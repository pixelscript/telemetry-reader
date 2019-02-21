import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    distance: 0,
    alt:0,
    homeLat:0,
    homeLong:0,
    headingAngle:0,
    tansmitterConnected:false,
    antennaConnected:false
  },
  mutations: {
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
    }
  }
})