
<template>

</template>

<script>
import _ from 'lodash';
import uuid from 'uuid';

export default {
  name: 'FlightRecorder',
  data: function() {
    return {
      history,
      flight: {
        gps:[],
        attitude:[],
        battery:[],
        link:[]
      },
      flightUUID: uuid()
    }
  },
  sockets: {
    gps: function(data) {
      this.recordData('gps',data);
      this.$store.commit('addEvent',{
        time: data.time,
        property: 'gps',
        data
      });
    },
    attitude: function(data) {
      this.recordData('attitude',data);
    },
    link: function(data) {
      this.recordData('link',data);
    },
    battery: function(data) {
      this.recordData('battery',data);
    },
  },
  methods: {
    recordData(type,data){
      this.flight[type].push(data);
      localStorage.setItem(this.flightUUID,JSON.stringify(this.flight));
    },
    recordFlightSession(){
      const history = JSON.parse(localStorage.getItem('flightHistory')) || [];
      history.push(this.flightUUID);
      localStorage.setItem('flightHistory',JSON.stringify(history));
    }
  },
  mounted() {
    this.recordFlightSession();
  }
}
</script>

<style>
</style>