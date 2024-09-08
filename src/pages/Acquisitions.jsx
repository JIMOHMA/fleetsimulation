import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

function Acquisitions() {

  const [companies, setCompanies] = useState([])
  
  useEffect(() => {
    socket.emit("all-companies", {message: "Request for all companies in db"})
    socket.on("company_list", ({data}) => {
      console.log(data);
      setCompanies([...data])
    })
  }, [socket])

  return (
    <section className='companies-container'>
      {companies.map((company) => (
        <div key={company.companyId} className="company-container">
          <h2 className='company-name'>{company.name}</h2>
          <div className="p-container">
            <p className="vehicle-num">{company.vehicles?.length || 0} <span>Vehicle{(company.vehicles.length > 1) ? "s" : ""}</span></p>
            <p className='in-fleet'>In Fleet</p>
          </div>

          <Link className="view-company" to={'/home'}>View More</Link>
        </div>
      ))}      
    </section>
  )
}

export default Acquisitions
