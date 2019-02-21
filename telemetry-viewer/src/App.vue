<template>
  <el-container id="app">
    <el-header>
      <serial-connection></serial-connection>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="16" class="live">
          <el-row class="seventy">
            <GpsMap></GpsMap>
          </el-row>
          <el-row class="thirty">
            <height-mapping :width="500" :height="250"></height-mapping>
          </el-row>
        </el-col>
        
        <el-col :span="8" class="side">
          <el-row>
            <el-col class="thirty">
              <AntennaInfo></AntennaInfo>
            </el-col>
            <el-col class="seventy">
              <attitude-viewer rotx="2" roty="0.6" rotz="0.1"></attitude-viewer>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <FlightRecorder></FlightRecorder>
  </el-container>
  
</template>

<script>
import SerialConnection from './components/SerialConnection'
import HeightMapping from './components/HeightMapping'
import AttitudeViewer from './components/AttitudeViewer'
import GpsMap from './components/GpsMap'
import AntennaInfo from './components/AntennaInfo'
import FlightRecorder from './components/FlightRecorder'
export default {
  name: 'App',
  data: function(){
      return {
        markers: [{position: {lat:54.5915776,lng:-1.30729}}]
      }
    },
  components:{
    FlightRecorder,
    SerialConnection,
    HeightMapping,
    AttitudeViewer,
    GpsMap,
    AntennaInfo
  }
}
</script>

<style>
body,html,.el-container,.el-main, .el-row{
  height:100%;
  width:100%;
  margin:0;
  padding:0;
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.side {
  height:100%;
}

.live {
  height:100%;
}

.seventy {
  height:70%;
}

.thirty {
  height:30%;
}

.el-header{
  padding:10px;
  background:#2c3e50;
}
</style>
