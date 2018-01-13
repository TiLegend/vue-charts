<script>
/* eslint-disable */
import { Line } from 'vue-chartjs'


  export default ({
    extends:Line,
    props: {
      chartData: {
        type: Array | Object,
        required: false
      },
      chartLabels: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
                callback: (value, index, values) => {
                  return this.formatNumber(value)
                }
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false,
          onClick: function(c,i){
          let activePoints = this.getElementsAtEventForMode(c, 'point', this.options);
          let firstPoint = activePoints[0];
          if(!firstPoint) return
          let label = this.data.labels[firstPoint._index];
          let activeLineIndex = firstPoint._datasetIndex;
          let countPointData = {word            : this.data.datasets[firstPoint._datasetIndex].wordName,
                                imported        : this.data.datasets[firstPoint._datasetIndex].imported,
                                sourceShortName : this.data.datasets[firstPoint._datasetIndex].sourceShortName,
                                startDate       : this.data.datasets[firstPoint._datasetIndex].startDate,
                                endDate         : this.data.datasets[firstPoint._datasetIndex].endDate,
                                pointCountDate  : label};
          this.options.getP(countPointData);
          
         },
         getP: (countPointData)=>{
          this.getPosts(countPointData)
         }
        },
      }
    },
    mounted () {
      this.renderChart({
        labels: this.chartLabels,
        datasets: this.chartData
      }, this.options)
    },
    methods: {
      getPosts(countPointData){
        this.$emit('get_point_click', countPointData);        
      },
      formatNumber (num) {
        let numString = Math.round(num).toString()
        let numberFormatMapping = [[6, 'm'], [3, 'k']]
        for (let [numberOfDigits, replacement] of numberFormatMapping) {
          if (numString.length > numberOfDigits) {
            let decimal = ''
            if (numString[numString.length - numberOfDigits] !== '0') {
              decimal = '.' + numString[numString.length - numberOfDigits]
            }
            numString = numString.substr(0, numString.length - numberOfDigits) + decimal + replacement
            break
          }
        }
        return numString
      }
    }
  })
</script>