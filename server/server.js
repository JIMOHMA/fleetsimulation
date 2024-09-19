require('dotenv').config()
const { autoAcquisition, newAcquisitionByUser } = require('./database');

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

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

app.get('/', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        // If no valid token, redirect to the frontend
        return res.redirect(process.env.CORS_ORIGIN);
    }
})

app.post('/new_acquisition', inputValidation, (req,res) => {
    newAcquisitionByUser(req.body.name, req.body.numOfVehicles)
    console.log(`command:manual entry, result:${req.body.name} Registered}`)
    res.json({data: `${req.body.name} Created and Registered`})
})

app.post('/autogenerate', inputAutoValidation2, async (req, res) => {
    const autoCompName = await autoAcquisition()
    console.log(`command:${req.body.instruction}, result:${autoCompName} Company Generated and Registered`)
    res.json({data: `${autoCompName} Generated and Registered`})
})

// Middleware to avoid invalid database entry
function inputValidation(req, res, next) {
    try {
        if ((req.body.name.length > 1) && (parseInt(req.body.numOfVehicles) > 0)) {
            console.log("Valid company details entered")
            console.log(`name: ${req.body.name}, num: ${req.body.numOfVehicles}`)
            next()
        } else {
            console.log("Not a valid entry")
            console.log(`name: ${req.body.name}, num: ${req.body.numOfVehicles}`)
            res.json({data: "Please enter reasonable name and number of vehicles (>= 1 and <= 7)"})
        }
    } catch (error) {
        res.json({data: "Invalid registration data provided!"})
    }

}

// Middleware to avoid invalid database entry
function inputAutoValidation2(req, res, next) {
    if (req.body.instruction === "generate-company") {
        console.log("Valid auto-gen request")
        next()
    }
    else {
        console.log(`bad request ${req.body}`)
        res.json({data: "Bad auto-gen request"})
    }
}

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
        console.log("First Parsed data")
        console.log(parsedData)
        clientSocket.emit('speed_data', {vehicleData: parsedData})

        // TODO: Change this back to 30000
        // wait 30 seconds before loading the next feed of data
        setInterval(async() => {
            speedResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(10).toArray()
            parsedData = speedResult.reverse().map((item) => ({
                speed: item.speed, 
                date: `${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}:${new Date(item.date).getSeconds()}`
            }))
            console.log("Second Parsed data:")
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
        
        // console.log("fuel result is", fuelResult)
        clientSocket.emit('fuel_data', {fuelData: fuelResult})

        // update fuel level every 30 seconds
        setInterval(async() => {
            let fuelResult = await sensorCollection.find({vehicleId: vehicleId}).project(projection).sort("date", -1).limit(1).toArray()

            clientSocket.emit('fuel_data', {fuelData: fuelResult})
        }, 30000)
    })

    clientSocket.on('pressure_information', async ({vehicleId}) => {
        // console.log("Pressure vehicleId received is", vehicleId)

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
        
            // console.log("Pressure result is", pressureResult)
            clientSocket.emit('pressure_data', {pressureData: pressureResult})
        }, 30000)
    })

    clientSocket.on('driver_info', async ({vehicleId}) => {

        await client.connect();
        const db = client.db('FleetElement')
        const vehicleCollection = db.collection('vehicles')
        const query = { vehicleId: vehicleId};
        const projection = {name: 1, vehicleType: 1, vehicleDriverName: 1, purchaseDate: 1} 

        // get the most recent fuel level value 
        const result = await vehicleCollection.findOne(query, {projection: projection});
        // console.log("Driver result are", result)
        clientSocket.emit('driver_data', {driverData: result})
    })

    clientSocket.on('description', async ({vehicleId}) => {
        
        await client.connect();
        const db = client.db('FleetElement')
        const vehicleCollection = db.collection('vehicles')
        const companyCollection = db.collection('companies')
        const query1 = { vehicleId: vehicleId};
        const projection1 = {name: 1, owner: 1} 

        const vehicleResult = await vehicleCollection.findOne(query1, {projection: projection1});
        // console.log("Description vehicle result are", vehicleResult)


        const query2 = {companyId: vehicleResult.owner}
        const projection2 = {name: 1}
        const companyResult = await companyCollection.findOne(query2, {projection: projection2})
        // console.log("Description company result are", companyResult)
        
        clientSocket.emit('description_data', [{vehicle: vehicleResult}, {company: companyResult}])
    })

})

const port = process.env.PORT || 3001
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`)
})