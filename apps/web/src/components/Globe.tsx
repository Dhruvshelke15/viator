import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      lines.push(
        <mesh key={`lon-${i}`} rotation={[0, angle, 0]}>
          <torusGeometry args={[2.01, 0.003, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </mesh>
      );
    }

    for (let i = 1; i < 6; i++) {
      const radius = Math.sin((i / 6) * Math.PI) * 2.01;
      const y = Math.cos((i / 6) * Math.PI) * 2.01;
      lines.push(
        <mesh key={`lat-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.003, radius + 0.003, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      );
    }

    return lines;
  }, []);

  const dots = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 800;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = 2.02 * Math.cos(theta) * Math.sin(phi);
      const y = 2.02 * Math.sin(theta) * Math.sin(phi);
      const z = 2.02 * Math.cos(phi);
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#0a1128"
          transparent
          opacity={0.9}
          shininess={5}
        />
      </Sphere>

      <Sphere args={[2.005, 64, 64]} ref={glowRef}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.03}
          wireframe
        />
      </Sphere>

      {gridLines}

      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
      ))}

      <TripMarker lat={64.14} lng={-21.93} color="#f59e0b" />
      <TripMarker lat={48.86} lng={2.35} color="#818cf8" />
      <TripMarker lat={35.68} lng={139.69} color="#34d399" />
      <TripMarker lat={-33.87} lng={151.21} color="#f87171" />
      <TripMarker lat={40.71} lng={-74.01} color="#38bdf8" />
    </group>
  );
}

function TripMarker({ lat, lng, color }: { lat: number; lng: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(2.05) * Math.sin(phi) * Math.cos(theta);
    const y = (2.05) * Math.cos(phi);
    const z = (2.05) * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }, [lat, lng]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function Particles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#38bdf8" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export function Globe() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} color="#38bdf8" />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#f59e0b" />
        <GlobeMesh />
        <Particles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  );
}
