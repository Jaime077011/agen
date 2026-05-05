'use client';
import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
precision mediump float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision mediump float;
out vec4 fragColor;
#define PI 3.14159265358979323846
uniform float width;
uniform float height;
uniform float time;
uniform float scale;
uniform vec2  cursor;
uniform float revealRadius;
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
  vec2 res = vec2(width, height);
  vec2 uv  = (gl_FragCoord.xy - res * 0.5) / min(res.x, res.y);

  float n = (snoise(vec3(uv * scale, time)) + 1.0) / 2.0;
  n = 15.0 * n;
  vec3  hue       = hueTb[int(floor(n))];
  float intensity = (1.0 - cos(n * 2.0 * PI)) * 0.5;

  // Torch reveal — smooth radial falloff around cursor
  // gl_FragCoord.y is flipped vs browser coords, so cursor.y is pre-flipped on JS side
  float dist   = length(gl_FragCoord.xy - cursor);
  float reveal = smoothstep(revealRadius, revealRadius * 0.05, dist);
  // Soft outer glow beyond the hard edge
  float glow   = smoothstep(revealRadius * 2.2, 0.0, dist) * 0.12;

  float alpha = intensity * reveal * 0.80 + glow * 0.5;
  fragColor = vec4(hue * (reveal * 0.80 + glow), alpha);
}
`;

// Red palette: 15 shades from near-black → accent red (#c41230 = 0.769, 0.071, 0.188)
const HUE_TB = (() => {
  const out: number[] = [];
  for (let k = 0; k < 15; k++) {
    const t = k / 14;
    out.push(t * 0.769, t * 0.071, t * 0.188);
  }
  return new Float32Array(out);
})();

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    let animId: number;
    let runTime = 0;
    let prevT     = performance.now();

    // Cursor tracking with lerp for smooth reveal movement
    let targetX = window.innerWidth  / 2;
    let targetY = window.innerHeight / 2;
    let smoothX = targetX;
    let smoothY = targetY;

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove);

    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 8, 0);

    const uW  = gl.getUniformLocation(prog, 'width');
    const uH  = gl.getUniformLocation(prog, 'height');
    const uT  = gl.getUniformLocation(prog, 'time');
    const uS  = gl.getUniformLocation(prog, 'scale');
    const uC  = gl.getUniformLocation(prog, 'cursor');
    const uR  = gl.getUniformLocation(prog, 'revealRadius');
    const uHue = gl.getUniformLocation(prog, 'hueTb');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform1f(uW, canvas!.width);
      gl!.uniform1f(uH, canvas!.height);
    }

    resize();
    gl.uniform1f(uS, 3.0);
    gl.uniform1f(uR, 220.0);
    gl.uniform3fv(uHue, HUE_TB);

    window.addEventListener('resize', resize);

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function draw() {
      const now = performance.now();
      runTime += Math.min(now - prevT, 100) * 0.00028;
      prevT = now;

      // Smooth cursor follow
      smoothX = lerp(smoothX, targetX, 0.08);
      smoothY = lerp(smoothY, targetY, 0.08);

      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uT, runTime);
      // Flip Y: WebGL origin is bottom-left, browser is top-left
      gl!.uniform2f(uC, smoothX, canvas!.height - smoothY);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="noise-bg" />;
}
