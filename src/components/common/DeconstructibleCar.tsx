import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import carModelUrl from '@/assets/generic_sedan_car.glb'

interface DeconstructibleCarProps {
    progress: number
    isLoader?: boolean
}

export const DeconstructibleCar = ({ progress, isLoader = false }: DeconstructibleCarProps) => {
    // SWITCH TO LOCAL ASSET - Use proper import for Vite
    const { scene } = useGLTF(carModelUrl)
    const groupRef = useRef<THREE.Group>(null!)

    // Clone the scene and store original positions with world transforms baked
    const items = useMemo(() => {
        const parts: THREE.Mesh[] = []

        // Ensure all world matrices are up to date
        scene.updateWorldMatrix(true, true)

        scene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                // Clone the mesh
                const clone = child.clone()

                // EXTRACT WORLD TRANSFORMS
                const worldPos = new THREE.Vector3()
                const worldQuat = new THREE.Quaternion()
                const worldScale = new THREE.Vector3()

                child.getWorldPosition(worldPos)
                child.getWorldQuaternion(worldQuat)
                child.getWorldScale(worldScale)

                clone.position.copy(worldPos)
                clone.quaternion.copy(worldQuat)
                clone.scale.copy(worldScale)

                // Ensure unique geometry and material for deconstruction
                clone.geometry = clone.geometry.clone()

                // TECH-NOIR WIREFRAME MATERIAL
                const material = new THREE.MeshPhysicalMaterial({
                    color: "#050505",
                    metalness: 0.9,
                    roughness: 0.1,
                    clearcoat: 1.0,
                    emissive: "#96CC39",
                    emissiveIntensity: 0.5, // Increased for wireframe visibility
                    transparent: true,
                    opacity: 1,
                    wireframe: true // MAKE THE CAR WIREFRAME
                })
                clone.material = material

                // Store baked positions as "original" for deconstruction
                clone.userData.origPos = clone.position.clone()
                clone.userData.origRot = clone.rotation.clone()

                // Assign a truly radial direction based on baked world position
                const radialDir = clone.position.clone().normalize()

                // Add some random noise to ensures non-uniform explosion
                const randomDir = new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ).normalize()

                clone.userData.explodeDir = radialDir.lerp(randomDir, 0.3).normalize()

                parts.push(clone)
            }
        })
        return parts
    }, [scene])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (!groupRef.current) return

        // ORCHESTRATED ANIMATION LOGIC
        const rotationPhase = Math.min(1, progress / 0.75)
        const explodePhase = Math.max(0, (progress - 0.75) / 0.25)

        // Base Idle/Hover
        const hover = Math.sin(time * 0.5) * 0.05

        // VERTICAL & HORIZONTAL POSITIONING
        let yOffset = 0
        let xOffset = 0

        if (!isLoader) {
            if (progress < 0) {
                // Initial Entry Phase (Landing)
                // We want the car to be on the RIGHT during this phase
                const entryVal = Math.abs(progress) // 1 to 0
                yOffset = entryVal * 10

                // Hero Section Positioning: Right side
                // We stay on the right (x: 3) during the landing reveal
                xOffset = 3
            } else {
                // Normal Scrolling Phase
                if (progress < 0.15) {
                    // Falling into Section 2
                    const scrollFall = 1 - (progress / 0.15)
                    yOffset = scrollFall * 15

                    // TRANSITION FROM RIGHT (Hero) TO CENTER (Section 2)
                    // At progress 0, x is 3. At 0.15, x is 0.
                    xOffset = scrollFall * 3
                } else {
                    xOffset = 0
                    yOffset = 0
                }
            }
        }

        groupRef.current.position.y = -yOffset + hover
        groupRef.current.position.x = xOffset
        groupRef.current.rotation.y = rotationPhase * Math.PI * 1.5 // 270 degrees

        items.forEach((child, i) => {
            // Apply radial explosion
            if (explodePhase > 0) {
                const explodeFactor = explodePhase * 25
                const dir = child.userData.explodeDir

                child.position.x = child.userData.origPos.x + dir.x * explodeFactor
                child.position.y = child.userData.origPos.y + dir.y * explodeFactor
                child.position.z = child.userData.origPos.z + dir.z * explodeFactor

                child.rotation.x = child.userData.origRot.x + explodePhase * Math.sin(i) * 20
                child.rotation.y = child.userData.origRot.y + explodePhase * Math.cos(i) * 20

                // FADE OUT PARTS
                if (child.material instanceof THREE.MeshPhysicalMaterial) {
                    child.material.opacity = Math.max(0, 1 - explodePhase * 1.5)
                }
            } else {
                child.position.copy(child.userData.origPos)
                child.rotation.copy(child.userData.origRot)
                if (child.material instanceof THREE.MeshPhysicalMaterial) {
                    child.material.opacity = 1
                }
            }
        })
    })

    return (
        <group ref={groupRef} scale={1.2}>
            {items.map((mesh, i) => (
                <primitive key={i} object={mesh} />
            ))}
        </group>
    )
}
