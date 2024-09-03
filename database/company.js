class company {
    constructor(companyName="Unknown", numOfVehicle=0, location={longitude: "0", latitude:"0"}) {
        this._companyName = companyName
        this._numOfVehicle = numOfVehicle
        this._location = location
    }

    get companyName() {
        return this._companyName
    }

    get numOfVehicle() {
        return this._numOfVehicle
    }

    get location() {
        return this._location
    }

    set companyName(name) {
        this._companyName = name
    }

    set numOfVehicle(number) {
        this._numOfVehicle = number
    }

    set location(address) {
        this._location = address
    }    

    displayCompanyInfo = () => {
        console.log(`${this.companyName} has ${this.numOfVehicle} vehicles and is located in ${this.location.longitude},${this.location.latitude}`)
    }
}

module.exports = company;