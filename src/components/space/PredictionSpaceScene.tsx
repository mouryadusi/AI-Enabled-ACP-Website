import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Six procedural trajectory paths in 3D space, each ending near a shared
// "predicted conflict" region rather than a single point — deliberately
// imperfect convergence, because prediction is a probability field, not a
// certainty. Control points are hand-placed (not random) so the geometry
// reads as intentional aircraft vectors, not noise.
const TRAJECTORIES: { points: [number, number, number][]; speed: number; colour: string }[] = [
  {
    points: [
      [-5, 1.4, -2],
      [-2.2, 0.6, -0.6],
      [-0.3, -0.1, 0.4],
      [1.6, -0.5, 0.9],
    ],
    speed: 0.14,
    colour: "#2FC2F0",
  },
  {
    points: [
      [4.6, -1.2, -3],
      [2, -0.4, -1],
      [0.2, 0.2, 0.2],
      [-1.5, 0.6, 0.8],
    ],
    speed: 0.11,
    colour: "#FF5C4D",
  },
  {
    points: [
      [-4, -2, 2],
      [-1.6, -0.9, 1],
      [0.4, -0.1, 0.1],
      [2.2, 0.7, -0.6],
    ],
    speed: 0.09,
    colour: "#3FDE8F",
  },
  {
    points: [
      [3.5, 2.2, 1.6],
      [1.4, 1.1, 0.6],
      [-0.2, 0.2, -0.1],
      [-2.4, -0.6, -0.9],
    ],
    speed: 0.13,
    colour: "#4AD6C7",
  },
];

function catmullPoints(pts: [number, number, number][], samples = 60) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  return curve.getPoints(samples);
}

function TrajectoryVector({ traj }: { traj: (typeof TRAJECTORIES)[number] }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(traj.points.map((p) => new THREE.Vector3(...p))), [traj]);
  const linePoints = useMemo(() => catmullPoints(traj.points), [traj.points]);
  const markerRef = useRef<THREE.Mesh>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random());

  useFrame((_, delta) => {
    t.current = (t.current + delta * traj.speed) % 1;
    const pos = curve.getPointAt(t.current);
    const tangent = curve.getTangentAt(t.current);
    if (markerRef.current) markerRef.current.position.copy(pos);

    // Uncertainty cone: grows the further along the predicted path we are —
    // a real encoding of "confidence decreases with prediction horizon",
    // not a decorative shape. Oriented along the direction of travel.
    if (coneRef.current) {
      const growth = 0.15 + t.current * 0.9;
      coneRef.current.position.copy(pos).add(tangent.clone().multiplyScalar(growth * 0.6));
      coneRef.current.scale.setScalar(growth);
      coneRef.current.lookAt(pos.clone().add(tangent));
      coneRef.current.rotateX(Math.PI / 2);
    }
  });

  return (
    <group>
      <Line points={linePoints} color={traj.colour} lineWidth={1.1} transparent opacity={0.55} />
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={traj.colour} />
      </mesh>
      <mesh ref={coneRef}>
        <coneGeometry args={[0.22, 0.5, 16, 1, true]} />
        <meshBasicMaterial color={traj.colour} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function DataParticles({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#2FC2F0" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/** Camera drifts slowly on its own, with a gentle additional offset toward
 * the pointer position — spatial interaction without requiring drag input. */
function DriftingCamera() {
  const { camera, pointer } = useThree();
  const base = useRef(0);
  useFrame((_, delta) => {
    base.current += delta * 0.05;
    camera.position.x = Math.sin(base.current) * 1.4 + pointer.x * 0.8;
    camera.position.y = Math.cos(base.current * 0.7) * 0.6 + pointer.y * 0.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function PredictionSpaceScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <DriftingCamera />
      <DataParticles />
      {TRAJECTORIES.map((traj, i) => (
        <TrajectoryVector key={i} traj={traj} />
      ))}
      {/* the shared predicted-conflict region the trajectories move toward */}
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#FFB020" transparent opacity={0.5} />
      </mesh>
    </>
  );
}
