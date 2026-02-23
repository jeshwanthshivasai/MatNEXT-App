import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Text } from '@react-three/drei'

interface FloatingMaterialProps {
    type: 'steel' | 'lithium' | 'cobalt' | 'copper' | 'aluminium'
    position: [number, number, number]
    scrollProgress: number
}

export const FloatingMaterial = ({ type, position, scrollProgress }: FloatingMaterialProps) => {
    const meshRef = useRef<THREE.Mesh>(null!)
    const textRef = useRef<THREE.Group>(null!)
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)

    const { color, emissive, metalness, roughness, value } = useMemo(() => {
        switch (type) {
            case 'steel': return { color: '#8E9196', emissive: '#B0B3B8', roughness: 0.1, metalness: 1, value: '85%' }
            case 'lithium': return { color: '#E5E7EB', emissive: '#FFFFFF', roughness: 0.2, metalness: 0.8, value: '45%' }
            case 'cobalt': return { color: '#2563EB', emissive: '#3B82F6', roughness: 0.1, metalness: 0.9, value: '25%' }
            case 'copper': return { color: '#EA580C', emissive: '#FB923C', roughness: 0.1, metalness: 1, value: '70%' }
            case 'aluminium': return { color: '#94A3B8', emissive: '#CBD5E1', roughness: 0.3, metalness: 0.9, value: '60%' }
            default: return { color: '#96CC39', emissive: '#96CC39', roughness: 0.5, metalness: 0.5, value: '0%' }
        }
    }, [type])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (meshRef.current && materialRef.current) {
            // SEQUENTIAL REVEAL LOGIC
            // 1. Fade In (0.15 -> 0.25)
            const fadeIn = THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.25)

            // 2. Flash Spike (0.25 -> 0.3)
            const flash = Math.max(0, 1 - Math.abs(scrollProgress - 0.275) / 0.025)
            const emissiveIntensity = flash * 15 // Bright shine

            // 3. Text Reveal (0.3 -> 0.4)
            const textReveal = THREE.MathUtils.smoothstep(scrollProgress, 0.3, 0.4)

            // Apply visibility
            const scale = fadeIn * 0.45
            meshRef.current.scale.setScalar(scale)
            materialRef.current.opacity = fadeIn * 0.9
            materialRef.current.emissiveIntensity = 0.1 + emissiveIntensity

            // Falling logic (crystals appear from above)
            const fallingOffset = (1 - fadeIn) * 5
            meshRef.current.position.set(
                position[0],
                position[1] + fallingOffset + Math.sin(time + position[0]) * 0.1,
                position[2]
            )

            if (textRef.current) {
                textRef.current.scale.setScalar(scale * 2.5)
                textRef.current.position.set(
                    meshRef.current.position.x,
                    meshRef.current.position.y + 0.7,
                    meshRef.current.position.z
                )
                // Text opacity ties to textReveal
                textRef.current.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.material) {
                        child.material.fillOpacity = textReveal
                    }
                })
                textRef.current.rotation.y = Math.sin(time) * 0.2
            }

            // FADE OUT DURING EXPLOSION (Sync with car)
            if (scrollProgress > 0.75) {
                const fadeFactor = Math.max(0, 1 - (scrollProgress - 0.75) / 0.15)
                materialRef.current.opacity = Math.min(materialRef.current.opacity, fadeFactor)
                if (textRef.current) {
                    textRef.current.traverse((child) => {
                        if (child instanceof THREE.Mesh && child.material) {
                            child.material.fillOpacity *= fadeFactor
                        }
                    })
                }
            }
        }
    })

    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={1}>
            <group>
                <mesh ref={meshRef} position={position} scale={0}>
                    <icosahedronGeometry args={[1, 1]} /> {/* High poly sharp crystal */}
                    <meshPhysicalMaterial
                        ref={materialRef}
                        color={color}
                        metalness={metalness}
                        roughness={roughness}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        emissive={emissive}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0}
                    />
                </mesh>

                <group ref={textRef} position={position}>
                    <Text
                        fontSize={0.15}
                        color="#96CC39"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {value}
                    </Text>
                    <Text
                        position={[0, -0.08, 0]}
                        fontSize={0.06}
                        color="#FFFFFF"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {type.toUpperCase()}
                    </Text>
                </group>
            </group>
        </Float>
    )
}
