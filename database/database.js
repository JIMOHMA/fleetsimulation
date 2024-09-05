require('dotenv').config()

const {v4: uuidv4} = require('uuid');

// utils and models
const company = require('./company');
const {User, Company, VehicleDynamicInformation} = require('./vehicle')
const {VehicleStaticInformation, MaintenanceInformation} = require('./vehicle')
const {generateRandomCompanyName, generateVehicleName, generateDriverName} = require('./namegenerator')

// Connect to database
const { MongoClient, ServerApiVersion } = require("mongodb"); 
const connectionString = process.env.connString
const client = new MongoClient(connectionString);


// create an entry into the dynamicData collection
// create an entry into the maintenanceData collection
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
            name: generateVehicleName(),
            vehicleType: vehicleTypes[Math.floor(Math.random()*vehicleTypes.length + 1)],            
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

async function newClient() {

    const newID = uuidv4();
    // a new company has between 1 and 7
    const vehicleNum = Math.ceil(Math.random()*7); 
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

// const generateSensoryData = (vehicleId, companyId) => {
const generateSensoryData = async () => {
    
    await client.connect();
    const db = client.db("FleetElement")
    const companyCollection = db.collection('companies')

    // const query1 = { companyId: "someString", name: "someString" };
    const projection = {companyId: 1, vehicles: 1} 
    const result = await companyCollection.find().project(projection).toArray()
    // console.log(result)

    // using the result, simulate data for the different vehicles.
    let incomingLiveSensorData = []
    result.forEach((company) => {
        company.vehicles.forEach((vehicleId) => {
            const sensorDataID = uuidv4()
            // const myDate = new Date().toISOString()
            const sensoryData = new VehicleDynamicInformation({
                _id: sensorDataID,
                infoId: sensorDataID,
                vehicleId: vehicleId,
                companyId: company.companyId,
                mileage: {date: new Date().toISOString(), value: 1000},
                fuelLevel: {date: new Date().toISOString(), value: 1}, // 1: full | 3/4 | 1/2 | 1/4 | 0: empty
                tirePressure: {date: new Date().toISOString(), value: 500},
                location: {date: new Date().toISOString(), longitude: "78.77", latitude: "75.28"}
            })
            incomingLiveSensorData.push(sensoryData)
        })
    })

    // insert all the sensory data into the database
    try {
        const sensorCollection = db.collection('sensorDataInfo');
        const insertionResult = await sensorCollection.insertMany(incomingLiveSensorData)
        console.log(insertionResult)
        console.log("Insertion of data from sensors successful")
    } catch (error) {
        console.log("Sensory data insertion error is:", error)
    } finally {
        await client.close()
    }
}

// newClient();

// generate sensor data for all the vehicles every 10seconds
setInterval(() => {
    generateSensoryData()
}, 10000)