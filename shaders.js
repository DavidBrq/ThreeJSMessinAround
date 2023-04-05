const vertexShader = `
varying vec2 vbarycoord;

void main(){
    vbarycoord = barycoord;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
precision mediump float;

varying vec2 vbarycoord;

void main(){
    vec3 barys;
    barys.xy = barycoord.xy;
    barys.z = 1.0 - barys.x - barys.y;

    vec3 coordscale = fwidth(barys);
    vec3 scaleCoord = barys / coordscale;
    float dist = min( scaleCoord.x, scaleCoord.y);
    dist = min(dist, scaleCoord.z);
    float halfwidth = 1.0;
    float wire = smoothstep(0.0, 1.0, dist);

    gl_FragColor= vec4(1.0, 0.0, 0.0,  1.0);
}
`;