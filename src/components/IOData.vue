<template>
  <div class="hello">
    <!--为echarts准备一个具备大小的容器dom-->
    <el-raw :gutter="2">
      <el-col :span="12">
        <div id="wPitch" style="width: 600px;height: 400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="wRoll" style="width: 600px;height: 400px;"></div>
      </el-col>
    </el-raw>
    <el-raw :gutter="2">
      <el-col :span="12">
        <div id="xAcc" style="width: 600px;height: 400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="yAcc" style="width: 600px;height: 400px;"></div>
      </el-col>
    </el-raw>
    <el-raw :gutter="2">
      <el-col :span="12">
        <div id="zAcc" style="width: 600px;height: 400px;"></div>
      </el-col>
    </el-raw>
    
    <span>{{ msg }}</span>
    <!-- <div id="wRo"> -->
  </div>
</template>

<script>

import echarts from 'echarts'
import axios from 'axios'
  export default {
    name: '',
    data() {
      return {
        msg: 'null',
        xList: [],
        wPitch: [],
        wRoll: [],
        xAcc: [],
        yAcc: [],
        zAcc: []
      }
    },
    methods: {
      drawLine(id, name, xList, xName, yList, yName) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [name]
          },
          grid: {
            left: '3%',
            right: '12%',
            bottom: '3%',
            containLabel: true
          },
 
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name: xName,
            type: 'category',
            boundaryGap: false,
            data: xList
          },
          yAxis: {
            name: yName,
            type: 'value'
          },
 
          series: [{
            name: name,
            type: 'line',
            stack: '总量',
            data: yList
          }]
        })
      },

      getIOData(){
        const path = 'http://localhost:5000/io'
        axios.get(path)
          .then((res) => {
            this.msg = res.data
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error(error)
          })
      }
    },
    //调用
    mounted() {
      const getIODataTimer = setInterval(() => {
        this.getIOData()
        let newXList = new Array(this.msg.wPitch.length)
        let newWPitch = new Array(this.msg.wPitch.length)
        let newWRoll = new Array(this.msg.wPitch.length)
        let newXAcc = new Array(this.msg.wPitch.length)
        let newYAcc = new Array(this.msg.wPitch.length)
        let newZAcc = new Array(this.msg.wPitch.length)
        for (var i = 0; i < this.msg.wPitch.length; i++){
          newXList[i] = i
          newWPitch[i] = this.msg.wPitch[i]
          newWRoll[i] = this.msg.wRoll[i]
          newXAcc[i] = this.msg.xAcc[i]
          newYAcc[i] = this.msg.yAcc[i]
          newZAcc[i] = this.msg.zAcc[i]
        }
        this.xList = newXList
        this.wPitch = newWPitch
        this.wRoll = newWRoll
        this.xAcc = newXAcc
        this.yAcc = newYAcc
        this.zAcc = newZAcc
        this.drawLine('wPitch', 'wPitch', this.xList, 'n * 0.01s', this.wPitch, 'pitch veclocity: rad/s')
        this.drawLine('wRoll', 'wRoll', this.xList, 'n * 0.01s', this.wRoll, 'roll veclocity: rad/s')
        this.drawLine('xAcc', 'xAcc', this.xList, 'n * 0.01s', this.xAcc, 'x accelarate veclocity: m/s^2')
        this.drawLine('yAcc', 'yAcc', this.xList, 'n * 0.01s', this.yAcc, 'y accelarate veclocity: m/s^2')
        this.drawLine('zAcc', 'zAcc', this.xList, 'n * 0.01s', this.zAcc, 'z accelarate veclocity: m/s^2')
        console.log(this.msg.xAcc)  
      }, 1000);
      this.$nextTick(function() {
        this.drawLine('main')
      });
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
