import React from 'react'
import SpeedAreaChart from '../components/SpeedAreaChart';
import FuelGuage from '../components/FuelGuage';
import { useParams } from 'react-router-dom';
import TirePressure from '../components/TirePressure';
import Driver from '../components/Driver';

function Vehicle() {

  const { vehicleId } = useParams();

  return (
    <section className='more-vehicle'>
      <div className="identification-info">
        <h2>Vehicle {"Vehicle Name"}</h2>
        <h3>Company {"Company Name"}</h3>
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
        <Driver 
          vehicleId = { vehicleId } 
        />
      </div>
    </section>
  )
}

export default Vehicle
