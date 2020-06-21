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
  const [room, setRoom] = React.useState({ inRoom: false, roomId: "" });

  let history = useHistory();

  const createUser = async () => {
    const data = { email: email, username: username };
    return await postReq({ url: "users", data });
  };

  const createRoom = async () => {
    return await postReq({ url: "rooms" });
  };

  const removeUserFromRoom = async roomId => {
    const data = { roomId: roomId };
    return await postReq({ url: "rooms/removeUser", data });
  };

  const onNewUserFormSubmit = async e => {
    e.preventDefault();
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

      if (room.inRoom) {
        setRoom({ inRoom: true, roomId: room.roomId });
        return;
      }

      history.push(`/room/${room.roomId}`);
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed", error);
    }
  };

  const joinRoom = roomId => {
    history.push(`/room/${roomId}`);
  };

  const joinNewRoom = async roomId => {
    try {
      let response = await removeUserFromRoom(roomId);
      if (response.error) {
        throw response.error;
      }

      let room = await createRoom();
      if (room.error) {
        throw room.error;
      }

      joinRoom(room.roomId);
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed", error);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="new-room-modal"
      centered
      className="Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="new-room-modal">New Room</Modal.Title>
      </Modal.Header>
      {room.inRoom ? (
        <>
          <Modal.Body>
            <h5>You want to abandon your current room?</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={e => joinRoom(room.roomId)}>
              Yes
            </Button>
            <Button variant="secondary" onClick={e => joinNewRoom(room.roomId)}>
              No
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Modal.Body>
          <Error error={error} />
          <h5>Your Details Please...</h5>
          <Form onSubmit={e => onNewUserFormSubmit(e)}>
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
      )}
    </Modal>
  );
}
