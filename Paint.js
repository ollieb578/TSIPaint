// TSI Javascript Paint project
// By Oliver Barnes, 16/05/2024

// Notes for reader/user:
// There's some confusing use of error handling in here, as well as Try/Catch statements.
// I figured this was preferable to asking for user input recursively.
//
// DEFINITELY should've implemented as an OOP approach, single script with no objects became
// too confusing and unwieldy too fast.
//
// catalogue.json is formatted improperly, doesn't actually use JSON formatting, closer to .csv.
// This became a real issue, requiring core-js library to offset some of the issues using the
// _.groupBy() function.
// 
// Due to a SEVERE lack of planning there's not much cohesion between the implementation 
// of each function, so a lot of them have major side effects and a lot of global vars are used. 
// This would've been easy to offset by drawing up a basic plan but apparently I couldn't 
// find a notepad.
//
// Lessons learned:
//  - Plan the code more. Draw up what values are required at the start and end, where they're
//    accessed and how. This would've revealed the OOP thing quickly.
//  - Understand file formats better/get a sample from somewhere. The JSON thing is embarrasing,
//    but they've given me hell on a seperate project so I format everything like a .csv.
//  - Ask questions about error handling - that input thing feels so weird and wrong. I hate it.

// imports
// requires prompt-sync
const prompt = require("prompt-sync")();
const fs = require("fs");
const groupBy = require("core-js/actual/array/group-by");
const path = require("path");

// global vars
// values required for the whole program to access
let totalArea = 0;
let areaByRoom = [];

let totalPaint = 0;
let paintByRoom = [];

let totalCost = 0;
let costByRoom = [];

// paint colour map
// this is a kv store that holds the amount of each type of paint used
let colourMap = new Map();

// toggles visual mode, which displays diagrams for measurement
let v = false;

// stores json object containing all paint data
var catalogue;

// contains values relating to uniform paint - if all walls are the same colour
let uniform = false;
let uniformPaintGrade = "value";
let uniformColour = "white";
let uniformSKU = "vwhite";

// mathematical functions
// determine coverage area, and paint required per m**2
// also calculates final cost of paint used, and the cheapest price available

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

// Checks what the cheapest option is when buying a quantity of paint
// !SIDE EFFECT!
function costOptimizer() {

}

// calculates actual cost of paint required and specified by the user
// !SIDE EFFECT! accesses colourMap, and alters totalCost.
function calculateCost() {
    for (const [key, value] of colourMap) {

    }
}

// paint functions
// these relate to reading in the catalogue file, displaying the catalogue, and displaying individual entries
// anything to do with the catalogue JSON object is handled here

// reads the contents of the catalogue file into a global object variable
// returns json object, the contents of the catalogue.json file
function readCatalogue() {
    let data;
    try {
        data = JSON.parse(fs.readFileSync("./catalogue.json"));
    } catch (Error) {
        console.log("Error: catalogue.json is not present or cannot be accessed.");
    }

    return(data);
}

// prints formatted out based on given json paint object
// params:
// paint - json, describes a type of paint
function printPaint(paint) {
    console.log("SKU: "+paint.SKU+"\nGrade: "+paint.Grade+"\nBrand: "+paint.Brand+"\nName: "+paint.Name+"\nColour:"+paint.Colour+"\nVolume:"+paint.Volume+"\nPrice:"+paint.Price);
}

// prints formatted out based on a group of paints with a shared SKU
// prints general info, then volumes and prices underneath (as these are independant of SKU)
// params:
// paints - json, describes a list of paints with a shared SKU
function printPaintsBySKU(paints) {
    const initialPaint = paints[0];
    let currentPaint;

    console.log("-------------------------------------------------------")
    console.log("SKU: "+initialPaint.SKU+"\nGrade: "+initialPaint.Grade+"         Brand: "+initialPaint.Brand+"\nName: "+initialPaint.Name+"        Colour: "+initialPaint.Colour+"\n\n  Prices:");

    for (let paint in paints) {
        currentPaint = paints[paint];
        console.log("   Volume: "+currentPaint.Volume+"      Price: "+currentPaint.Price);
    }
}

// Prints a formatted catalogue of all available paints
// Groups them by internal SKU value.
//
// Reliant on user input, prints 5 paints per page.
// params:
// catalogue - JSON object, contains all paint data
function printCatalogue(catalogue) {
    catalogue = readCatalogue();

    // number of results per catalogue page
    const pageCount = 5;
    const skuData = groupBy(catalogue.paint, ({ SKU }) => SKU);
    const results = Object.keys(skuData).length;

    let dataSlice;
    
    console.log("Number of results: "+results);

    catalogueLoop:
    for (let i = 0; i < results; i+=pageCount) {
        dataSlice = Object.entries(skuData).slice(i, i + (pageCount));
        console.log(i);

        for (let paint in dataSlice) {
            printPaintsBySKU(skuData[Object.keys(skuData)[i + Number(paint)]]);
        }

        if (results < pageCount) {
            console.log("\nAll entries printed!");
        } else {
            let userIn = catalogueControls();

            if (userIn == "e") {
                console.log("Exiting...");
                break catalogueLoop;
            } else if (userIn == "p") {
                if (i >= pageCount) {
                    i-=(2*pageCount);
                } else {
                    i = 0;
                }
            } else {
                if (results <= i+pageCount) {
                    console.log("No more results to display! Exiting...");
                    break catalogueLoop;
                } 
            }
        }

    }
}

// context action for catalogue traversal
// returns - string, handled by switch/case in catalogue function
function catalogueControls(){
    return prompt("[P]revious, [*N]ext, [Exit]: ").toLowerCase();
}

// actual search function without UI wrapper
// params:
// keyword - string, name of a colour
// catalogue - JSON object to be searched
// returns filtered JSON object 
function catalogueSearch(keyword, catalogue){
    return catalogue.filter(
        function(catalogue) {
            return catalogue.Colour == keyword;
        }
    );
}

// allows user to quickly find paint that they'd like from the catalogue
// search only implemented by colour
function searchCatalogue(catalogue) {
    catalogue = readCatalogue();

    let searchTerm = prompt("Please enter the name of the colour to search for: ").toLowerCase();
    let searchResult = catalogueSearch(searchTerm, catalogue.paint);

    const skuData = groupBy(searchResult, ({ SKU }) => SKU);
    const results = Object.keys(skuData).length;
    console.log("Number of results: "+results);

    for (let paint in skuData) {
        printPaintsBySKU(skuData[paint]);
    }

    if (results == 0) {
        let userChoice = prompt("No results. Search again? [Y]es or [*N]o: ").toLowerCase();
        if (userChoice == "y") {
            searchCatalogue(catalogue);
        }
    }
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

        result -= obstacleArea;

        paintSelect(result);

        return result;
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

// allows the user to pick the type of paint they want
// params:
// area - paint coverage area in m**2
// !SIDE EFFECT! alters colourMap global
function paintSelect(area) {
    catalogue = readCatalogue();
    let userChoice = prompt("Enter the SKU of paint to use, or type [S] to search paints: ").toLowerCase();
    let amount = areaToPaint(area);

    const skuData = groupBy(catalogue.paint, ({ SKU }) => SKU);

    if (userChoice == "s") {
        searchCatalogue(catalogue);
        paintSelect(area);
    } else {
        if (userChoice in skuData) {
            if (typeof colourMap.get(userChoice) == 'undefined') {
                colourMap.set(userChoice, amount);
            } else {
                colourMap.set(userChoice, colourMap.get(userChoice) + amount);
            }
        } else {
            console.log("SKU not in catalogue. Please try again.");
            paintSelect(area);
        }
    }
}





//printCatalogue(catalogue);
console.log(totalRooms());
//console.log(areaByRoom);

console.log(colourMap);