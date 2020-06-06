import React from "react";
// import logo from "./logo.svg";
import "./Home.css";

import NewRoom from "./NewRoom";

function Home() {
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
        <NewRoom />
      </header>
    </div>
  );
}

export default Home;
