<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!--为echarts准备一个具备大小的容器dom-->
    <div id="main" style="width: 600px;height: 400px;"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
  export default {
    name: '',
    data() {
      return {
        msg: 'show your io data here ...',
        charts: '',
      /*  opinion: ["1", "3", "3", "4", "5"],*/
        opinionData: ["3", "2", "4", "4", "5"]
      }
    },
    methods: {
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['近七日收益']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
 
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
          data: ["1","2","3","4","5"]
          
          },
          yAxis: {
            type: 'value'
          },
 
          series: [{
            name: '近七日收益',
            type: 'line',
            stack: '总量',
            data: this.opinionData
          }]
        })
      }
    },
    //调用
    mounted() {
      this.$nextTick(function() {
        this.drawLine('main')
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
