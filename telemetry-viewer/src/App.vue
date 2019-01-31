<template>
  <el-container id="app">
    <el-header>
      <SerialConnection></SerialConnection>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="16" class="live">
          <el-row class="map">
          <GmapMap
            :center="{lat:54.5915776, lng:-1.30729}"
            :zoom="12"
            map-type-id="terrain"
            style="width: 100%; height: 100%"
          >
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              :draggable="true"
              @click="center=m.position"
            />
          </GmapMap>
          </el-row>
          <el-row class="height">
            <HeightMapping :width="500" :height="250"></HeightMapping>
          </el-row>
        </el-col>
        
        <el-col :span="8" class="side">
          fuck
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  
</template>

<script>
import SerialConnection from './components/SerialConnection'
import HeightMapping from './components/HeightMapping'
export default {
  name: 'App',
  data: function(){
      return {
        markers: [{position: {lat:54.5915776,lng:-1.30729}}]
      }
    },
  components:{
    SerialConnection,
    HeightMapping
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
  background:red;
}

.live {
  height:100%;
}

.map {
  height:70%;
}

.height {
  height:30%;
}
</style>
