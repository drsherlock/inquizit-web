import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import LeaveRoomPrompt from "./LeaveRoomPrompt";
import UserLogin from "./UserLogin";

import config from "./config/development";
import {
  verifyUser,
  createUser,
  removeUserFromRoom,
  addUserToRoom,
  getRoom
} from "./actions";

import "./Room.css";

function Room() {
  const [room, setRoom] = React.useState({ inRoom: false, roomId: "" });
  const [loginModal, setLoginModal] = React.useState(true);
  const [usersInRoom, setUsersInRoom] = React.useState([]);
  const [error, setError] = React.useState({ show: false, message: "" });

  const ws = React.useRef();

  let history = useHistory();

  const { roomId } = useParams();

  const goToRoom = roomId => {
    setRoom({ inRoom: false, roomId: "" });
    history.push(`/room/${roomId}`);
  };

  const joinNewRoom = async previousRoomId => {
    setRoom({ inRoom: false, roomId: "" });

    try {
      let response = await removeUserFromRoom(previousRoomId);
      if (response.error) {
        throw response.error;
      }

      response = await addUserToRoom(roomId);
      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed: ", error);
    }
  };

  const onNewUserFormSubmit = async (e, { email, username }) => {
    e.preventDefault();
    try {
      let user = await createUser(email, username);
      if (user.error) {
        throw user.error;
      }

      Cookies.set("Authorization", user.token);

      user = await verifyUser();
      if (user.error) {
        throw user.error;
      }

      setLoginModal(false);

      const room = await getRoom();
      if (room.error) {
        throw room.error;
      }

      // user is in a different room
      if (room.inRoom && room.roomId !== roomId) {
        setRoom({ inRoom: true, roomId: room.roomId });
        return;
      }

      let response = await addUserToRoom(roomId);
      if (response.error) {
        throw response.error;
      }

      connectWebSocket(user);
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed: ", error);
    }
  };

  let timeout = 250;
  const connectWebSocket = React.useCallback(async user => {
    let connectInterval;
    try {
      ws.current = new WebSocket(`${config.WS_URL}ws/${roomId}/${user.userId}`);

      // websocket onopen event listener
      ws.current.onopen = () => {
        console.log("connected websocket main component");

        timeout = 250; // reset timer to 250 on open of websocket connection
        clearTimeout(connectInterval); // clear Interval on on open of websocket connection
      };

      ws.current.onmessage = e => {
        const message = JSON.parse(e.data);
        if (message.action === "connect") {
          setUsersInRoom(message.users);
        } else if (message.action === "join") {
          // TODO: compate by userId before merging
          setUsersInRoom(usersInRoom => {
            for (const user of usersInRoom) {
              if (user.userId === message.user.userId) {
                return usersInRoom;
              }
            }
            return [message.user, ...usersInRoom];
          });
        } else if (message.action === "disconnect") {
          setUsersInRoom(usersInRoom =>
            usersInRoom.filter(user => user.userId !== message.userId)
          );
        }
        // TODO: check for disconnect
      };

      // websocket onclose event listener
      ws.current.onclose = e => {
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (timeout + timeout) / 1000
          )} second.`,
          e.reason
        );

        timeout += timeout; //increment retry interval
        connectInterval = setTimeout(check, Math.min(10000, timeout), user); //call check function after timeout
      };

      // websocket onerror event listener
      ws.current.onerror = err => {
        console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
        );

        ws.current.close();
      };
    } catch (error) {
      console.log("Request failed: ", error);
      timeout += timeout; //increment retry interval
      connectInterval = setTimeout(check, Math.min(10000, timeout), user); //call check function after timeout
    }
  }, []);

  /**
   * utilited by the @function connectWebSocket to check if the connection is close, if so attempts to reconnect
   */
  const check = user => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      connectWebSocket(user); //check if websocket instance is closed, if so call `connect` function.
    }
  };

  React.useEffect(() => {
    (async function checkUserInRoom() {
      try {
        const token = Cookies.get("Authorization");
        if (token) {
          const user = await verifyUser();
          if (user.error) {
            throw user.error;
          }

          // TODO: show login if can not verify user

          setLoginModal(false);

          const room = await getRoom();
          if (room.error) {
            throw room.error;
          }

          // user is in a different room
          if (room.inRoom && room.roomId !== roomId) {
            setRoom({ inRoom: true, roomId: room.roomId });
            return;
          }

          let response = await addUserToRoom(roomId);
          if (response.error) {
            throw response.error;
          }

          connectWebSocket(user);
        } else {
          setLoginModal(true);
        }
      } catch (error) {
        console.log("Request failed: ", error);
      }
    })();
  }, [connectWebSocket, roomId]);

  return (
    <>
      <LeaveRoomPrompt
        show={room.inRoom}
        onHide={() => null}
        roomId={room.roomId}
        joinNewRoom={joinNewRoom}
        goToRoom={goToRoom}
      />

      <div className="Room">
        <Container fluid={true}>
          <Row>
            <Col sm={8}>
              <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control as="textarea" rows="3" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Control type="text" placeholder="Say Hi!" />
                </Form.Group>
              </Form>
            </Col>
            <Col sm={4}>
              <ListGroup className="User-list">
                {usersInRoom.map(user => (
                  <ListGroup.Item key={user.userId}>
                    {user.username}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>

      <UserLogin
        show={loginModal}
        onHide={() => null}
        onNewUserFormSubmit={onNewUserFormSubmit}
        error={error}
      />
    </>
  );
}

export default Room;
