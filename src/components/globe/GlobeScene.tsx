import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { mockFlights } from "@/data/mission";
import { latLngToVector3 } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

function greatCircleArc(a: [number, number, number], b: [number, number, number], height = 0.35) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(1 + height);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(48).map((p) => [p.x, p.y, p.z] as [number, number, number]);
}

function Earth() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.02;
  });
  return (
    <group ref={groupRef}>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#0E141D"
          emissive="#0A2A2C"
          emissiveIntensity={0.35}
          roughness={0.85}
          metalness={0.1}
        />
      </Sphere>
      {/* lat/long wire shell for a technical, instrument look */}
      <Sphere args={[1.002, 24, 16]}>
        <meshBasicMaterial color="#2FC2F0" wireframe transparent opacity={0.08} />
      </Sphere>
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      {/* Two layered shells rather than one — a tighter, brighter inner rim
          and a wider, softer outer halo — reads as genuine atmospheric
          scattering rather than a single flat glow sphere. */}
      <Sphere args={[1.035, 48, 48]}>
        <meshBasicMaterial color="#7FE8EE" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.09, 48, 48]}>
        <meshBasicMaterial color="#2FC2F0" transparent opacity={0.045} side={THREE.BackSide} />
      </Sphere>
    </>
  );
}

function FlightArcs() {
  const arcs = useMemo(
    () =>
      mockFlights.map((f) => ({
        id: f.id,
        color: STATUS_COLOR[f.status],
        points: greatCircleArc(
          latLngToVector3(f.originLat, f.originLng, 1.001),
          latLngToVector3(f.destLat, f.destLng, 1.001),
        ),
        originPoint: latLngToVector3(f.originLat, f.originLng, 1.01),
        destPoint: latLngToVector3(f.destLat, f.destLng, 1.01),
      })),
    [],
  );

  return (
    <group>
      {arcs.map((arc) => (
        <group key={arc.id}>
          <Line points={arc.points} color={arc.color} lineWidth={1.4} transparent opacity={0.75} />
          <mesh position={arc.originPoint}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color={arc.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={1.15} color="#EAF6F7" />
      {/* a dim, cool rim light from behind — a day/night terminator edge
          rather than one uniformly lit sphere */}
      <directionalLight position={[-4, -1, -3]} intensity={0.25} color="#3A5CFF" />
      <Stars radius={60} depth={30} count={2200} factor={1.4} saturation={0} fade speed={0.4} />
      <Earth />
      <Atmosphere />
      <FlightArcs />
    </>
  );
}
