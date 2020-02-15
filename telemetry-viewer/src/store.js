import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    time:0,
    timeStart:-1,
    timeEnd:0,
    liveData:true,
    gps:{},
    distance: 0,
    alt:0,
    homeLat:0,
    homeLong:0,
    headingAngle:0,
    tansmitterConnected:false,
    antennaConnected:false,
    eventLog: {}
  },
  mutations: {
    setLiveData(state, val) {
      state.liveData = val;
    },
    setTime(state, val) {
      state.time = val;
    },
    setGps(state, val) {
      state.gps = val;
    },
    setTimeStart(state, val) {
      state.timeStart = val;
    },
    setTimeEnd(state, val) {
      state.timeEnd = val;
    },
    setAlt(state, val) {
      state.alt = val;
    },
    setHome(state, val) {
      state.home = val;
    },
    setDistance(state, val) {
      state.distance = val;
    },
    setHomeLat(state, val) {
      state.homeLat = val;
    },
    setHomeLong(state, val) {
      state.homeLong = val;
    },
    setHeadingAngle(state, val) {
      state.headingAngle = val;
    },
    setTransmitterConnection(state, val) {
      state.tansmitterConnected = val;
    },
    setAntennaConnection(state, val) {
      state.antennaConnected = val;
    },
    addEvent(state, val){
      if(!state.eventLog[val.time]){
        state.eventLog[val.time] = {};
      }
      state.eventLog[val.time][val.property] = val.data;
      if(Math.min(state.timeStart,val.time) !== state.timeStart || state.timeStart === -1){
        state.timeStart = val.time;
      }
      if(Math.max(state.timeEnd,val.time) !== state.timeEnd){
        state.timeEnd = val.time;
      }
    }
  }
})