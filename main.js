import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as mainRoom from '/mainRoom.js';
import * as cubes from '/cubes.js';
import * as wireframe from '/wireframe.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 15);
controls.update();

scene.add(mainRoom.room);

scene.add(cubes.scene);

scene.add(wireframe.sphere);

render();

function render() {

    renderer.clearStencil(0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}