<template>
  <div id="serial-connection">
    <el-button type="primary" icon="el-icon-refresh" circle @click="fetchPorts"></el-button>
    <div class="icon">
      <img src="../assets/transmitter.svg" class="t-icon"/>
    </div>
    <el-select v-model="transmitterChosenConnection" placeholder="Transmitter Serial" size="large">
      <el-option
        :key="index"
        v-for="(c, index) in connections"
        :value = "c.comName">
        {{c.comName}}
      </el-option>
    </el-select>
    <el-select v-model="transmitterChosenBaud" placeholder="Baud rate" size="large">
      <el-option
        :key="index"
        v-for="(b, index) in transmitterBaudRates"
        :value="b.value">
          {{b.label}}
      </el-option>
    </el-select>
    <el-button type="primary" @click="connectToTransmitterPort">Connect to Transmitter</el-button>
    <div class="seperator">|</div>
    <div class="icon green">
      <img src="../assets/antenna.svg" class="a-icon"/>
    </div>
    <el-select v-model="antennaChosenConnection" placeholder="Antenna Serial" size="large">
      <el-option
        :key="index"
        v-for="(c, index) in connections"
        :value = "c.comName">
        {{c.comName}}
      </el-option>
    </el-select>
    <el-select v-model="antennaChosenBaud" placeholder="Baud rate" size="large">
      <el-option
        :key="index"
        v-for="(b, index) in antennaBaudRates"
        :value="b.value">
          {{b.label}}
      </el-option>
    </el-select>
    <el-button type="primary" @click="connectToAntennaPort">Connect to Antenna</el-button>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
  name: 'SerialConnection',
  data: function(){
    return {
      transmitterConnected: false,
      transmitterBaudRates: [
        {label: 'CRSF - 115200', value: 115200}
      ],
      transmitterChosenBaud:'',
      transmitterChosenConnection:'',
      antennaConnected: false,
      antennaBaudRates: [
        {label: '9600', value: 9600}
      ],
      antennaChosenBaud:'',
      antennaChosenConnection:'',
      connections: [
      ]
    }
  },
  created() {
    this.fetchPorts();
  },
  methods: {
    fetchPorts() {
      axios.get(`//localhost:3000/ports`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.connections = response.data
        })
        .catch(e => {
          console.log(e);
        })
    },
    connectToPort() {
      const comName = this.chosenConnection;
      const baud = this.chosenBaud;
      axios.post(`//localhost:3000/connect`, {
        comName,
        baud})
        .then(response => {
          // JSON responses are automatically parsed.
          this.connections = response.data
        })
        .catch(e => {
          console.log(e);
        })
    }
  }
}
</script>

<style>
#serial-connection {
  text-align:left;
}
.icon {
  border-radius: 50%;
  vertical-align:bottom;
  display:inline-block;
  margin-right:5px;
  padding:7px;
}

.t-icon {
  width:25px;
  display:inline-block;
  vertical-align:bottom;
}
.a-icon {
  width:35px;
  stroke:white;
  display:inline-block;
  vertical-align:bottom;
}
.green {
  padding:2px;
}
.seperator {
  display:inline-block;
  margin-left:10px;
  margin-right:10px;
  color:#aaa;
}
</style>
