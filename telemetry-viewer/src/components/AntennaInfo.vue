
<template>
  <div id="antenna">
    <h1>Antenna</h1>
    <el-row :gutter="20">
      <el-col :span="12"><div class="grid-content bg-purple section">Distance: {{distance}}(m)<br/>Alt: {{alt}}(m)</div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple section">Heading Angle: {{headingAngle}}<br/>Tilt Angle: {{tiltAngle}}</div></el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'AntennaInfo',
  computed: {
    alt () {
      return this.$store.state.alt;
    },
    distance () {
      return _.round(this.$store.state.distance,2);
    },
    headingAngle () {
      return _.round(this.$store.state.headingAngle,2);
    },
    tiltAngle () {
      return _.round(Math.atan(this.alt/this.distance) / (Math.PI / 180),2)
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style>
  #container {
    width:100%;
    height:100%;
  }
  .section {
    padding:20px;
  }
  h1{
    margin-left:20px;
  }
</style>