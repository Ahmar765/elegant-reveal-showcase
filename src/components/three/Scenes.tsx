import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/* -------- Hero Chair: a stylised lounge chair built from primitives -------- */
function LoungeChair({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Auto-rotate
    group.current.rotation.y += delta * 0.18;
    // Subtle camera-angle response to mouse
    const targetX = mouse.current.y * 0.15;
    const targetTilt = mouse.current.x * 0.1;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.position.x += (targetTilt * 0.3 - group.current.position.x) * 0.05;
  });

  // Materials
  const leather = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#3a2a1f"),
        roughness: 0.55,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.6,
        sheen: 0.6,
        sheenColor: new THREE.Color("#c9a064"),
      }),
    []
  );
  const brass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c9a064"),
        roughness: 0.25,
        metalness: 1.0,
        clearcoat: 0.9,
      }),
    []
  );
  const walnut = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#2a1a10"),
        roughness: 0.45,
        metalness: 0.15,
        clearcoat: 0.5,
      }),
    []
  );

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={1.1}>
      {/* Seat cushion */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={leather}>
        <boxGeometry args={[1.7, 0.3, 1.4]} />
      </mesh>
      {/* Back cushion (tilted) */}
      <mesh position={[0, 1.1, -0.55]} rotation={[-0.18, 0, 0]} castShadow material={leather}>
        <boxGeometry args={[1.6, 1.2, 0.3]} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.95, 0.7, 0]} castShadow material={leather}>
        <boxGeometry args={[0.2, 0.55, 1.4]} />
      </mesh>
      <mesh position={[0.95, 0.7, 0]} castShadow material={leather}>
        <boxGeometry args={[0.2, 0.55, 1.4]} />
      </mesh>
      {/* Wooden base frame */}
      <mesh position={[0, 0.18, 0]} castShadow material={walnut}>
        <boxGeometry args={[1.8, 0.12, 1.5]} />
      </mesh>
      {/* Brass legs */}
      {[
        [-0.78, -0.15, 0.6],
        [0.78, -0.15, 0.6],
        [-0.78, -0.15, -0.6],
        [0.78, -0.15, -0.6],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow material={brass}>
          <cylinderGeometry args={[0.05, 0.04, 0.55, 16]} />
        </mesh>
      ))}
      {/* Decorative button-tufting dots on back */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = -0.6 + (i % 3) * 0.6;
        const y = 0.85 + Math.floor(i / 3) * 0.35;
        return (
          <mesh key={i} position={[x, y, -0.4]} material={brass}>
            <sphereGeometry args={[0.035, 16, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* -------- Cinematic spot that follows the cursor -------- */
function MouseSpot({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = mouse.current.x * 6;
    ref.current.position.y = 4 + mouse.current.y * 2;
  });
  return (
    <spotLight
      ref={ref}
      position={[0, 5, 4]}
      angle={0.55}
      penumbra={0.85}
      intensity={2.4}
      color="#f0d9a8"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
}

/* -------- Floating dust particles -------- */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 220;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = Math.random() * 6 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setY(i, y + 0.003 + Math.sin(state.clock.elapsedTime + i) * 0.0005);
      if (pos.getY(i) > 5) pos.setY(i, -1);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#e8c98a" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

interface HeroSceneProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export function HeroScene({ mouse }: HeroSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 5.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#0e0c0a"]} />
      <fog attach="fog" args={["#0e0c0a", 6, 14]} />

      <ambientLight intensity={0.15} color="#fff1d6" />
      <MouseSpot mouse={mouse} />
      <directionalLight position={[-4, 4, 2]} intensity={0.4} color="#c9a064" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <LoungeChair mouse={mouse} />
      </Float>

      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.65}
        scale={8}
        blur={2.4}
        far={3}
        color="#000000"
      />

      <Dust />
      <Environment preset="apartment" />
    </Canvas>
  );
}

/* -------- Small product viewer for gallery cards -------- */
function ProductMesh({ kind, hovered }: { kind: string; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (hovered ? 0.6 : 0.2);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, hovered ? 0.15 : 0, 0.08);
  });

  const goldMat = (
    <meshPhysicalMaterial color="#c9a064" metalness={1} roughness={0.25} clearcoat={0.8} />
  );
  const darkLeather = (
    <meshPhysicalMaterial color="#2a1f17" roughness={0.6} clearcoat={0.3} sheen={0.5} sheenColor="#c9a064" />
  );
  const ivoryFabric = (
    <meshPhysicalMaterial color="#e8d9bd" roughness={0.85} sheen={0.6} sheenColor="#fff" />
  );

  return (
    <group ref={ref} position={[0, 0, 0]} scale={0.9}>
      {kind === "sofa" && (
        <>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.4, 0.4, 0.9]} />
            {ivoryFabric}
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[2.4, 0.6, 0.3]} />
            {ivoryFabric}
          </mesh>
          <mesh position={[-1.1, 0.55, 0]}>
            <boxGeometry args={[0.2, 0.5, 0.9]} />
            {ivoryFabric}
          </mesh>
          <mesh position={[1.1, 0.55, 0]}>
            <boxGeometry args={[0.2, 0.5, 0.9]} />
            {ivoryFabric}
          </mesh>
          {[-1, -0.3, 0.3, 1].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.35]}>
              <cylinderGeometry args={[0.04, 0.03, 0.2, 12]} />
              {goldMat}
            </mesh>
          ))}
        </>
      )}
      {kind === "chair" && (
        <>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            {darkLeather}
          </mesh>
          <mesh position={[0, 0.8, -0.4]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.15]} />
            {darkLeather}
          </mesh>
          {[
            [-0.4, -0.05, 0.4],
            [0.4, -0.05, 0.4],
            [-0.4, -0.05, -0.4],
            [0.4, -0.05, -0.4],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <cylinderGeometry args={[0.035, 0.025, 0.7, 12]} />
              {goldMat}
            </mesh>
          ))}
        </>
      )}
      {kind === "table" && (
        <>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.08, 48]} />
            <meshPhysicalMaterial color="#e8e2d8" roughness={0.15} clearcoat={1} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.18, 0.6, 24]} />
            {goldMat}
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
            {goldMat}
          </mesh>
        </>
      )}
      {kind === "lamp" && (
        <>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.35, 0.4, 0.08, 32]} />
            {goldMat}
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.0, 16]} />
            {goldMat}
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <coneGeometry args={[0.45, 0.5, 32, 1, true]} />
            <meshPhysicalMaterial color="#f3e3bf" roughness={0.35} side={THREE.DoubleSide} emissive="#c9a064" emissiveIntensity={0.35} />
          </mesh>
          <pointLight position={[0, 0.7, 0]} intensity={0.5} color="#f0d9a8" distance={3} />
        </>
      )}
    </group>
  );
}

export function ProductViewer({ kind, hovered }: { kind: string; hovered: boolean }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [2.2, 1.8, 2.6], fov: 35 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.4} color="#fff1d6" />
      <spotLight position={[3, 5, 3]} intensity={1.6} angle={0.6} penumbra={1} color="#f0d9a8" />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#c9a064" />
      <ProductMesh kind={kind} hovered={hovered} />
      <ContactShadows position={[0, -0.45, 0]} opacity={0.55} scale={5} blur={2.6} far={2} color="#000" />
      <Environment preset="apartment" />
    </Canvas>
  );
}

/* -------- Configurator chair (color/material reactive) -------- */
export function ConfigChair({
  color,
  legColor,
  scale,
}: {
  color: string;
  legColor: string;
  scale: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.35;
  });
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [2.6, 1.6, 2.6], fov: 35 }} shadows>
      <ambientLight intensity={0.35} color="#fff1d6" />
      <spotLight position={[3, 5, 3]} intensity={1.8} angle={0.6} penumbra={1} color="#f0d9a8" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#c9a064" />
      <group ref={ref} scale={scale}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.95]} />
          <meshPhysicalMaterial color={color} roughness={0.55} clearcoat={0.5} sheen={0.6} sheenColor="#c9a064" />
        </mesh>
        <mesh position={[0, 0.85, -0.42]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.95, 1.0, 0.16]} />
          <meshPhysicalMaterial color={color} roughness={0.55} clearcoat={0.5} sheen={0.6} sheenColor="#c9a064" />
        </mesh>
        {[
          [-0.42, -0.05, 0.42],
          [0.42, -0.05, 0.42],
          [-0.42, -0.05, -0.42],
          [0.42, -0.05, -0.42],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.7, 16]} />
            <meshPhysicalMaterial color={legColor} metalness={1} roughness={0.3} clearcoat={0.8} />
          </mesh>
        ))}
      </group>
      <ContactShadows position={[0, -0.45, 0]} opacity={0.6} scale={5} blur={2.4} far={2} color="#000" />
      <Environment preset="apartment" />
    </Canvas>
  );
}

/* -------- Material orb (for craftsmanship cards) -------- */
export function MaterialOrb({ kind }: { kind: "leather" | "walnut" | "marble" | "metal" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 35 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.4} />
      <spotLight position={[3, 4, 3]} intensity={1.6} angle={0.6} penumbra={1} color="#f0d9a8" />
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        {kind === "leather" && (
          <meshPhysicalMaterial color="#3a2418" roughness={0.6} clearcoat={0.4} sheen={0.7} sheenColor="#c9a064" />
        )}
        {kind === "walnut" && (
          <meshPhysicalMaterial color="#3d2716" roughness={0.45} clearcoat={0.6} />
        )}
        {kind === "marble" && (
          <meshPhysicalMaterial color="#ece4d3" roughness={0.15} clearcoat={1} metalness={0.05} />
        )}
        {kind === "metal" && (
          <meshPhysicalMaterial color="#c9a064" roughness={0.2} metalness={1} clearcoat={0.9} />
        )}
      </mesh>
      <Environment preset="apartment" />
    </Canvas>
  );
}
