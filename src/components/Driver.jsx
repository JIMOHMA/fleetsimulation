import React from 'react'
import { useEffect, useState  } from 'react';

import io from 'socket.io-client';
// const socket = io.connect("http://localhost:3001")
const socket = io.connect("https://fleetsimulation.onrender.com")

const Driver = (props) => {

    
    const [ driverInfo, setDriverInfo ] = useState({})
  
    useEffect(() => {
      socket.emit("driver_info", {vehicleId: props.vehicleId})
      socket.on("driver_data", ({driverData}) => {
        console.log("diver data are below and vehicleId is", props.vehicleId)
        console.log(driverData)
        setDriverInfo(driverData)
      });
  
      // Cleanup the socket listener when the component unmounts or socket changes
      return () => {
        socket.off("fuel_data");
      };
    }, [socket])
  return (
    <div className='driver-vehicle-details shadow-effect'>
        <div className='driver-details'>
            <h2>Driver Details</h2>
            <p>Name: {driverInfo.vehicleDriverName}</p>
            <p>Contact: {"(XXX) XXX-XXXX"}</p>
        </div>
        <div className='vehicle-details'>
            <h2>Vehicle Details</h2>
            <p>Name: {driverInfo.name}</p>
            <p>VehicleType: {driverInfo.vehicleType}</p>
            <p>Purchase Date: {new Date(driverInfo.purchaseDate).toDateString()}</p>
        </div>
    </div>
  )
}

export default Driver
