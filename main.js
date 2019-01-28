const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const crc8 = require('./utils.js');
// const { crc81wire } = require('crc');
let telemetryRxBuffer = [];
const TELEMETRY_RX_PACKET_SIZE = 128;

//CRSF_FRAME_SIZE_MAX = 64?

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
const RX_RSSI1_INDEX = 0;
const RX_RSSI2_INDEX = 1;
const RX_QUALITY_INDEX = 2;
const RX_SNR_INDEX = 3;
const RX_ANTENNA_INDEX = 4;
const RF_MODE_INDEX =  5;
const TX_POWER_INDEX = 6;
const TX_RSSI_INDEX =  7;
const TX_QUALITY_INDEX = 8;
const TX_SNR_INDEX = 9;
const BATT_VOLTAGE_INDEX = 10;
const BATT_CURRENT_INDEX = 11;
const BATT_CAPACITY_INDEX =  12;
const GPS_LATITUDE_INDEX = 13;
const GPS_LONGITUDE_INDEX =  14;
const GPS_GROUND_SPEED_INDEX = 15;
const GPS_HEADING_INDEX = 16;
const GPS_ALTITUDE_INDEX = 17;
const GPS_SATELLITES_INDEX = 18;
const ATTITUDE_PITCH_INDEX = 19;
const ATTITUDE_ROLL_INDEX = 20;
const ATTITUDE_YAW_INDEX = 21;
const FLIGHT_MODE_INDEX = 22;
const UNKNOWN_INDEX = 23;
const subtypeLabel = 
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
'UNKNOWN_INDEX']
/*
 * CRSF protocol
 *
 * CRSF protocol uses a single wire half duplex uart connection.
 * The master sends one frame every 4ms and the slave replies between two frames from the master.
 *
 * 420000 baud - being transmitted via UAT @ 115200
 * not inverted
 * 8 Bit
 * 1 Stop bit
 * Big endian
 * 420000 bit/s = 46667 byte/s (including stop bit) = 21.43us per byte
 * Max frame size is 64 bytes
 * A 64 byte frame plus 1 sync byte can be transmitted in 1393 microseconds.
 *
 * CRSF_TIME_NEEDED_PER_FRAME_US is set conservatively at 1500 microseconds
 *
 * Every frame has the structure:
 * <Device address><Frame length><Type><Payload><CRC>
 *
 * Device address: (uint8_t)
 * Frame length:   length in  bytes including Type (uint8_t)
 * Type:           (uint8_t)
 * CRC:            (uint8_t)
 *
 */

var port = new SerialPort("/dev/cu.wchusbserial1410", {
  baudRate: 115200
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

const parser = port.pipe(new ByteLength({length: 1}))
parser.on('data', data => {
  processTelemetry(data[0]);
})

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

function processBattery() {
  let value;
  if (value = getCrossfireTelemetryValue(2, 3)) {
    console.log('BATT_VOLTAGE_INDEX', value.value);
    // processCrossfireTelemetryValue(BATT_VOLTAGE_INDEX, value.value);
  }
  if (value = getCrossfireTelemetryValue(2, 5)) {
    console.log('BATT_CURRENT_INDEX', value.value);
    // processCrossfireTelemetryValue(BATT_CURRENT_INDEX, value.value);
  }
  if (value = getCrossfireTelemetryValue(3, 7)) {
    console.log('BATT_CAPACITY_INDEX', value.value);
    // processCrossfireTelemetryValue(BATT_CAPACITY_INDEX, value.value);
  }
}

function processAttitude(){

  if (value = getCrossfireTelemetryValue(2, 3)) {
    console.log('ATTITUDE_PITCH_INDEX', value.value/10);
    // processCrossfireTelemetryValue(ATTITUDE_PITCH_INDEX, value.value/10);
  }
  if (value = getCrossfireTelemetryValue(2, 5)) {
    console.log('ATTITUDE_ROLL_INDEX', value.value/10);
    // processCrossfireTelemetryValue(ATTITUDE_ROLL_INDEX, value.value/10);
  }
  if (value = getCrossfireTelemetryValue(2, 7)) {
    console.log('ATTITUDE_YAW_INDEX', value.value/10);
    // processCrossfireTelemetryValue(ATTITUDE_YAW_INDEX, value.value/10);
  }

}

function processGPS(){
  let value;
  console.log(telemetryRxBuffer.slice(3).join(','))
  if (value = getCrossfireTelemetryValue(4, 3)) {
    console.log('GPS_LATITUDE_INDEX', value.value/10);
    // processCrossfireTelemetryValue(GPS_LATITUDE_INDEX, value/10);
  }
  if (value = getCrossfireTelemetryValue(4, 7)) {
    console.log('GPS_LONGITUDE_INDEX', value.value/10);
    // processCrossfireTelemetryValue(GPS_LONGITUDE_INDEX, value/10);
  }
  if (value = getCrossfireTelemetryValue(2, 11)) {
    console.log('GPS_GROUND_SPEED_INDEX', value.value);
    // processCrossfireTelemetryValue(GPS_GROUND_SPEED_INDEX, value);
  }
  if (value = getCrossfireTelemetryValue(2, 13)) {
    console.log('GPS_HEADING_INDEX', value.value);
    // processCrossfireTelemetryValue(GPS_HEADING_INDEX, value);
  }
  if (value = getCrossfireTelemetryValue(2, 15)) {
    console.log('GPS_ALTITUDE_INDEX', value.value - 1000);
    // processCrossfireTelemetryValue(GPS_ALTITUDE_INDEX,  value - 1000);
  }
  if (value = getCrossfireTelemetryValue(1, 17)) {
    console.log('GPS_SATELLITES_INDEX', value.value);
    // processCrossfireTelemetryValue(GPS_SATELLITES_INDEX, value);
  }
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
    // console.log("[XF] address 0x" + data.toString(16) + " error");
    return;
  }
  
  if (telemetryRxBuffer.length == 1 && (data < 2 || data > TELEMETRY_RX_PACKET_SIZE-2)) {
    // console.log("[XF] length 0x" + data.toString(16) + " error");
    telemetryRxBuffer = [];
    return;
  }

  if (telemetryRxBuffer.length < TELEMETRY_RX_PACKET_SIZE) {
    telemetryRxBuffer.push(data);
  } else {
    // console.log("[XF] array size " + telemetryRxBuffer.length + " error");
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
    // console.log("[XF] CRC error");
    return;
  }
  console.log(getFrameType(telemetryRxBuffer[2]));
  // telemetryRxBuffer[2] = telemetryRxBuffer[2]+'('++')';
  // console.log(telemetryRxBuffer.slice(2,telemetryRxBuffer.length-1).join(','));

}

function checkCrossfireTelemetryFrameCRC() {
  const crc = crc8(telemetryRxBuffer.slice(2,telemetryRxBuffer.length-1));
  return (crc == telemetryRxBuffer[telemetryRxBuffer.length-1]);
}