import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function NewRoomModal(props) {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const onNewUserFormSubmit = event => {
    event.preventDefault();
    const url = "http://localhost:8080/users";
    fetch(url, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email: email, username: username })
    })
      .then(response => response.json())
      .then(function(data) {
        console.log("Request succeeded with JSON response", data);
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
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
