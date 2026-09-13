import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { Aircraft3D, type AircraftKind } from "@/components/aircraft3d/Aircraft3D";
import type { MockFlight } from "@/data/mission";

const STATUS_COLOR: Record<string, string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

interface SceneProps {
  flights: MockFlight[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function Scene({ flights, selectedId, hoveredId, onHover, onSelect }: SceneProps) {
  // Each aircraft's own footprint (fuselage length ~2.9-3.7 units, wingspan
  // up to 3.6) used to be comparable to the total spread across all four,
  // which is why they interpenetrated into one fused shape. Scaling every
  // aircraft down uniformly and widening the per-aircraft spacing gives
  // each one a real, non-overlapping gap.
  const AIRCRAFT_SCALE = 0.62;
  const positions = useMemo(() => {
    const n = flights.length;
    const spacing = 2.9;
    const spread = spacing * (n - 1);
    return flights.map((_, i) => (i - (n - 1) / 2) * (spread / Math.max(1, n - 1)));
  }, [flights]);

  const { camera } = useThree();
  const camBase = useRef(new THREE.Vector3(0, 0.6, 7.2));

  useFrame(({ pointer }) => {
    const targetX = camBase.current.x + pointer.x * 0.5;
    const targetY = camBase.current.y + pointer.y * 0.25;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, -0.1, 0);
  });

  return (
    <>
      {/* three-point studio lighting rather than one flat ambient wash */}
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#FFFDF5" castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.55} color="#2FC2F0" />
      <pointLight position={[0, 1.5, 4]} intensity={0.4} color="#4AD6C7" />
      <Environment preset="night" />
      <fog attach="fog" args={["#08090B", 6, 13]} />

      {/* a soft reflective floor beneath the row of aircraft — the studio
          "product shot" cue that turns floating primitives into an
          intentional presentation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <planeGeometry args={[13, 6]} />
        <meshStandardMaterial color="#0C0E12" roughness={0.15} metalness={0.4} />
      </mesh>
      <gridHelper args={[13, 22, "#1E2836", "#141922"]} position={[0, -0.615, 0]} />

      {flights.map((f, i) => (
        <group
          key={f.id}
          position={[positions[i], 0, selectedId === f.id ? 0.9 : 0]}
          scale={AIRCRAFT_SCALE}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(f.id);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(f.id);
          }}
        >
          <Aircraft3D
            kind={f.aircraftType as AircraftKind}
            color={STATUS_COLOR[f.status]}
            hovered={hoveredId === f.id}
            selected={selectedId === f.id}
          />
        </group>
      ))}
    </>
  );
}

/**
 * The 3D flight-selection scene: procedural aircraft (see Aircraft3D) laid
 * out in a row with real spacing between them, each independently
 * hoverable/selectable via standard pointer events — no cursor changes, the
 * existing cursor system is untouched. Selecting one nudges it forward and
 * brightens it; the caller drives what happens next (the take-off sequence).
 */
export function AircraftSelectorScene({ flights, selectedId, onSelect }: {
  flights: MockFlight[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 0.6, 7.2], fov: 36 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <Scene
        flights={flights}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onHover={setHoveredId}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
