'use client';
import { useEffect, useRef } from 'react';

// WebGL2 shaders (GLSL ES 3.00) — preferred path
const VERT2 = `#version 300 es
precision mediump float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG2 = `#version 300 es
precision mediump float;
out vec4 fragColor;
#define PI 3.14159265358979323846
uniform float width;
uniform float height;
uniform float time;
uniform float scale;
uniform vec2  cursor;
uniform float revealRadius;
uniform float revealMode;
uniform vec3  hueTb[15];

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+2.0*C.xxx;
  vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec2 res=vec2(width,height);
  vec2 uv=(gl_FragCoord.xy-res*0.5)/min(res.x,res.y);
  float n=(snoise(vec3(uv*scale,time))+1.0)/2.0;
  n=15.0*n;
  vec3  hue=hueTb[int(floor(n))];
  float intensity=(1.0-cos(n*2.0*PI))*0.5;

  // Cursor torch reveal
  float dist=length(gl_FragCoord.xy-cursor);
  float cursorReveal=smoothstep(revealRadius,revealRadius*0.05,dist);
  float cursorGlow=smoothstep(revealRadius*2.2,0.0,dist)*0.12;

  // Edge/border reveal — noise glows at the screen perimeter, dark in centre
  // Half-circle: centred at screen bottom-middle, intense there, fades upward
  vec2  bottomCentre=vec2(width*0.5,0.0);
  float halfDist=length(gl_FragCoord.xy-bottomCentre);
  float halfReveal=(1.0-smoothstep(0.0,height*1.1,halfDist))*0.65;

  // Additive: half-circle fades in as a base layer, cursor torch always on top
  float reveal=clamp(cursorReveal+halfReveal*revealMode,0.0,1.0);
  float glow  =cursorGlow;
  float alpha=intensity*reveal*0.80+glow*0.5;
  vec3  rgb=hue*(reveal*0.80+glow);
  fragColor=vec4(rgb*alpha,alpha);
}
`;

// WebGL1 shaders (GLSL ES 1.00) — fallback for older iOS / no WebGL2
const VERT1 = `
precision mediump float;
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG1 = `
precision mediump float;
#define PI 3.14159265358979323846
uniform float width;
uniform float height;
uniform float time;
uniform float scale;
uniform vec2  cursor;
uniform float revealRadius;
uniform float revealMode;
uniform vec3  hueTb[15];

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+2.0*C.xxx;
  vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

vec3 hueLookup(int idx){
  for(int i=0;i<15;i++){ if(i==idx) return hueTb[i]; }
  return hueTb[14];
}

void main(){
  vec2 res=vec2(width,height);
  vec2 uv=(gl_FragCoord.xy-res*0.5)/min(res.x,res.y);
  float n=(snoise(vec3(uv*scale,time))+1.0)/2.0;
  n=15.0*n;
  vec3  hue=hueLookup(int(floor(n)));
  float intensity=(1.0-cos(n*2.0*PI))*0.5;

  float dist=length(gl_FragCoord.xy-cursor);
  // Cursor: soft reveal + wide glow halo + bright core = torch light feel
  float cursorReveal=smoothstep(revealRadius,revealRadius*0.12,dist);
  float cursorHalo  =smoothstep(revealRadius*3.0,0.0,dist)*0.28;
  float cursorCore  =smoothstep(revealRadius*0.28,0.0,dist)*0.50;
  float cursorGlow  =cursorHalo+cursorCore;

  // Half-circle: centred at screen bottom-middle, intense there, fades upward
  vec2  bottomCentre=vec2(width*0.5,0.0);
  float halfDist=length(gl_FragCoord.xy-bottomCentre);
  float halfReveal=(1.0-smoothstep(0.0,height*1.1,halfDist))*0.65;

  // Additive: half-circle fades in as a base layer, cursor torch always on top
  float reveal=clamp(cursorReveal+halfReveal*revealMode,0.0,1.0);
  float glow  =cursorGlow;
  float alpha=intensity*reveal*0.80+glow*0.5;
  vec3  rgb=hue*(reveal*0.80+glow);
  gl_FragColor=vec4(rgb*alpha,alpha);
}
`;

function buildHueTb(hex: string): Float32Array {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const out: number[] = [];
  for (let k = 0; k < 15; k++) {
    const t = k / 14;
    out.push(t * r, t * g, t * b);
  }
  return new Float32Array(out);
}

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // premultipliedAlpha: true (default) — premultipliedAlpha:false is broken on iOS Safari
    const ctxOpts = { alpha: true, antialias: false, premultipliedAlpha: true };

    let gl: WebGLRenderingContext | null = null;
    let isGL2 = false;
    const gl2 = canvas.getContext('webgl2', ctxOpts);
    if (gl2) {
      gl = gl2 as unknown as WebGLRenderingContext;
      isGL2 = true;
    } else {
      gl = (canvas.getContext('webgl', ctxOpts) ??
            canvas.getContext('experimental-webgl', ctxOpts)) as WebGLRenderingContext | null;
    }
    if (!gl) return;

    const VERT = isGL2 ? VERT2 : VERT1;
    const FRAG = isGL2 ? FRAG2 : FRAG1;

    let animId: number;
    let runTime  = 0;
    let autoTime = 0;
    let prevT    = performance.now();

    let autoMode = true;
    let targetX  = window.innerWidth  / 2;
    let targetY  = window.innerHeight / 2;
    let smoothX  = targetX;
    let smoothY  = targetY;

    // revealMode: 0 = cursor torch, 1 = edge/border glow (moment 1)
    let noiseModeTarget = 0;
    let noiseModeSmooth = 0;
    function onNoiseMode(e: Event) {
      noiseModeTarget = (e as CustomEvent<number>).detail;
    }
    window.addEventListener('noise-mode', onNoiseMode);

    function onMouseMove(e: MouseEvent) {
      autoMode = false;
      targetX  = e.clientX;
      targetY  = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove);

    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('[noise] shader error:', gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[noise] link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 8, 0);

    const uW    = gl.getUniformLocation(prog, 'width');
    const uH    = gl.getUniformLocation(prog, 'height');
    const uT    = gl.getUniformLocation(prog, 'time');
    const uS    = gl.getUniformLocation(prog, 'scale');
    const uC    = gl.getUniformLocation(prog, 'cursor');
    const uR    = gl.getUniformLocation(prog, 'revealRadius');
    const uMode = gl.getUniformLocation(prog, 'revealMode');
    const uHue  = gl.getUniformLocation(prog, 'hueTb');

    gl.enable(gl.BLEND);
    // ONE, ONE_MINUS_SRC_ALPHA — correct blend for premultiplied alpha output
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform1f(uW, canvas!.width);
      gl!.uniform1f(uH, canvas!.height);
      // Scale with screen on mobile; cap at 220 to preserve desktop cursor feel
      const radius = Math.min(Math.min(canvas!.width, canvas!.height) * 0.52, 220);
      gl!.uniform1f(uR, radius);
    }

    resize();
    gl.uniform1f(uS, 3.0);

    const savedAccent = (() => { try { return localStorage.getItem('accent'); } catch { return null; } })();
    gl.uniform3fv(uHue, buildHueTb(savedAccent ?? '#c41230'));

    function onAccentChange(e: Event) {
      gl!.uniform3fv(uHue, buildHueTb((e as CustomEvent<string>).detail));
    }
    window.addEventListener('accent-change', onAccentChange);
    window.addEventListener('resize', resize);

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function draw() {
      const now   = performance.now();
      const delta = Math.min(now - prevT, 100);
      runTime  += delta * 0.00028;
      autoTime += delta / 1000;
      prevT = now;

      if (autoMode) {
        const cx = canvas!.width  / 2;
        const cy = canvas!.height / 2;
        targetX = cx + Math.sin(autoTime * 0.38) * cx * 0.55;
        targetY = cy + Math.cos(autoTime * 0.25) * cy * 0.50;
      }

      const lerpK = autoMode ? 0.025 : 0.08;
      smoothX = lerp(smoothX, targetX, lerpK);
      smoothY = lerp(smoothY, targetY, lerpK);
      noiseModeSmooth = lerp(noiseModeSmooth, noiseModeTarget, 0.03);

      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uT, runTime);
      gl!.uniform1f(uMode, noiseModeSmooth);
      gl!.uniform2f(uC, smoothX, canvas!.height - smoothY);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('accent-change', onAccentChange);
      window.removeEventListener('noise-mode', onNoiseMode);
    };
  }, []);

  return <canvas ref={canvasRef} className="noise-bg" />;
}
