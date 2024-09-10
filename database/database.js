require('dotenv').config()
const {v4: uuidv4} = require('uuid');

// utils and models
const company = require('./company');
const {Company} = require('./schemas')
const {VehicleStaticInformation, MaintenanceInformation} = require('./schemas')
const {generateRandomCompanyName, generateVehicleName, generateDriverName} = require('./namegenerator')

// Connect to database
const { MongoClient, ServerApiVersion } = require("mongodb"); 
const connectionString = process.env.connString
const client = new MongoClient(connectionString);

// new acquisition
// Steps:  1. create company in db
//         2. create vehicles associated with company in db
//         3. Initialize vehicles historical data
//         4. Implicit operation: simulataion.js automatically would query this new
//         acquisition and simulate the sensory data accordingly
async function autoAcquisition() {

    const companyId = uuidv4();
    // a new company has between 1 and 7
    const vehicleNum = Math.ceil(Math.random()*7); 
    const newCompany = new Company({
        _id: companyId,
        companyId: companyId,
        name: generateRandomCompanyName(),
        numberOfVehicles: vehicleNum,
        location: "Mississauga Ontario, Canada", // default location
        vehicles: await createVehicleInformation(vehicleNum, companyId)
    })

    try {
        await client.connect();
        const database  = client.db('FleetElement');
        const companyCollection = database.collection('companies');

        const result = await companyCollection.insertOne(newCompany)
        console.log(result)
    } catch (error) {
        console.log("Error inserting company", error)
    } finally {
        await client.close();
        console.log(`Successfully added new client`)
    }

    initializeFleetHistory(companyId)
}

async function newAcquisitionByUser(companyName, numOfVehicle) {
    const companyId = uuidv4();
    const newCompany = new Company({
        _id: companyId,
        companyId: companyId,
        name: companyName,
        numberOfVehicles: numOfVehicle,
        location: "Mississauga Ontario, Canada", // default 
        vehicles: await createVehicleInformation(numOfVehicle, companyId)
    })

    try {
        await client.connect();
        const database  = client.db('FleetElement');
        const companyCollection = database.collection('companies');

        const result = await companyCollection.insertOne(newCompany)
        console.log(result)
    } catch (error) {
        console.log("Error inserting company", error)
    } finally {
        await client.close();
        console.log(`Successfully added new client`)
    }

    initializeFleetHistory(companyId)
}

// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const vehicleTypes = [
    "Pickup Truck",
    "Box Truck",
    "SUV",
    "Sedan",
    "Minivan",
    "Tank Truck",
    "Semi Truck"
];


const initializeFleetHistory = async (companyId) => {
    await client.connect();
    const db = client.db("FleetElement")
    const companyCollection = db.collection('companies')

    const query = { companyId: companyId};
    const projection = {companyId: 1, vehicles: 1} 
    const result = await companyCollection.findOne(query, {projection: projection});

    // using the result, simulate maintenance history a vehicle
    let maintenanceDataInfo = []
    result.vehicles.forEach((vehicleId) => {
        let lastOilChange = {date: new Date().toISOString(), longitude: "78.77", latitude: "75.28"}
        let nextOilChangeDate = new Date(lastOilChange.date)
        nextOilChangeDate.setMonth(nextOilChangeDate.getMonth() + 2) // next oil change in 2 months
        
        const maintenanceDataID = uuidv4()
        const maintenanceData = new MaintenanceInformation({
            _id: maintenanceDataID,
            infoId: maintenanceDataID,
            vehicleId: vehicleId,
            companyId: companyId,
            lastOilChange: lastOilChange,
            nextOilChangeDate: nextOilChangeDate,
            tirePressureRefill: {
                date: new Date().toISOString(), 
                longitude: "78.77",
                latitude: "75.28",
                oldValue: [pValue(30), pValue(33), pValue(31), pValue(34)], // [fr, fl, rr, rl]
                refillValue: [newPValue(50), newPValue(50), newPValue(50), newPValue(50)], // [fr, fl, rr, rl]                    
            },
            refuelHistory: {
                date: new Date().toISOString(), 
                longitude: "-79.63594368066431",
                latitude: "43.59740068079627",
                oldValue: 0.25, // 0 | 0.25 | 0.5 | 1.75 | 1
                refuelLevel: 1
            }
        })
        maintenanceDataInfo.push(maintenanceData)
    })

    // insert all the sensory data into the database
    try {
        const maintenanceCollection = db.collection('maintenanceData');
        const insertionResult = await maintenanceCollection.insertMany(maintenanceDataInfo)
        console.log(insertionResult)
        console.log("Insertion of data from maintenance successful")
    } catch (error) {
        console.log("Maintenance data insertion error is:", error)
    } finally {
        await client.close()
    }
}

// should return a list of the vehicleIds created
async function createVehicleInformation(vehicleNum, companyId) {
    let vehicleObjectList = []
    let vehicleIdList = []

    for (let i=0; i<vehicleNum; i++) {
        const vehicleId = uuidv4();
        const newVehicle = new VehicleStaticInformation({
            _id: vehicleId,
            vehicleId: vehicleId,
            name: generateVehicleName(),
            vehicleType: vehicleTypes[Math.floor(Math.random()*vehicleTypes.length)],            
            purchaseDate: Date.now,
            vehicleDriverName: generateDriverName(),
            owner: companyId
        })
        
        vehicleObjectList.push(newVehicle )
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

const pValue = (bound) => {
    return Math.floor(Math.random()*15) + bound
}

const newPValue = (bound) => {
    return Math.floor(Math.random()*4) + bound
}

// Initialize maintenance history
const maintenanceHistory = async () => {
    await client.connect();
    const db = client.db("FleetElement")
    const companyCollection = db.collection('companies')

    // const query1 = { companyId: "someString", name: "someString" };
    const projection = {companyId: 1, vehicles: 1} 
    const result = await companyCollection.find().project(projection).toArray()

    // using the result, simulate maintenance history a vehicle

    let maintenanceDataInfo = []
    result.forEach((company) => {
        company.vehicles.forEach((vehicleId) => {
            let lastOilChange = {date: new Date().toISOString(), longitude: "78.77", latitude: "75.28"}
            let nextOilChangeDate = new Date(lastOilChange.date)
            nextOilChangeDate.setMonth(nextOilChangeDate.getMonth() + 2) // next oil change in 2 months
            
            const maintenanceDataID = uuidv4()
            const maintenanceData = new MaintenanceInformation({
                _id: maintenanceDataID,
                infoId: maintenanceDataID,
                vehicleId: vehicleId,
                companyId: company.companyId,
                lastOilChange: lastOilChange,
                nextOilChangeDate: nextOilChangeDate,
                tirePressureRefill: {
                    date: new Date().toISOString(), 
                    longitude: "78.77",
                    latitude: "75.28",
                    oldValue: [pValue(30), pValue(33), pValue(31), pValue(34)], // [fr, fl, rr, rl]
                    refillValue: [newPValue(50), newPValue(50), newPValue(50), newPValue(50)], // [fr, fl, rr, rl]                    
                },
                refuelHistory: {
                    date: new Date().toISOString(), 
                    longitude: "-79.63594368066431",
                    latitude: "43.59740068079627",
                    oldValue: 0.25, // 0 | 0.25 | 0.5 | 1.75 | 1
                    refuelLevel: 1
                }
            })
            maintenanceDataInfo.push(maintenanceData)
        })
    })

    // insert all the sensory data into the database
    try {
        const maintenanceCollection = db.collection('maintenanceData');
        const insertionResult = await maintenanceCollection.insertMany(maintenanceDataInfo)
        console.log(insertionResult)
        console.log("Insertion of data from maintenance successful")
    } catch (error) {
        console.log("Maintenance data insertion error is:", error)
    } finally {
        await client.close()
    }
}

// add a new company
// newAcquisition()


module.exports = {
    autoAcquisition,
    newAcquisitionByUser,
    initializeFleetHistory,
    createVehicleInformation
};