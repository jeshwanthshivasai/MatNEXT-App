import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, vec2(0.5));
    vec3 color = mix(vec3(1.0), vec3(0.98), dist); 
    float grain = noise(uv * uTime) * 0.015;
    color += grain;
    gl_FragColor = vec4(color, 1.0);
  }
`

export const BackgroundShader = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const uniforms = useRef({
    uTime: { value: 0 }
  })

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent
      />
    </mesh>
  )
}
