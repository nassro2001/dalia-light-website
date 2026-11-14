"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { ProductScene } from "@/lib/catalog/types";

// Mise en situation : la photo détourée du luminaire est suspendue au-dessus d'une table, dans une salle à manger
// modélisée en code (unités : mètres). La lumière est réelle : un spot part de l'ampoule, éclaire la table et projette
// les ombres ; une lumière ponctuelle éclaire le plafond. Le visiteur change d'angle à la souris ou au doigt.

export type Pointer = { x: number; y: number };

const CEILING = 2.7;
const HOTEL_CEILING = 3.4; // hall d'hôtel : plafond plus haut
const TABLE_Y = 0.75;
const BULB_Y = 1.55; // par défaut : 80 cm au-dessus de la table, la hauteur conseillée
// Cadrages : une suspension est vue de près ; un lustre, plus grand et plus haut, avec du recul.
const VIEWS = {
  suspension: {
    camera: new THREE.Vector3(0, 1.3, 2.25),
    lookAt: new THREE.Vector3(0, 1.22, 0),
  },
  lustre: {
    camera: new THREE.Vector3(0, 1.4, 2.6),
    lookAt: new THREE.Vector3(0, 1.72, 0),
  },
  // Salon : plus de recul, pour voir le lustre, la table basse, le canapé et les fauteuils.
  salon: {
    camera: new THREE.Vector3(0, 1.45, 3.5),
    lookAt: new THREE.Vector3(0, 1.4, -0.4),
  },
  // Hall d'hôtel : grand recul, regard levé vers le plafond haut.
  hotel: {
    camera: new THREE.Vector3(0, 1.45, 4.5),
    lookAt: new THREE.Vector3(0, 1.95, -0.8),
  },
  // Lustre fixé au plafond (salon) : le regard monte pour le dégager du titre.
  salonPlafond: {
    camera: new THREE.Vector3(0, 1.4, 3.5),
    lookAt: new THREE.Vector3(0, 1.8, -0.4),
  },
};

function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,244,214,1)");
  g.addColorStop(0.15, "rgba(255,196,80,0.75)");
  g.addColorStop(0.45, "rgba(255,120,20,0.18)");
  g.addColorStop(1, "rgba(255,106,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const beamFragment = /* glsl */ `
  uniform float uI;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float edge = pow(abs(dot(vNormal, vView)), 2.0);
    float fall = pow(vUv.y, 1.6);
    gl_FragColor = vec4(vec3(1.0, 0.72, 0.32), fall * edge * 0.09 * uI);
  }
`;

function Lamp({ scene, intensity, ceiling }: { scene: ProductScene; intensity: number; ceiling: number }) {
  const texture = useLoader(THREE.TextureLoader, scene.cutout);
  const photoRef = useRef<THREE.Group>(null);
  const photoMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowsRef = useRef<THREE.Group>(null);
  const beamMat = useRef<THREE.ShaderMaterial>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const glow = useMemo(() => glowTexture(), []);
  const beamUniforms = useMemo(() => ({ uI: { value: 1 } }), []);

  // Couleurs de la photo : espace sRGB (sinon elle paraît délavée).
  useEffect(() => {
    const map = photoMat.current?.map;
    if (!map) return;
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    map.needsUpdate = true;
  }, [texture]);

  // Le spot vise le centre de la table, juste en dessous.
  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    spot.target.position.set(0, 0, 0);
    spot.target.updateMatrixWorld();
  }, []);

  const lustre = scene.kind === "lustre";
  const flush = scene.mount === "plafond";
  const width = scene.widthM;
  const height = width / scene.aspect;
  // Fixé au plafond : le haut de l'image touche le plafond (2 mm d'écart pour éviter le scintillement).
  const bulbY = flush ? ceiling - 0.002 - scene.bulb[1] * height : (scene.bulbHeightM ?? BULB_Y);
  // L'image est placée pour que son cœur lumineux (scene.bulb) coïncide avec la source de lumière 3D.
  const centerY = bulbY + (scene.bulb[1] - 0.5) * height;
  const centerX = -(scene.bulb[0] - 0.5) * width;
  const top = centerY + height / 2;
  const i = intensity / 100;
  const beamHeight = bulbY - TABLE_Y;
  const beamRadius = Math.tan(scene.beamAngle) * beamHeight;
  // Halos : une par ampoule (lustre) ou une seule (suspension), en coordonnées locales du plan de la photo.
  const glowPoints = (scene.bulbs ?? [scene.bulb]).map(
    ([bx, by]) => [(bx - scene.bulb[0]) * width, (scene.bulb[1] - by) * height] as const,
  );
  const chain = scene.cord === "chaine";
  const hookXs = (scene.hooks ?? [scene.bulb[0]]).map((hx) => (hx - scene.bulb[0]) * width);

  useFrame(({ camera }) => {
    // La photo fait toujours face au visiteur (rotation autour de l'axe vertical seulement).
    if (photoRef.current) photoRef.current.rotation.y = Math.atan2(camera.position.x, camera.position.z);
    // Photo d'un lustre déjà allumé : on l'assombrit davantage quand on baisse le variateur.
    if (photoMat.current) {
      const level = lustre ? 0.3 + 0.7 * i : 0.5 + 0.5 * i;
      // LED photographiée éteinte : blanc froid → blanc chaud quand on monte le variateur.
      if (scene.led) photoMat.current.color.setRGB(level, level * (1 - 0.1 * i), level * (1 - 0.28 * i));
      else photoMat.current.color.setScalar(level);
    }
    for (const child of glowsRef.current?.children ?? []) {
      const sprite = child as THREE.Sprite;
      const size = lustre ? 0.05 + 0.1 * i : 0.12 + 0.32 * i;
      sprite.scale.set(size, size, 1);
      sprite.material.opacity = Math.min(1, i * (lustre ? 0.9 : 1.4));
    }
    if (beamMat.current) beamMat.current.uniforms.uI.value = i;
  });

  return (
    <group>
      <group ref={photoRef} position={[0, bulbY, 0]}>
        {/* Rosaces et suspentes jusqu'au plafond, une par point d'accroche (la photo commence sous la rosace).
            Dans le groupe qui suit le regard : elles restent alignées sur les crochets de la photo. */}
        {!flush &&
          hookXs.map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh position={[0, ceiling - 0.015 - bulbY, 0]}>
                <cylinderGeometry args={[chain ? 0.07 : 0.055, chain ? 0.07 : 0.055, 0.03, 32]} />
                <meshStandardMaterial
                  color={chain ? "#8A6A30" : "#141210"}
                  roughness={0.4}
                  metalness={chain ? 0.6 : 0.3}
                />
              </mesh>
              <mesh position={[0, (ceiling + top) / 2 - bulbY, 0]}>
                <cylinderGeometry args={[chain ? 0.007 : 0.003, chain ? 0.007 : 0.003, ceiling - top, 6]} />
                <meshStandardMaterial
                  color={chain ? "#7A5A22" : "#0d0c0b"}
                  roughness={0.5}
                  metalness={chain ? 0.5 : 0}
                />
              </mesh>
            </group>
          ))}
        <mesh position={[centerX, centerY - bulbY, 0]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial ref={photoMat} map={texture} transparent alphaTest={0.02} toneMapped={false} />
        </mesh>
        <group ref={glowsRef}>
          {glowPoints.map(([x, y]) => (
            <sprite key={`${x}${y}`} position={[x, y, 0.01]}>
              <spriteMaterial
                map={glow}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </sprite>
          ))}
        </group>
      </group>

      {/* Faisceau visible sous l'abat-jour (suspension seulement : un lustre éclaire dans toutes les directions). */}
      {!lustre && (
        <mesh position={[0, bulbY - beamHeight / 2, 0]}>
          <coneGeometry args={[beamRadius, beamHeight, 48, 1, true]} />
          <shaderMaterial
            ref={beamMat}
            uniforms={beamUniforms}
            vertexShader={beamVertex}
            fragmentShader={beamFragment}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <spotLight
        ref={spotRef}
        position={[0, bulbY, 0]}
        angle={scene.beamAngle}
        penumbra={lustre ? 0.9 : 0.55}
        decay={2}
        intensity={(lustre ? 10 : 12) * i}
        color="#FFC680"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.1}
        shadow-camera-far={4}
      />
      {/* Lumière diffuse : faible pour un abat-jour (plafond, murs), forte pour un lustre. */}
      <pointLight
        position={[0, bulbY + (lustre ? -0.15 : 0.12), 0]}
        intensity={(lustre ? 4 : 2.6) * i}
        decay={2}
        color="#FFB45E"
        distance={8}
      />
    </group>
  );
}

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const wood = <meshStandardMaterial color="#3B2818" roughness={0.55} />;
  const legs: [number, number][] = [
    [-0.2, -0.2],
    [0.2, -0.2],
    [-0.2, 0.2],
    [0.2, 0.2],
  ];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.06, 0.46]} />
        <meshStandardMaterial color="#6E5A44" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, -0.21]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.56, 0.04]} />
        {wood}
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]} castShadow>
          <boxGeometry args={[0.035, 0.44, 0.035]} />
          {wood}
        </mesh>
      ))}
    </group>
  );
}

// Murs, sol, plafond, fenêtre de nuit et tableaux : communs à la salle à manger et au salon.
function RoomShell() {
  const wall = <meshStandardMaterial color="#B8A78F" roughness={0.95} />;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#4A3626" roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING, 0]}>
        <planeGeometry args={[7, 7]} />
        {wall}
      </mesh>
      <mesh position={[0, CEILING / 2, -2.6]} receiveShadow>
        <planeGeometry args={[7, CEILING]} />
        {wall}
      </mesh>
      <mesh position={[-3, CEILING / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7, CEILING]} />
        {wall}
      </mesh>
      <mesh position={[3, CEILING / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7, CEILING]} />
        {wall}
      </mesh>

      {/* Fenêtre de nuit (mur gauche) */}
      <mesh position={[-2.99, 1.45, -0.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 1.7]} />
        <meshBasicMaterial color="#1B2533" />
      </mesh>

      {/* Deux tableaux de part et d'autre, pour laisser le luminaire se détacher sur le mur. */}
      {[-1.15, 1.15].map((x, index) => (
        <group key={x} position={[x, 1.55, -2.58]}>
          <mesh>
            <boxGeometry args={[0.62, 0.8, 0.03]} />
            <meshStandardMaterial color="#1A1510" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.52, 0.7]} />
            <meshStandardMaterial color={index === 0 ? "#9C6B3C" : "#5E6B5A"} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DiningRoom() {
  const tableLegs: [number, number][] = [
    [-0.82, -0.38],
    [0.82, -0.38],
    [-0.82, 0.38],
    [0.82, 0.38],
  ];
  const plates: [number, number][] = [
    [-0.45, -0.22],
    [0.45, -0.22],
    [-0.45, 0.22],
    [0.45, 0.22],
  ];
  return (
    <group>
      {/* Table en noyer, assiettes, vase */}
      <mesh position={[0, TABLE_Y - 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.05, 0.95]} />
        <meshStandardMaterial color="#5C3B22" roughness={0.38} />
      </mesh>
      {tableLegs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (TABLE_Y - 0.05) / 2, z]} castShadow>
          <boxGeometry args={[0.07, TABLE_Y - 0.05, 0.07]} />
          <meshStandardMaterial color="#4A2F1B" roughness={0.45} />
        </mesh>
      ))}
      {plates.map(([x, z]) => (
        <mesh key={`p${x}${z}`} position={[x, TABLE_Y + 0.008, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.11, 0.016, 40]} />
          <meshStandardMaterial color="#EFE8DC" roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.08, TABLE_Y + 0.09, 0.05]} castShadow>
        <cylinderGeometry args={[0.035, 0.06, 0.18, 32]} />
        <meshStandardMaterial color="#D9CCB4" roughness={0.5} />
      </mesh>

      {/* Chaises : deux derrière la table, une à chaque bout */}
      <Chair position={[-0.45, 0, -0.68]} />
      <Chair position={[0.45, 0, -0.68]} />
      <Chair position={[-1.18, 0, 0]} rotation={Math.PI / 2} />
      <Chair position={[1.18, 0, 0]} rotation={-Math.PI / 2} />

      {/* Buffet sur le mur du fond */}
      <mesh position={[0, 0.42, -2.35]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.84, 0.45]} />
        <meshStandardMaterial color="#2C2119" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Armchair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const leather = <meshStandardMaterial color="#7A4A2A" roughness={0.55} />;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.3, 0.8]} />
        {leather}
      </mesh>
      <mesh position={[0, 0.42, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.66]} />
        <meshStandardMaterial color="#86553A" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, -0.33]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.62, 0.14]} />
        {leather}
      </mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.24, 0.76]} />
          {leather}
        </mesh>
      ))}
    </group>
  );
}

function LivingRoom() {
  const fabric = <meshStandardMaterial color="#D3C4AA" roughness={0.95} />;
  return (
    <group>
      {/* Tapis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -0.35]} receiveShadow>
        <planeGeometry args={[3.2, 2.3]} />
        <meshStandardMaterial color="#6E4E3C" roughness={1} />
      </mesh>

      {/* Canapé trois places contre le mur du fond */}
      <group position={[0, 0, -2.05]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.3, 0.95]} />
          {fabric}
        </mesh>
        {[-0.72, 0, 0.72].map((x) => (
          <mesh key={x} position={[x, 0.43, 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.12, 0.72]} />
            <meshStandardMaterial color="#DCCEB5" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, 0.62, -0.38]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.6, 0.2]} />
          {fabric}
        </mesh>
        {[-1.07, 1.07].map((x) => (
          <mesh key={x} position={[x, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.42, 0.95]} />
            {fabric}
          </mesh>
        ))}
        {/* Coussins */}
        {[-0.8, 0.8].map((x) => (
          <mesh key={`c${x}`} position={[x, 0.66, -0.2]} rotation={[-0.2, 0, x > 0 ? -0.15 : 0.15]} castShadow>
            <boxGeometry args={[0.42, 0.4, 0.12]} />
            <meshStandardMaterial color="#9C6B3C" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Table basse ronde : plateau marbre, pied laiton */}
      <mesh position={[0, 0.4, -0.35]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 64]} />
        <meshStandardMaterial color="#E9E2D6" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.19, -0.35]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 0.38, 48]} />
        <meshStandardMaterial color="#8A6A30" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* Livres et bougie sur la table basse */}
      <mesh position={[-0.15, 0.445, -0.3]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.22]} />
        <meshStandardMaterial color="#2F3B33" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.47, -0.42]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 24]} />
        <meshStandardMaterial color="#EFE8DC" roughness={0.6} />
      </mesh>

      {/* Deux fauteuils tournés vers la table basse */}
      <Armchair position={[-1.55, 0, -0.2]} rotation={Math.PI / 2 - 0.35} />
      <Armchair position={[1.55, 0, -0.2]} rotation={-Math.PI / 2 + 0.35} />
    </group>
  );
}

// Hall d'hôtel : plafond haut, sol en marbre clair, mur du fond en tasseaux de noyer, comptoir de réception
// rétroéclairé, coin salon (table basse ronde, deux fauteuils, tapis), appliques et grands végétaux.
function HotelLobby() {
  const h = HOTEL_CEILING;
  const slats = Array.from({ length: 33 }, (_, index) => -2.24 + index * 0.14);
  const stone = <meshStandardMaterial color="#A8977E" roughness={0.9} />;
  const brass = <meshStandardMaterial color="#B08A3E" roughness={0.3} metalness={0.7} />;
  return (
    <group>
      {/* Sol en marbre clair, plafond, murs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#CFC3B0" roughness={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#BFB3A2" roughness={0.95} />
      </mesh>
      <mesh position={[0, h / 2, -3.2]} receiveShadow>
        <planeGeometry args={[9, h]} />
        <meshStandardMaterial color="#4A3A2C" roughness={0.9} />
      </mesh>
      <mesh position={[-4, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[9, h]} />
        {stone}
      </mesh>
      <mesh position={[4, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[9, h]} />
        {stone}
      </mesh>

      {/* Tasseaux de noyer, du sol au plafond, derrière la réception */}
      {slats.map((x) => (
        <mesh key={x} position={[x, h / 2, -3.17]} castShadow receiveShadow>
          <boxGeometry args={[0.06, h, 0.05]} />
          <meshStandardMaterial color="#8A6040" roughness={0.55} />
        </mesh>
      ))}

      {/* Comptoir de réception : façade marbre, bandeau laiton, plateau sombre, filet lumineux */}
      <group position={[0, 0, -2.45]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.1, 0.7]} />
          <meshStandardMaterial color="#E8E0D2" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.95, 0.356]}>
          <boxGeometry args={[3.0, 0.04, 0.01]} />
          {brass}
        </mesh>
        <mesh position={[0, 1.125, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.1, 0.05, 0.78]} />
          <meshStandardMaterial color="#1E1813" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.03, 0.37]}>
          <boxGeometry args={[2.9, 0.015, 0.01]} />
          <meshBasicMaterial color="#FFC778" toneMapped={false} />
        </mesh>
      </group>

      {/* Lumière rasante sur les tasseaux et la réception (spots encastrés au plafond, invisibles) */}
      {[-1.4, 1.4].map((x) => (
        <pointLight key={x} position={[x, h - 0.3, -2.75]} intensity={3.2} decay={2} distance={4.5} color="#FFC680" />
      ))}

      {/* Appliques verticales de part et d'autre */}
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 1.9, -3.14]}>
          <mesh>
            <boxGeometry args={[0.1, 0.95, 0.04]} />
            <meshBasicMaterial color="#FFD9A0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0, 0.25]} intensity={0.7} decay={2} distance={3} color="#FFC680" />
        </group>
      ))}

      {/* Coin salon : tapis rond, table basse ronde, deux fauteuils face à face */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} receiveShadow>
        <circleGeometry args={[1.7, 64]} />
        <meshStandardMaterial color="#3B2A20" roughness={1} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 64]} />
        <meshStandardMaterial color="#E9E2D6" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.19, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.32, 0.38, 48]} />
        {brass}
      </mesh>
      <mesh position={[0.12, 0.47, 0.08]} castShadow>
        <cylinderGeometry args={[0.07, 0.05, 0.1, 32]} />
        <meshStandardMaterial color="#2F3B33" roughness={0.6} />
      </mesh>
      <Armchair position={[-1.3, 0, 0]} rotation={Math.PI / 2} />
      <Armchair position={[1.3, 0, 0]} rotation={-Math.PI / 2} />

      {/* Grands végétaux en pot dans les angles du fond */}
      {[-3.3, 3.3].map((x) => (
        <group key={x} position={[x, 0, -2.6]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.22, 0.7, 32]} />
            <meshStandardMaterial color="#1E1813" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <coneGeometry args={[0.38, 1.8, 24]} />
            <meshStandardMaterial color="#456E4E" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CameraRig({
  pointer,
  view,
  lift = 0,
}: {
  pointer: RefObject<Pointer>;
  view: (typeof VIEWS)["suspension"];
  lift?: number;
}) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => view.lookAt.clone().setY(view.lookAt.y + lift), [view, lift]);
  useFrame(({ camera }, delta) => {
    const p = pointer.current;
    const base = view.camera;
    target.set(base.x + p.x * 1.1, base.y - p.y * 0.35, base.z - Math.abs(p.x) * 0.2);
    camera.position.lerp(target, 1 - Math.exp(-delta * 4));
    camera.lookAt(look);
  });
  return null;
}

export default function RoomScene({
  scene,
  intensity,
  pointer,
  isMobile,
}: {
  scene: ProductScene;
  intensity: number;
  pointer: RefObject<Pointer>;
  isMobile: boolean;
}) {
  const view =
    scene.room === "hotel"
      ? VIEWS.hotel
      : scene.room === "salon"
      ? scene.mount === "plafond"
        ? VIEWS.salonPlafond
        : VIEWS.salon
      : VIEWS[scene.kind ?? "suspension"];
  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{
        position: view.camera.toArray(),
        fov: isMobile ? 62 : 46,
        near: 0.05,
        far: 20,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
      }}
    >
      <color attach="background" args={["#0B0907"]} />
      {/* Nuit : un soupçon de lumière ambiante froide, pour lire la pièce quand la lampe est baissée. */}
      <hemisphereLight args={["#5A5048", "#1E1710", 0.35]} />
      {scene.room === "hotel" ? (
        <HotelLobby />
      ) : (
        <>
          <RoomShell />
          {scene.room === "salon" ? <LivingRoom /> : <DiningRoom />}
        </>
      )}
      <Lamp scene={scene} intensity={intensity} ceiling={scene.room === "hotel" ? HOTEL_CEILING : CEILING} />
      <CameraRig pointer={pointer} view={view} lift={scene.viewLift} />
    </Canvas>
  );
}
