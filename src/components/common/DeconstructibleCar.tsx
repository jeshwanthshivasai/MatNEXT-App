import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const carModelUrl = '/models/generic_sedan_car.glb'
const heroModelUrl = '/models/generic_sedan_car/scene.gltf'

interface DeconstructibleCarProps {
    progress: number
    isLoader?: boolean
}

export const DeconstructibleCar = ({ progress, isLoader = false }: DeconstructibleCarProps) => {
    // USE PUBLIC PATHS
    const { scene: wireframeScene } = useGLTF(carModelUrl)
    const { scene: heroScene } = useGLTF(heroModelUrl)
    const groupRef = useRef<THREE.Group>(null!)

    // Process scenes into deconstructible parts
    const items = useMemo(() => {
        const processModel = (scene: THREE.Group, isWireframe: boolean) => {
            const parts: THREE.Mesh[] = []
            if (!scene) return parts

            scene.updateWorldMatrix(true, true)
            scene.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                    const clone = child.clone()
                    const worldPos = new THREE.Vector3()
                    const worldQuat = new THREE.Quaternion()
                    const worldScale = new THREE.Vector3()

                    child.getWorldPosition(worldPos)
                    child.getWorldQuaternion(worldQuat)
                    child.getWorldScale(worldScale)

                    clone.position.copy(worldPos)
                    clone.quaternion.copy(worldQuat)
                    clone.scale.copy(worldScale)
                    clone.geometry = clone.geometry.clone()

                    if (isWireframe) {
                        clone.material = new THREE.MeshBasicMaterial({
                            color: "#96CC39",
                            wireframe: true
                        })
                    } else if (clone.material) {
                        // For hero model, we clone the material to avoid side effects
                        if (Array.isArray(clone.material)) {
                            clone.material = clone.material.map(m => m.clone())
                        } else {
                            clone.material = clone.material.clone()
                        }
                    }

                    clone.userData.origPos = clone.position.clone()
                    clone.userData.origRot = clone.rotation.clone()
                    const radialDir = clone.position.clone().normalize()
                    const randomDir = new THREE.Vector3(
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2
                    ).normalize()
                    clone.userData.explodeDir = radialDir.lerp(randomDir, 0.3).normalize()

                    // DISABLE FRUSTUM CULLING TO PREVENT CLIPPING
                    clone.frustumCulled = false

                    parts.push(clone)
                }
            })
            return parts
        }

        return {
            wireframe: processModel(wireframeScene, true),
            hero: processModel(heroScene, false)
        }
    }, [wireframeScene, heroScene])

    const activeItems = (isLoader || progress < 0) ? items.wireframe : items.hero


    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (!groupRef.current) return

        // ORCHESTRATED ANIMATION LOGIC
        const rotationPhase = Math.max(0, Math.min(1, progress / 0.75))
        const explodePhase = Math.max(0, (progress - 0.75) / 0.25)

        // Base Idle/Hover
        const hover = Math.sin(time * 0.5) * 0.05

        // VERTICAL & HORIZONTAL POSITIONING
        let yOffset = 0
        let xOffset = 0

        if (!isLoader) {
            if (progress < 0) {
                // Initial Entry Phase (Landing)
                const entryVal = Math.abs(progress) // 1 to 0
                yOffset = entryVal * 8 // Fall from slightly above instead of completely off-screen
                xOffset = 3.0 // Match screenshot right-side position
            } else {
                // Normal Scrolling Phase
                if (progress < 0.2) {
                    // HERO TO CENTER TRANSITION (0 -> 0.2)
                    const transitionProgress = progress / 0.2
                    xOffset = 3.0 * (1 - transitionProgress)
                    yOffset = 0
                } else if (progress < 0.35) {
                    // Stay centered while text fades or other things happen
                    xOffset = 0
                    yOffset = 0
                } else {
                    xOffset = 0
                    yOffset = 0
                }
            }
        }

        groupRef.current.position.y = -yOffset + hover
        groupRef.current.position.x = xOffset
        groupRef.current.rotation.y = rotationPhase * Math.PI * 1.5 // 270 degrees

        activeItems.forEach((child, i) => {
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
        <group ref={groupRef} scale={1.4}>
            {activeItems.map((mesh, i) => (
                <primitive key={`${progress < 0 ? 'w' : 'h'}-${i}`} object={mesh} />
            ))}
        </group>
    )
}
