import React from 'react';
import { useEffect, useState  } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001")

const SpeedAreaChart = (props) => {
    const [ speedData, setSpeedData ] = useState([])
  
    useEffect(() => {
      socket.emit("speed_information", {vehicleId: props.vehicleId})
      socket.on("speed_data", ({vehicleData}) => {
        console.log("Speed data are below and vehicleId is", props.vehicleId)
        console.log(vehicleData)
        setSpeedData((prevData) => {
            return [...vehicleData]
        })
      });
  
      // Cleanup the socket listener when the component unmounts or socket changes
      return () => {
        socket.off("speed_data");
      };
    }, [socket])


    return (
        // width and dimension of the chart.. size is based on the dimensions
        // of the parent
        <div className='speed-analytics shadow-effect'>
            <h2>Vehicle Speed (km/hr)</h2>
            <p className='time-frame'>Speed Time-frame: 5 minutes</p>
            <p className='update-time'>Graph Update Time: 30 secs</p>
            <ResponsiveContainer className='chart-area' width="100%" height="100%">
                <AreaChart
                // width={400}
                // height={200}
                data={speedData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <defs>
                {/* Define a linear gradient */}
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7e8e0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a7e8e0" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                {/* <CartesianGrid strokeDasharray="5 5" /> */}
                <XAxis 
                    dataKey="date" 
                    stroke="#82c341"
                    // label={{ value: 'Time', position: 'Center', offset: 10, fill: '#ff7300', fontSize: 14 }}
                    />
                <YAxis 
                    stroke="#82c341"
                    // label={{ value: 'Speed', angle: 90, position: 'insideLeft', offset: 20, fill: '#387908', fontSize: 14 }}
                    />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#333', color: '#fff', border: '1px solid transparent', borderRadius: '10px' }}
                    itemStyle={{ color: '#a7e8e0' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Area dot={{ r: 3 }} type="monotone" dataKey="speed" stroke="#82c341" fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SpeedAreaChart
