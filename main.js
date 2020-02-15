const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const crc8 = require('./utils.js');
const _ = require('lodash');
let telemetryRxBuffer = [];
const TELEMETRY_RX_PACKET_SIZE = 128;

const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const http = require('http').Server(app);
const io = require('socket.io')(http);

let port;
let parser;

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname+'/web/index.html');
});

app.get('/ports', function(req, res){
  SerialPort.list((err, results) => {
    if (err) {
      res.send('whoops');
    } else {
      res.setHeader('Content-Type', 'text/json');
      res.send(JSON.stringify(results));
    };
  })
});

app.post('/connect', function(req, res){
  port = new SerialPort(req.body.comName, {
    baudRate: Number(req.body.baud)
  }, function (err) {
    if (err) {
      res.send(500, err.message)
    } else {
      res.send('{"successful": true}');
      setFastMode();
    }
    res.end();
  });
});

function setFastMode(){
  port.write('$$$');
  setTimeout(()=>port.write("F,1\n"),2000);
  setTimeout(setupRead,4000);
}

function setupRead() {
  parser = port.pipe(new ByteLength({length: 1}));
  parser.on('data', data => {
    processTelemetry(data[0]);
  });
}
io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

const RADIO_ADDRESS       = 0xEA;
// Frame id
const GPS_ID              = 0x02;
const BATTERY_ID          = 0x08;
const LINK_ID             = 0x14;
const CHANNELS_ID         = 0x16;
const ATTITUDE_ID         = 0x1E;
const FLIGHT_MODE_ID      = 0x21;
const PING_DEVICES_ID     = 0x28;
const DEVICE_INFO_ID      = 0x29;
const REQUEST_SETTINGS_ID = 0x2A;
// subtype index
const TX_POWER_INDEX = 6;
const TX_SNR_INDEX = 9;
const subtypeId = 
['RX_RSSI1_INDEX',
'RX_RSSI2_INDEX',
'RX_QUALITY_INDEX',
'RX_SNR_INDEX',
'RX_ANTENNA_INDEX',
'RF_MODE_INDEX',
'TX_POWER_INDEX',
'TX_RSSI_INDEX',
'TX_QUALITY_INDEX',
'TX_SNR_INDEX',
'BATT_VOLTAGE_INDEX',
'BATT_CURRENT_INDEX',
'BATT_CAPACITY_INDEX',
'GPS_LATITUDE_INDEX',
'GPS_LONGITUDE_INDEX',
'GPS_GROUND_SPEED_INDEX',
'GPS_HEADING_INDEX',
'GPS_ALTITUDE_INDEX',
'GPS_SATELLITES_INDEX',
'ATTITUDE_PITCH_INDEX',
'ATTITUDE_ROLL_INDEX',
'ATTITUDE_YAW_INDEX',
'FLIGHT_MODE_INDEX',
'UNKNOWN_INDEX'];

function getFrameType(type) {
  switch (type) {
    case GPS_ID:
      processGPS();
      return 'gps'
      break;
    case BATTERY_ID:
      processBattery();
      return'battery';
      break;
    case LINK_ID:
      processLink();
      return 'link info';
      break;
    case CHANNELS_ID:
      return 'channel info';
      break;
    case ATTITUDE_ID:
      processAttitude();
      return 'attitude info';
      break;
    case FLIGHT_MODE_ID:
      processFlightMode();
      return 'flight mode info';
      break;
    case PING_DEVICES_ID:
      return 'ping info';
      break;
    case DEVICE_INFO_ID:
      return 'device info';
      break;
    case REQUEST_SETTINGS_ID:
      return 'request settings info';
      break;
  }
}

function processFlightMode() {
  let fm = '';
  // length is limited in opentx not sure if we need to limit here
  for (let i=3; i<= Math.min(16, telemetryRxBuffer[1]-1); i++) {
    fm += String.fromCharCode(telemetryRxBuffer[i]);
  }
  throttledFlightMode('link', {flightmode:fm});
}

function processLink() {
  let value;
  let linkInfo = {};
  for (let i = 0; i<= TX_SNR_INDEX; i++) {
    if (value = getCrossfireTelemetryValue(1, 3+i)) {
      if (i == TX_POWER_INDEX) {
        const power_values = [ 0, 10, 25, 100, 500, 1000, 2000 ];
        value.value = (value.value < power_values.length && value.value >= 0) ? power_values[value.value] : 0;
      }
      linkInfo[subtypeId[i]] = value.value;
    }
  }
  throttledLink('link', linkInfo);
}

function processBattery() {
  let value;
  let battryInfo = {}
  if (value = getCrossfireTelemetryValue(2, 3)) {
    battryInfo.voltage = value.value/10;
  }
  if (value = getCrossfireTelemetryValue(2, 5)) {
    battryInfo.current = value.value/10;
  }
  if (value = getCrossfireTelemetryValue(3, 7)) {
    battryInfo.capacity = value.value;
  }
  throttledBattery('battery', battryInfo);
}

function processAttitude(){
  let value;
  let attitudeInfo = {};
  if (value = getCrossfireTelemetryValue(2, 3)) {
    attitudeInfo.pitch = value.value/10000;
  }
  if (value = getCrossfireTelemetryValue(2, 5)) {
    attitudeInfo.roll = value.value/10000;
  }
  if (value = getCrossfireTelemetryValue(2, 7)) {
    attitudeInfo.yaw = value.value/10000;
  }
  throttledAttitude('attitude', attitudeInfo);
}

function processGPS(){
  let value;
  let gpsInfo = {}
  if (value = getCrossfireTelemetryValue(4, 3)) {
    gpsInfo.lat = value.value/10000000;
  }
  if (value = getCrossfireTelemetryValue(4, 7)) {
    gpsInfo.long = value.value/10000000;
  }
  if (value = getCrossfireTelemetryValue(2, 11)) {
    gpsInfo.speed = value.value;
  }
  if (value = getCrossfireTelemetryValue(2, 13)) {
    gpsInfo.heading = value.value;
  }
  if (value = getCrossfireTelemetryValue(2, 15)) {
    gpsInfo.alt = value.value - 1000;
  }
  if (value = getCrossfireTelemetryValue(1, 17)) {
    gpsInfo.numSats = value.value;
  }
  if(gpsInfo.numSats > 0){
    throttledGps('gps', gpsInfo);
  }
}

const throttledGps = _.throttle(broadcastInfo, 1000);
const throttledAttitude = _.throttle(broadcastInfo, 1000);
const throttledLink = _.throttle(broadcastInfo, 1000);
const throttledBattery = _.throttle(broadcastInfo, 1000);
const throttledFlightMode = _.throttle(broadcastInfo, 1000);

function broadcastInfo(type, info) {
  info.time = Date.now();
  io.emit(type, info);
}

function getCrossfireTelemetryValue(N, index){
  let result = false;
  // set value of first sector
  let byte = telemetryRxBuffer[index];
  // if it's less than 128 set it to -1 otherwise it's zero buddy (uses bitwise AND operation)
  value = (byte & 0x80) ? -1 : 0;
  for (let i=0; i<N; i++) {
    // shift this bit by 8 bits to the left, why fuck knows?
    value = value << 8;
    // if it's not a 255 we're golden I guess?
    if (byte != 0xff) {
      result = true;
    }
    value += byte;
    byte = telemetryRxBuffer[i+1+index];
  }
  if(result) {
    return {
      value
    }
  } else {
    return false;
  }
}

function processTelemetry(data) {
  if (telemetryRxBuffer.length === 0 && data != RADIO_ADDRESS) {
    return;
  }
  
  if (telemetryRxBuffer.length == 1 && (data < 2 || data > TELEMETRY_RX_PACKET_SIZE-2)) {
    telemetryRxBuffer = [];
    return;
  }

  if (telemetryRxBuffer.length < TELEMETRY_RX_PACKET_SIZE) {
    telemetryRxBuffer.push(data);
  } else {
    telemetryRxBuffer = [];
  }

  if (telemetryRxBuffer.length > 4) {
    const length = telemetryRxBuffer[1];
    if (length + 2 == telemetryRxBuffer.length) {
      processCrossfireTelemetryFrame();
      telemetryRxBuffer = [];
    }
  }
}

function processCrossfireTelemetryFrame() {
  if (!checkCrossfireTelemetryFrameCRC()) {
    return;
  }
  getFrameType(telemetryRxBuffer[2]);
}

function checkCrossfireTelemetryFrameCRC() {
  const crc = crc8(telemetryRxBuffer.slice(2,telemetryRxBuffer.length-1));
  return (crc == telemetryRxBuffer[telemetryRxBuffer.length-1]);
}