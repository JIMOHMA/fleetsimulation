import { useState } from 'react'
import './App.css'

import GaugeChart from 'react-gauge-chart'
import TirePressure from './components/TirePressure'

// export default App
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <h1>FLEET ELEMENT</h1>

      <GaugeChart id="gauge-chart1" />
      
      <GaugeChart id="gauge-chart2" 
        nrOfLevels={20} 
        percent={0.86} 
      />

      <GaugeChart id="gauge-chart3" 
        nrOfLevels={30} 
        colors={["#FF5F6D", "#FFC371"]} 
        arcWidth={0.3} 
        percent={0.37} 
      />

      <GaugeChart id="gauge-chart4" 
        nrOfLevels={10} 
        arcPadding={0.1} 
        cornerRadius={3} 
        percent={0.6} 
      />

      <GaugeChart id="gauge-chart5"
        arcsLength={[0.25, 0.25, 0.25, 0.25]}
        colors={['#EA4228', '#F5CD19', '#5BE12C' ]}
        percent={0.37}
        arcPadding={0.01}
        formatTextValue={value => `${value} km/h`}
        needleColor="#fff"
      />

      <GaugeChart id="gauge-chart6" 
        animate={false} 
        nrOfLevels={15} 
        percent={0.56} 
        needleColor="#345243" 
      />

      <TirePressure></TirePressure>
    </>
  )
}

export default App
