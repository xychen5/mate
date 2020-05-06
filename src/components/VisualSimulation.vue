<template>
    <div>
      <div id="container" style="height: 600px"></div>
    </div>
</template>
 
<script>
import * as THREE from 'three';
import { GeometryUtils } from 'three';
import axios from 'axios';

class Leg {
  constructor(info) {
    /**
     * info是一个字典
     * startPoint: THREE.Vector3
     * endPoint: THREE.Vector3
     * 根据起点和终点构成支撑杆子
     */
    this.info = info
    this.createGeometry()
    this.createObeject()
  }

  createGeometry() {
    //创建几何体
    var path = new THREE.LineCurve3(this.info.startPoint, this.info.endPoint);
    this.geometry = new THREE.TubeGeometry( path, 20, 0.005, 8, false );
  }
  

  createObeject() {
    //给几合体mesh后创建的物体
    var material = new THREE.MeshBasicMaterial( { color: 0xf0f00f } );
    this.object = new THREE.Mesh(this.geometry, material );
  }

  updateLeg(startPoint, endPoint) {
    //将该leg删除后重新赋值
    this.info.startPoint = startPoint
    this.info.endPoint = endPoint
    if(this.geometry) {
      this.geometry.dispose()
      this.geometry = null
    }
    this.createGeometry()
    this.object.geometry = this.geometry
    console.log("update leg!")
  }
}



export default {
  name: 'THREETest',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      fixedPlatform: null,
      motionPlatform: null,
      leg1: null,
      leg2: null,
      leg3: null,
      tmp: "for tmp",
      msg: null,
      motionPlatformInfo: null,
      height: 0
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
      console.log(window.innerHeight, window.innerWidth);
      this.camera.position.set(1, 1, 1);  //设置相机位置
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置相机的朝向

      this.scene = new THREE.Scene();

      //长方体构建
      let geometry = new THREE.BoxGeometry(0.01, 0.01, 0.02);
      let material = new THREE.MeshNormalMaterial();
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(0.2, 0, 0.2)

      //在这里构建动平台的法向量
      var startPoint = new THREE.Vector3(0, 0, 0)
      var endPoint = new THREE.Vector3(0.0, 0.0,0.11)
      var normalVecotr = new THREE.LineCurve3(startPoint, endPoint)

      //扩展配置
      var extrudeSettings = {
        steps: 1,
        depth: 0.01,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
        // extrudePath: normalVecotr
      };

      //构建三角形的动平台和定平台
      this.LR_LENGTH = 0.28
      this.FB_LENGTH = 0.28
      this.CT = 0.2175
      
      var trianglePoints = new Array(
        new THREE.Vector2(0, this.FB_LENGTH/2),
        new THREE.Vector2(- this.LR_LENGTH/2, - this.FB_LENGTH/2),
        new THREE.Vector2(this.LR_LENGTH/2, - this.FB_LENGTH/2),
        new THREE.Vector2(0, this.FB_LENGTH/2)
      )
      var shape3 = new THREE.Shape(trianglePoints)

      let geometry3 = new THREE.ExtrudeGeometry( shape3, extrudeSettings );
      let material3 = new THREE.MeshNormalMaterial();
      this.fixedPlatform = new THREE.Mesh( geometry3, material3);
      this.fixedPlatform.position.set(0, 0, 0);  //设定平台的位置
      this.fixedPlatform.rotateX(Math.PI / 2);
      // this.fixedPlatform.rotateZ(Math.PI / 2);

      this.motionPlatform = new THREE.Mesh(geometry3, material3); 
      this.motionPlatform.position.set(0, this.CT, 0);  //设置动平台位置
      // this.motionPlatform.lookAt(new THREE.Vector3(0,0,0)) //根据动平台的朝向确定其姿态
      this.motionPlatform.rotateX(Math.PI / 2);
      // this.motionPlatform.rotateY(Math.PI / 2)

      //构建柱形的支撑杆
      this.leg1 = new Leg({
        startPoint: new THREE.Vector3(0, 0, this.FB_LENGTH/2),
        endPoint: new THREE.Vector3(0, this.CT, this.FB_LENGTH/2)
      });
      this.leg2 = new Leg({
        startPoint: new THREE.Vector3(this.LR_LENGTH/2, 0, -this.FB_LENGTH/2),
        endPoint: new THREE.Vector3(this.LR_LENGTH/2, this.CT, -this.FB_LENGTH/2)
      });
      this.leg3 = new Leg({
        startPoint: new THREE.Vector3(-this.LR_LENGTH/2, 0, -this.FB_LENGTH/2),
        endPoint: new THREE.Vector3(-this.LR_LENGTH/2, this.CT, -this.FB_LENGTH/2)
      });
      this.scene.add(this.leg1.object); 
      this.scene.add(this.leg2.object);
      this.scene.add(this.leg3.object);

      this.scene.add(new THREE.AxesHelper(10))
      // this.scene.add(this.mesh);
      // this.scene.add(this.mesh2);
      this.scene.add(this.fixedPlatform);
      this.scene.add(this.motionPlatform);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement)

    },
    
    legConstructor: function(xa1, ya1, za1, xa2, ya2, za2){
      var path = new THREE.LineCurve3(new THREE.Vector3(xa1, ya1, za1), 
                                      new THREE.Vector3(xa2, ya2, za2))
      var geometry = new THREE.TubeGeometry( path, 20, 0.005, 8, false );
      var material = new THREE.MeshBasicMaterial( { color: 0xf0f00f } );
      var mesh = new THREE.Mesh( geometry, material );
      console.log("create leg")
      return mesh;
    },

    animate: function() {
      requestAnimationFrame(this.animate);
      // this.motionPlatform.rotation.x += 0.01;
      // this.motionPlatform.rotation.y = 0.1;
      this.renderer.render(this.scene, this.camera);
      // this.leg1.updateLeg()
    },
    
    updateMotionPlatform(){
      
    },

    getMotionPlatformInof () {
      const path = 'http://localhost:5000/visualize'
      axios.get(path)
        .then((res) => {
          this.motionPlatformInfo = res.data
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
        })
    }

    
    //更新动平台位置的设计思路:
    // 1, 输入的是反解后的每个Actuator(电动缸)的运动量
    // 2, 提出问题,反解后得到的各个电动缸的运动量,这个作为平台的重新绘制很麻烦,电动缸不总是垂直于地面的
    // 3, 思考方式: 使用可以控制其他obj的three.js的对象,也就是骨骼,尝试使用骨骼构建,然后控制骨骼的长度
    // updateMotionPlatform(inverseResolutionData){
      
    // }
  },
  //设定定时器，定时获取后端的动平台的位置和姿态
  beforeMount(){
    
  },

  mounted() {
    this.init();
    const getMotionPlatformInfoTimer = setInterval(() => {
      this.getMotionPlatformInof()
      console.time("net and updat")
      //获取数据的个数，这里我们总是取最顶端的那个数据作为更新的数据
      var dataNum = this.motionPlatformInfo.xa1.length 
      console.log(this.motionPlatformInfo.xa1[dataNum - 1]);
      //由于在前端，实现的动平台的前方面向为z轴，左右为x轴，上下为y轴，后端的前为x，左右为y，上下为z，同时前端坐标的尺度和后端不同
      //前端和后端大小的比例为： 0.28 : 560mm，后端的x为前端的z，后端的y为前端的x，后端的z为前端的y
      //动平台3个顶点，a1, a2, a3分别为前，左后，右后，且后端的坐标系建立在动平台上，前端建立在动平台上所以有以下坐标转化
      var scaleToFrontEnd = 0.28 / 560
      var xa1 = this.motionPlatformInfo.ya1[dataNum - 1] * scaleToFrontEnd
      var ya1 = this.motionPlatformInfo.za1[dataNum - 1] * scaleToFrontEnd + this.CT
      var za1 = this.motionPlatformInfo.xa1[dataNum - 1] * scaleToFrontEnd
      var xa2 = this.motionPlatformInfo.ya2[dataNum - 1] * scaleToFrontEnd
      var ya2 = this.motionPlatformInfo.za2[dataNum - 1] * scaleToFrontEnd + this.CT
      var za2 = this.motionPlatformInfo.xa2[dataNum - 1] * scaleToFrontEnd
      var xa3 = this.motionPlatformInfo.ya3[dataNum - 1] * scaleToFrontEnd
      var ya3 = this.motionPlatformInfo.za3[dataNum - 1] * scaleToFrontEnd + this.CT
      var za3 = this.motionPlatformInfo.xa3[dataNum - 1] * scaleToFrontEnd
      console.log(xa1, ya1, za1);
      //根据后端给出的坐标更新3个支撑杆
      this.leg1.updateLeg(new THREE.Vector3(0, 0, this.FB_LENGTH/2),
                          new THREE.Vector3(xa1, ya1, za1));
      this.leg2.updateLeg(new THREE.Vector3(this.LR_LENGTH/2, 0, -this.FB_LENGTH/2),
                          new THREE.Vector3(xa2, ya2, za2));
      this.leg3.updateLeg(new THREE.Vector3(-this.LR_LENGTH/2, 0, -this.FB_LENGTH/2),
                          new THREE.Vector3(xa3, ya3, za3));
      //根据后端给出的pitch和roll来更新动平台, 由于构建运动平台，动平台的绕x轴的初始旋转值为Math.PI / 2
      this.motionPlatform.rotation.x = this.motionPlatformInfo.pitch[dataNum - 1] + Math.PI / 2
      this.motionPlatform.rotation.z = this.motionPlatformInfo.roll[dataNum - 1]
      this.motionPlatform.y = this.motionPlatformInfo.updown[dataNum - 1] + this.CT
      console.timeEnd("net and updat")
      this.height += 0.01
    }, 1000);
    
    this.animate();
  },
  
}
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>