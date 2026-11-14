"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { HeroState } from "./heroState";
import { LAMP } from "./lamp";

// Suspension en laiton modélisée en code (pas de fichier GLB) : abat-jour tourné (LatheGeometry),
// intérieur émissif, ampoule, halo, cône de lumière et poussière dans le faisceau.
// Caméra orthographique zoom 1 : 1 unité = 1 px CSS, ce qui aligne la lampe sur le halo CSS et le repli SVG.
// Tout ce qui bouge est lu dans `state` à chaque image (écrit par GSAP et par le glisser du pendule) :
// aucune animation ne passe par un re-rendu React.

type SceneProps = {
  /** État partagé, lu à chaque image (écrit par GSAP et par le glisser du pendule). */
  stateRef: React.RefObject<HeroState>;
  /** Intensité du variateur, 0 → 1 (lue via ref pour ne pas recréer la scène). */
  intensity: number;
  isMobile: boolean;
  running: boolean;
  /** Décalage horizontal de l'ampoule (px) dû au balancement, pour la lumière CSS du titre. */
  onSwing: (offsetPx: number) => void;
  onReady: () => void;
};

const BRASS = "#B98C45";
const OMEGA2 = 8.2; // (2π / période)², période ≈ 2,2 s
const DAMPING = 0.55;
const MAX_ANGLE = 0.65;

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Halo radial autour de l'ampoule : cœur flamme → braise → transparent.
const haloFragment = /* glsl */ `
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    vec3 color = mix(vec3(1.0, 0.72, 0.0), vec3(1.0, 0.42, 0.0), smoothstep(0.0, 0.35, d));
    gl_FragColor = vec4(color, pow(core, 2.2) * 0.55 * uIntensity);
  }
`;

// Cône de lumière : dense sous l'abat-jour, s'efface vers le sol.
const coneFragment = /* glsl */ `
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float fade = pow(vUv.y, 1.8);
    float edge = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 6.0);
    gl_FragColor = vec4(1.0, 0.78, 0.35, fade * edge * 0.11 * uIntensity);
  }
`;

// Poussière : chaque grain descend lentement dans le cône (position calculée dans le shader).
const dustVertex = /* glsl */ `
  attribute vec3 seed;
  uniform float uTime;
  uniform float uHeight;
  uniform float uTopRadius;
  uniform float uBottomRadius;
  uniform float uSize;
  varying float vFade;
  void main() {
    float t = fract(seed.x + uTime * (0.006 + seed.y * 0.01));
    float radius = mix(uTopRadius, uBottomRadius, t) * sqrt(seed.z) * 0.85;
    float phi = seed.y * 6.2831 + uTime * 0.05;
    vec3 p = vec3(cos(phi) * radius + sin(uTime * 0.4 + seed.z * 20.0) * 6.0, -t * uHeight, sin(phi) * radius);
    vFade = pow(1.0 - t, 1.3) * (0.55 + 0.45 * sin(uTime * 1.3 + seed.x * 40.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.6 + seed.z);
  }
`;

const dustFragment = /* glsl */ `
  uniform float uIntensity;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(1.0, 0.86, 0.55, a * vFade * 0.75 * uIntensity);
  }
`;

function shadeProfile(radius: number) {
  // Profil en cloche (x = rayon, y = hauteur au-dessus du bord), unités = rayon du bord.
  // Ordonné du bord vers le sommet : les normales de LatheGeometry pointent alors vers l'extérieur
  // (FrontSide = laiton extérieur, BackSide = intérieur éclairé).
  const points: [number, number][] = [
    [1.0, 0.0], [0.95, 0.1], [0.85, 0.3], [0.7, 0.54], [0.52, 0.76],
    [0.34, 0.93], [0.2, 1.02], [0.1, 1.08],
  ];
  return points.map(([x, y]) => new THREE.Vector2(x * radius, y * radius));
}

const FILAMENT = new THREE.Color(1, 0.32, 0.04);
const WARM = new THREE.Color(1, 0.9, 0.7);

function Lamp({ stateRef, intensity, isMobile, onSwing }: Omit<SceneProps, "onReady" | "running">) {
  const { size, viewport } = useThree();
  const swing = useRef<THREE.Group>(null);
  const cone = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.MeshBasicMaterial>(null);
  const inner = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const intensityRef = useRef(intensity);
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);
  const lastOffset = useRef(0);

  const anchor = isMobile ? LAMP.mobile : LAMP.desktop;
  const R = anchor.radius;
  const x = (anchor.x - 0.5) * size.width;
  const bulbY = (0.5 - anchor.y) * size.height;
  const top = size.height / 2;
  const rimY = bulbY - 0.14 * R;
  const cableLength = top - (rimY + 1.08 * R);
  const coneHeight = rimY + top; // jusqu'au bas du hero
  const pendulum = top - bulbY; // longueur du pendule (px)

  const shadeGeometry = useMemo(() => new THREE.LatheGeometry(shadeProfile(R), 72), [R]);

  const dust = useMemo(() => {
    const count = isMobile ? 45 : 110;
    const seeds = new Float32Array(count * 3);
    // Pseudo-aléatoire déterministe (rendu pur) : même nuage de poussière à chaque montage.
    for (let i = 0; i < seeds.length; i++) {
      const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      seeds[i] = v - Math.floor(v);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5); // positions calculées dans le shader
    return geometry;
  }, [isMobile]);

  // Valeurs initiales des uniforms ; modifiées ensuite à chaque image via les refs des matériaux.
  const initialUniforms = useMemo(
    () => ({
      halo: { uIntensity: { value: 0 } },
      cone: { uIntensity: { value: 0 } },
      dust: {
        uIntensity: { value: 0 },
        uTime: { value: 0 },
        uHeight: { value: 1 },
        uTopRadius: { value: 1 },
        uBottomRadius: { value: 1 },
        uSize: { value: 3 },
      },
    }),
    [],
  );
  const haloMaterial = useRef<THREE.ShaderMaterial>(null);
  const coneMaterial = useRef<THREE.ShaderMaterial>(null);
  const dustMaterial = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, camera }, delta) => {
    const state = stateRef.current;
    const dt = Math.min(delta, 1 / 30);
    const lit = intensityRef.current * state.ignite;

    // ── Pendule ─────────────────────────────────────────────
    if (state.dragTarget !== null) {
      const target = THREE.MathUtils.clamp(state.dragTarget, -MAX_ANGLE, MAX_ANGLE);
      state.velocity += ((target - state.angle) * 90 - state.velocity * 12) * dt;
    } else {
      state.velocity += (-OMEGA2 * Math.sin(state.angle) - DAMPING * state.velocity) * dt;
    }
    state.angle = THREE.MathUtils.clamp(state.angle + state.velocity * dt, -MAX_ANGLE, MAX_ANGLE);
    const idle = Math.sin(clock.elapsedTime * 0.5) * 0.012;

    if (swing.current) {
      swing.current.rotation.z = state.angle + idle;
      // La lampe défile plus lentement que la page : elle reste visible pendant que le faisceau s'élargit.
      swing.current.position.y = top - state.lift * size.height * 0.45;
    }
    const offset = Math.sin(state.angle + idle) * pendulum;
    if (Math.abs(offset - lastOffset.current) > 0.5) {
      lastOffset.current = offset;
      onSwing(offset);
    }

    // ── Lumière ─────────────────────────────────────────────
    if (bulb.current) {
      bulb.current.color
        .copy(FILAMENT)
        .multiplyScalar(state.filament * 1.4 * (1 - state.ignite))
        .add(WARM.clone().multiplyScalar(0.15 + 2.4 * lit));
    }
    if (inner.current) inner.current.emissiveIntensity = 0.04 + 0.85 * lit;
    if (light.current) light.current.intensity = 4 * lit;
    const halo = haloMaterial.current?.uniforms;
    const beam = coneMaterial.current?.uniforms;
    const dustU = dustMaterial.current?.uniforms;
    if (halo) halo.uIntensity.value = Math.max(lit, state.filament * 0.35 * (1 - state.ignite));
    if (beam) beam.uIntensity.value = lit * (1 + state.lift * 0.8);
    if (dustU) {
      dustU.uIntensity.value = lit;
      dustU.uTime.value = clock.elapsedTime;
      dustU.uHeight.value = coneHeight * 0.9;
      dustU.uTopRadius.value = 0.9 * R;
      dustU.uBottomRadius.value = 3.2 * R;
      dustU.uSize.value = (isMobile ? 2.2 : 3) * viewport.dpr;
    }
    if (cone.current) {
      const spread = 1 + state.lift * 1.3;
      cone.current.scale.set(spread, 1, spread);
    }

    // ── Caméra : gros plan sur le filament → cadrage normal ──
    const ortho = camera as THREE.OrthographicCamera;
    const zoom = state.camZoom;
    const focusX = x * state.camFocus;
    const focusY = bulbY * state.camFocus;
    if (ortho.zoom !== zoom || ortho.position.x !== focusX || ortho.position.y !== focusY) {
      ortho.zoom = zoom;
      ortho.position.x = focusX;
      ortho.position.y = focusY;
      ortho.updateProjectionMatrix();
    }
  });

  return (
    <group position={[x, top, 0]} ref={swing}>
      {/* Câble (prolongé au-dessus du hero pour la remontée au scroll) */}
      <mesh position={[0, -cableLength / 2 + size.height * 0.25, 0]}>
        <cylinderGeometry args={[1.2, 1.2, cableLength + size.height * 0.5, 8]} />
        <meshStandardMaterial color="#7A6038" roughness={0.6} />
      </mesh>

      <group position={[0, rimY - top, 0]} rotation={[-0.22, 0, 0]}>
        {/* Douille */}
        <mesh position={[0, 1.12 * R, 0]}>
          <cylinderGeometry args={[0.1 * R, 0.12 * R, 0.14 * R, 32]} />
          <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Abat-jour : extérieur laiton */}
        <mesh geometry={shadeGeometry}>
          <meshStandardMaterial color={BRASS} metalness={0.45} roughness={0.38} side={THREE.FrontSide} />
        </mesh>
        {/* Abat-jour : intérieur éclairé par l'ampoule */}
        <mesh geometry={shadeGeometry}>
          <meshStandardMaterial
            ref={inner}
            color="#3A2A12"
            emissive="#FF9A1F"
            emissiveIntensity={0}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
        {/* Ampoule */}
        <mesh position={[0, 0.14 * R, 0]}>
          <sphereGeometry args={[0.17 * R, 32, 16]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
        <pointLight ref={light} position={[0, 0.1 * R, 0.2 * R]} color="#FFB866" intensity={0} distance={0} decay={0} />
        {/* Cône de lumière */}
        <mesh ref={cone} position={[0, -coneHeight / 2, 0]}>
          <cylinderGeometry args={[0.95 * R, 3.4 * R, coneHeight, 64, 1, true]} />
          <shaderMaterial
            ref={coneMaterial}
            uniforms={initialUniforms.cone}
            vertexShader={glowVertex}
            fragmentShader={coneFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Poussière dans le faisceau */}
        <points geometry={dust} position={[0, -0.05 * R, 0]}>
          <shaderMaterial
            ref={dustMaterial}
            uniforms={initialUniforms.dust}
            vertexShader={dustVertex}
            fragmentShader={dustFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Halo autour de l'ampoule (face caméra) */}
      <mesh position={[0, bulbY - top, 50]}>
        <planeGeometry args={[5.5 * R, 5.5 * R]} />
        <shaderMaterial
          ref={haloMaterial}
          uniforms={initialUniforms.halo}
          vertexShader={glowVertex}
          fragmentShader={haloFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <hemisphereLight args={["#FFE3B0", "#2A1C0C", 1.1]} />
      <directionalLight position={[-500, 300, 700]} color="#FFE8C2" intensity={2.6} />
    </group>
  );
}

export default function HeroScene({ running, onReady, ...props }: SceneProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1000], zoom: 1, near: 1, far: 4000 }}
      dpr={[1, props.isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={running ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        onReady();
      }}
      aria-hidden="true"
    >
      <Lamp {...props} />
    </Canvas>
  );
}
