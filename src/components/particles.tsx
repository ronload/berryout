"use client";

import { Camera, Geometry, Mesh, type OGLRenderingContext, Program, Renderer } from "ogl";
import { type RefObject, useEffect, useRef } from "react";

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];
const hashPrefix = /^#/;

const hexToRgb = (hex: string): [number, number, number] => {
  const digits = hex.replace(hashPrefix, "");
  const fullDigits =
    digits.length === 3
      ? digits
          .split("")
          .map((c) => c + c)
          .join("")
      : digits;
  const int = Number.parseInt(fullDigits, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

type SceneOptions = Required<Omit<ParticlesProps, "className" | "particleColors">> &
  Pick<ParticlesProps, "particleColors">;

interface Point {
  x: number;
  y: number;
}

function randomPointInUnitSphere(): [number, number, number] {
  let x: number;
  let y: number;
  let z: number;
  let len: number;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
    len = x * x + y * y + z * z;
  } while (len > 1 || len === 0);
  const r = Math.cbrt(Math.random());
  return [x * r, y * r, z * r];
}

function createGeometry(
  gl: OGLRenderingContext,
  count: number,
  particleColors: string[] | undefined,
): Geometry {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

  for (let i = 0; i < count; i++) {
    positions.set(randomPointInUnitSphere(), i * 3);
    randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    const hex = palette[Math.floor(Math.random() * palette.length)] ?? "#ffffff";
    colors.set(hexToRgb(hex), i * 3);
  }

  return new Geometry(gl, {
    position: { size: 3, data: positions },
    random: { size: 4, data: randoms },
    color: { size: 3, data: colors },
  });
}

function createProgram(
  gl: OGLRenderingContext,
  options: SceneOptions,
  time: { value: number },
): Program {
  return new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: time,
      uSpread: { value: options.particleSpread },
      uBaseSize: { value: options.particleBaseSize * options.pixelRatio },
      uSizeRandomness: { value: options.sizeRandomness },
      uAlphaParticles: { value: options.alphaParticles ? 1 : 0 },
    },
    transparent: true,
    depthTest: false,
  });
}

function updateTransform(particles: Mesh, mouse: Point, elapsed: number, options: SceneOptions) {
  if (options.moveParticlesOnHover) {
    particles.position.x = -mouse.x * options.particleHoverFactor;
    particles.position.y = -mouse.y * options.particleHoverFactor;
  } else {
    particles.position.x = 0;
    particles.position.y = 0;
  }

  if (!options.disableRotation) {
    particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
    particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
    particles.rotation.z += 0.01 * options.speed;
  }
}

function mountParticles(
  container: HTMLDivElement,
  mouseRef: RefObject<Point>,
  options: SceneOptions,
): () => void {
  const renderer = new Renderer({
    dpr: options.pixelRatio,
    depth: false,
    alpha: true,
  });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl, { fov: 15 });
  camera.position.set(0, 0, options.cameraDistance);

  const resize = () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  };
  window.addEventListener("resize", resize, false);
  resize();

  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current = { x, y };
  };

  if (options.moveParticlesOnHover) {
    container.addEventListener("mousemove", handleMouseMove);
  }

  const time = { value: 0 };
  const geometry = createGeometry(gl, options.particleCount, options.particleColors);
  const program = createProgram(gl, options, time);
  const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

  let animationFrameId = 0;
  let lastTime = performance.now();
  let elapsed = 0;

  const update = (t: number) => {
    animationFrameId = requestAnimationFrame(update);
    const delta = t - lastTime;
    lastTime = t;
    elapsed += delta * options.speed;
    time.value = elapsed * 0.001;
    updateTransform(particles, mouseRef.current, elapsed, options);
    renderer.render({ scene: particles, camera });
  };

  animationFrameId = requestAnimationFrame(update);

  return () => {
    window.removeEventListener("resize", resize);
    if (options.moveParticlesOnHover) {
      container.removeEventListener("mousemove", handleMouseMove);
    }
    cancelAnimationFrame(animationFrameId);
    if (container.contains(gl.canvas)) {
      container.removeChild(gl.canvas);
    }
  };
}

export function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    return mountParticles(container, mouseRef, {
      particleCount,
      particleSpread,
      speed,
      particleColors,
      moveParticlesOnHover,
      particleHoverFactor,
      alphaParticles,
      particleBaseSize,
      sizeRandomness,
      cameraDistance,
      disableRotation,
      pixelRatio,
    });
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio,
  ]);

  return <div ref={containerRef} className={className} />;
}
