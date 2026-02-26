import { useRef, Suspense } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { DeconstructibleCar } from './DeconstructibleCar'
import { Target, Brain, Globe, ShieldCheck, Plug, Lock, LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface WhyCard { icon: LucideIcon; index: string; title: string; desc: string }

const whyCards: WhyCard[] = [
    { icon: Target, index: '01', title: 'Deep Tier Precision', desc: 'We don\'t just track Direct Suppliers. We trace the entire value chain all the way back to source extraction.' },
    { icon: Brain, index: '02', title: 'Industrial Grade AI', desc: 'Custom ML models built specifically for complex material data and industrial OEM supplier documents.' },
    { icon: Globe, index: '03', title: 'Global Architecture', desc: 'Nodes in every major industrial hub—Mumbai to San Francisco—ensuring zero latency at enterprise scale.' },
    { icon: ShieldCheck, index: '04', title: 'Compliance Ready', desc: 'Built-in frameworks for EU Battery Passport, CBAM, US Clean Air Act, and expanding global mandates.' },
    { icon: Plug, index: '05', title: 'Seamless Integration', desc: 'Connects with existing ERPs like SAP, Oracle, and Dynamics in minutes, not months. Zero rip-and-replace.' },
    { icon: Lock, index: '06', title: 'Audit-Proof Proof', desc: 'Tamper-proof traceability records that withstand the most rigorous regulatory and third-party audits.' },
]

const topCards = whyCards.slice(0, 3)
const bottomCards = whyCards.slice(3, 6)

const WhyNode = ({ card }: { card: WhyCard }) => {
    const Icon = card.icon
    return (
        <div
            className="feature-card shrink-0 flex flex-col justify-between py-8 px-8 border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative"
            style={{ width: 'calc(100vw / 3)' }}
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

export const WhyMatNextNarrative = () => {
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
        <section ref={sectionRef} id="why-matnext" className="relative w-full overflow-hidden z-[50] h-screen bg-white flex flex-col">
            <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1 pt-28 pb-10">

                <div ref={topTrackRef} className="flex items-stretch w-max relative z-10 shrink-0 border-y border-data-navy/5 h-[30vh] max-h-[280px]">
                    {topCards.map(c => <WhyNode key={c.title} card={c} />)}
                </div>

                {/* Central text — 3D car replaces the right watermark */}
                <div className="relative flex-1 flex items-center px-10 md:px-20 overflow-hidden pointer-events-none">

                    {/* Left: text content */}
                    <div className="relative pointer-events-auto z-10 flex-1">
                        <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">Why Choose Us</span>
                        <h2 className="text-[7vw] md:text-[5vw] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                            Why<br />MatNEXT?
                        </h2>
                        <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                            Scroll to explore all 6 reasons →
                        </p>
                    </div>

                    {/* Right: 3D car — same height as text content area, no watermark text */}
                    <div className="relative z-0 pointer-events-auto" style={{ width: '45%', height: '100%' }}>
                        <Canvas gl={{ antialias: true, alpha: true }}>
                            <Suspense fallback={null}>
                                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                                <DeconstructibleCar progress={0.35} isLoader={true} />
                                <Environment preset="city" />
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#96CC39" />
                            </Suspense>
                        </Canvas>
                    </div>
                </div>

                <div ref={bottomTrackRef} className="flex items-stretch w-max relative z-10 shrink-0 border-y border-data-navy/5 h-[30vh] max-h-[280px]">
                    {bottomCards.map(c => <WhyNode key={c.title} card={c} />)}
                </div>

            </div>
        </section>
    )
}
