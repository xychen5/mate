<template>
    <div>
      <div id="container"></div>
      <div id='test'></div>
    </div>
</template>
 
<script>
import * as THREE from 'three'
 
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
      mesh3: null
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
      this.camera.position.z = 1;

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
      this.mesh3 = new THREE.Mesh( geometry3, material3);
      this.mesh3.position.set(0, 0.1, 0)  //设置动平台的位置

      this.scene.add(new THREE.AxesHelper(10))
      // this.scene.add(this.mesh);
      // this.scene.add(this.mesh2);
      this.scene.add(this.mesh3);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement)

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.mesh3.rotation.x += 0.02;
      this.mesh3.rotation.y += 0.01;
      this.mesh2.rotation.x += 0.02;
      this.mesh2.rotation.y += 0.01;
      this.mesh.rotation.x += 0.02;
      this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
    this.init();
    this.animate()
  }
}
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>