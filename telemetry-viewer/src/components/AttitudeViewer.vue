
<template>
<div id="container"></div>
</template>

<script>
import * as Three from 'three'
import * as STLLoader from 'three-stl-loader'
let STLLoaderInstance = STLLoader(Three);

export default {
  name: 'AttitudeViewer',
  sockets: {
    connect: function () {
    },
    attitude: function (data) {
      // this.mesh.rotation.x = 0-(Math.PI / 2)+Number(data.pitch);
      // this.mesh.rotation.y = 0-Number(data.roll);
      // this.mesh.rotation.z = 0-(Math.PI)+Number(data.yaw);
      this.mesh.rotation.x = 0-(Math.PI / 2)+Number(data.pitch);
      this.mesh.rotation.y = 0-Number(data.roll);
      this.mesh.rotation.z = 0-(Math.PI)+Number(data.yaw);
      this.renderer.render(this.scene, this.camera);
    }
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('container');

        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 4;

        this.scene = new Three.Scene();

        var loader = new STLLoaderInstance();
        var width = 2, height = 1.4;

        var shape = new Three.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( width, height );
        shape.lineTo( -width, height );
        shape.lineTo( 0, 0 );

        var extrudeSettings = {
          steps: 2,
          depth: 0.13,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 1
        };

        var geometry = new Three.ExtrudeGeometry( shape, extrudeSettings );
        let material = new Three.MeshNormalMaterial();

        this.mesh = new Three.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.mesh.rotation.x = 0-(Math.PI / 2);

        this.renderer.render(this.scene, this.camera);
    },
    animate: function() {
        // requestAnimationFrame(this.animate);
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.02;
        // 
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
}
</script>

<style>
  #container {
    width:100%;
    height:100%;
  }
</style>