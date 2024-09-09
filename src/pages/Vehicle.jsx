import React from 'react'
import SpeedAreaChart from '../components/SpeedAreaChart';
import FuelGuage from '../components/FuelGuage';
import { useParams } from 'react-router-dom';
import TirePressure from '../components/TirePressure';

function Vehicle() {

  const { vehicleId } = useParams();

  return (
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
    </div>
  )
}

export default Vehicle
