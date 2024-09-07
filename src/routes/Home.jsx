import { useEffect, useState } from 'react';
// import Header from '../components/Header'
// import Footer from '../components/Footer'

import io from 'socket.io-client';
const socket = io.connect("http://localhost:5173")


function Home() {

  const [count, setCount] = useState(0)

  function emitMessage() {
    socket.emit("new-message", {message: "Ayodele is nice"})
  }

  useEffect(() => {
    socket.on("db_query", ({info}) => {
      console.log(info);
    })
  }, [socket])

  return (
    <div className='hero-section'>
      <h6>Welcome to</h6>
      <h1 className='hero-header'>Fleet Simulation</h1>
      <p className="hero-description">
        Access real-time analytics, 
        and explore how your fleet of vehicles can be better managed.
      </p>
      <a className="hero-button" href="/acquisitions">New Acquisition</a>

      <figure className='hero-bg'>
        <img src="/images/fleetVehicles.jfif" alt="Fleet of vehicles as background" />
      </figure>
    </div>
  )
}

export default Home
