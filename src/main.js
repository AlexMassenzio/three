import './css/style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}

//doughnut load
Array(200).fill().forEach(addStar)
const loader = new GLTFLoader();
let mixer;
loader.load("/models/doughnut.gltf", function (gltf) {
  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'BreadnutAction');
  const action = mixer.clipAction(clip);
  action.play();
})

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);

  mixer.update(clock.getDelta());
}

animate();