import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Cpu, BarChart2, FileText, ArrowUpRight, AlertTriangle, Wind, LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface AICard { icon: LucideIcon; index: string; title: string; desc: string }

const aiCards: AICard[] = [
    { icon: Cpu, index: '01', title: 'Smart Data Capture', desc: 'AI reads supplier emails and documents, eliminating the need for partners to log in. No portal, no training required.' },
    { icon: BarChart2, index: '02', title: 'Predictive Risk Scoring', desc: 'ML models continuously analyze supply chain signals to forecast disruptions before they impact operations.' },
    { icon: FileText, index: '03', title: 'Automated Compliance', desc: 'Regulatory-aware AI automatically generates audit-ready CBAM, EPR, and IRA reports without manual effort.' },
    { icon: ArrowUpRight, index: '04', title: 'Material Flow Optimization', desc: 'AI recommends optimal recycled-to-virgin ratios, routing decisions, and inventory strategies at scale.' },
    { icon: AlertTriangle, index: '05', title: 'Emission Anomaly Detection', desc: 'Real-time AI monitoring flags irregularities in GHG data, ensuring data integrity and compliance trust.' },
    { icon: Wind, index: '06', title: 'Carbon Intelligence', desc: 'AI models fill data gaps to calculate granular Scope 3 emissions with high accuracy across all tiers.' },
]

const topCards = aiCards.slice(0, 3)
const bottomCards = aiCards.slice(3, 6)

const AINode = ({ card }: { card: AICard }) => {
    const Icon = card.icon
    return (
        <div
            className="feature-card w-[350px] shrink-0 flex flex-col justify-between py-8 px-8 border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative"
        >
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <div>
                <span className="text-[2rem] font-black text-electric-sulfur/50 leading-none block mb-2 tracking-tighter select-none pointer-events-none">{card.index}</span>
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">{card.title}</h3>
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">{card.desc}</p>
            </div>
        </div>
    )
}

/* ─── GenbaAI Document Scanner Animation ─────────────────── */

/* Helper: create a line from points array */
const LinePath = ({ points, color = '#96CC39', opacity = 0.4 }: { points: number[][]; color?: string; opacity?: number }) => {
    const positions = new Float32Array(points.flat())
    return (
        <line>
            <bufferGeometry attach="geometry">
                <bufferAttribute attach="attributes-position" args={[positions, 3]} count={points.length} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color={color} opacity={opacity} transparent />
        </line>
    )
}

/* Corner bracket (L-shaped) at a given corner — uses scale flipping for consistent look */
const CornerBracket = ({ position, flipX = false, flipY = false, size = 0.35, thickness = 0.04 }: { position: [number, number, number]; flipX?: boolean; flipY?: boolean; size?: number; thickness?: number }) => (
    <group position={position} scale={[flipX ? -1 : 1, flipY ? -1 : 1, 1]}>
        {/* Horizontal arm */}
        <mesh position={[size / 2, 0, 0]}>
            <planeGeometry args={[size, thickness]} />
            <meshBasicMaterial color="#96CC39" opacity={0.8} transparent side={THREE.DoubleSide} />
        </mesh>
        {/* Vertical arm */}
        <mesh position={[0, -size / 2, 0]}>
            <planeGeometry args={[thickness, size]} />
            <meshBasicMaterial color="#96CC39" opacity={0.8} transparent side={THREE.DoubleSide} />
        </mesh>
    </group>
)

const GenbaAIScanner = () => {
    const groupRef = useRef<THREE.Group>(null)
    const scanLineRef = useRef<THREE.Mesh>(null)
    const pulseRefs = useRef<THREE.Mesh[]>([])

    // Document dimensions
    const docW = 2.6
    const docH = 3.4
    const bracketOffset = 0.25 // extra space outside the doc

    useFrame((_state) => {
        const t = _state.clock.elapsedTime

        // Scan line sweeps up and down
        if (scanLineRef.current) {
            const scanY = Math.sin(t * 1.2) * (docH / 2 - 0.1)
            scanLineRef.current.position.y = scanY
        }

        // Pulse data nodes
        pulseRefs.current.forEach((mesh, i) => {
            if (mesh) {
                const phase = t * 2 + i * 1.1
                mesh.scale.setScalar(0.8 + 0.4 * Math.sin(phase))
                    ; (mesh.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.4 * Math.sin(phase)
            }
        })

        // Subtle float for the whole group
        if (groupRef.current) {
            groupRef.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.03
        }
    })

    // Data flow path points (a graph/chart inside the document)
    const dataFlowPath = [
        [-0.55, -0.6, 0.01],
        [-0.35, -0.3, 0.01],
        [-0.15, -0.5, 0.01],
        [0.05, 0.0, 0.01],
        [0.25, -0.2, 0.01],
        [0.45, 0.3, 0.01],
        [0.55, 0.1, 0.01],
    ]

    // Secondary data path
    const dataFlowPath2 = [
        [-0.55, -0.3, 0.01],
        [-0.3, 0.1, 0.01],
        [-0.05, -0.1, 0.01],
        [0.2, 0.4, 0.01],
        [0.45, 0.2, 0.01],
        [0.55, 0.5, 0.01],
    ]



    // Data node positions (where the chart hits key points)
    const dataNodes: [number, number][] = [
        [-0.35, -0.3], [0.05, 0.0], [0.45, 0.3],
        [-0.3, 0.1], [0.2, 0.4],
    ]

    return (
        <group ref={groupRef} position={[0, -0.15, 0]} scale={0.65}>

            {/* ── Corner Scanning Brackets ── */}
            <CornerBracket position={[-(docW / 2 + bracketOffset), docH / 2 + bracketOffset, 0]} size={0.4} />
            <CornerBracket position={[docW / 2 + bracketOffset, docH / 2 + bracketOffset, 0]} flipX size={0.4} />
            <CornerBracket position={[-(docW / 2 + bracketOffset), -(docH / 2 + bracketOffset), 0]} flipY size={0.4} />
            <CornerBracket position={[docW / 2 + bracketOffset, -(docH / 2 + bracketOffset), 0]} flipX flipY size={0.4} />

            {/* ── "GenbaAI in Action" title text on the document ── */}
            <Text
                position={[0, docH / 2 - 0.35, 0.05]}
                fontSize={0.22}
                color="#96CC39"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.15}
                fillOpacity={1}
            >
                {'GenbaAI in Action'}
            </Text>

            {/* ── Document outline ── */}
            <LinePath
                points={[
                    [-docW / 2, docH / 2, 0], [docW / 2 - 0.3, docH / 2, 0],
                    [docW / 2, docH / 2 - 0.3, 0], [docW / 2, -docH / 2, 0],
                    [-docW / 2, -docH / 2, 0], [-docW / 2, docH / 2, 0],
                ]}
                opacity={0.5}
            />

            {/* ── Document fold corner ── */}
            <LinePath
                points={[
                    [docW / 2 - 0.3, docH / 2, 0],
                    [docW / 2 - 0.3, docH / 2 - 0.3, 0],
                    [docW / 2, docH / 2 - 0.3, 0],
                ]}
                opacity={0.5}
            />

            {/* ── Document body fill ── */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[docW, docH]} />
                <meshBasicMaterial color="#96CC39" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* ── Data flow chart line 1 ── */}
            <LinePath points={dataFlowPath} opacity={1} />

            {/* ── Data flow chart line 2 ── */}
            <LinePath points={dataFlowPath2} color="#96CC39" opacity={1} />

            {/* ── Data nodes (pulsing circles at key inflection points) ── */}
            {dataNodes.map(([x, y], i) => (
                <group key={`node-${i}`}>
                    {/* Outer ring */}
                    <mesh position={[x, y, 0.02]}>
                        <ringGeometry args={[0.04, 0.055, 16]} />
                        <meshBasicMaterial color="#96CC39" opacity={0.5} transparent side={THREE.DoubleSide} />
                    </mesh>
                    {/* Inner dot (pulsing) */}
                    <mesh
                        position={[x, y, 0.02]}
                        ref={(el: THREE.Mesh | null) => { if (el) pulseRefs.current[i] = el }}
                    >
                        <circleGeometry args={[0.03, 12]} />
                        <meshBasicMaterial color="#96CC39" opacity={0.8} transparent />
                    </mesh>
                </group>
            ))}

            {/* ── Animated scan line (horizontal beam sweeping vertically) ── */}
            <mesh ref={scanLineRef} position={[0, 0, 0.03]}>
                <planeGeometry args={[docW + 0.4, 0.02]} />
                <meshBasicMaterial color="#96CC39" opacity={0} transparent side={THREE.DoubleSide} />
            </mesh>
            {/* Scan line glow */}
            <mesh ref={scanLineRef} position={[0, 0, 0.025]}>
                <planeGeometry args={[docW + 0.4, 0.18]} />
                <meshBasicMaterial color="#96CC39" opacity={0.5} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* ── Small gear/cog icons (representing AI processing) ── */}
            {[[-0.5, 0.15], [0.35, -0.55]].map(([x, y], i) => (
                <lineLoop key={`gear-${i}`}>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attach="attributes-position"
                            args={[
                                new Float32Array(
                                    Array.from({ length: 13 }, (_, j) => {
                                        const angle = (j / 12) * Math.PI * 2
                                        const r = j % 2 === 0 ? 0.07 : 0.05
                                        return [x + Math.cos(angle) * r, y + Math.sin(angle) * r, 0.02]
                                    }).flat()
                                ),
                                3
                            ]}
                            count={13}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial attach="material" color="#96CC39" opacity={0.4} transparent />
                </lineLoop>
            ))}

        </group>
    )
}

export const AINarrative = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const topTrackRef = useRef<HTMLDivElement>(null)
    const bottomTrackRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!topTrackRef.current || !bottomTrackRef.current || !contentWrapperRef.current || !sectionRef.current) return
        const getTrackWidth = () => topTrackRef.current!.scrollWidth
        const getWindowWidth = () => window.innerWidth

        gsap.set([topTrackRef.current, bottomTrackRef.current], { x: () => getWindowWidth() })

        const tl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, pin: true, scrub: 1, invalidateOnRefresh: true, start: 'top top', end: () => `+=${getTrackWidth() + getWindowWidth()}` }
        })
        tl.to([topTrackRef.current, bottomTrackRef.current], { x: () => getWindowWidth() - getTrackWidth(), ease: 'none', duration: () => getTrackWidth() })
        tl.to(contentWrapperRef.current, { x: () => -getWindowWidth(), ease: 'none', duration: () => getWindowWidth() })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="ai" className="relative w-full overflow-hidden z-[50] h-screen bg-white flex flex-col">
            <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1 pt-28 pb-8">

                <div ref={topTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                    {topCards.map(c => <AINode key={c.title} card={c} />)}
                </div>

                {/* 
                    GenbaAI Scanner Container:
                    - Same positioning rules as Traction globe.
                    - ON TOP of cards (z-20), pointer-events-none.
                    - No overflow-hidden so no clipping.
                */}
                <div className="absolute right-0 w-[50vw] max-w-[900px] top-[14.2vh] h-[75vh] z-20 pointer-events-none fade-in opacity-100">
                    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="w-full h-full" style={{ pointerEvents: 'none' }}>
                        <GenbaAIScanner />
                    </Canvas>
                </div>

                <div className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-10 overflow-hidden">
                    {/* NeuralAccent removed, replaced by scanning radar */}
                    <div className="relative pointer-events-auto z-10">
                        <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">Artificial Intelligence</span>
                        <h2 className="text-[7vw] md:text-[5vw] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                            AI-Powered<br />Intelligence.
                        </h2>
                        <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                            Scroll to explore all 6 AI capabilities →
                        </p>
                    </div>
                </div>

                <div ref={bottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                    {bottomCards.map(c => <AINode key={c.title} card={c} />)}
                </div>

            </div>
        </section>
    )
}
