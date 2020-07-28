const Employee = require("./Employee");
//manager class, inherits from employee class
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    getOfficeNumber(){
        return this.officeNumber;
    }

    getRole() {
        return "Manager";
    }
}

//export manager class
module.exports = Manager;