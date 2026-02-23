import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Infographic3DProps {
    progress: number
    entryProgress: number
}

export const Infographic3D = ({ progress, entryProgress }: Infographic3DProps) => {
    const groupRef = useRef<THREE.Group>(null!)

    // Visibility logic: ONLY show during scroll-based reveal (0 -> 0.15) OR during traction section reveal (0.7 -> 0.9)
    // We hide it during the entryProgress phase to focus on the car reveal
    const reveal = (entryProgress > 0) ? 0 : (progress < 0.15 ? progress / 0.15 : (progress > 0.7 ? (progress - 0.7) / 0.2 : 0))
    const opacity = THREE.MathUtils.clamp(reveal, 0, 1)

    useFrame((state) => {
        if (groupRef.current) {
            // Base Y + Scroll reveal + Falling entry
            // entryProgress 1 -> 0. Falling down.
            let yOffset = entryProgress * 15

            // Scroll Fall (match car)
            if (entryProgress === 0 && progress < 0.15) {
                const scrollFall = 1 - (progress / 0.15)
                yOffset = scrollFall * 15
            }

            groupRef.current.position.y = -2 + opacity * 2 + yOffset
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group ref={groupRef} position={[0, -5, -2]}>
            <Text
                position={[-4, 2, 0]}
                fontSize={1.5}
                color="#96CC39"
                anchorX="left"
                anchorY="middle"
                fillOpacity={opacity}
            >
                6
            </Text>
            <Text
                position={[-4, 1, 0]}
                fontSize={0.2}
                color="#0A0A0B"
                anchorX="left"
                anchorY="middle"
                fillOpacity={opacity * 0.5}
            >
                INDUSTRIES COVERED
            </Text>

            <Text
                position={[0, 2, 0]}
                fontSize={1.5}
                color="#96CC39"
                anchorX="center"
                anchorY="middle"
                fillOpacity={opacity}
            >
                25
            </Text>
            <Text
                position={[0, 1, 0]}
                fontSize={0.2}
                color="#0A0A0B"
                anchorX="center"
                anchorY="middle"
                fillOpacity={opacity * 0.5}
            >
                STAKEHOLDERS
            </Text>

            <Text
                position={[4, 2, 0]}
                fontSize={1.5}
                color="#96CC39"
                anchorX="right"
                anchorY="middle"
                fillOpacity={opacity}
            >
                120k
            </Text>
            <Text
                position={[4, 1, 0]}
                fontSize={0.2}
                color="#0A0A0B"
                anchorX="right"
                anchorY="middle"
                fillOpacity={opacity * 0.5}
            >
                TONS TRACKED
            </Text>
        </group>
    )
}
