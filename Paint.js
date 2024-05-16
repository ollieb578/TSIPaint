// TSI Javascript Paint project
// By Oliver Barnes, 16/05/2024

// imports
// requires prompt-sync
const prompt = require("prompt-sync")({ sigint: true });

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
    const l = prompt("Please enter the length of the wall:");

    if (v) {
        console.log("\n    _______________\n    |             |\n    |             |\n    |             |\n    |             |\n    |_____________|\n    <------------->");
    }
    const h = prompt("Please enter the height of the wall:");

    return h * l;
}

console.log(wallRectangle(false));