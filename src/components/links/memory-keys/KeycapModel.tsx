'use client';
import { useEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  ExtrudeGeometry,
  Shape,
  Float32BufferAttribute,
  Group,
  Mesh,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { gsap } from '@/lib/gsap';
import { keyColors, type KeyItem } from '@/content/keycaps';

// Original rounded profiles: flared skirt, narrow bevel, gently dished top.
export function makeKeycapGeometry() {
  const rings = [
    [0.8, 0.31, 0],
    [0.8, 0.31, 0.055],
    [0.795, 0.31, 0.12],
    [0.78, 0.3, 0.32],
    [0.765, 0.29, 0.375],
    [0.744, 0.28, 0.409],
    [0.708, 0.263, 0.432],
    [0.66, 0.24, 0.442],
    [0.53, 0.21, 0.442],
  ];
  const points: number[] = [];
  const indices: number[] = [];
  const segments = 9;
  const count = 4 * segments;
  for (const [half, r, y] of rings) {
    for (let corner = 0; corner < 4; corner++) {
      const angle = (corner * Math.PI) / 2;
      const cx = (corner === 0 || corner === 3 ? 1 : -1) * (half - r);
      const cz = (corner < 2 ? 1 : -1) * (half - r);
      for (let n = 0; n < segments; n++) {
        const a = angle + ((n / (segments - 1)) * Math.PI) / 2;
        points.push(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r);
      }
    }
  }
  for (let ring = 0; ring < rings.length - 1; ring++)
    for (let n = 0; n < count; n++) {
      const a = ring * count + n,
        b = ring * count + ((n + 1) % count),
        c = b + count,
        d = a + count;
      indices.push(a, c, b, a, d, c);
    }
  const center = points.length / 3;
  points.push(0, 0.442, 0);
  for (let n = 0; n < count; n++)
    indices.push(
      center,
      (rings.length - 1) * count + ((n + 1) % count),
      (rings.length - 1) * count + n,
    );
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(points, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
export function makeBaseGeometry(width: number, depth: number) {
  const x = -width / 2,
    y = -depth / 2,
    r = 0.19;
  const shape = new Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + depth - r);
  shape.quadraticCurveTo(x + width, y + depth, x + width - r, y + depth);
  shape.lineTo(x + r, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 3,
    curveSegments: 10,
  });
  geo.rotateX(Math.PI / 2);
  return geo;
}
export function KeycapModel({
  item,
  position,
  active,
  pressed,
  geometry,
  visible,
  exploded = false,
}: {
  item: KeyItem;
  position: [number, number, number];
  active: boolean;
  pressed: boolean;
  geometry: BufferGeometry;
  visible: boolean;
  exploded?: boolean;
}) {
  const group = useRef<Group>(null);
  const legend = useRef<Mesh>(null);
  const well = useMemo(() => makeBaseGeometry(1.74, 1.74), []);
  useEffect(() => () => well.dispose(), [well]);
  const { invalidate, gl } = useThree();
  const texture = useLoader(TextureLoader, `/assets/keycaps/${item.style}.svg`);
  useMemo(() => {
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [texture]);
  useEffect(() => {
    if (!group.current || !visible) return;
    // The legend and cap are separate existing meshes; disassembly never changes geometry.
    const legendTween = legend.current
      ? gsap.to(legend.current.position, {
          y: exploded ? 1.0 : 0.45,
          duration: 0.32,
          ease: 'power2.out',
          onUpdate: invalidate,
        })
      : null;
    const tween = gsap.to(group.current.position, {
      y: position[1] + (exploded ? 0.6 : 0) + (pressed ? -0.155 : active ? 0.035 : 0),
      duration: pressed ? 0.085 : 0.27,
      ease: pressed ? 'power2.out' : 'back.out(1.5)',
      onUpdate: () => {
        invalidate();
        gl.domElement.dataset.keyY = String(group.current?.position.y);
        gl.domElement.dataset.activeKey = item.id;
      },
    });
    return () => {
      tween.kill();
      legendTween?.kill();
    };
  }, [active, pressed, position, invalidate, gl, item.id, visible, exploded]);
  useEffect(() => {
    if (visible) invalidate();
  }, [visible, invalidate]);
  return (
    <group position={position}>
      <mesh position={[0, -0.025, 0]} geometry={well}>
        <meshStandardMaterial color="#090d12" roughness={0.85} />
      </mesh>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={keyColors[item.style]}
            roughness={item.style === 'display' ? 0.7 : 0.44}
            metalness={item.style === 'display' ? 0.08 : 0.26}
            clearcoat={0.22}
            clearcoatRoughness={0.35}
            emissive={item.style === 'display' ? '#8ca9b7' : '#8bafc2'}
            emissiveIntensity={item.style === 'display' ? 0.08 : active ? 0.035 : 0}
          />
        </mesh>
        <mesh ref={legend} position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.05, 1.05]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      </group>
    </group>
  );
}
