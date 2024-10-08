import React, { useEffect } from 'react'
import { useState  } from 'react';
import { useParams } from 'react-router-dom';

// Component imports
import SpeedAreaChart from '../components/SpeedAreaChart';
import FuelGuage from '../components/FuelGuage';
import TirePressure from '../components/TirePressure';
import Driver from '../components/Driver';
import Maintenance from '../components/Maintenance';
import Header from '../components/Header';
import io from 'socket.io-client';

const SERVER_API = import.meta.env.VITE_API_URL
const socket = io.connect(SERVER_API) 

function Vehicle() {

  const { vehicleId } = useParams();
  const [ vName, setVName ] = useState("")
  const [ cName, setCName ] = useState("")

  useEffect(() => {
    socket.emit("description", {vehicleId: vehicleId})
    socket.on("description_data", (data) => {
      // console.log("Description 1 data is", data[0].vehicle.name)
      // console.log("Description 2 data is", data[1].company.name)
      setVName(data[0].vehicle.name)
      setCName(data[1].company.name)
    })
  }, [socket])

  return (
    <>
      <Header></Header>
      <section className='more-vehicle'>
        <div className="identification-info">
          <h3>Vehicle Name: {vName}</h3>
          <h2>{cName}</h2>
          <h3>Real-time Analytics</h3>
        </div>
        <div className='full-analytics'>
          <SpeedAreaChart 
            vehicleId = { vehicleId } 
          />
          <FuelGuage 
            vehicleId = { vehicleId } 
          />
          <TirePressure 
            vehicleId = { vehicleId } 
          />
          <Maintenance 
            vehicleId = { vehicleId }
          />
          <Driver 
            vehicleId = { vehicleId } 
          />
        </div>
      </section>
    </>
  )
}

export default Vehicle
