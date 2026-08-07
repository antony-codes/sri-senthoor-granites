import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingMonolith = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.8, 2.4, 0.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.6}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          roughness={0.2}
          metalness={0.8}
          color="#C5A059"
        />
      </mesh>
    </Float>
  );
};

const MineralDust = () => {
  const count = 70;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 12;
  }

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#F3E5AB"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const GraniteHeroCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 dark:opacity-90 light:opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#F3E5AB" />
        <directionalLight position={[-5, -5, -2]} intensity={0.8} color="#E0E0E0" />
        <pointLight position={[0, 0, 3]} intensity={1.0} color="#C5A059" />

        <FloatingMonolith />
        <MineralDust />
      </Canvas>
    </div>
  );
};
