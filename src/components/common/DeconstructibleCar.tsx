import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const carModelUrl = '/models/generic_sedan_car.glb'
const heroModelUrl = '/models/generic_sedan_car/scene.gltf'

interface DeconstructibleCarProps {
    progress: number
    isLoader?: boolean
}

const ProcessedMeshGroup = ({ scene, isWireframe, progress, isLoader }: { scene: THREE.Group, isWireframe: boolean, progress: number, isLoader: boolean }) => {
    const groupRef = useRef<THREE.Group>(null!)
    const parts = useMemo(() => {
        const meshes: THREE.Mesh[] = []
        if (!scene) return meshes
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
                    clone.material = new THREE.MeshBasicMaterial({ color: "#96CC39", wireframe: true })
                } else if (clone.material) {
                    if (Array.isArray(clone.material)) {
                        clone.material = clone.material.map(m => m.clone())
                    } else {
                        clone.material = clone.material.clone()
                    }
                }
                clone.userData.origPos = clone.position.clone()
                clone.userData.origRot = clone.rotation.clone()
                const radialDir = clone.position.clone().normalize()
                const randomDir = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).normalize()
                clone.userData.explodeDir = radialDir.lerp(randomDir, 0.3).normalize()
                clone.frustumCulled = false
                meshes.push(clone)
            }
        })
        return meshes
    }, [scene, isWireframe])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (!groupRef.current) return

        const rotationPhase = Math.max(0, Math.min(1, progress / 0.75))
        const explodePhase = Math.max(0, (progress - 0.75) / 0.25)
        const hover = Math.sin(time * 0.5) * 0.05

        // FIXED SCALE: 1.2
        const scale = 1.2
        groupRef.current.scale.setScalar(scale)

        let yOffset = 0
        let xOffset = 0
        if (!isLoader) {
            if (progress < 0) {
                const entryVal = Math.abs(progress)
                yOffset = entryVal * 8
                xOffset = 3.0
            } else {
                if (progress < 0.2) {
                    const transitionProgress = progress / 0.2
                    xOffset = 3.0 * (1 - transitionProgress)
                }
            }
        }
        groupRef.current.position.y = -yOffset + hover
        groupRef.current.position.x = xOffset

        // ORBITING MODE: After centering (0.2+), add auto-rotate
        const baseAutoRotate = progress > 0.2 ? time * 0.2 : 0
        groupRef.current.rotation.y = baseAutoRotate + rotationPhase * Math.PI * 1.5

        parts.forEach((child, i) => {
            if (explodePhase > 0) {
                const explodeFactor = explodePhase * 25
                const dir = child.userData.explodeDir
                child.position.x = child.userData.origPos.x + dir.x * explodeFactor
                child.position.y = child.userData.origPos.y + dir.y * explodeFactor
                child.position.z = child.userData.origPos.z + dir.z * explodeFactor
                child.rotation.x = child.userData.origRot.x + explodePhase * Math.sin(i) * 20
                child.rotation.y = child.userData.origRot.y + explodePhase * Math.cos(i) * 20
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
        <group ref={groupRef} frustumCulled={false}>
            {parts.map((mesh, i) => (
                <primitive key={i} object={mesh} />
            ))}
        </group>
    )
}

const WireframeLayer = ({ progress, isLoader }: DeconstructibleCarProps) => {
    const { scene } = useGLTF(carModelUrl)
    return <ProcessedMeshGroup scene={scene} isWireframe={true} progress={progress} isLoader={isLoader || false} />
}

const HeroLayer = ({ progress }: { progress: number }) => {
    const { scene } = useGLTF(heroModelUrl)
    return <ProcessedMeshGroup scene={scene} isWireframe={false} progress={progress} isLoader={false} />
}

export const DeconstructibleCar = ({ progress, isLoader = false }: DeconstructibleCarProps) => {
    const showHero = !isLoader && progress >= 0
    return (
        <Suspense fallback={null}>
            {showHero ? (
                <HeroLayer progress={progress} />
            ) : (
                <WireframeLayer progress={progress} isLoader={isLoader} />
            )}
        </Suspense>
    )
}
