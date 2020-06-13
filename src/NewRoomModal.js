import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import { postReq } from "./reqUtil";

import Error from "./Error";

export default function NewRoomModal(props) {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState({ show: false, message: "" });

  let history = useHistory();

  const createUser = async () => {
    const data = { email: email, username: username };
    return await postReq({ url: "users", data });
  };

  const createRoom = async () => {
    return await postReq({ url: "rooms" });
  };

  const onNewUserFormSubmit = async event => {
    event.preventDefault();
    try {
      let user = await createUser();
      if (user.error) {
        throw user.error;
      }

      Cookies.set("Authorization", user.token);

      let room = await createRoom();
      if (room.error) {
        throw room.error;
      }

      history.push(`/room/${room.roomId}`);
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed", error);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">New Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Error error={error} />
        <h4>Your Details Please...</h4>
        <Form onSubmit={event => onNewUserFormSubmit(event)}>
          <Form.Group controlId="email">
            <Form.Control
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
      {/*<Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>*/}
    </Modal>
  );
}
