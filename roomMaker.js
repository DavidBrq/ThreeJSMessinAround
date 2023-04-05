import * as THREE from 'three';

export function MakeRoom(stencilRef, floorColor, wallColor, ceilingColor) {
    const room = new THREE.Group();

    const planeGeom = new THREE.PlaneGeometry(50, 50);
    
    const floorMaterial = new THREE.MeshPhongMaterial({ color: floorColor });
    floorMaterial.stencilWrite = true;
    floorMaterial.stencilRef = stencilRef;
    floorMaterial.stencilFunc = THREE.EqualStencilFunc;
    const floor = new THREE.Mesh(planeGeom, floorMaterial);
    floor.renderOrder = 1
    floor.position.copy(new THREE.Vector3(0, -5, 0));
    floor.rotateX(-Math.PI / 2);
    room.add(floor);

    
    const ceilingMaterial = new THREE.MeshPhongMaterial({ color: ceilingColor });
    ceilingMaterial.stencilWrite = true;
    ceilingMaterial.stencilRef = stencilRef;
    ceilingMaterial.stencilFunc = THREE.EqualStencilFunc;
    const ceiling = new THREE.Mesh(planeGeom, ceilingMaterial);
    ceiling.renderOrder = 1;
    ceiling.position.copy(new THREE.Vector3(0, 5, 0));
    ceiling.rotateX(Math.PI / 2);
    room.add(ceiling);

    const cubeGeom = new THREE.BoxGeometry(50, 10.2, 50);
    const wallMaterial = new THREE.MeshPhongMaterial({ color: wallColor });
    wallMaterial.stencilWrite = true;
    wallMaterial.stencilRef = stencilRef;
    wallMaterial.stencilFunc = THREE.EqualStencilFunc;
    wallMaterial.side = THREE.BackSide;
    const walls = new THREE.Mesh(cubeGeom, wallMaterial);
    walls.renderOrder = 1
    room.add(walls);

    return room;
}