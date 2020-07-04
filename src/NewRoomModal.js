import React from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import UserLogin from "./UserLogin";

import { postReq } from "./reqUtil";

export default function NewRoomModal(props) {
  const { loginModal, setLoginModal, room } = props;

  const [error, setError] = React.useState({ show: false, message: "" });

  let history = useHistory();

  const createUser = async (email, username) => {
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

  const onNewUserFormSubmit = async (e, { email, username }) => {
    e.preventDefault();
    try {
      let user = await createUser(email, username);
      if (user.error) {
        throw user.error;
      }

      Cookies.set("Authorization", user.token);
      setLoginModal(false);

      // TODO: remove user from other rooms
      // let response = await removeUserFromRoom(previousRoomId);
      // if (response.error) {
      //   throw response.error;
      // }

      let room = await createRoom();
      if (room.error) {
        throw room.error;
      }

      // redirect user to new room
      goToRoom(room.roomId);
    } catch (error) {
      setError({ show: true, message: error });
      console.log("Request failed: ", error);
    }
  };

  const goToRoom = roomId => {
    history.push(`/room/${roomId}`);
  };

  return (
    <>
      <UserLogin
        show={loginModal}
        onHide={setLoginModal}
        onNewUserFormSubmit={onNewUserFormSubmit}
        error={error}
      />
    </>
  );
}
