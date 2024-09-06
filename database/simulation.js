require('dotenv').config()
const {v4: uuidv4} = require('uuid');

// model
const {VehicleDynamicInformation} = require('./vehicle')

// Connect to database
const { MongoClient, ServerApiVersion } = require("mongodb"); 
const vehicle = require('./vehicle');
const connectionString = process.env.connString
const client = new MongoClient(connectionString);

const interval = 30000 // 30 seconds
console.log(`Started simulation...generating vehicle sensory data every ${interval/1000} seconds`)

const generateSensoryData = async () => {
    
    await client.connect();
    const db = client.db("FleetElement")
    const companyCollection = db.collection('companies')

    // const query1 = { companyId: "someString", name: "someString" };
    const projection = {companyId: 1, vehicles: 1} 
    // get access to all vehicles in entire database
    const result = await companyCollection.find().project(projection).toArray() 
    // console.log(result)

    // using the result, simulate data for the different vehicles.
    let incomingLiveSensorData = []
    result.forEach((company) => {
        company.vehicles.forEach((vehicleId) => {
            const sensorDataID = uuidv4()
            const sensoryData = new VehicleDynamicInformation({
                _id: sensorDataID,
                infoId: sensorDataID,
                vehicleId: vehicleId,
                companyId: company.companyId,
                date: new Date().toISOString(),
                speed: simulateSpeed(vehicleId), // based on the most recent speed value
                mileage: mileageValue(vehicleId),
                fuelLevel: 0.75, // 1: full | 3/4 | 1/2 | 1/4 | 0: empty
                tirePressure: pressureValue(vehicleId), // 50 or lower
                // 43.59740068079627, -79.63594368066431 lat and long of Element Fleet
                location: {longitude: "-79.63594368066431", latitude: "43.59740068079627"} 
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

// decrease pressure value by 0 0r 1 pressure value for each simulation
// pressure can only stay the same or decrease BUT NOT increase over time
const pressureTracker = new Map();
const pressureValue = (vehicleId) => {
    let initialPressure = pressureTracker.get(vehicleId)
    let pressure = 50 // initial pressure tires are set to 50 psi

    if (initialPressure) {
        pressure = initialPressure - Math.floor(Math.random()*2)
        pressureTracker.set(vehicleId, pressure)
    } else {
        pressureTracker.set(vehicleId, pressure)
    }
    return pressure
}

// increase mileage between 0 - 4 km
const mileageTracker = new Map();
const mileageValue = (vehicleId) => {
    let initialMileage = mileageTracker.get(vehicleId)
    let mileage = 20000 // initial mileage of vehicle is 20000km

    if (initialMileage) {
        mileage = initialMileage + Math.floor(Math.random()*5)
        mileageTracker.set(vehicleId, mileage)
    } else {
        mileageTracker.set(vehicleId, mileage)
    }
    return mileage
}

const speedTracker = new Map();
// return the simulated speed but store the new speed value for the next
// simulation inside speedTracker hash map
function simulateSpeed(vehicleId) {

    const maxSpeed = 200;  // Maximum speed of the vehicle
    let initialSpeed = speedTracker.get(vehicleId)
    
    // sets speed if record is in hashMap, otherwise set to 30 km/hr or m/hr
    // let speed = initialSpeed ? initialSpeed : 30
    if (initialSpeed) {
        speed = initialSpeed
    } else {
        speed = 30 // sets initial speed if record is not in hashMap
        
        // update speed of vehicle inside hasMap and return
        speedTracker.set(vehicleId, speed)
        console.log(`Initial speed: ${initialSpeed}, New Speed:${speed}`)
        return speed
    }

    // Simulate random increase or decrease in speed
    switch (true) {
        case (speed >= 160):
            speed += Math.floor(Math.random() * 2) - 5; //Random value: -5 or -4
            break;
        case (speed >= 100):
            speed -= Math.floor(Math.random() * 21) - 10; //Random value between -10 to 10
            break;
        case (speed >= 75):
            speed += Math.floor(Math.random() * 41) - 20; //Random value between -20 to 20
            break;
        case (speed >= 50):
            speed += Math.floor(Math.random() * 71) - 35; //Random value between -35 to 35
            break;
        case (speed >= 30):
            speed += Math.floor(Math.random() * 31) - 15; //Random value between -15 to 15
            break;
        case speed <= 30:
            speed += Math.floor(Math.random() * 41) - 20; //Random value between -20 to 20
            break;
        default:
            break;
    }
    
    // Keep speed within 0 and maxSpeed
    if (speed < 0) speed = 0;
    if (speed > maxSpeed) speed = maxSpeed;

    // update speed of vehicle inside hasMap
    speedTracker.set(vehicleId, speed)

    // Update the speed on the screen
    console.log(`Initial speed: ${initialSpeed}, New Speed:${speed}`)
    return speed
}

setInterval(() => {
    generateSensoryData();
}, interval) // simulate vehicle sensory information every 10 seconds and save it to the data base 