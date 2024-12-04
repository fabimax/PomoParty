// Imports
var Commands = require('./modules/CommandList');
var GameServer = require('./GameServer');

// Init variables
var showConsole = true;

/*
setInterval(() => {
let now = new Date();
console.log(now);

  if ((now.getMinutes()>=25 && now.getMinutes()<=29) || ((now.getMinutes()>=55 && now.getMinutes()<=59))){
    gameServer.run=true;
  }else{
    gameServer.run=false;
  }
  
  
}
, 1000)
*/

//Claude Code (server shutdown at right intervals)

/*
const scheduleServer = (gameServer, timeRanges) => {
  // timeRanges format: [[startMinute, startSecond, endMinute, endSecond], ...]
  if (!Array.isArray(timeRanges) || !timeRanges.every(range => 
      Array.isArray(range) && 
      range.length === 4 && 
      range.every(n => Number.isInteger(n)) &&
      range[0] >= 0 && range[0] < 60 && // start minute
      range[1] >= 0 && range[1] < 60 && // start second
      range[2] >= 0 && range[2] < 60 && // end minute
      range[3] >= 0 && range[3] < 60)) { // end second
    throw new Error('Invalid range format. Expected [[startMin, startSec, endMin, endSec], ...]');
  }

  return setInterval(() => {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    
    const isInRange = timeRanges.some(([startMin, startSec, endMin, endSec]) => {
      const timeValue = currentMinute * 60 + currentSecond;
      const startValue = startMin * 60 + startSec;
      const endValue = endMin * 60 + endSec;
      
      return timeValue >= startValue && timeValue <= endValue;
    });
    
    if (gameServer.run !== isInRange) {
      gameServer.run = isInRange;
      console.log(
        `Server ${isInRange ? 'started' : 'stopped'} at ${currentMinute}:${currentSecond}`
      );
    }
  }, 1000); // Check every second
};

// Example usage:
// Run from XX:25:30 to XX:29:30 every hour
//const ranges = [[25, 30, 29, 30]];
//scheduleServer(gameServer, ranges);

// Multiple ranges example:
// const ranges = [
//   [25, 30, 29, 30], // XX:25:30 to XX:29:30
//   [45, 0, 45, 30]   // XX:45:00 to XX:45:30
// ];

//Use like this
/*
scheduleServer(gameServer, [
  [25, 30, 29, 30],  // XX:25:30 to XX:29:30
  [55, 0, 55, 30]    // XX:55:00 to XX:55:30
]);*/

/* //claude continued
scheduleServer(gameServer, [
  [35, 0, 36, 0],  // XX:25:30 to XX:30:00
  [55, 0, 0, 0]    // XX:55:00 to XX:00:00
]);
*/

// Start msg
console.log("[Game] Ogar3 - An open source Agar.io server implementation based on ogar!");

// Handle arguments
process.argv.forEach(function(val) {
    if (val == "--noconsole") {
        showConsole = false;
    } else if (val == "--help") {
        console.log("Proper Usage: node index.js");
        console.log("    --noconsole         Disables the console");
        console.log("    --help              Help menu.");
        console.log("");
    }
});

// Run Ogar
var gameServer = new GameServer();
exports.gameServer = gameServer;
gameServer.start();
// Add command handler
gameServer.commands = Commands.list;
// Initialize the server console
if (showConsole) {
    var readline = require('readline');
    var in_ = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    setTimeout(prompt, 100);
}

// Console functions

function prompt() {
    in_.question(">", function(str) {
        parseCommands(str);
        return prompt(); // Too lazy to learn async
    });
}

function parseCommands(str) {
    // Log the string
    gameServer.log.onCommand(str);

    // Don't process ENTER
    if (str === '')
        return;

    // Splits the string
    var split = str.split(" ");

    // Process the first string value
    var first = split[0].toLowerCase();

    // Get command function
    var execute = gameServer.commands[first];
    if (typeof execute != 'undefined') {
        execute(gameServer, split);
    } else {
        console.log("[Console] Invalid Command!");
    }
}
