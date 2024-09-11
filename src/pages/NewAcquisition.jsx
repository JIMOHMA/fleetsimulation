import React from 'react'
import Header from '../components/Header'
import { useState } from 'react'

const NewAcquisition = () => {

  const [companyName, setCompanyName] = useState('')
  const [vehicleNums, setVehicleNums] = useState('')
  const [isChecked, setIsChecked] = useState(false)

  const BACKEND_URL = "https://fleetdemo.onrender.com"

  const autoGenerateCompany = async () => {
    
    try {
      // const response = await fetch('http://localhost:3001/autogenerate', {
      const response = await fetch("https://fleetdemo.onrender.com/autogenerate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({instruction: "generate-company"}),
      });
      
      const responseData = await response.json();
      // console.log('Response from server:', responseData)

      if (response.ok) {
        alert('New Company generated and registered');
      } else {
        alert('Error submitting company info...Please try again!');
      }
    } catch (error) {
      console.log("Error auto-generating company:", error)
    }
  }

  // handle the change on the checkbox
  const handleCheckbox = (e) => {
    console.log(e.target.value)
    setIsChecked(e.target.checked)
    console.log("isChecked state is now:", isChecked)
  }

  const submitCompany = async (myEvent) => {
    myEvent.preventDefault();
  
    const newCompanyData = {
      name: companyName,
      numOfVehicles: vehicleNums
    }

    // req to server to submit company information
    try {
      // const response = await fetch('https://fleetdemo.onrender.com/new_acquisition', {
      const response = await fetch('http://localhost:3001/new_acquisition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompanyData),
      });

      const responseData = await response.json();
      console.log('Response from server:', responseData)
      setCompanyName('')
      setVehicleNums('')

      if (response.ok) {
        alert('New Company successfully registered');
      } else {
        alert('Error submitting company info...Please try again!');
      }
    } catch (error) {
      console.log('Error from submission is:', error)
    }
  }

  const styles = {
    disabledButton: {
      pointerEvents: "none",
      cursor: 'not-allowed',
      opacity: 0.65
    },
    enabledButton: {
      cursor: 'pointer'
    }
  }

  return (
    <>
      <Header></Header>
      <section className='acquisition-container'>
        <h2 className='h2-heading'>Register Company</h2>
        <form onSubmit={submitCompany}>
          <fieldset className="name-fieldset">
              <label htmlFor="name">Company Name :</label>
              <input 
              type="text" 
              name="name" 
              placeholder="Enter Company Name" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)} // update state to entered name
            required/>
          </fieldset>

          <fieldset className="num-fieldset">
              <label htmlFor="vehicleNumber">Number of Vehicles :</label>
              <select 
              name="vehicleNumber" 
              id="vehicleNumber"
              value={vehicleNums}
              onChange={(e) => setVehicleNums(e.target.value)}
              required>
                  <option></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="6">7</option>
              </select>
          </fieldset>
        
        
          <button 
            type='submit' 
            className='save-button'
            style={!isChecked ? styles.enabledButton : styles.disabledButton }
            >
            Register
          </button>
        </form> 
        <div className="generate">

            <input 
            type="checkbox" 
            id="auto-generate" 
            name="auto-generate" 
            onChange={handleCheckbox}
            value='generate-company'
            />
            <label htmlFor="auto-generate">Auto Generate Data</label><br />

            <button style={!isChecked ? styles.disabledButton : styles.enableButton} 
            // {/* <button  */}
              onClick={autoGenerateCompany} className='generate-button'>
              Auto-Register

            </button>
            <div className='bg-replace'></div>
        </div>
      </section>
    </>
  )
}

export default NewAcquisition
