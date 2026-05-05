let canvas = document.getElementById("canvas");
let dimensionx = window.innerWidth;
let dimensiony = window.innerHeight;
let mousePos = { x: 0.5, y: 0.5 };
let runTime = 0,
  prevT = performance.now();

canvas.width = dimensionx;
canvas.height = dimensiony;
canvas.style.left = (window.innerWidth - dimensionx) / 2 + "px";
canvas.style.top = (window.innerHeight - dimensiony) / 2 + "px";

let gl = canvas.getContext("webgl2");
const m2PI = Math.PI * 2;

//************** Shader sources **************
let vertexSource = `#version 300 es

precision mediump float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

let fragmentSource = `#version 300 es

 precision mediump float;

 out vec4 fragColor;

 #define PI 3.14159265358979323846

 uniform float width;
 uniform float height;
 uniform float time;
 uniform float scale;
 uniform int pattern;
 uniform vec3 hueTb[15];

 vec2 resolution;

// Simplex 3D noise
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main(){

	//set up position
resolution = vec2(width, height);
  vec2 uv = ((gl_FragCoord.xy - resolution/2.0) / min(resolution.x, resolution.y));
  vec3 hue=vec3(0.0,0.0,0.0);

  float light = (snoise(vec3(uv * scale, time)) + 1.0) / 2.0; // range 0..1
   light= 15.0 * light; // range 0..15


   hue = hueTb[int (floor(light))];
   switch (pattern) {
           case 0: light=1.0;break; // plain color
           case 1: light = (1.0-cos (light*2.0*PI))*0.5; break; // wave
           case 2: if (fract(light)<0.3) light=1.0; else light=0.0; break; // square wave
    } // switch pattern

  fragColor = vec4(light * hue , 1.0 );
}
`;

//************** Utility functions **************

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  let dimensionx = window.innerWidth;
  let dimensiony = window.innerHeight;
  canvas.width = dimensionx;
  canvas.height = dimensiony;
  gl.viewport(0, 0, dimensionx, dimensiony);
  gl.uniform1f(widthHandle, dimensionx);
  gl.uniform1f(heightHandle, dimensiony);
}

//Compile shader and combine with source
function compileShader(shaderSource, shaderType) {
  let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

//From https://codepen.io/jlfwong/pen/GqmroZ
//Utility to complain loudly if we fail to find the attribute/uniform
function getAttribLocation(program, name) {
  let attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw "Cannot find attribute " + name + ".";
  }
  return attributeLocation;
}

function getUniformLocation(program, name) {
  let attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === null) {
    throw "Cannot find uniform " + name + ".";
  }
  return attributeLocation;
}

//************** Create shaders **************

//Create vertex and fragment shaders
let vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
let fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

//Create shader programs
let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

gl.useProgram(program);

//Set up rectangle covering entire canvas
let vertexData = new Float32Array([
  -1.0,
  1.0, // top left
  -1.0,
  -1.0, // bottom left
  1.0,
  1.0, // top right
  1.0,
  -1.0 // bottom right
]);

// Create vertex buffer
let vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of our data in the vertex buffer
let positionHandle = getAttribLocation(program, "position");

gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(
  positionHandle,
  2, // position is a vec2 (2 values per component)
  gl.FLOAT, // each component is a float
  false, // don't normalize values
  2 * 4, // two 4 byte float components per vertex (32 bit float is 4 bytes)
  0 // how many bytes inside the buffer to start from
);

//Set uniform handle

let widthHandle = getUniformLocation(program, "width");
let heightHandle = getUniformLocation(program, "height");
let timeHandle = getUniformLocation(program, "time");
let scaleHandle = getUniformLocation(program, "scale");
let patternHandle = getUniformLocation(program, "pattern");
let hueTbHandle = getUniformLocation(program, "hueTb");
let pattern = -1; // will be set to 0 by initial "changePattern";

let hueTb = [];
let firstRun = true;

gl.uniform1f(widthHandle, dimensionx);
gl.uniform1f(heightHandle, dimensiony);
setScale();
changePattern();

function draw() {
  let nt = performance.now();
  let dt = Math.min(performance.now() - prevT, 100);
  prevT = nt;

  runTime += dt * 0.001 * mousePos.y;

  gl.uniform1f(timeHandle, runTime);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}

function display(string) {
  document.querySelector("p").innerText = string;
}

function pointerMove(event) {
  mousePos = {
    x: event.offsetX / canvas.width,
    y: event.offsetY / canvas.height
  };
  setScale();
} // pointerMove

function pointerDown(event) {
  mousePos = {
    x: event.offsetX / canvas.width,
    y: event.offsetY / canvas.height
  };
  setScale();
  changePattern();
} // pointerDown

function setScale() {
  gl.uniform1f(scaleHandle, 1.0 + 6 * (1 - mousePos.x));
}

function changePattern() {
  pattern = (pattern + 1) % 3;
  if (firstRun) pattern = 1;
  gl.uniform1i(patternHandle, pattern);
  setHueTb(pattern);
  firstRun = false;
}

function setHueTb(pattern) {
  // if (pattern==0), some color combinations are forbidden (would produce blank image)

  hueTb = new Array(45).fill(0); // 15 vec3 values => 45 numbers

  let colPatt, limit;
  do {
    colPatt = Math.floor(4 * Math.random());
    limit = Math.random() > 0.5;
    if (firstRun) {
      colPatt = 0;
      limit = true;
    }
  } while (pattern == 0 && (colPatt == 0 || colPatt == 2) && !limit);

  switch (colPatt) {
    case 0:
      hueTb = hueTb.map(() => 1); // all white
      break;
    case 1:
      hueTb = hueTb.map((v, k) => Math.floor(k / 3) & 1);
      break;

    case 2: // uniform random color
      const col = returnSat();
      for (let k = 0; k < 15; ++k) {
        hueTb[3 * k] = col[0];
        hueTb[3 * k + 1] = col[1];
        hueTb[3 * k + 2] = col[2];
      }
      break;

    case 3: // random colors
      for (let k = 0; k < 15; ++k) {
        const col = returnSat();
        hueTb[3 * k] = col[0];
        hueTb[3 * k + 1] = col[1];
        hueTb[3 * k + 2] = col[2];
      }
  }
  if (limit) {
    hueTb.forEach((v, k) => {
      if (Math.floor(k / 3) < 7 || Math.floor(k / 3) >= 10) hueTb[k] = 0;
    });
  }
  gl.uniform3fv(hueTbHandle, hueTb);
}

function returnSat() {
  /* return r,g,b components of a sat of 100% and lum 50% */
  const col = [0, 1, Math.random()];
  // shuffle components
  let k = Math.floor(3 * Math.random());
  [col[2], col[k]] = [col[k], col[2]];
  k = Math.floor(2 * Math.random());
  [col[1], col[k]] = [col[k], col[1]];
  return col;
}

canvas.addEventListener("pointermove", pointerMove);
canvas.addEventListener("pointerdown", pointerDown);

draw();