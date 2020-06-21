import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import config from "./config/development";
import { getReq } from "./reqUtil";

import "./Room.css";

function Room() {
  const [room, setRoom] = React.useState({ inRoom: false, roomId: "" });
  const ws = React.useRef();

  const { roomId } = useParams();

  const verifyUser = async roomId => {
    return await getReq({ url: `users/verify/${roomId}` });
  };

  let timeout = 250;
  const connectWebSocket = React.useCallback(async () => {
    let connectInterval;
    try {
      const token = Cookies.get("Authorization");
      if (token) {
        const user = await verifyUser(roomId);
        console.log(user);
        if (user.error) {
          throw user.error;
        }

        if (user.inRoom) {
          setRoom({ inRoom: true, roomId: user.roomId });
          return;
        }

        ws.current = new WebSocket(
          `${config.WS_URL}ws/${roomId}/${user.userId}`
        );

        // websocket onopen event listener
        ws.current.onopen = () => {
          console.log("connected websocket main component");

          timeout = 250; // reset timer to 250 on open of websocket connection
          clearTimeout(connectInterval); // clear Interval on on open of websocket connection
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
          connectInterval = setTimeout(check, Math.min(10000, timeout)); //call check function after timeout
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
      } else {
        // show login modal
      }
    } catch (error) {
      console.log("Request failed: ", error);
      timeout += timeout; //increment retry interval
      connectInterval = setTimeout(check, Math.min(10000, timeout)); //call check function after timeout
    }
  });

  /**
   * utilited by the @function connectWebSocket to check if the connection is close, if so attempts to reconnect
   */
  const check = () => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED)
      connectWebSocket(); //check if websocket instance is closed, if so call `connect` function.
  };

  React.useEffect(() => {
    (async function checkUserInRoom() {
      connectWebSocket();
    })();
  }, [connectWebSocket]);

  return (
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
  );
}

export default Room;
