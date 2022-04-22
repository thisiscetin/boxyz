import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export type Size = [number, number, number];
export type Color = [number, number, number];

interface ThreeDBoxProps {
  color: Color;
  size: Size;
}

export default function ({ color, size }: ThreeDBoxProps) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    const rotation = ref.current?.rotation;
    if (rotation) {
      rotation.x += 0.005;
      rotation.y += 0.005;
      rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={ref} scale={0.4}>
      <boxGeometry args={[size[0] / 100, size[1] / 100, size[2] / 100]} />
      <meshStandardMaterial color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`} />
    </mesh>
  );
}
