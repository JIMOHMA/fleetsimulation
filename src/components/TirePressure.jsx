import React from 'react'

function TirePressure() {
    const style = {
        backgroundColor: 'red'
    }
    return (
        <div style={style}>
            <h3>Tire Pressure Values</h3>
            <div className='tires'>
                <div className='leftfront'>
                    <p>52psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
                <div className='rightfront'>
                    <p>51psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
                <div className='leftrear'>
                    <p>40psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
                <div className='rightrear'>
                    <p>53psi</p>
                    <div className='tire'>
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                        <div className="line4"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TirePressure
