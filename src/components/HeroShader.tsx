import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Pseudo-random generator
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y -= u_time * 0.05; // Scroll vertically

    // Create a grid
    vec2 grid_st = floor(st * vec2(80.0, 40.0));
    
    // Generate binary-like noise (0.0 or 1.0)
    float rnd = random(grid_st);
    float val = step(0.5, rnd);

    // Coordinate system: webGL has y=0 at bottom.
    // Mouse input from React is normalized 0-1, y=0 at top. Let's handle it here
    vec2 mouse_st = vec2(u_mouse.x, 1.0 - u_mouse.y);
    
    float dist = distance(gl_FragCoord.xy / u_resolution.xy, mouse_st);
    // Smooth pulse highlight around the cursor
    float glow = smoothstep(0.25, 0.0, dist);

    // Electric Amber core mix to black.
    // vec3(1.0, 0.69, 0.0) is #ffb000
    vec3 baseColor = mix(vec3(0.0), vec3(0.15, 0.1, 0.0), val);
    vec3 highlightColor = mix(vec3(1.0, 0.69, 0.0), vec3(0.0), dist * 3.0);
    vec3 color = mix(baseColor, highlightColor, glow * val * 0.8);

    gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(-1, -1) },
    }),
    [size]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.u_resolution.value.set(size.width, size.height);
      
      // Convert pointer coordinates (-1 to 1) back to (0 to 1) for the custom shader
      const normalizedMouseX = (state.pointer.x + 1) / 2;
      const normalizedMouseY = 1.0 - ((state.pointer.y + 1) / 2); // Invert Y
      materialRef.current.uniforms.u_mouse.value.set(normalizedMouseX, normalizedMouseY);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function HeroShader() {
  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-auto cursor-crosshair">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
