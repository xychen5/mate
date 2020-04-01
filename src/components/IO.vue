<template>
  <div>
    <div id="all">
      <el-container>
        <el-header>3DOF Motion Platform Simulation</el-header>
        <el-container>
            <el-aside width=200px>
              <el-row class="tac">
                <el-col>
                  <el-menu
                    :default-active="$route.path"
                    class="el-menu-vertical-demo"
                    router
                    background-color="#d3dce6"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="/io/ioData">
                      <i class="el-icon-menu"></i>
                      <span slot="title">Data Input & Output</span>
                    </el-menu-item>
                    <el-menu-item index="/io/visualSimulation" align="left">
                      <i class="el-icon-menu"></i>
                      <span slot="title">Visual Simulation</span>
                    </el-menu-item>
                  </el-menu>
                </el-col>
              </el-row>
            </el-aside>
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="container-fluid">
      <!-- <button
        type="button"
        class="btn btn-primary"
        @click="handleClick"
      >{{ msg }}</button> -->
      
      
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'IO',
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  methods: {
    getMessage () {
      const path = 'http://localhost:5000/io'
      axios.get(path)
        .then((res) => {
          this.msg = res.data
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
        })
    },
    // handleClick() {
    //   console.log("clicked");
    // }
  },
  created () {
    this.getMessage()
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: rgb(10, 37, 73);
    color: rgb(255, 255, 255);
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    min-height: 100vh;
  }
  

  .el-row {
    text-align: left;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>