"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// 🌧️ FRAGMENT SHADER: escena melancólica, reflejos en charcos, tonos grises y azules
const FRAG = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_brightness;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(23.43, 54.23))) * 12345.123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for(int i=0; i<5; i++) {
    v += a * noise(p);
    p *= 2.2;
    a *= 0.45;
  }
  return v;
}

// paleta gris azul fría
vec3 palette(float t) {
  vec3 dark = vec3(0.03, 0.05, 0.08);
  vec3 blue = vec3(0.05, 0.12, 0.25);
  vec3 cobalt = vec3(0.1, 0.25, 0.45);
  return mix(dark, mix(blue, cobalt, t), t);
}

// textura base de humedad / charcos
float puddleMask(vec2 uv) {
  return smoothstep(0.55, 0.7, fbm(uv * 1.5 + vec2(0.0, u_time * 0.05)));
}

// reflejos simulados de cielo/luces
vec3 reflections(vec2 uv) {
  vec2 ruv = vec2(uv.x, -uv.y);
  vec2 ripple = ruv + 0.02 * sin(uv.yx * 15.0 + u_time * 2.0);
  float rf = fbm(ripple * 4.0 + vec2(0.0, u_time * 0.2));
  return palette(0.4 + rf * 0.6);
}

// líneas verticales de lluvia
float rain(vec2 uv) {
  uv.y += u_time * 4.0;
  float drops = fract(sin(uv.y * 120.0 + uv.x * 20.0) * 34543.345);
  return smoothstep(0.95, 1.0, drops);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.1;
  float f = fbm(uv * 2.0 + vec2(t, t * 0.4));
  vec3 base = palette(f);

  float puddle = puddleMask(uv);
  vec3 refl = reflections(uv);
  vec3 wet = mix(base, refl, puddle);

  float gloss = pow(fbm(uv * 10.0 + vec2(u_time * 0.5)), 6.0) * puddle;
  wet += vec3(0.4, 0.6, 1.0) * gloss * 0.5;

  float rainFx = rain(uv * 0.8);
  wet += vec3(0.1, 0.15, 0.25) * rainFx * 0.3;

  float vign = smoothstep(1.2, 0.3, length(uv));
  wet *= mix(0.55, 1.2, vign);

  wet = pow(wet * u_brightness, vec3(0.9));

  gl_FragColor = vec4(wet, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
  }
  return sh;
}

export default function CyberpunkRainScene({ onReady }: { onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uBright = gl.getUniformLocation(program, "u_brightness");

    const brightness = { v: 1.0 };
    gsap.to(brightness, {
      v: 1.25,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

  const start = performance.now();
    let raf = 0;
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const t = (now - start) * 0.001;
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uBright, brightness.v);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    // 🔹 Disparar onReady cuando el efecto esté inicializado
    if (onReady) {
      setTimeout(() => onReady(), 1000);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-95"
      aria-hidden="true"
    />
  );
}
