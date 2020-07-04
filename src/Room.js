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
import { getReq, postReq } from "./reqUtil";

import "./Room.css";

function Room() {
  const [room, setRoom] = React.useState({ inRoom: false, roomId: "" });
  const [loginModal, setLoginModal] = React.useState(true);
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

  const createUser = async (email, username) => {
    const data = { email: email, username: username };
    return await postReq({ url: "users", data });
  };

  const removeUserFromRoom = async roomId => {
    const data = { roomId: roomId };
    return await postReq({ url: "rooms/removeUser", data });
  };

  const addUserToRoom = async roomId => {
    const data = { roomId: roomId };
    return await postReq({ url: "rooms/addUser", data });
  };

  const verifyUser = async () => {
    return await getReq({ url: "users/verify" });
  };

  const onNewUserFormSubmit = async (e, { email, username }) => {
    e.preventDefault();
    try {
      let user = await createUser(email, username);
      if (user.error) {
        throw user.error;
      }

      Cookies.set("Authorization", user.token);
      setLoginModal(false);

      // TODO: request to check if user in current room

      // user is already in a diffeent room
      // if (user.inRoom && user.roomId) {
      //   setRoom({ inRoom: true, roomId: user.roomId });
      //   return;
      // }

      // user is not in any room
      // if (!user.inRoom) {
      //   let response = await addUserToRoom(roomId);
      //   if (response.error) {
      //     throw response.error;
      //   }
      // }
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
        console.log(message);
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
  });

  /**
   * utilited by the @function connectWebSocket to check if the connection is close, if so attempts to reconnect
   */
  const check = () => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      connectWebSocket(); //check if websocket instance is closed, if so call `connect` function.
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

          // TODO: request to check if user in current room

          // user is already in a diffeent room
          // if (user.inRoom && user.roomId) {
          //   setRoom({ inRoom: true, roomId: user.roomId });
          //   return;
          // }

          // user is not in any room
          // if (!user.inRoom) {
          //   let response = await addUserToRoom(roomId);
          //   if (response.error) {
          //     throw response.error;
          //   }
          // }

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
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
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
