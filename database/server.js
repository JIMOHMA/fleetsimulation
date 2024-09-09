require('dotenv').config()

const express = require('express')
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

// database connection
const { MongoClient } = require("mongodb");
const connectionString = process.env.connString
const client = new MongoClient(connectionString)

app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

app.get('/', (req, res) => {
    res.send("ALL GOOD.")
})

io.on('connection', (clientSocket) => {
    clientSocket.on('all-companies', async ({message}) => {
        console.log(`${message}, socket ID: ${clientSocket.id}`)

        await client.connect();
        const db = client.db('FleetElement')
        const companyCollection = db.collection('companies')
        const projection = {name: 1, companyId: 1, vehicles: 1} 
        const result = await companyCollection.find().project(projection).toArray()
        
        // sending data back to the Front-End through the db_query socket channel
        clientSocket.emit('company_list', {data: result})
    })

    clientSocket.on("company-data", async({companyId}) => {
        console.log(companyId)

        await client.connect();
        const db = client.db('FleetElement')
        const vehicleCollection = db.collection('vehicles')
        const companyCollection = db.collection('companies')
        const projection = {name: 1, vehicleId: 1, vehicleType: 1, vehicleDriverName: 1, purchaseDate: 1} 
        const result = await vehicleCollection.find({owner: companyId}).project(projection).toArray()

        const query = {companyId: companyId}
        const projection2 = {name: 1}
        const vehicleOwner = await companyCollection.findOne(query, {projection: projection2})

        clientSocket.emit('vehicle_list', {data: [{vehicles: result, owner: vehicleOwner}]})
    })

    clientSocket.on("speed_information", async ({vehicleId}) => {
        
        await client.connect();
        const db = client.db('FleetElement')
        const sensorCollection = db.collection('sensorDataInfo')
        const projection = {infoID: 1, vehicleId: 1, date: 1, speed: 1} 
        // limiting the query to 10 data points which will be equivalent to 5 mins timeframe 
        // given that we add data to the database every 30seconds
        let speedResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(10).toArray()

        // parse and format the data before sending it to the frontEnd
        let parsedData = speedResult.reverse().map((item) => ({
            speed: item.speed, 
            date: `${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}:${new Date(item.date).getSeconds()}`
        }))
        console.log(parsedData)
        clientSocket.emit('speed_data', {vehicleData: parsedData})

        // wait 30 seconds before loading the next feed of data
        setInterval(async() => {
            speedResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(10).toArray()
            parsedData = speedResult.reverse().map((item) => ({
                speed: item.speed, 
                date: `${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}:${new Date(item.date).getSeconds()}`
            }))
            console.log(parsedData)
            clientSocket.emit('speed_data', {vehicleData: parsedData})
        }, 30000)

    })

    clientSocket.on('fuel_information', async ({vehicleId}) => {
        console.log("vehicleId received is", vehicleId)

        await client.connect();
        const db = client.db('FleetElement')
        const sensorCollection = db.collection('sensorDataInfo')
        const projection = {infoID: 1, vehicleId: 1, date: 1, fuelLevel: 1} 

        // get the most recent fuel level value 
        let fuelResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(1).toArray()
        
        console.log("fuel result is", fuelResult)
        clientSocket.emit('fuel_data', {fuelData: fuelResult})

        // update fuel level every 30 seconds
        setInterval(async() => {
            let fuelResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(1).toArray()

            clientSocket.emit('fuel_data', {fuelData: fuelResult})
        }, 30000)
    })

    clientSocket.on('pressure_information', async ({vehicleId}) => {
        console.log("Pressure vehicleId received is", vehicleId)

        await client.connect();
        const db = client.db('FleetElement')
        const sensorCollection = db.collection('sensorDataInfo')
        const projection = {date: 1, tirePressure: 1} 

        // get the most recent fuel level value 
        let pressureResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(1).toArray()
        clientSocket.emit('pressure_data', {pressureData: pressureResult})

        // update fuel level every 30 seconds
        setInterval(async() => {
            let pressureResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(1).toArray()
        
            console.log("Pressure result is", pressureResult)
            clientSocket.emit('pressure_data', {pressureData: pressureResult})
        }, 30000)
    })

})

const port = 3001
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`)
})