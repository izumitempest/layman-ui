import { useReducedMotion } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, SpotLight, Line, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";

const NUM_NODES = 50;

function ASTGraph() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const { viewport } = useThree();

  // Generate nodes and edges
  const { nodes, lines } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NUM_NODES; i++) {
      // Random position within a sphere of radius 4
      const radius = 4 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    // Simple tree-like structure
    for (let i = 1; i < NUM_NODES; i++) {
      // Connect to a random previous node to ensure connectivity (simple random tree)
      const parentIdx = Math.floor(Math.random() * i);
      lines.push([nodes[parentIdx], nodes[i]]);
    }
    // Add some random extra connections
    for (let i = 0; i < 20; i++) {
      const idx1 = Math.floor(Math.random() * NUM_NODES);
      const idx2 = Math.floor(Math.random() * NUM_NODES);
      if (idx1 !== idx2) lines.push([nodes[idx1], nodes[idx2]]);
    }

    return { nodes, lines };
  }, []);

  // Set instanced mesh matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => {
    if (meshRef.current) {
      nodes.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [nodes, dummy]);

  // Geometries & Materials
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 32, 32), []);
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        ior: 1.5,
        roughness: 0.1,
        thickness: 2,
        color: "#64748b", // slate-500 for better visibility
        transparent: true,
      }),
    []
  );

  useFrame((state, delta) => {
    // Rotate AST slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;

      // Parallax movement mapped to state.pointer applied to group instead of camera
      const targetX = state.pointer.x * 2;
      const targetY = state.pointer.y * 2;
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 2, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 2, delta);
    }

    // Spotlight tracking cursor
    if (lightRef.current) {
      // Map pointer to world space near the graph
      const lightX = (state.pointer.x * viewport.width) / 2;
      const lightY = (state.pointer.y * viewport.height) / 2;
      lightRef.current.position.x = THREE.MathUtils.damp(lightRef.current.position.x, lightX, 4, delta);
      lightRef.current.position.y = THREE.MathUtils.damp(lightRef.current.position.y, lightY, 4, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <SpotLight
        ref={lightRef}
        position={[0, 0, 5]}
        penumbra={1}
        angle={0.5}
        intensity={2}
        distance={20}
        color="#ffffff"
      />

      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[sphereGeometry, glassMaterial, NUM_NODES]} />
        
        {/* Draw connections */}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={[line[0], line[1]]}
            color="#cbd5e1"
            opacity={0.3}
            transparent
            lineWidth={1}
          />
        ))}
      </group>
    </>
  );
}

export default function HeroCanvas() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 z-0 bg-slate-50 flex items-center justify-center opacity-30">
        {/* Static 2D fallback pattern */}
        <div className="w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-slate-50 overflow-hidden">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true }}>
          <Environment preset="city" />
          <ASTGraph />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            autoRotate={false}
            dampingFactor={0.05}
          />
          <EffectComposer disableNormalPass>
            <Bloom intensity={0.5} luminanceThreshold={0.8} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </div>
  );
}
