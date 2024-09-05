const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        longitude: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        }
    },
    numberOfVehicles: {
        type: Number,
        required: true
    },
    vehicles: [String]
})

const Company = mongoose.model('Company', companySchema)

const vehicleStaticInformationSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    vehicleType: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    vehicleDriverName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    owner: {
        type: String,
        required: true
    }
})

const VehicleStaticInformation = mongoose.model('VehicleStaticInformation', vehicleStaticInformationSchema)

const vehicleDynamicInformationSchema = mongoose.Schema({
    infoId: {type: String, required: true},
    mileage: {
        type: Map,
        of: Number,
        required: true
    },
    fuelLevel: {
        type: Map,
        of: Number,
        required: true
    },
    tirePressure: {
        type: Map,
        of: Number,
        required: true
    },
    location: {
        date: {type: Date, required: true},
        longitude: {type: String, required: true},
        latitude: {type: String, required: true}
    },
    vehicleId: {type: String, required: true}
})

const VehicleDynamicInformation = mongoose.model('VehicleDynamicInformation', vehicleDynamicInformationSchema)

const maintenanceInformationSchema = mongoose.Schema({
    infoId: {type: String, required: true},
    oilChange: {
        date: {
            type: Date,
            required: true
        },
        location: {
            longitude: {type: String, required: true},
            latitude: {type: String, required: true}
        }
    },
    tirePressureRefil: {
        date: {
            type: Date,
            required: true
        },
        location: {
            longitude: {type: String, required: true},
            latitude: {type: String, required: true}
        }
    },
    refuelHistory: {
        date: {
            type: Date,
            required: true
        },
        location: {
            longitude: {type: String, required: true},
            latitude: {type: String, required: true}
        }
    },
})

const MaintenanceInformation = mongoose.model('MaintenanceInformation', maintenanceInformationSchema)
module.exports = {
    Company: Company,
    VehicleStaticInformation: VehicleStaticInformation,
    VehicleDynamicInformation: VehicleDynamicInformation,
    MaintenanceInformation: MaintenanceInformation
}

// To import use, const User = require('../model/user')
// https://stackoverflow.com/questions/58172762/how-to-export-multiple-schemas-in-same-file-in-mongoose
// https://mongoosejs.com/docs/schematypes.html