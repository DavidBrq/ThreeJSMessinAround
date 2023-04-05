import * as THREE from 'three';
import * as roomMaker from '/roomMaker.js';


export const scene = new THREE.Group();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
let cubes;

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });
    material.stencilWrite = true;
    material.stencilRef = 1;
    material.stencilFunc = THREE.EqualStencilFunc;
    const cube = new THREE.Mesh(geometry, material);
    cube.renderOrder = 1;
    scene.add(cube);

    cube.position.x = x;

    return cube;
}

cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
];

scene.add(roomMaker.MakeRoom(1, 'blue', 'green', 'blue'));

Render();


function Render(time) {
    time *= 0.001;  // convert time to seconds

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    requestAnimationFrame(Render);
}
