import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'

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


        // Subtle float for the whole group
        if (groupRef.current) {
            groupRef.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.03
        }
    })



    return (
        <group ref={groupRef} position={[0, -0.15, 0]} scale={0.65}>

            {/* ── Corner Scanning Brackets ── */}
            <CornerBracket position={[-(docW / 2 + bracketOffset), docH / 2 + bracketOffset, 0]} size={0.4} />
            <CornerBracket position={[docW / 2 + bracketOffset, docH / 2 + bracketOffset, 0]} flipX size={0.4} />
            <CornerBracket position={[-(docW / 2 + bracketOffset), -(docH / 2 + bracketOffset), 0]} flipY size={0.4} />
            <CornerBracket position={[docW / 2 + bracketOffset, -(docH / 2 + bracketOffset), 0]} flipX flipY size={0.4} />

            {/* ── Sci-fi 2D Brain / Mind (center of document) ── */}
            <group position={[0, -0.1, 0.02]}>
                {/* Brain outline - left hemisphere */}
                <LinePath points={[
                    [-0.6, 0.5, 0], [-0.75, 0.3, 0], [-0.8, 0.0, 0], [-0.75, -0.3, 0],
                    [-0.55, -0.5, 0], [-0.3, -0.55, 0], [0, -0.5, 0],
                ]} color="#0A1628" opacity={0.5} />
                {/* Brain outline - right hemisphere */}
                <LinePath points={[
                    [0.6, 0.5, 0], [0.75, 0.3, 0], [0.8, 0.0, 0], [0.75, -0.3, 0],
                    [0.55, -0.5, 0], [0.3, -0.55, 0], [0, -0.5, 0],
                ]} color="#0A1628" opacity={0.5} />
                {/* Brain top curve */}
                <LinePath points={[
                    [-0.6, 0.5, 0], [-0.4, 0.7, 0], [-0.1, 0.75, 0],
                    [0.1, 0.75, 0], [0.4, 0.7, 0], [0.6, 0.5, 0],
                ]} color="#0A1628" opacity={0.5} />
                {/* Central fissure */}
                <LinePath points={[
                    [0, 0.75, 0], [0, 0.4, 0], [-0.05, 0.1, 0], [0, -0.2, 0], [0, -0.5, 0],
                ]} color="#0A1628" opacity={0.35} />

                {/* Left hemisphere internal folds */}
                <LinePath points={[[-0.55, 0.35, 0], [-0.4, 0.15, 0], [-0.55, -0.05, 0], [-0.35, -0.25, 0]]} color="#0A1628" opacity={0.3} />
                <LinePath points={[[-0.3, 0.5, 0], [-0.2, 0.25, 0], [-0.35, 0.0, 0], [-0.2, -0.3, 0]]} color="#0A1628" opacity={0.3} />

                {/* Right hemisphere internal folds */}
                <LinePath points={[[0.55, 0.35, 0], [0.4, 0.15, 0], [0.55, -0.05, 0], [0.35, -0.25, 0]]} color="#0A1628" opacity={0.3} />
                <LinePath points={[[0.3, 0.5, 0], [0.2, 0.25, 0], [0.35, 0.0, 0], [0.2, -0.3, 0]]} color="#0A1628" opacity={0.3} />

                {/* Neural circuit nodes */}
                {[
                    [-0.4, 0.15], [-0.55, -0.05], [-0.2, 0.25], [-0.35, 0.0], [-0.2, -0.3],
                    [0.4, 0.15], [0.55, -0.05], [0.2, 0.25], [0.35, 0.0], [0.2, -0.3],
                    [0, 0.4], [0, -0.2], [-0.05, 0.1],
                ].map(([x, y], i) => (
                    <mesh key={`brain-node-${i}`} position={[x, y, 0]}>
                        <circleGeometry args={[0.025, 10]} />
                        <meshBasicMaterial color="#0A1628" opacity={0.4} transparent />
                    </mesh>
                ))}

                {/* Cross-hemisphere connections (circuit lines) */}
                <LinePath points={[[-0.4, 0.15, 0], [-0.1, 0.2, 0], [0.1, 0.2, 0], [0.4, 0.15, 0]]} color="#0A1628" opacity={0.2} />
                <LinePath points={[[-0.35, -0.25, 0], [-0.1, -0.25, 0], [0.1, -0.25, 0], [0.35, -0.25, 0]]} color="#0A1628" opacity={0.2} />
                <LinePath points={[[-0.55, -0.05, 0], [-0.2, 0.0, 0], [0.2, 0.0, 0], [0.55, -0.05, 0]]} color="#0A1628" opacity={0.2} />
            </group>



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
                <div className="absolute -right-25 w-[50vw] max-w-[900px] top-[14.2vh] h-[75vh] z-20 pointer-events-none fade-in opacity-100">
                    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="w-full h-full" style={{ pointerEvents: 'none' }}>
                        <GenbaAIScanner />
                    </Canvas>
                    {/* HTML overlay text with Inter font */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingTop: '6vh' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '4.5vw', fontWeight: 800, color: '#96CC39', lineHeight: 1, letterSpacing: '0.02em', opacity: 1 }}>
                            GenbaAI
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6vw', fontWeight: 500, color: '#0A1628', lineHeight: 1, letterSpacing: '0.25em', marginTop: '1em', textTransform: 'uppercase' as const }}>
                            in Action
                        </span>
                    </div>
                </div>

                <div className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-10 overflow-hidden">
                    {/* NeuralAccent removed, replaced by scanning radar */}
                    <div className="relative pointer-events-auto z-10">
                        <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">Artificial Intelligence</span>
                        <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
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
