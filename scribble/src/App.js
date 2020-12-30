import './App.css';
import socketClient from "socket.io-client";
import { Component } from 'react'

const SERVER = "http://localhost:8080"

var socket = socketClient(SERVER);
socket.on('connection', () => {
  console.log(`I'm connected with the back-end`);
});

class App extends Component {

  render() {
    return (
      <div className="App">
        hii
      </div>
    )
  }
}

export default App;
