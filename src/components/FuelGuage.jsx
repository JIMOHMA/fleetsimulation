import React from 'react'
import { useEffect, useState  } from 'react';
import GaugeChart from 'react-gauge-chart';


import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

function FuelGuage(props) {

    const [ fuelLevel, setFuelLevel ] = useState(1)
  
    useEffect(() => {
      socket.emit("fuel_information", {vehicleId: props.vehicleId})
      socket.on("fuel_data", ({fuelData}) => {
        console.log("Fuel data are below and vehicleId is", props.vehicleId)
        console.log(fuelData[0].fuelLevel)
        setFuelLevel(fuelData[0].fuelLevel)
      });
  
      // Cleanup the socket listener when the component unmounts or socket changes
      return () => {
        socket.off("fuel_data");
      };
    }, [socket])

    return (
        <div className='fuel-analytics shadow-effect'>
            <h2>Fuel Guage</h2>
            <GaugeChart id="gauge-chart5"
                nrOfLevels={4}
                arcsLength={[0.25, 0.25, 0.25, 0.25]}
                colors={['#EA4228', '#F5CD19', '#5BE12C']}
                percent={fuelLevel}
                arcPadding={0.02}
                needleBaseColor='#a7e8e0'
                cornerRadius={3}
                arcWidth={0.2}
                animateDuration={10000}
            />
            <p>Estimated Distance Left: <span>{fuelLevel*600} km</span></p>
        </div>
    )
}

export default FuelGuage
