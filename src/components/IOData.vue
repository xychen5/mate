<template>
  <div class="hello">
    <el-tabs v-model="activeName">
    <el-tab-pane label="input data" name="first">
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
    </el-tab-pane>
    <el-tab-pane label="output data" name="second">
      <el-raw :gutter="2">
        <el-col :span="12">
          <div id="h1" style="width: 500px;height: 400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="h2" style="width: 500px;height: 400px;"></div>
        </el-col>
      </el-raw>
      <el-raw :gutter="2">
        <el-col :span="12">
          <div id="h3" style="width: 600px;height: 400px;"></div>
        </el-col>
      </el-raw>
    </el-tab-pane>
    </el-tabs>
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
        activeName: "first",
        xList: [],
        wPitch: [],
        wRoll: [],
        xAcc: [],
        yAcc: [],
        zAcc: [],
        h1: [],
        h2: [],
        h3: []
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
            left: '12%',
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
        let newH1 = new Array(this.msg.wPitch.length)
        let newH2 = new Array(this.msg.wPitch.length)
        let newH3 = new Array(this.msg.wPitch.length)
        for (var i = 0; i < this.msg.wPitch.length; i++){
          newXList[i] = i
          newWPitch[i] = this.msg.wPitch[i]
          newWRoll[i] = this.msg.wRoll[i]
          newXAcc[i] = this.msg.xAcc[i]
          newYAcc[i] = this.msg.yAcc[i]
          newZAcc[i] = this.msg.zAcc[i]
          newH1[i] = this.msg.h1[i]
          newH2[i] = this.msg.h2[i]
          newH3[i] = this.msg.h3[i]
        }
        this.xList = newXList
        this.wPitch = newWPitch
        this.wRoll = newWRoll
        this.xAcc = newXAcc
        this.yAcc = newYAcc
        this.zAcc = newZAcc
        this.h1 = newH1
        this.h2 = newH2
        this.h3 = newH3
        this.drawLine('wPitch', 'wPitch', this.xList, 'n * T', this.wPitch, 'pitch : rad/s')
        this.drawLine('wRoll', 'wRoll', this.xList, 'n * T', this.wRoll, 'roll : rad/s')
        this.drawLine('xAcc', 'xAcc', this.xList, 'n * T', this.xAcc, 'x accelarate : m/s^2')
        this.drawLine('yAcc', 'yAcc', this.xList, 'n * T', this.yAcc, 'y accelarate : m/s^2')
        this.drawLine('zAcc', 'zAcc', this.xList, 'n * T', this.zAcc, 'z accelarate : m/s^2')
        this.drawLine('h1', 'h1', this.xList, 'n * T', this.h1, 'the front cylinder\'s height change: mm')
        this.drawLine('h2', 'h2', this.xList, 'n * T', this.h2, 'the left behind cylinder\'s height change: mm')
        this.drawLine('h3', 'h3', this.xList, 'n * T', this.h3, 'the right behid cylinder\'s height change: mm')
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
