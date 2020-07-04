import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Error from "./Error";

export default function UserLogin(props) {
  const { show, onHide, onNewUserFormSubmit, error } = props;

  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  return (
    <Modal
      size="md"
      aria-labelledby="new-room-modal"
      centered
      className="Modal"
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Error error={error} />
        <h5>Your Details Please...</h5>
        <Form onSubmit={e => onNewUserFormSubmit(e, { email, username })}>
          <Form.Group controlId="email">
            <Form.Control
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
