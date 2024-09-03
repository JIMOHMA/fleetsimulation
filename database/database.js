require('dotenv').config()

// db
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb"); 

const company = require('./company');
const vehicleTypes = require("./vehicleTypes");
const {User, Company, VehicleDynamicInformation} = require('./vehicle')
const {VehicleStaticInformation, MaintenanceInformation} = require('./vehicle')


// Connect to database
const connectionString = process.env.connString
const client = new MongoClient(connectionString);
const database  = client.db('FleetElement');
const companyCollection = database.collection('companies');
const vehicleCollection = database.collection('companies');
const dynamicCollection = database.collection('companies');

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

// create an entry into the company collection
// create an entry into the vehicle collection
// create an entry into the dynamicData collection
// create an entry into the maintenanceData collection
function createDatabases() {
    const database  = client.db('FleetElement');
    const companyCollection = database.collection('companies');
    const vehicleCollection = database.collection('companies');
    const dynamicCollection = database.collection('companies');
}

// createDatabases()
async function loadCompany() {
    const companyA = new company("CompanyA", 5, {longitude:"78.45", latitude:"71.79"});
    const newCompany = new Company({
        companyId: "55",
        name: companyA.companyName,
        numberOfVehicles: companyA.numOfVehicle,
        location: companyA.location,
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
 
loadCompany()