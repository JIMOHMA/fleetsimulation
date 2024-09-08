import React from 'react'


const NewAcquisition = () => {
  return (
    <section className='acquisition-container'>
            <h2 className='h2-heading'>Register Company</h2>
            <fieldset className="name-fieldset">
                <label htmlFor="name">Company Name :</label>
                <input type="text" name="name" placeholder="Enter Company Name" />
            </fieldset>

            <fieldset className="num-fieldset">
                <label htmlFor="vehicleNumber">Number of Vehicles :</label>
                <select name="vehicleNumber" id="vehicleNumber">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
            </fieldset>

            
            <button className='save-button'>Register</button>
            
            <div className="generate">

                <input type="checkbox" id="auto-generate" name="auto-generate" value="generate-data" />
                <label htmlFor="auto-generate">Auto Generate Data</label><br />

                <button className='generate-button'>Auto Register</button>
                <div className='bg-replace'></div>
            </div>
    </section>
  )
}

export default NewAcquisition
