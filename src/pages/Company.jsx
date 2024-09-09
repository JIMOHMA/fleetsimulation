import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

const Company = () => {

  const [ companyVehicles, setCompanyVehicles ] = useState([])
  const [ companyName, setCompanyName ] = useState("")
  const [ loadState, setLoadState ] = useState(true)

  const { companyId } = useParams();
  console.log(companyId)

  useEffect(() => {
    socket.emit("company-data", {companyId: companyId})
    socket.on('vehicle_list', ({data}) => {
      console.log(data[0].owner.name)
      console.log(data[0].vehicles)
      setCompanyName(data[0].owner.name)
      setCompanyVehicles([...data[0].vehicles])
    })
  }, [socket])

  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  function dateInStringform(someDate) {
    const dateObj = new Date(someDate)
    return `${month[dateObj.getMonth()]} - ${dateObj.getFullYear()}`
  }
  return (
    <>
      <h2 className='page-heading'>{companyName ? companyName : ''}</h2>
      <section className='vehicles-container'>
          {companyVehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="vehicle-card">
              <h2 className='v-name'>{vehicle.name}</h2>
              <p className='v-type'>{vehicle.vehicleType}</p>
              <div className="driver-info">
                <i className="fa-solid fa-person"></i>
                <p className="d-name">Driver: {vehicle.vehicleDriverName}</p>
              </div>

              <p className='purchase-date'>Purchased: {dateInStringform(vehicle.purchaseDate)}</p>

              <Link className="view-analytics" to={`/vehicle/${vehicle.vehicleId}`}>Real-time Analytics</Link>
            </div>
          ))}      
        </section>
    </>
  )
}

export default Company
