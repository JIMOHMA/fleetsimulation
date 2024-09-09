import React from 'react'
import SpeedAreaChart from '../components/SpeedAreaChart';
import FuelGuage from '../components/FuelGuage';
import { useParams } from 'react-router-dom';

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
    </div>
  )
}

export default Vehicle
