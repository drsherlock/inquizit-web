import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Cookies from "js-cookie";

import { postReq } from "./reqUtil";

function NewRoomModal(props) {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

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
      Cookies.set("Authorization", user.token);
      let room = await createRoom();
    } catch (error) {
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

function NewRoom() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button variant="light" type="button" onClick={() => setModalShow(true)}>
        New Room
      </Button>
      <NewRoomModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default NewRoom;
