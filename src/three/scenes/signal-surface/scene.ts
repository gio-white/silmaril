/**
 * Signal surface: a single displaced grid, viewed in slight perspective.
 *
 * One mesh, one draw call. Displacement lives in the vertex shader; the
 * fragment shader draws the hairlines and the rust threshold band with
 * fwidth anti-aliasing. The only per-frame CPU work is writing uTime.
 *
 * Reads its colours from CSS custom properties at init and again on theme
 * change, so the canvas and the page cannot drift apart.
 */

import {
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import type { SceneHandle } from '../../loader';
import { readPalette, toVec3 } from '../../palette';

const VERT = /* glsl */ `
uniform float uTime;
varying float vHeight;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 13.17;
    a *= 0.5;
  }
  return v;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float n = fbm(uv * vec2(3.4, 4.6) + vec2(0.15, uTime * 0.07));
  vHeight = n;
  pos.z += (n - 0.42) * 0.42;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uRust;
uniform float uThreshold;
varying float vHeight;
varying vec2 vUv;

void main() {
  vec2 cells = vUv * vec2(42.0, 28.0);
  vec2 grid = abs(fract(cells - 0.5) - 0.5) / max(fwidth(cells), vec2(1e-4));
  float line = 1.0 - min(min(grid.x, grid.y), 1.0);

  float above = smoothstep(uThreshold - 0.03, uThreshold + 0.03, vHeight);
  vec3 lineColor = mix(uInk, uRust, above);
  vec3 wash = mix(uPaper, mix(uPaper, uRust, 0.18), above);
  vec3 color = mix(wash, lineColor, line * mix(0.45, 0.85, above));
  gl_FragColor = vec4(color, 1.0);
}
`;

const THRESHOLD = 0.62;
const SEGMENTS = 96;

export function mount(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
    stencil: false,
    depth: true,
  });
  renderer.setClearColor(new Color(readPalette().paper), 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0.15, -1.55, 1.35);
  camera.lookAt(0, 0.05, 0);

  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uThreshold: { value: THRESHOLD },
      uPaper: { value: toVec3(readPalette().paper) },
      uInk: { value: toVec3(readPalette().ink) },
      uRust: { value: toVec3(readPalette().rustBright) },
    },
  });

  const mesh = new Mesh(new PlaneGeometry(2.4, 1.7, SEGMENTS, SEGMENTS), material);
  mesh.rotation.x = -Math.PI / 2.35;
  scene.add(mesh);

  const started = performance.now();
  let playing = false;
  let frame = 0;

  function resize(): void {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function applyPalette(): void {
    const palette = readPalette();
    material.uniforms.uPaper.value = toVec3(palette.paper);
    material.uniforms.uInk.value = toVec3(palette.ink);
    material.uniforms.uRust.value = toVec3(palette.rustBright);
    renderer.setClearColor(new Color(palette.paper), 1);
  }

  function tick(): void {
    if (!playing) return;
    material.uniforms.uTime.value = (performance.now() - started) / 1000;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  applyPalette();
  renderer.render(scene, camera);

  return {
    destroy() {
      playing = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
    setPlaying(next: boolean) {
      if (next === playing) return;
      playing = next;
      if (playing) {
        tick();
      } else {
        cancelAnimationFrame(frame);
      }
    },
    setPaletteFromDocument() {
      applyPalette();
      if (!playing) renderer.render(scene, camera);
    },
  };
}
