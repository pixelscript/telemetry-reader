<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  name: 'HeightMapping',
  mixins: [mixins.reactiveData],
  extends: Line,
  data: function(){
    return {
      chartData: {
        datasets: [
          {
            label: 'Height',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend:{
          display:false
        },
        scales: {
          xAxes: [{
              display:false,
              gridLines: {
                  display:false
              },
              type: 'linear',
              scaleLabel: {
                display: false
              }
          }]
        }
      }
      
    }
  },
  // watch: {
  //   'chartData': {
  //     handler: dataHandler,
  //     deep: true
  //   }
  // },
  sockets: {
    gps: function(gps){
      // this.chartData.labels.push('');
      this.chartData.datasets[0].data.push({x:this.chartData.datasets[0].data.length, y:gps.alt});
      this.chartData = {
        datasets: [
          {
            label: 'Height',
            backgroundColor: 'rgba(255,255,255,0)',
            borderColor:'black',
            pointRadius: 0,
            borderWidth: 0.5,
            data: this.chartData.datasets[0].data
          }
        ]
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style>
#serial-connection {
  color:white;
  text-align:left;
}
</style>