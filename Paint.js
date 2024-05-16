// TSI Javascript Paint project
// By Oliver Barnes, 16/05/2024

// imports
// requires prompt-sync
const prompt = require("prompt-sync")();

// initial mathematical functions
// determine coverage area, and paint required per m**2

// calculates area of rectangular wall given user input
// params:
//  v - boolean, if user has selected visual mode, prints diagram for user
// returns area of wall in m**2
function wallRectangle(v) {
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

// calculates area of triangular wall given user input
// params:
//  v - boolean, if user has selected visual mode, prints diagram for user
// returns area of wall in m**2
function wallTriangle(v) {
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

// calculates area of circular wall given user input
// params:
//  v - boolean, if user has selected visual mode, prints diagram for user
// returns area of wall in m**2, to 2 decimal places
function wallCircle(v) {
    if (v) {
        console.log("\n         , - ~ ~ ~ - ,\n     , '               ' ,\n   ,                       ,\n  ,                         ,\n ,                           ,\n ,<------------------------->,\n ,                           ,\n  ,                         ,\n   ,                       ,\n     ,                  , '\n       ' - , _ _ _ ,  '");
    }
    const d = prompt("Please enter the diameter of the shape: ");
    let r = d/2

    return (((r**2) * Math.PI).toFixed(2));
}

console.log(wallCircle(true));