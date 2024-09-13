// import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/Header';


function Home() {

  return (
    <>
      <Header />
      <div className='hero-section'>
        <div className="hero-content">
          <h6>Welcome to</h6>
          <h1 className='hero-header'>Fleet Simulation</h1>
          <p className="hero-description">
            Access real-time analytics, 
            and explore how your fleet of vehicles can be better managed.
          </p>
          
          {/* <a className="hero-button" href="/new">New Acquisition</a> */}
          <Link className='hero-button' to={'/new'}>New Acquisition</Link>
        </div>
        <figure className='hero-bg'>
          <img loading='lazy' src="/images/fleetVehicles.jfif" alt="Fleet of vehicles as background" />
        </figure>
      </div>
    </>
  )
}

export default Home
