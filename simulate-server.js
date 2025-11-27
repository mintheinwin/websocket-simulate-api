const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log("Mock WebSocket server running on ws://localhost:8080");

let elapsedSeconds = 0;

wss.on('connection', (ws) => {
  console.log("Client connected");

  const statusOptions = ["MEASURING", "NORMAL", "ALARM"]; // excluding INITIALIZING here

  const interval = setInterval(() => {
    elapsedSeconds++;

    const dynamicImsSumAbs = (Math.random() * (120 - 70) + 70).toFixed(6);
   // const displayName = dynamicImsSumAbs > 110 ? "Nerve" : "Air";
    const displayName = dynamicImsSumAbs > 110 ? "Nerve" : "Chem.Detected";

    // === Determine status ===
    let mainState = "INITIALIZING";
    let mode = "INITIALIZING";

    if (elapsedSeconds > 60) {
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      mainState = randomStatus;
      mode = randomStatus;
    }

    const statusMessage = JSON.stringify({
      type: "status",
      content: {
        mainState: mainState,
        alarmFlags: [],
        statusCode: 102106626,
        statusFlags: [2, 10, 11, 18, 19, 21, 26, 27],
        substateFlags: [],
        hiddenSubstateFlags: [],
        mode: mode,
        unacknowledgedAlarms: false,
        faultCode: 0,
        significantFault: null,
        faultFlags: []
      }
    });

    const measMessage = JSON.stringify({
      type: "meas",
      content: {
        level: 2,
        libraryPartId: 1,
        compound: {
          id: 1,
          displayName: displayName,
          iconId: 1,
          noAdvert: false,
          parent: 0
        },
        libraryId: 2
      }
    });

    const sensorsMessage = JSON.stringify({
      type: "sensors",
      content: {
        Trend: 0.704756,
        IMSpos: [0, 0, 0, 40.359589, 17.654816, 7.594977, 3.526955, 0],
        IMSneg: [0, 0, 0, -31.882872, -8.817388, -0.84166, 0.741462, 0],
        rel_IMSpos: [0, 0, 0, 0.380753, 0.280554, 0.100197, 0.040079, 0],
        rel_IMSneg: [0, 0, 0, -0.100197, -0.060119, -0.020039, 0.02004, 0],
        ImsSumAbs: parseFloat(dynamicImsSumAbs),
        ImsSumRel: 1.001977,
        PumpPwm: 138,
        Flow: 1.293856,
        ImsFlow: 1.301918,
        CellTemp: 38.359436,
        Humidity: 28.279863,
        AbsoluteHumidity: 13.282198,
        AirPressure: 989,
        ScCell1R: 227286,
        ScCell2R: 16581,
        ScCell3R: 5375,
        MOS2_SensorResistance: 113855,
        ScCell1RAbsPerBl: 0.997836,
        ScCell2RAbsPerBl: 0.998014,
        ScCell3RAbsPerBl: 0.998143,
        MOS2_SensorResistanceAbsPerBl: 1.000413,
        EC_Value: 0,
        flow_lpm_std: 1.220406
      }
    });

    ws.send(measMessage);
    ws.send(sensorsMessage);
    ws.send(statusMessage);

  }, 1000);

  ws.on('close', () => {
    console.log("Client disconnected");
    clearInterval(interval);
    elapsedSeconds = 0;
  });
});
