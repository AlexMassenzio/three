import '../css/style.css'

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { WireframeGeometry } from 'three';
import { Vector3 } from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(0);



const geometry = new THREE.CylinderGeometry(10, 10, 10, 10);
const material = new THREE.MeshBasicMaterial({color: 0xff6347, wireframe: true});
const cylinder = new THREE.Mesh(geometry, material);

scene.add(cylinder);
cylinder.rotateX(THREE.MathUtils.degToRad(90));

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

//Define Tween
const tween1 = new TWEEN.Tween({z:0})
  .to({z:18}, 5000)
  .delay(1000)
  .easing(TWEEN.Easing.Cubic.InOut);

const tween2 = new TWEEN.Tween({d:0})
  .to({d:180}, 3000)
  .delay(250)
  .easing(TWEEN.Easing.Cubic.InOut);

//Tween Actions
tween1.onUpdate((twn) => {
  camera.position.setZ(twn.z);
});
tween1.onComplete(() => {
  tween2.start();
});
tween2.onUpdate((twn) => {
  cylinder.rotation.set(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(twn.d), 0)
})

tween1.start();

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();

  //console.log(camera.position);
  controls.update();

  renderer.render(scene, camera);

}

animate();