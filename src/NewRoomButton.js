import React from "react";
import Button from "react-bootstrap/Button";

import NewRoomModal from "./NewRoomModal";

function NewRoomButton() {
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

export default NewRoomButton;
