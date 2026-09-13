import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type AircraftKind = "A350-1000" | "A380-800" | "B777-300ER" | "A330-900";

// Per-type proportions — not a literal CAD reproduction of each aircraft
// (no licensed model data available), but a parametric silhouette that
// genuinely differs by type: fuselage length/radius, wingspan, tail size
// and engine count all vary, so an A380 reads as visibly larger and
// four-engined next to a twin-engined A330, rather than four identical
// "generic plane" placeholders wearing different labels.
const SPEC: Record<
  AircraftKind,
  { len: number; radius: number; wingspan: number; wingSweep: number; engines: number; tailH: number }
> = {
  "A350-1000": { len: 3.2, radius: 0.26, wingspan: 3.0, wingSweep: 0.55, engines: 2, tailH: 0.62 },
  "A380-800": { len: 3.7, radius: 0.4, wingspan: 3.6, wingSweep: 0.5, engines: 4, tailH: 0.78 },
  "B777-300ER": { len: 3.5, radius: 0.3, wingspan: 3.1, wingSweep: 0.5, engines: 2, tailH: 0.68 },
  "A330-900": { len: 2.9, radius: 0.27, wingspan: 2.7, wingSweep: 0.5, engines: 2, tailH: 0.58 },
};

interface Props {
  kind: AircraftKind;
  color: string;
  emissive?: string;
  hovered?: boolean;
  selected?: boolean;
}

/**
 * A parametric, stylized-but-proportionally-distinct aircraft built from
 * primitive geometry (capsule fuselage, tapered wing planes, tail fin,
 * podded engines) — not a licensed CAD model (none available here), but
 * genuinely varies by aircraft type rather than reusing one mesh for all
 * four, and now carries an actual livery: a neutral pearl-white fuselage
 * (real aircraft are not solid neon-coloured), a dark window band along the
 * cabin, and the status colour reserved for the tail and engine — the way
 * an actual airline livery concentrates colour rather than painting the
 * whole airframe one flat hue. Reacts to hover/selection with a lift and
 * brightness change, not with cursor changes — the cursor itself is
 * untouched.
 */
export function Aircraft3D({ kind, color, emissive = "#0A0A0A", hovered, selected }: Props) {
  const spec = SPEC[kind];
  const group = useRef<THREE.Group>(null);
  const targetY = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    targetY.current = hovered || selected ? 0.14 : 0;
    group.current.position.y += (targetY.current - group.current.position.y) * Math.min(1, delta * 6);
    const targetRotZ = hovered ? 0.05 : 0;
    group.current.rotation.z += (targetRotZ - group.current.rotation.z) * Math.min(1, delta * 6);
  });

  const fuselageMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color="#F1EFE9"
        emissive={emissive}
        emissiveIntensity={hovered || selected ? 0.12 : 0.04}
        roughness={0.28}
        metalness={0.55}
      />
    ),
    [emissive, hovered, selected],
  );

  const liveryMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered || selected ? 0.55 : 0.22}
        roughness={0.3}
        metalness={0.5}
      />
    ),
    [color, hovered, selected],
  );

  const engineOffsets = useMemo(() => {
    const offsets: number[] = [];
    const half = spec.engines / 2;
    for (let i = 0; i < half; i++) offsets.push(0.55 + i * 0.55);
    return offsets;
  }, [spec.engines]);

  return (
    <group ref={group}>
      {/* fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <capsuleGeometry args={[spec.radius, spec.len - spec.radius * 2, 8, 16]} />
        {fuselageMaterial}
      </mesh>

      {/* window band — a dark strip along the cabin, the single detail
          that reads "aircraft" rather than "capsule" at small scale */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, spec.radius * 0.35, 0]}>
        <cylinderGeometry
          args={[spec.radius * 1.002, spec.radius * 1.002, spec.len - spec.radius * 2.6, 16, 1, true, Math.PI * 0.62, Math.PI * 0.4]}
        />
        <meshStandardMaterial color="#12151A" roughness={0.2} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* cockpit taper hint */}
      <mesh position={[spec.len / 2 - 0.05, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[spec.radius * 0.92, 0.34, 16]} />
        {fuselageMaterial}
      </mesh>

      {/* wings — two tapered boxes swept back */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[-0.1, -0.02, side * (spec.wingspan / 4)]}
          rotation={[0, side * -0.18, 0]}
        >
          <boxGeometry args={[spec.wingSweep * 1.6, 0.045, spec.wingspan / 2]} />
          {fuselageMaterial}
        </mesh>
      ))}

      {/* tail fin — livery colour, the aircraft's single strongest accent */}
      <mesh position={[-spec.len / 2 + 0.32, spec.tailH / 2, 0]}>
        <boxGeometry args={[0.5, spec.tailH, 0.04]} />
        {liveryMaterial}
      </mesh>
      {/* horizontal stabilizers */}
      <mesh position={[-spec.len / 2 + 0.28, 0.06, 0]}>
        <boxGeometry args={[0.36, 0.035, spec.wingspan * 0.42]} />
        {fuselageMaterial}
      </mesh>

      {/* engines, count varies by type — livery-accented cowling */}
      {[-1, 1].flatMap((side) =>
        engineOffsets.map((off, i) => (
          <mesh
            key={`${side}-${i}`}
            position={[0.05, -spec.radius - 0.1, side * off]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.11, 0.11, 0.42, 12]} />
            {liveryMaterial}
          </mesh>
        )),
      )}

      {/* beacon light */}
      <mesh position={[-spec.len / 2 + 0.1, 0.05, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={selected ? "#FF5C4D" : "#2C968C"} />
      </mesh>
    </group>
  );
}
