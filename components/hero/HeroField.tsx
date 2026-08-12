"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 150;
const ROWS = 90;
const HALF_W = 32;
const HALF_H = 19;

/**
 * A sheet of points in 3D that drifts on its own and pushes away from the
 * cursor. Displacement happens entirely in the vertex shader — the geometry is
 * uploaded once and never touched again, so the whole field costs one draw
 * call regardless of how hard the pointer is moved.
 */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uStrength;
  uniform float uSize;

  attribute float aRand;

  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Ambient drift: three low-frequency waves at incommensurate speeds, so
    // the surface never visibly loops.
    float wave =
        sin(p.x * 0.32 + uTime * 0.30) * 0.50
      + sin(p.y * 0.41 - uTime * 0.23) * 0.40
      + sin((p.x + p.y) * 0.17 + uTime * 0.15) * 0.55;
    p.z += wave;

    // Cursor ripple. The sheet lifts toward the viewer and slides outward.
    float d    = distance(p.xy, uPointer);
    float ring = exp(-d * d * 0.012);
    p.z  += ring * uStrength * 5.0;
    p.xy += normalize(p.xy - uPointer + 1e-4) * ring * uStrength * 1.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Dissolve at the edges so the field ends in nothing, not in a border.
    float edge = smoothstep(36.0, 13.0, length(position.xy));
    vAlpha = edge * (0.26 + ring * uStrength * 1.5) * (0.5 + aRand * 0.5);

    gl_PointSize = uSize * (0.55 + aRand * 0.9) * (34.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.01, d) * vAlpha;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`;

export function HeroField({ active }: { active: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointerWorld = useRef(new THREE.Vector2(0, 0));
  const strength = useRef(0);
  const { size } = useThree();

  const { positions, randoms } = useMemo(() => {
    const count = COLS * ROWS;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);

    for (let j = 0; j < ROWS; j += 1) {
      for (let i = 0; i < COLS; i += 1) {
        const index = j * COLS + i;
        pos[index * 3] = -HALF_W + (i / (COLS - 1)) * HALF_W * 2;
        pos[index * 3 + 1] = -HALF_H + (j / (ROWS - 1)) * HALF_H * 2;
        pos[index * 3 + 2] = 0;
        rnd[index] = Math.random();
      }
    }

    return { positions: pos, randoms: rnd };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: 0 },
      uSize: { value: 2.6 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const dt = Math.min(delta, 0.05);
    material.uniforms.uTime.value += dt;

    // Pointer arrives in NDC; project it onto the plane the points sit on.
    const targetX = state.pointer.x * HALF_W * 0.92;
    const targetY = state.pointer.y * HALF_H * 0.92;
    pointerWorld.current.x += (targetX - pointerWorld.current.x) * (1 - Math.pow(0.001, dt));
    pointerWorld.current.y += (targetY - pointerWorld.current.y) * (1 - Math.pow(0.001, dt));
    material.uniforms.uPointer.value.copy(pointerWorld.current);

    const targetStrength = active ? 1 : 0;
    strength.current += (targetStrength - strength.current) * (1 - Math.pow(0.02, dt));
    material.uniforms.uStrength.value = strength.current;

    // The field leans toward the cursor. The wordmark above it does not.
    if (groupRef.current) {
      const rx = -0.30 + state.pointer.y * 0.06;
      const ry = state.pointer.x * 0.09;
      groupRef.current.rotation.x += (rx - groupRef.current.rotation.x) * (1 - Math.pow(0.01, dt));
      groupRef.current.rotation.y += (ry - groupRef.current.rotation.y) * (1 - Math.pow(0.01, dt));
    }

    material.uniforms.uSize.value = size.width < 768 ? 1.9 : 2.6;
  });

  return (
    <group ref={groupRef} rotation={[-0.3, 0, 0]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-aRand" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
