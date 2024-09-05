require('dotenv').config()

const {v4: uuidv4} = require('uuid');

// utils and models
const company = require('./company');
const {User, Company, VehicleDynamicInformation} = require('./vehicle')
const {VehicleStaticInformation, MaintenanceInformation} = require('./vehicle')
const {generateRandomCompanyName, generateVehicleName, generateDriverName} = require('./namegenerator')

// Connect to database
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb"); 
const connectionString = process.env.connString
const client = new MongoClient(connectionString);


// create an entry into the dynamicData collection
// create an entry into the maintenanceData collection
// const sensorCollection = database.collection('sensorData');
// const maintenanceCollection = database.collection('maintenanceData');

// const myCompany = new company("Ayodele", 5, "cambridge");
// myCompany.displayCompanyInfo();
async function emailExist() {
    const database  = client.db('test');
    const users = database.collection('users');
    const query = {email: "ayodelejimoh@gmail.com"};
    const result = await users.find(query).toArray();
    return result;
} 

async function main() {
    try {
        const result = await emailExist();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
    finally {
        await client.close();
    }
}

// main();

// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
async function loadCompany() {
    const companyA = new company("CompanyA", 5, "Hamilton Ontario, Canada");
    const companyB = new company();
    const newCompany = new Company({
        companyId: uuidv4(),
        name: companyB.companyName,
        numberOfVehicles: companyB.numOfVehicle,
        location: companyB.location,
        vehicles: []
    })

    try {
        const result = await companyCollection.insertOne(newCompany)
        console.log(result)
    } catch (error) {
        console.log("Error", error)
    } finally {
        await client.close();
    }
}
 
// loadCompany()

const vehicleTypes = [
    "Pickup Truck",
    "Box Truck",
    "SUV",
    "Sedan",
    "Minivan",
    "Tank Truck",
    "Semi Truck"
];

// should return a list of the vehicleIds created
async function createVehicleInformation(vehicleNum, companyId) {
    let vehicleObjectList = []
    let vehicleIdList = []

    for (let i=0; i<vehicleNum; i++) {
        const vehicleId = uuidv4();
        const newVehicle = new VehicleStaticInformation({
            _id: vehicleId,
            vehicleId: vehicleId,
            name: `${generateVehicleName()} - ${vehicleTypes[Math.floor(Math.random()*vehicleTypes.length)]}`,
            purchaseDate: Date.now,
            vehicleDriverName: generateDriverName(),
            owner: companyId
        })
        
        vehicleObjectList.push(newVehicle)
        vehicleIdList.push(vehicleId)
    }   

    // Insert the vehicles generated into the database collection
    try {
        await client.connect();
        const database  = client.db('FleetElement');
        const vehicleCollection = database.collection('vehicles');
        
        // insert to the vehicles collection 
        const insertionResult = await vehicleCollection.insertMany(vehicleObjectList)
        console.log(insertionResult)
        console.log(`Successfully inserted ${vehicleIdList.length} vehicles`)
    } catch (error) {
        console.log("Error on inserting vehicle into collection:", error)
    } 
    finally {
        await client.close();
    }

    return vehicleIdList // list of vehicles created for a company
}

async function newClient() {

    const newID = uuidv4();
    const vehicleNum = 4;
    const newCompany = new Company({
        _id: newID,
        companyId: newID,
        name: generateRandomCompanyName(),
        numberOfVehicles: vehicleNum,
        location: "Mississauga Ontario, Canada",
        vehicles: await createVehicleInformation(vehicleNum, newID)
    })

    try {
        await client.connect();
        const database  = client.db('FleetElement');
        const companyCollection = database.collection('companies');

        const result = await companyCollection.insertOne(newCompany)
        console.log(result)
        console.log(`Successfully added new client`)
    } catch (error) {
        console.log("Error inserting company", error)
    } finally {
        await client.close();
    }
}

newClient();
// setInterval(() => {
//     newClient()
// }, 10000)