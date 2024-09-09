import React from 'react'
import { useEffect, useState  } from 'react';
import SpeedAreaChart from '../components/SpeedAreaChart'
import { useParams, Link } from 'react-router-dom'

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

function Vehicle() {

  const { vehicleId } = useParams();

  return (
    <div className='full-analytics'>
      <SpeedAreaChart 
        vehicleId = { vehicleId } 
      />
    </div>
  )
}

export default Vehicle
