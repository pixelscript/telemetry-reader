<template>
  <div id="serial-connection">
    <el-select v-model="chosenConnection" placeholder="Connection" size="large">
      <el-option
        :key="index"
        v-for="(c, index) in connections"
        :value = "c.comName">
        {{c.comName}}
      </el-option>
    </el-select>
    <el-select v-model="chosenBaud" placeholder="Baud rate" size="large">
      <el-option
        :key="index"
        v-for="(b, index) in baudRates"
        :value="b.value">
          {{b.label}}
      </el-option>
    </el-select>
    <el-button type="primary" @click="connectToPort">Connect</el-button>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
  name: 'SerialConnection',
  data: function(){
    return {
      connected: false,
      baudRates: [
        {label: 'CRSF - 155200', value: 155200}
      ],
      chosenBaud:'',
      chosenConnection:'',
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
  color:white;
  text-align:left;
  background:black;
}
</style>
