<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'HeightMapping',
  extends: Line,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels:['','','','','','','','','',''],
      datasets: [
        {
          label: 'Height',
          backgroundColor: '#f87979',
          data: [0,10,30,50,60,60,100,200]
        }
      ]
    },{responsive: true, maintainAspectRatio: false})
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