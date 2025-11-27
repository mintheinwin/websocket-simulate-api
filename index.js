///////////////////////////
// Run the script by using the command "node index.js"
///////////////////////////

const WebSocket = require("ws");
const fs = require("fs");

//const wsURL = 'ws://192.168.246.94/xip/api/device/stream'; // Client mode CPX device URL
//const wsURL = 'ws://10.42.0.01/xip/api/device/stream'; // Access point mode: default CPX device URL
//const wsURL = 'ws://10.42.0.1/xip/api/rad/stream';
//const wsURL = 'ws://10.42.0.1/xip/api/settings/stream';
//const wsURL = 'ws://10.42.0.1/xip/api/device/stream'; // CPX device URL
const wsURL = 'ws://localhost:8080';   // Test URL with mock server

const outputDataFile = "data.json";

let buffer = [];
let writeInterval = 2000;  // Write to file every 2 seconds

// Connect to WS server
console.log(`Connecting to server... ${wsURL}`);
const ws = new WebSocket(wsURL);

// Successful connection
ws.on("open", () => {
  console.log("Successfully connected to server...\n");
});

// Upon receiving new message
ws.on("message", (event) => {
   try {
      // Add to buffer
      var msg = JSON.parse(event);
      msg.receivedTimestamp = new Date().toLocaleString("en-SG");    // Log the datetime when data is received from socket
      buffer.push(JSON.stringify(msg));
   } catch (e) {
      console.error("Unable to parse data");
   }
});

// Socket to server is closed
ws.on("close", () => {
   console.log("Disconnected from server");
});

ws.on("error", (error) => {
   console.error("Websocket error: ", error);
});


// Periodically write all buffered data
setInterval(() => {
   if (buffer.length > 0) {
      // Append buffer data to file
      const dataToWrite = buffer.join("\n") + "\n";
      fs.appendFile(outputDataFile, dataToWrite, (err) => {
         if (err)
            console.error("Append failed:", err);
      });

      // Clear buffer
      buffer = [];
   }
}, writeInterval);
