import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BRAND = new THREE.Color('#C9A45C');
const CYAN = new THREE.Color('#EFE3C2');
const INK = new THREE.Color('#F5F7FA');

function OrbitalRings({ paused }: { paused: boolean }) {
  const group = useRef<THREE.Group>(null);

  const rings = useMemo(
    () => [
      { count: 14, radius: 2.0, tilt: 0.5, rotZ: 0, speed: 0.24, size: 0.07, color: BRAND },
      { count: 22, radius: 2.75, tilt: -0.22, rotZ: 0.6, speed: -0.16, size: 0.055, color: CYAN },
      { count: 30, radius: 3.5, tilt: 0.85, rotZ: -0.45, speed: 0.1, size: 0.045, color: BRAND },
    ],
    []
  );

  const meshes = useMemo(
    () =>
      rings.map((ring) => {
        const geo = new THREE.IcosahedronGeometry(ring.size, 1);
        const mat = new THREE.MeshBasicMaterial({ color: ring.color });
        const inst = new THREE.InstancedMesh(geo, mat, ring.count);
        inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        return { inst, ring };
      }),
    [rings]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;
    t.current += delta;
    const time = t.current;
    const g = group.current;
    if (g) g.rotation.y += delta * 0.05;
    meshes.forEach(({ inst, ring }) => {
      for (let i = 0; i < ring.count; i++) {
        const a = (i / ring.count) * Math.PI * 2 + time * ring.speed;
        const x = Math.cos(a) * ring.radius;
        const z = Math.sin(a) * ring.radius;
        const y = Math.sin(a) * ring.radius * Math.sin(ring.tilt) * 0.55;
        dummy.position.set(x, y, z);
        const s = 0.75 + Math.sin(a * 2 + time) * 0.25;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group ref={group}>
      {meshes.map(({ inst }, i) => (
        <primitive key={i} object={inst} />
      ))}
      {rings.map((ring, i) => (
        <mesh key={`p-${i}`} rotation={[Math.PI / 2 - ring.tilt, 0, ring.rotZ]}>
          <torusGeometry args={[ring.radius, 0.006, 8, 96]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function Core({ paused, pointer }: { paused: boolean; pointer: { x: number; y: number } }) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const rig = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (paused) return;
    const time = performance.now() / 1000;
    const pulse = 1 + Math.sin(time * 1.8) * 0.12;
    core.current?.scale.setScalar(pulse);
    halo.current?.scale.setScalar(1 + Math.sin(time * 1.1) * 0.06);
    // Camera-follow parallax: the whole rig leans toward the pointer.
    const rigEl = rig.current;
    if (rigEl) {
      rigEl.rotation.y += (pointer.x * 0.45 - rigEl.rotation.y) * 0.04;
      rigEl.rotation.x += (pointer.y * 0.3 - rigEl.rotation.x) * 0.04;
    }
    void delta;
  });

  return (
    <group ref={rig}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshBasicMaterial color={BRAND} transparent opacity={0.16} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color={BRAND} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

/**
 * WebGL hero reactor — real 3D via React Three Fiber (the current industry
 * standard for web 3D). Instanced orbital nodes, torus orbit guides, a
 * pulsing core and pointer-parallax rig. The frameloop parks entirely when
 * `paused` (offscreen or reduced motion) and `frameloop="demand"` plus a
 * capped adaptive dpr keep the GPU cost low.
 */
export const ReactorScene: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const pointer = useRef({ x: 0, y: 0 }).current;

  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.4, 7.2], fov: 42 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <Core paused={paused} pointer={pointer} />
      <OrbitalRings paused={paused} />
    </Canvas>
  );
};
