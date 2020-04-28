<template>
    <div>
      <div id="container"></div>
      <div id='test'></div>
    </div>
</template>
 
<script>
import * as THREE from 'three'
import { GeometryUtils } from 'three';
 
export default {
  name: 'THREETest',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      scene2: null,
      renderer2: null,
      mesh2: null,
      fixedPlatform: null,
      motionPlatform: null
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
      console.log(window.innerHeight, window.innerWidth);
      this.camera.position.set(0.375, 0.75, 0.75);  //设置相机位置
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置相机的朝向

      this.scene = new THREE.Scene();

      //长方体构建
      let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
      let material = new THREE.MeshNormalMaterial();
      this.mesh = new THREE.Mesh(geometry, material);



      var length = 0.1, width = 0.1;
                                                                                                                               
      let shape2 = new THREE.Shape();
      //构建正方形
      shape2.moveTo( 0,0 );
      shape2.lineTo( 0, width );
      shape2.lineTo( length, width );
      shape2.lineTo( length, 0 );
      shape2.lineTo( 0, 0 );

      //扩展配置
      var extrudeSettings = {
        steps: 1,
        depth: 0.01,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
      };

      //构建三角形
      const edgeLen = 0.2
      const triangleHeight = 0.2 * 1.732 / 2
      var trianglePoints = new Array(
        new THREE.Vector2(0, triangleHeight/2),
        new THREE.Vector2(- edgeLen/2, - triangleHeight/2),
        new THREE.Vector2(edgeLen/2, - triangleHeight/2),
        new THREE.Vector2(0, triangleHeight/2)
      )
      var shape3 = new THREE.Shape(trianglePoints)

      //从二维形状扩展3维度，默认按照z轴扩展
      let geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings );
      let material2 = new THREE.MeshNormalMaterial();
      this.mesh2 = new THREE.Mesh( geometry2, material2);

      let geometry3 = new THREE.ExtrudeGeometry( shape3, extrudeSettings );
      let material3 = new THREE.MeshNormalMaterial();
      this.fixedPlatform = new THREE.Mesh( geometry3, material3);
      this.fixedPlatform.position.set(0, 0, 0);  //设定平台的位置
      this.fixedPlatform.rotateX(Math.PI / 2);
      // this.fixedPlatform.rotateZ(Math.PI / 2);

      this.motionPlatform = new THREE.Mesh(geometry3, material3); 
      this.motionPlatform.position.set(0, 0.2, 0);  //设置动平台位置
      this.motionPlatform.rotateX(Math.PI / 2);

      this.scene.add(new THREE.AxesHelper(10))
      // this.scene.add(this.mesh);
      // this.scene.add(this.mesh2);
      this.scene.add(this.fixedPlatform);
      this.scene.add(this.motionPlatform);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement)

    },

    animate: function() {
      requestAnimationFrame(this.animate);
      // this.fixedPlatform.rotation.x += 0.02;
      // this.fixedPlatform.rotation.y += 0.01;
      this.mesh2.rotation.x += 0.02;
      this.mesh2.rotation.y += 0.01;
      this.mesh.rotation.x += 0.02;
      this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    },

    //更新动平台位置的设计思路:
    // 1, 输入的是反解后的每个Actuator(电动缸)的运动量
    // 2, 提出问题,反解后得到的各个电动缸的运动量,这个作为平台的重新绘制很麻烦,电动缸不总是垂直于地面的
    // 3, 思考方式: 使用可以控制其他obj的three.js的对象,也就是骨骼,尝试使用骨骼构建,然后控制骨骼的长度
    // updateMotionPlatform(inverseResolutionData){
      
    // }
  },
  mounted() {
    this.init();
    this.animate();
    console.log(this.fixedPlatform.vertices);
  }
}
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>