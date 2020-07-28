const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const employeeArray = [];
const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employeeQuestions = [
    {
        type: "input", 
        name: "name",
        message: "What is the employees' name?"
    },
    {
        type: "input", 
        name: "id",
        message: "What is the employees' id number?"
    },
    {
        type: "input", 
        name: "email",
        message: "What is the employees' email address?",
        default: () => {},
        validate: function (email) {
            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            if (valid) {
                console.log("Valid email format.");
                return true;
            } else {
                console.log("Please enter a valid email");
                return false;
            }
        }
    },

    {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: ["Manager", "Engineer", "Intern"]
    }
];
//manager specific questions
const managerQuestions = [
    {
        type: "input",
        name: "officeNumber",
        message: "What is the manager's office number?"
    }
];
//intern specific questions
const internQuestions = [
    {
        type: "input",
        name: "school",
        message: "What school did/does the intern attend?"
    }
];
//engineer specific questions
const engineerQuestions = [
    {
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub username?"
    }
];
//adding employee to employee array
const addEmployeeQuestion = [
    {
        type: "confirm",
        name: "addEmployee",
        message: "Are there any more employees to add?",
        default: false
    }
];

async function addEmployee() {
    try {
        const answer = await inquirer.prompt(addEmployeeQuestion);
        if (answer.addEmployee) {
            await askQuestions();
        } return employeeArray;
    } catch (error) {
        console.log("Error: Add Employee");
    }
}
//function for inquirer to ask employee questions
async function askQuestions() {
    try {
        const employeeAnswers = await inquirer.prompt(employeeQuestions);
        const { name, id, email } = employeeAnswers;
        switch (employeeAnswers.role) {
            case "Manager":
                try {
                    const managerAnswers = await inquirer.prompt(managerQuestions);
                    const { officeNumber } = managerAnswers;
                    let manager = new Manager(name, id, email, officeNumber);
                    employeeArray.push(manager);
                    await addEmployee();
                } catch (err) {
                    console.log("Error: Manager");
                }
                break;
            case "Engineer":
                try {
                    const engineerAnswers = await inquirer.prompt(engineerQuestions);
                    const { github } = engineerAnswers;
                    let engineer = new Engineer(name, id, email, github);
                    employeeArray.push(engineer);
                    await addEmployee();
                } catch (err) {
                    console.log("Error: Engineer");
                }
                break;
            case "Intern":
                try {
                    const internAnswers = await inquirer.prompt(internQuestions);
                    const { school } = internAnswers;
                    let intern = new Intern(name, id, email, school);
                    employeeArray.push(intern);
                    await addEmployee();
                } catch (err) {
                    console.log("Error: Intern");
                }
                break;
        }
    } catch (err) {
        console.log("Error: Ask Questions");
    }
};

async function generator() {
    await askQuestions();
    //array containing employee objects
    const renderedHTML = render(employeeArray);
    const dir = "./output";
    if (fs.existsSync(dir)) {
        console.log("Output directory exists!");
    } else {
        fs.mkdirSync(dir);
        console.log("Output directory created.")
    }
    //create html file
    fs.writeFile(outputPath, renderedHTML, (error) => {
        if (error) throw error;
        console.log("File saved.");
    });
}

generator()
    .then(() => console.log("Team generated."))
    .catch((error) => console.log(error));