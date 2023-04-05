import * as THREE from 'three';

const sphereGeom = new THREE.SphereGeometry(3, 32, 16);

const triangles = sphereGeom.getIndex().array;
const vertices = PackIntoVector3(sphereGeom.getAttribute('position').array);
const normals = PackIntoVector3(sphereGeom.getAttribute('normal').array);
const uvs = PackIntoVector2(sphereGeom.getAttribute('uv').array);

const newVertices = [...vertices];
const baryCoords = new Array(sphereGeom.getAttribute('position').count).fill(new THREE.Vector2(-1, -1));
const newNormals = [...normals];
const newUvs = [...uvs];
const newTriangles = new Float32Array([...triangles]);

const defaultVec = new THREE.Vector2(-1, -1);

for (let tri = 0; tri < triangles.length; tri += 3) {
    const vert1 = newTriangles[tri];
    const vert2 = newTriangles[tri + 1];
    const vert3 = newTriangles[tri + 2];
    const numSet = (baryCoords[vert1].equals(defaultVec) ? 0 : 1) + (baryCoords[vert2].equals(defaultVec) ? 0 : 1) + (baryCoords[vert3].equals(defaultVec) ? 0 : 1);

    //If none are set
    if (numSet == 0) {
        baryCoords[vert1] = GetBaryCoords(0);
        baryCoords[vert2] = GetBaryCoords(1);
        baryCoords[vert3] = GetBaryCoords(2);
    }
    //else if one is set
    else if (numSet == 1) {
        const vertArr = [vert1, vert2, vert3];
        const setVert = !baryCoords[vert1].equals(defaultVec) ? 0 : !baryCoords[vert2].equals(defaultVec) ? 1 : 2;
        const setBary = GetIndex(baryCoords[vertArr[setVert]]);
        let nextVert = (setVert + 1) % 3;
        let nextBary = (setBary + 1) % 3;
        baryCoords[vertArr[nextVert]] = GetBaryCoords(nextBary);
        nextVert = (setVert + 2) % 3;//used to be 1?
        nextBary = (setBary + 2) % 3;
        baryCoords[vertArr[nextVert]] = GetBaryCoords(nextBary);
    }
    //else if 2 are set
    else if (numSet == 2) {
        const vertArr = [vert1, vert2, vert3];
        const firstSet = baryCoords[vert1].equals(defaultVec) ? 0 : 1;
        const secondSet = firstSet == 1 ? 2 : baryCoords[vert2].equals(defaultVec) ? 1 : 2;
        if (baryCoords[vertArr[firstSet]].equals(baryCoords[vertArr[secondSet]]))// two set are the same make a new one for the second one
        {
            newVertices.push(new THREE.Vector3().copy(newVertices[vertArr[secondSet]]));
            newNormals.push(normals[vertArr[secondSet]]);
            newUvs.push(uvs[vertArr[secondSet]]);
            baryCoords.push(GetBaryCoords((GetIndex(baryCoords[vertArr[firstSet]]) + 1) % 3));
            newTriangles[tri + secondSet] = newVertices.length - 1;
            vertArr[secondSet] = newVertices.length - 1;
        }
        //set the third
        var third = 3 - firstSet - secondSet;
        baryCoords[vertArr[third]] = new THREE.Vector2(1, 1).sub(baryCoords[vertArr[firstSet]]).sub(baryCoords[vertArr[secondSet]]);
    }
    //else all 3 are set
    else {
        //check if all three are different we're good
        if (!baryCoords[vert1].equals(baryCoords[vert2]) &&
            !baryCoords[vert1].equals(baryCoords[vert3]) &&
            !baryCoords[vert2].equals(baryCoords[vert3])) {
            continue;
        }
        //if all 3 are the same create 2 new vertex's
        if (baryCoords[vert1] == baryCoords[vert2] && baryCoords[vert1] == baryCoords[vert3]) {
            var vert1Index = GetIndex(baryCoords[vert1]);

            newVertices.push(new THREE.Vector3().copy(newVertices[vert2]));
            newNormals.push(normals[vert2]);
            newUvs.push(uvs[vert2]);
            baryCoords.push(GetBaryCoords((vert1Index + 1) % 3));
            newTriangles[tri + 1] = newVertices.Count - 1;

            newVertices.push(new THREE.Vector3().copy(newVertices[vert3]));
            newNormals.push(normals[vert3]);
            newUvs.push(uvs[vert3]);
            baryCoords.push(GetBaryCoords((vert1Index + 2) % 3));
            newTriangles[tri + 2] = newVertices.Count - 1;

            continue;

        }
        // a pair exists create new vertex for the third
        if (!baryCoords[vert1].equals(baryCoords[vert2]))//change vert3
        {
            newVertices.push(new THREE.Vector3().copy(newVertices[vert3]));
            newNormals.push(normals[vert3]);
            newUvs.push(uvs[vert3]);
            baryCoords.push(GetBaryCoords(3 - GetIndex(baryCoords[vert1]) - GetIndex(baryCoords[vert2])));
            newTriangles[tri + 2] = newVertices.Count - 1;
        }
        else// change vert2
        {
            newVertices.push(new THREE.Vector3().copy(newVertices[vert2]));
            newNormals.push(normals[vert2]);
            newUvs.push(uvs[vert2]);
            baryCoords.push(GetBaryCoords(3 - GetIndex(baryCoords[vert1]) - GetIndex(baryCoords[vert3])));
            newTriangles[tri + 1] = newVertices.Count - 1;
        }
    }
}

const newVerticesFloat32 = [ ...Unpack(newVertices)];
const newNormalsFloat32 = [ ...Unpack(newNormals)];
const newUvsFloat32 = [...Unpack(newUvs)];
const baryCoordFloat32 = [ ...Unpack(baryCoords)];

const wireSphereGeom = new THREE.BufferGeometry();
wireSphereGeom.setAttribute('position', new THREE.Float32BufferAttribute(newVerticesFloat32, 3));
wireSphereGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormalsFloat32, 3));
wireSphereGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUvsFloat32), 2);
// wireSphereGeom.deleteAttribute('normal');
// wireSphereGeom.deleteAttribute('uv');
// wireSphereGeom.setAttribute('barycoords', new THREE.Float32BufferAttribute(baryCoordFloat32, 2));
wireSphereGeom.setIndex(new THREE.Float32BufferAttribute(newTriangles, 3));

const vertexShader = `
void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
precision mediump float;

varying vec2 barycoord;

void main(){


    gl_FragColor= vec4(1.0, 0.0, 0.0,  1.0);
}
`;
const sphereMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader});
const m = new THREE.MeshBasicMaterial({color: 'red'});

export const sphere = new THREE.Mesh(wireSphereGeom, m);


function GetIndex(v) {
    return v.equals(new THREE.Vector2(0, 0)) ? 0 : v.equals(new THREE.Vector2(0, 1)) ? 1 : 2;
}

function GetBaryCoords(i) {
    switch (i) {
        case 0:
            return new THREE.Vector2(0, 0);
        case 1:
            return new THREE.Vector2(0, 1);
        case 2:
            return new THREE.Vector2(1, 0);
    }
}

function PackIntoVector3(a) {
    const ret = new Array();
    for (let i = 0; i < a.length; i += 3) {
        ret.push(new THREE.Vector3(a[i], a[i + 1], a[i + 2]));
    }
    return ret;
}

function PackIntoVector2(a) {
    const ret = new Array();
    for (let i = 0; i < a.length; i += 2) {
        ret.push(new THREE.Vector2(a[i], a[i + 1]));
    }
    return ret;
}

function Unpack(a) {
    const ret = new Array();
    for (const val of a) {
        ret.push(...val.toArray());
    }
    return ret;
}