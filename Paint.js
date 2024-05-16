// TSI Javascript Paint project
// By Oliver Barnes, 16/05/2024
// There's some confusing use of error handling in here, as well as Try/Catch statements.
// I figured this was preferable to asking for user input recursively.

// imports
// requires prompt-sync
const prompt = require("prompt-sync")();


// global vars
// values required for the whole program to access
let totalArea = 0;
let areaByRoom = [];

let totalPaint = 0;
let paintByRoom = [];

let totalCost = 0;
let costByRoom = [];

// toggles visual mode, which displays diagrams for measurement
let v = false;

// 
let uniform = false;
let uniformPaintGrade = "value";
let uniformColour = "white";

// initial mathematical functions
// determine coverage area, and paint required per m**2

// calculates area of rectangular area given user input
// returns area of wall in m**2
function areaRectangle() {
    if (v) {
        console.log("\n    _______________\n    |             |\n    |             |\n    |             |\n    |             |\n    |_____________|\n    <------------->");
    }
    const l = prompt("Please enter the length of the shape: ");

    if (v) {
        console.log("\n    _______________\n  ^ |             |\n  | |             |  \n  | |             |\n  | |             |\n  v |_____________|");
    }
    const h = prompt("Please enter the height of the shape: ");

    return h * l;
}

// calculates area of triangular area given user input
// returns area of wall in m**2
function areaTriangle() {
    if (v) {
        console.log("\n    |\\ \n    | \\ \n    |  \\ \n    |   \\ \n    |    \\ \n    |     \\ \n    |------\\ \n    <------>");
    }
    const l = prompt("Please enter the length of the shape: ");

    if (v) {
        console.log("\n  ^ |\\ \n  | | \\ \n  | |  \\ \n  | |   \\ \n  | |    \\ \n  | |     \\ \n  v |------\\ ");
    }
    const h = prompt("Please enter the height of the shape: ");

    return (h * l)/2;
}

// calculates area of circular area given user input
// returns area of wall in m**2, to 2 decimal places
function areaCircle() {
    if (v) {
        console.log("\n         , - ~ ~ ~ - ,\n     , '               ' ,\n   ,                       ,\n  ,                         ,\n ,                           ,\n ,<------------------------->,\n ,                           ,\n  ,                         ,\n   ,                       ,\n     ,                  , '\n       ' - , _ _ _ ,  '");
    }
    const d = prompt("Please enter the diameter of the shape: ");
    let r = d/2

    return (((r**2) * Math.PI).toFixed(2));
}

// calculates amount of paint needed given an area in m**2
// params:
//  a - number, area required to be painted in m**2
// returns area of wall in m**2, to 2 decimal places
function areaToPaint(a) {
    return (a * 0.1);
}


// selection functions
// 

// in the event an error is thrown by a user inputting incorrect values,
// this confirmation function will be called to ask if they'd like to proceed
// returns boolean, based on user input
function invalidConfirmation() {
    const response = prompt("Input value is invalid. Try again? [y]es or [n]o. ");

    if (response.toLowerCase() == "y") {
        return true;
    } else {
        return false;
    }
}

// allows user to select the shape of an obstacle on a given wall,
// so surface area calculation can be run
// returns area in m**2, to 2 decimal places
function selectObstacle() {
    const shape = prompt("What shape is the obstacle? Enter 1 for rectangular, 2 for triangular, and 3 for circular. ");
    let result = 0;

    switch(shape) {
        case "1":
            result = areaRectangle();
            break;
        case "2":
            result = areaTriangle();
            break;
        case "3":
            result = areaCircle();
            break;
        default:
            throw new Error('Invalid user input.');
    }

    if (isNaN(result)) {
        throw new Error('Invalid user input.');
    } else {
        return result;
    }
}

// allows user to input the number of obstacles
// iterates selectObstacle to calculate surface area to subtract from total
// returns wall space occupied by obstacles in m**2
function totalObstacles() {
    let total = 0;

    const obstaclesInput = prompt("How many obstacles are on the current wall? ");
    let obstacles = Number(obstaclesInput);

    if (isNaN(obstacles)) {
        throw new Error('Invalid user input.');
    }

    for (let i = 0; i < obstacles; i++) {
        try {
            total += selectObstacle();
        } catch (Error) {
            if (invalidConfirmation()) {
                total += selectObstacle();
            }
        }
    }

    return total;
}

// allows user to select the shape of a given wall,
// so surface area calculation can be run
// returns area in m**2, to 2 decimal places
function selectWall() {
    const shape = prompt("What shape is the wall? Enter 1 for rectangular, 2 for triangular, and 3 for circular. ");

    let result = 0;
    let obstacleArea = 0;

    switch(shape) {
        case "1":
            result = areaRectangle();
            break;
        case "2":
            result = areaTriangle();
            break;
        case "3":
            result = areaCircle();
            break;
        default:
            throw new Error('Invalid user input.');
    }

    if (isNaN(result)) {
        throw new Error('Invalid user input.');
    } else {

        try {
            obstacleArea = totalObstacles();
        } catch (Error) {
            if (invalidConfirmation()) {
                obstacleArea = totalObstacles();
            }
        }

        if (obstacleArea > result) {
            throw new Error('Obstacles cannot occupy more space than the wall does.');
        }

        // TODO: 
        // need to add check for colour, and add total to colourmap
        return result - obstacleArea;
    }
}

// allows user to input the number of walls in the current room
// iterates selectWall to calculate surface area to add to totals
//
// returns wall space of the room in m**2
function totalWalls(areaByRoom) {
    let total = 0;

    const wallsInput = prompt("How many walls are in the current room? ");
    let walls = Number(wallsInput);

    if (isNaN(walls)) {
        throw new Error('Invalid user input.');
    }

    for (let i = 0; i < walls; i++) {
        try {
            total += selectWall();
        } catch (Error) {
            if (invalidConfirmation()) {
                total += selectWall();
            }
        }
    }

    areaByRoom.push(total);
    return total;
}

// allows user to input the number of rooms in the current building
// iterates totalWalls to calculate surface area to add to totals
// returns wall space of the rooms in m**2
// !SIDE EFFECT!: directly alters areaByRoom list, not passed in as param to this function
function totalRooms() {
    let total = 0;

    const roomsInput = prompt("How many rooms to calculate for? ");
    let rooms = Number(roomsInput);

    if (isNaN(rooms)) {
        throw new Error('Invalid user input.');
    }

    for (let i = 0; i < rooms; i++) {
        try {
            total += totalWalls(areaByRoom);
        } catch (Error) {
            if (invalidConfirmation()) {
                total += totalWalls(areaByRoom);
            }
        }
    }

    return total;
}

console.log(totalRooms());
console.log(areaByRoom);