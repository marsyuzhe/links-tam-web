'use client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { deviceLayout, type HitRect } from './device-layout';
import type { KeyItem } from '@/content/keycaps';
import { KeycapModel, makeKeycapGeometry, makeBaseGeometry } from './KeycapModel';

type Props = {
  items: KeyItem[];
  compact: boolean;
  exploded?: boolean;
  active: string | null;
  pressed: string | null;
  onReady: () => void;
  onFail: () => void;
  onRects: (r: HitRect[]) => void;
};
function Scene({ items, compact, active, pressed, exploded, onReady, onFail, onRects }: Props) {
  const { camera, size, gl, invalidate } = useThree();
  const [visible, setVisible] = useState(true);
  const geometry = useMemo(makeKeycapGeometry, []);
  const layout = useMemo(
    () => deviceLayout(size.width, size.height, items.length, compact),
    [size.width, size.height, items.length, compact],
  );
  const { cols, rows, positions } = layout;
  const baseGeometry = useMemo(
    () => makeBaseGeometry(cols * 2.1 + 0.35, rows * 2.1 + 0.3),
    [cols, rows],
  );
  useEffect(() => () => baseGeometry.dispose(), [baseGeometry]);
  useEffect(() => {
    camera.position.set(0, 8, 7);
    camera.lookAt(0, 0, 0);
    camera.zoom = layout.zoom;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    onRects(layout.rects);
    invalidate();
    onReady();
  }, [camera, layout, onRects, onReady, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lose = (e: Event) => {
      e.preventDefault();
      onFail();
    };
    canvas.addEventListener('webglcontextlost', lose);
    const visibility = () => {
      setVisible(!document.hidden);
      if (!document.hidden) invalidate();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      canvas.removeEventListener('webglcontextlost', lose);
      document.removeEventListener('visibilitychange', visibility);
      geometry.dispose();
    };
  }, [gl, onFail, invalidate, geometry]);
  const samples = useRef({ last: 0, total: 0, count: 0 });
  useFrame(() => {
    const el = gl.domElement;
    el.dataset.frames = String(Number(el.dataset.frames || 0) + 1);
    el.dataset.calls = String(gl.info.render.calls);
    el.dataset.triangles = String(gl.info.render.triangles);
    const now = performance.now(),
      s = samples.current,
      gap = now - s.last;
    s.last = now;
    if (gap > 0 && gap < 150) {
      s.total += gap;
      s.count++;
      if (s.count >= 24) {
        el.dataset.activeFrameMs = String(s.total / s.count);
        if (s.total / s.count > 60) onFail();
        s.total = 0;
        s.count = 0;
      }
    }
  });
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[-3, 7, 5]} intensity={2.65} color="#e3edf4" />
      <directionalLight position={[5, 3, -4]} intensity={1.15} color="#becbd4" />
      <mesh position={[0, -0.09, 0]} geometry={baseGeometry}>
        <meshStandardMaterial color="#26323c" metalness={0.25} roughness={0.7} />
      </mesh>
      {items.map((item, i) => (
        <KeycapModel
          key={item.id}
          item={item}
          position={positions[i]}
          active={active === item.id}
          pressed={pressed === item.id}
          geometry={geometry}
          visible={visible}
          exploded={exploded}
        />
      ))}
    </>
  );
}
export default function MemoryKeysScene(props: Props) {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches ? 1 : 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('aria-hidden', 'true');
      }}
      fallback={null}
    >
      <Scene {...props} />
    </Canvas>
  );
}
