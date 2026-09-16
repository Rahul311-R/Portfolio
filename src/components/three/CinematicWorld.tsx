import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CinematicWorld — the scroll-driven 3D space behind the Home page.
 * A corridor of gold rings and drifting particles; the camera flies forward
 * along the corridor as the page scrolls, with a gentle pointer parallax.
 * Pure decoration: aria-hidden, frameloop paused under reduced motion,
 * unmounted entirely when the tab is hidden.
 */

const GOLD = new THREE.Color('#C9A45C');
const CHAMPAGNE = new THREE.Color('#EFE3C2');
const OBSIDIAN = new THREE.Color('#08090D');

function Rings({ scrollRef, pointerRef }: { scrollRef: React.RefObject<number>; pointerRef: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    const COUNT = 16;
    const DEPTH = 90;
    return Array.from({ length: COUNT }, (_, i) => ({
      z: -(i / COUNT) * DEPTH,
      radius: 3.4 + Math.sin(i * 1.7) * 0.7,
      rotX: Math.sin(i * 0.9) * 0.28,
      rotY: Math.cos(i * 1.3) * 0.35,
      phase: i * 0.7,
      thin: i % 4 === 0,
    }));
  }, []);

  const geos = useMemo(
    () => ({
      main: new THREE.TorusGeometry(1, 0.014, 8, 96),
      thin: new THREE.TorusGeometry(1, 0.006, 8, 96),
    }),
    []
  );

  const mats = useMemo(
    () => ({
      gold: new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.85 }),
      faint: new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.28 }),
      champagne: new THREE.MeshBasicMaterial({ color: CHAMPAGNE, transparent: true, opacity: 0.5 }),
    }),
    []
  );

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const s = scrollRef.current ?? 0;
    // Rings stream past the camera; loop to the front — infinite corridor.
    for (let i = 0; i < g.children.length; i++) {
      const ring = g.children[i] as THREE.Mesh;
      const meta = rings[i];
      if (!meta) continue;
      ring.rotation.x = meta.rotX + Math.sin(t * 0.24 + meta.phase) * 0.16;
      ring.rotation.y = meta.rotY + Math.cos(t * 0.2 + meta.phase) * 0.2;
      const zz = meta.z + ((s * 42) % 90);
      ring.position.z = zz > 3 ? zz - 90 : zz;
      const near = 1 - Math.min(1, Math.abs(zz) / 34);
      (ring.material as THREE.MeshBasicMaterial).opacity =
        (meta.thin ? 0.24 : 0.6) * (0.3 + near * 0.7);
    }
    // The whole corridor banks with scroll and leans toward the pointer
    g.rotation.y = (pointerRef.current?.x ?? 0) * 0.06 + s * 0.12;
    g.rotation.z = s * 0.18;
    g.rotation.x = (pointerRef.current?.y ?? 0) * 0.04;
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh
          key={i}
          geometry={r.thin ? geos.thin : geos.main}
          material={r.thin ? mats.faint : i % 3 === 0 ? mats.champagne : mats.gold}
          position={[0, 0, r.z]}
          scale={r.radius}
        />
      ))}
    </group>
  );
}

function Dust({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const points = useRef<THREE.Points>(null);

  const { geo, mat } = useMemo(() => {
    const COUNT = 420;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -Math.random() * 90;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const c = sprite.getContext('2d')!;
    const grad = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(239,227,194,1)');
    grad.addColorStop(1, 'rgba(239,227,194,0)');
    c.fillStyle = grad;
    c.fillRect(0, 0, 32, 32);
    const m = new THREE.PointsMaterial({
      size: 0.09,
      map: new THREE.CanvasTexture(sprite),
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return { geo: g, mat: m };
  }, []);

  useFrame(({ clock }) => {
    const p = points.current;
    if (!p) return;
    const t = clock.getElapsedTime();
    p.rotation.z = t * 0.012;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    // Recycle each particle through the corridor as scroll advances
    const off = (scrollRef.current ?? 0) * 42;
    for (let i = 0; i < pos.count; i += 7) {
      const z = ((pos.getZ(i) + off) % 90 + 90) % 90;
      pos.setZ(i, -z);
    }
    pos.needsUpdate = true;
  });

  return <points ref={points} geometry={geo} material={mat} />;
}

function CameraRig({ scrollRef, pointerRef }: { scrollRef: React.RefObject<number>; pointerRef: React.RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const cur = useRef({ x: 0, y: 0 });
  useFrame(() => {
    const target = scrollRef.current ?? 0;
    const px = pointerRef.current?.x ?? 0;
    const py = pointerRef.current?.y ?? 0;
    cur.current.x += (px * 0.9 - cur.current.x) * 0.045;
    cur.current.y += (-py * 0.5 - cur.current.y) * 0.045;
    camera.position.x = cur.current.x;
    camera.position.y = cur.current.y;
    camera.position.z = 6 - target * 7; // real dolly — fly 7 units deep
    camera.lookAt(cur.current.x * 0.4, cur.current.y * 0.4, -12);
  });
  return null;
}

export const CinematicWorld: React.FC<{ className?: string }> = ({ className = '' }) => {
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  return (
    <div
      className={className}
      onPointerMove={(e) => {
        pointerRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        };
      }}
    >
      <Canvas
        aria-hidden="true"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 62, position: [0, 0, 6], near: 0.1, far: 120 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(OBSIDIAN, 0);
          scene.fog = new THREE.Fog(OBSIDIAN, 18, 78);
        }}
      >
        <ScrollBinder scrollRef={scrollRef} />
        <CameraRig scrollRef={scrollRef} pointerRef={pointerRef} />
        <Rings scrollRef={scrollRef} pointerRef={pointerRef} />
        <Dust scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
};

/** Bridges Lenis-smoothed window scroll into the scene without re-renders. */
function ScrollBinder({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  useFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollRef.current = max > 0 ? window.scrollY / max : 0;
  });
  return null;
}
