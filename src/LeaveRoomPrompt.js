import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function LeaveRoomPrompt(props) {
  const { show, onHide, roomId, joinNewRoom, goToRoom } = props;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="new-room-modal"
      centered
      className="Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Leave Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>You want to abandon your current room?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={e => joinNewRoom(roomId)}>
          Yes
        </Button>
        <Button variant="secondary" onClick={e => goToRoom(roomId)}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
