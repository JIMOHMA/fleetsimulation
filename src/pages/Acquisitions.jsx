import { useEffect, useState } from 'react';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

function Acquisitions() {

  const [count, setCount] = useState(0)

  function emitMessage() {
    socket.emit("new-message", {message: "Ayodele is nice", date: new Date().toISOString()})
  }

  useEffect(() => {
    socket.on("db_query", ({info}) => {
      console.log(info);
    })
  }, [socket])
  return (
    <div>
      <h3>Acquisitions Link</h3>
      <nav>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/acquisitions">Acquisitions</a></li>
        </ul>
      </nav>
      <button onClick={emitMessage}>Send Message</button>
    </div>
  )
}

export default Acquisitions
