require('dotenv').config()

const express = require('express')
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

// database connection
const { MongoClient } = require("mongodb");
const connectionString = process.env.connString
const client = new MongoClient(connectionString);

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

let listOfCompanies = 
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

})

const port = 3001
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`)
})