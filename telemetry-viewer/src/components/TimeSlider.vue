<template>
<div>
  <el-row>
    <el-col :span="4">
      <button @click="play">play</button>
      <button>pause</button>
      <button @click="stop">stop</button>
      <button>current</button>
      {{(time - minTime)/1000}}
    </el-col>
    <el-col :span="20">
      <el-slider v-model="time" :min="minTime" :max="maxTime" :format-tooltip="format"></el-slider>
    </el-col>
  </el-row>
  </div>
</template>

<script>

export default {
  name: 'TimeSlider',
  data: function() {
    return {
      interval:undefined
    }
  },
  mounted: function(){},
  sockets: {
  },
  computed: {
    time: {
      get: function(){
        return this.$store.state.time;
      },
      set: function(val) {
        this.$store.commit('setTime', Number(val));
      }
    },
    minTime: function(){
      return this.$store.state.timeStart;
    },
    maxTime: function(){
      return this.$store.state.timeEnd;
    }
  },
  methods: {
    stop: function() {
      clearInterval(this.interval);
      this.$store.commit('setTime', 0);
    },
    play:function() {
      let d = this;
      this.interval = setInterval(()=>{
        this.$store.commit('setTime', this.$store.state.time+1);
      }, 1);
    },
    format: function(val) {
      return String(Math.round(((val - this.minTime)/1000))) + "s";
    }
  }
}
</script>
<style>
</style>