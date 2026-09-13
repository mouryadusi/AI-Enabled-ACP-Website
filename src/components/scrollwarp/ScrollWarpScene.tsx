import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// A real vertex shader, not a CSS approximation: the plane's vertices
// displace in Z based on scroll velocity, with the centre and edges moving
// at different rates (edgeFactor) so the surface genuinely bows rather than
// translating as a rigid slab — plus a slow ambient wave so it never sits
// perfectly flat even at rest. This is deliberately an ambient background
// layer, not a texture of the page's real content: text and every other
// DOM element stay in normal CSS layout, fully readable, untouched by the
// shader — the "separate rendering layers" approach, applied literally.
const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float edgeFactor = 1.0 - abs(pos.x) / 10.0;
    float wave = sin(pos.y * 0.35 + uTime * 0.3) * 0.12;
    float bend = uVelocity * edgeFactor * 0.9;
    pos.z += bend + wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.95, 0.05, d) * 0.05;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * The ambient warp surface itself. Camera-facing plane, generously
 * subdivided so the vertex displacement reads as a smooth curve rather than
 * visible facets. Scroll velocity is measured directly (rAF + window.scrollY
 * delta) and pushed into the shader as a uniform every frame — no React
 * state, so this never triggers a re-render.
 */
export function ScrollWarpScene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const lastScrollY = useRef(0);
  const smoothVelocity = useRef(0);
  const { viewport } = useThree();

  useFrame(({ clock }, delta) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const rawVelocity = (currentScrollY - lastScrollY.current) / Math.max(delta, 0.001);
    lastScrollY.current = currentScrollY;

    // Normalise and clamp so fast flicks bend firmly without ever folding
    // the plane on itself, then ease toward neutral — the "spring-back
    // when scrolling stops, reversible when scrolling backward" behaviour.
    const target = THREE.MathUtils.clamp(rawVelocity / 2200, -1, 1);
    smoothVelocity.current += (target - smoothVelocity.current) * Math.min(1, delta * 5);

    if (materialRef.current) {
      materialRef.current.uniforms.uVelocity.value = smoothVelocity.current;
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -4]} scale={[viewport.width * 1.4, viewport.height * 1.4, 1]}>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          uTime: { value: 0 },
          uVelocity: { value: 0 },
          uColor: { value: new THREE.Color("#2FC2F0") },
        }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
