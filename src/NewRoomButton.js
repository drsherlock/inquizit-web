import React from "react";
import Button from "react-bootstrap/Button";

import NewRoomModal from "./NewRoomModal";

function NewRoomButton(props) {
  const { setLoginModal } = props;
  return (
    <>
      <Button variant="light" type="button" onClick={() => setLoginModal(true)}>
        New Room
      </Button>
      <NewRoomModal {...props} />
    </>
  );
}

export default NewRoomButton;
