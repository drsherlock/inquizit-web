import React from "react";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import { getRoom } from "./actions";
// import logo from "./logo.svg";

import "./Home.css";

import NewRoomButton from "./NewRoomButton";

function Home() {
  const [loginModal, setLoginModal] = React.useState(false);
  const [room, setRoom] = React.useState({ inRoom: false, roomId: "" });

  let history = useHistory();

  const joinRoom = roomId => {
    history.push(`/room/${roomId}`);
  };

  React.useEffect(() => {
    (async function checkUserInRoom() {
      try {
        const token = Cookies.get("Authorization");
        if (token) {
          // TODO: verify user

          const room = await getRoom();
          if (room.error) {
            throw room.error;
          }

          if (room.inRoom) {
            setRoom({ inRoom: true, roomId: room.roomId });
          }
        }
      } catch (error) {
        console.log("Request failed: ", error);
      }
    })();
  }, []);

  return (
    <div className="Home">
      <header className="Home-header">
        {/*<img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>*/}
        <h2>Inquizit</h2>
        <NewRoomButton
          loginModal={loginModal}
          setLoginModal={setLoginModal}
          room={room}
          setRoom={setRoom}
        />
        <br />
        {room.inRoom && (
          <>
            <h5>You are already in a room</h5>
            <Button onClick={e => joinRoom(room.roomId)}>Join</Button>
          </>
        )}
      </header>
    </div>
  );
}

export default Home;
