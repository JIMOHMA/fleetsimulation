import React from 'react'
import { useEffect, useState  } from 'react';

import io from 'socket.io-client';
import Vehicle from '../pages/Vehicle';
// const socket = io.connect("http://localhost:3001")
const socket = io.connect("https://fleetdemo.onrender.com")


// TODO: Tires pressures are all the same for all 4 tires
// TODO: Update the simulator logic to reflect this and update this component
function TirePressure(props) {

    const [ tirePressures, setTirePressures ] = useState(0)

    useEffect(() => {
        socket.emit('pressure_information', {vehicleId: props.vehicleId})
        socket.on('pressure_data', ({pressureData}) => {
            // console.log("Pressure data are below and vehicleId is", props.vehicleId)
            // console.log(pressureData[0].tirePressure)
            setTirePressures(pressureData[0].tirePressure)
        })
        return () => {
            socket.off('pressure_data')
        }
    }, [socket])

    return (
        <div className='pressure-analytics shadow-effect'>
            <h2>Tire Pressure Values</h2>
            <div className='tires'>
                <div className='leftfront'>
                    <p>{tirePressures}psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
                <div className='rightfront'>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                    <p>{tirePressures}psi</p>
                </div>
                <div className='leftrear'>
                    <p>{tirePressures}psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
                <div className='rightrear'>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                    <p>{tirePressures}psi</p>
                </div>
            </div>
        </div>
    )
}

export default TirePressure
