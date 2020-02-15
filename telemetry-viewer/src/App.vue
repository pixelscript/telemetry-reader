<template>
  <el-container id="app">
    <el-header>
      <serial-connection></serial-connection>
    </el-header>
    <el-main>
      <el-row class="main-row">
        <el-col :span="10" class="live">
          <el-tabs type="card" v-model="activeName">
            <el-tab-pane label="2D" name="2D">
                <el-row class="seventy">
                  <GpsMap></GpsMap>
                </el-row>
                <el-row class="thirty">
                  <height-mapping :width="500" :height="250"></height-mapping>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="3D" name="second">Config</el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="4" class="side">
          <el-row>
            <el-col class="thirty">
              <AntennaInfo></AntennaInfo>
            </el-col>
            <el-col class="seventy">
              <attitude-viewer rotx="2" roty="0.6" rotz="0.1"></attitude-viewer>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" class="side">
          <VideoPlayer></VideoPlayer>
        </el-col>
      </el-row>
      <el-row class="timer-row">
        <TimeSlider></TimeSlider>
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
import VideoPlayer from './components/VideoPlayer'
import TimeSlider from './components/TimeSlider'

export default {
  name: 'App',
  data: function(){
      return {
        markers: [{position: {lat:54.5915776,lng:-1.30729}}],
        activeName: "2D"
      }
    },
  components:{
    FlightRecorder,
    SerialConnection,
    HeightMapping,
    AttitudeViewer,
    GpsMap,
    AntennaInfo,
    VideoPlayer,
    TimeSlider
  }
}
</script>

<style>
html {
  height:100%;
}
body {
  height:100%;
  width:100%;
  margin:0;
  padding:0;
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.el-container,.el-main, .el-row{
  height:100%;
  overflow:hidden;
}

.el-main {
  padding:5px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-tabs, .el-tabs__content, .el-tab-pane, .side, .live{
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

.main-row {
  height:calc(100% - 30px);
}

.timer-row {
  height: 30px;
  padding: 0px 10px;
}
</style>
