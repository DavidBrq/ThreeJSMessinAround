import * as THREE from 'three';
import * as roomMaker from '/roomMaker.js';

export const room = new THREE.Group

AddLights();
AddRoom();
AddCube();

function AddLights() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-1, 2, -4);

    const light3 = new THREE.AmbientLight(0x404040); // soft white light
    room.add(light, light2, light3);
}

function AddRoom() {
    room.add(roomMaker.MakeRoom(0, 0x606060, 0xFF6E6E, 0x606060));
}

function AddCube() {
    const AddCubeFace = (stencilRef, planePos, planeRot) => {
        const planeGeom = new THREE.PlaneGeometry();
        const stencilMat = new THREE.MeshPhongMaterial({ color: 'white' });
        stencilMat.colorWrite = false;
        stencilMat.depthWrite = false;
        stencilMat.stencilWrite = true;
        stencilMat.stencilRef = stencilRef;
        stencilMat.stencilFunc = THREE.AlwaysStencilFunc;
        stencilMat.stencilZPass = THREE.ReplaceStencilOp;
        const stencilMesh = new THREE.Mesh(planeGeom, stencilMat);
        stencilMesh.position.copy(planePos);
        stencilMesh.rotation.x = planeRot.x;
        stencilMesh.rotation.y = planeRot.y;
        stencilMesh.rotation.z = planeRot.z;
        stencilMesh.scale.multiplyScalar(5.7);
        room.add(stencilMesh);
    }

    AddCubeFace(1, new THREE.Vector3(0, 0, 3), new THREE.Vector3(0, 0, 0));
    AddCubeFace(2, new THREE.Vector3(0, 3, 0), new THREE.Vector3(- Math.PI / 2, 0, 0));
    AddCubeFace(3, new THREE.Vector3(0, -3, 0), new THREE.Vector3(Math.PI / 2, 0, 0));
    AddCubeFace(4, new THREE.Vector3(0, 0, -3), new THREE.Vector3(Math.PI, 0, 0));
    AddCubeFace(5, new THREE.Vector3(-3, 0, 0), new THREE.Vector3(0, -Math.PI / 2, 0));
    AddCubeFace(6, new THREE.Vector3(3, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));

    const boxBorderMat = new THREE.MeshPhongMaterial({ color: 0x1A120B });
    boxBorderMat.stencilWrite = true;
    boxBorderMat.stencilRef = 0;
    boxBorderMat.stencilFunc = THREE.EqualStencilFunc;
    const boxBorderGeom = new THREE.BoxGeometry(6,6,6);
    room.add(new THREE.Mesh(boxBorderGeom, boxBorderMat));
}



