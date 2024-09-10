import { useEffect, useState  } from 'react';
import { Link } from 'react-router-dom'
// import PulseLoader from "react-spinners/ClipLoader";
import RingLoader from "react-spinners/ClipLoader";
import Header from '../components/Header';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")


const override = {
  display: "block",
  margin: "2rem auto",
  borderColor: "#a7e8e0",
};

function Acquisitions() {

  const [companies, setCompanies] = useState([])
  const [loadState, setLoadState] = useState(true)
  
  useEffect(() => {
    socket.emit("all-companies", {message: "Request for all companies in db"})
    socket.on("company_list", ({data}) => {
      console.log(data);
      setTimeout(() => {
        setCompanies([...data])
        setLoadState(false)
      }, 200)
    });

    // Cleanup the socket listener when the component unmounts or socket changes
    return () => {
      socket.off("company_list");
    };
  }, [socket])

  return (
    <>
      <Header></Header>
      <h2 className='page-heading'>Acquired Companies</h2>
      {loadState ? (
        <div className='load-spinner'>
          <RingLoader
            color="#a7e8e0"
            loading={loadState}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ): (
        <section className='companies-container'>
          {companies.map((company) => (
            <div key={company.companyId} className="company-container">
              <h2 className='company-name'>{company.name}</h2>
              <div className="p-container">
                <p className="vehicle-num">{company.vehicles?.length || 0} <span>Vehicle{(company.vehicles.length > 1) ? "s" : ""}</span></p>
                <p className='in-fleet'>In Fleet</p>
              </div>

              <Link className="view-company" to={`/company/${company.companyId}`}>View More</Link>
            </div>
          ))}      
        </section>
      )}
    </>
  )
}

export default Acquisitions
