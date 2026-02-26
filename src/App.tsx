import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { BackgroundShader } from '@/components/common/BackgroundShader'
import { DeconstructibleCar } from '@/components/common/DeconstructibleCar'
import { HeroStats } from '@/components/common/HeroStats'
import { TraceabilityMap } from './components/common/TraceabilityMap'
import { TractionNarrative } from '@/components/common/TractionNarrative'
import { AINarrative } from '@/components/common/AINarrative'
import { WhyMatNextNarrative } from '@/components/common/WhyMatNextNarrative'
import { FooterNarrative } from '@/components/common/FooterNarrative'
import { FeaturesNarrative } from '@/components/common/FeaturesNarrative'
// import { FloatingMaterial } from '@/components/common/FloatingMaterial'
import { Loader } from '@/components/common/Loader'
import { SoundController } from '@/utils/SoundController'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
    ArrowRight,
} from 'lucide-react'
import logo from './assets/MatNEXT.png'
import { Analytics } from '@vercel/analytics/react'


gsap.registerPlugin(ScrollTrigger)

function App() {
    const container = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isLanding, setIsLanding] = useState(false)
    const [entryProgress, setEntryProgress] = useState(1) // 1 to 0 (Falling down)
    const lenisRef = useRef<Lenis | null>(null)
    const [isMuted, setIsMuted] = useState(SoundController.getMuteState())

    const handleToggleMute = () => {
        setIsMuted(SoundController.toggleMute())
    }

    const scrollToSection = (id: string) => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(id, {
                duration: 2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            })
        }
    }

    // Scroll-triggered sound events
    useEffect(() => {
        // Shatter/boom when car starts exploding
        if (scrollProgress > 0.4 && scrollProgress < 0.45) {
            SoundController.playShatter()
        } else if (scrollProgress < 0.35) {
            // Reset shatter so it triggers again if they scroll back down
            SoundController.resetEvent('shatter')
        }

        // Reset whoosh event when user scrolls back to the very top
        if (scrollProgress < 0.05) {
            SoundController.resetEvent('whoosh')
        }
    }, [scrollProgress])

    // Lenis Smooth Scroll Initialization
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.1,
        })

        lenisRef.current = lenis

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        lenis.on('scroll', () => {
            ScrollTrigger.update()
        })

        return () => {
            lenis.destroy()
        }
    }, [])

    // Scrollytelling Progress Tracker
    useGSAP(() => {
        ScrollTrigger.create({
            trigger: '.hero-wrapper',
            start: 'top top',
            end: '+=400%',
            pin: true,
            scrub: 1,
            refreshPriority: 10, // Force parent pin calculation before child components
            onUpdate: (self) => {
                setScrollProgress(self.progress)
            }
        })

    }, { scope: container })

    const onLoaderComplete = useCallback(() => {
        setLoading(false)

        // 1. Reveal Hero content FIRST
        gsap.fromTo(".hero-reveal",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    // 2. Start Car Entry (Land from above to the RIGHT) AFTER text reveal
                    setIsLanding(true)
                    SoundController.playWhoosh() // Whoosh as car enters
                    gsap.to({ val: 1 }, {
                        val: 0,
                        duration: 2,
                        ease: "power3.out",
                        onUpdate: function () {
                            setEntryProgress(this.targets()[0].val)
                        },
                        onComplete: () => {
                            setIsLanding(false)
                        }
                    })
                }
            }
        )
    }, [])

    // Features data moved to FeaturesNarrative.tsx

    return (
        <main ref={container} className="relative w-full selection:bg-electric-sulfur selection:text-white overflow-x-hidden">

            {/* GLOBAL 3D CANVAS */}
            <div
                className="fixed inset-0 -z-10 h-screen w-full overflow-hidden"
                style={{
                    opacity: scrollProgress > 0.80 ? Math.max(0, 1 - ((scrollProgress - 0.80) / 0.15)) : 1,
                    pointerEvents: scrollProgress > 0.80 ? 'none' : 'auto'
                }}
            >
                <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0.5, 20]} fov={18} near={0.1} far={10000} />
                        <BackgroundShader />
                        <DeconstructibleCar progress={loading ? -1 : (isLanding ? -entryProgress : scrollProgress)} isLoader={false} />

                        {/* Traceability Map UI will overlay here - previously the 3D material nuggets were here */}

                        <Environment preset="city" />
                        <ambientLight intensity={1.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                    </Suspense>
                </Canvas>
            </div>

            {loading && <Loader onComplete={onLoaderComplete} />}

            {/* TRACEABILITY MAP OVERLAY — appears during car explosion */}
            {!loading && <TraceabilityMap scrollProgress={scrollProgress} />}

            {/* Navigation */}
            <nav
                style={{
                    opacity: (!loading && scrollProgress < 0.3) ? 1 : (scrollProgress > 0.45 ? 1 : 0),
                    pointerEvents: (!loading && (scrollProgress < 0.3 || scrollProgress > 0.45)) ? 'auto' : 'none',
                    zIndex: 100
                }}
                className="fixed top-0 flex w-full items-center justify-between px-10 py-6 text-data-navy transition-all duration-700 bg-white border-b border-data-navy/10"
            >
                <div
                    className="flex items-center cursor-pointer group"
                    onClick={() => {
                        SoundController.playClickSound();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <img src={logo} alt="MatNEXT Logo" className="h-5 w-auto object-contain transition-transform duration-300 group-hover:scale-110" style={{ filter: 'none' }} />
                </div>
                <div className="hidden gap-10 text-[10px] font-bold tracking-[0.3em] md:flex opacity-100">
                    {['FEATURES', 'TRACTION', 'AI', 'WHY-MATNEXT', 'CUSTOMERS'].map((item) => (
                        <button key={item}
                            onClick={() => {
                                SoundController.playClickSound();
                                scrollToSection(`#${item.toLowerCase()}`);
                            }}
                            onMouseEnter={() => SoundController.playHoverSound()}
                            className="hover:text-electric-sulfur transition-all duration-300 cursor-pointer text-left">
                            /{item.replace('-', ' ')}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleToggleMute}
                        onMouseEnter={() => SoundController.playHoverSound()}
                        className="text-data-navy hover:text-electric-sulfur transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button
                        onMouseEnter={() => SoundController.playHoverSound()}
                        onClick={() => SoundController.playClickSound()}
                        className="btn-premium py-2.5 px-6 group relative flex items-center gap-2 transition-all duration-300 hover:bg-electric-sulfur hover:text-data-navy text-[10px] tracking-widest"
                    >
                        Request Platform Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* SECTION 1: HERO OVERHAUL */}
            <div className="hero-wrapper relative w-full overflow-hidden bg-transparent">
                <section className="h-screen w-full flex flex-col justify-center p-10 md:p-20 pt-20 bg-transparent">
                    <div
                        style={{
                            opacity: Math.max(0, 1 - scrollProgress * 5),
                            transform: `translateY(${scrollProgress * -100}px)`,
                            pointerEvents: scrollProgress > 0.15 ? 'none' : 'auto'
                        }}
                        className="hero-content z-10 w-full"
                    >
                        <h1
                            className="hero-reveal text-editorial-h1 uppercase text-electric-sulfur max-w-5xl relative top-12 opacity-0"
                        >
                            Product and Material Tracking, Traceability <br /> and Sustainability Platform
                        </h1>

                        <div className="flex flex-col md:flex-row items-end justify-between w-full">
                            <div className="max-w-xl">
                                <p
                                    className="hero-reveal text-[14px] text-justify opacity-0 mb-6 leading-relaxed"
                                >
                                    <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }} className="text-electric-sulfur text-2xl font-bold">MatNEXT</span> is an end-to-end materials traceability and management platform that enables OEMs and value chain partners to track recycled content, carbon footprint, and regulatory compliance across every stage of production.
                                </p>
                                <div className="hero-reveal flex gap-10 opacity-0">
                                    <button
                                        onMouseEnter={() => SoundController.playHoverSound()}
                                        onClick={() => SoundController.playClickSound()}
                                        className="btn-premium group flex items-center gap-4 pointer-events-auto"
                                    >
                                        Request Platform Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                    <button
                                        onMouseEnter={() => SoundController.playHoverSound()}
                                        onClick={() => SoundController.playClickSound()}
                                        className="btn-premium group flex items-center gap-4 text-data-navy tracking-widest py-2.5 px-10 font-bold text-[10px] bg-electric-sulfur hover:bg-data-navy hover:text-white transition-all duration-500 pointer-events-auto"
                                    >
                                        Explore the Engine <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* HERO STATS - REPOSITIONED UNDER CAR */}
                            <div className="hero-reveal opacity-0 md:mr-24 lg:mr-48">
                                <HeroStats />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SCROLL TOOLTIP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (!loading && !isLanding && scrollProgress < 0.1) ? 1 : 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 z-20 pointer-events-none"
                >
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-[2px] h-12 bg-data-navy/20 relative overflow-hidden">
                            <motion.div
                                animate={{ y: [0, 48] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-full h-1/2 bg-electric-sulfur"
                            />
                        </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Scroll to Explore</span>
                </motion.div>
            </div>

            {/* SECTION 2: FEATURES NARRATIVE (HORIZONTAL SCROLL) */}
            <FeaturesNarrative />

            {/* SECTION 3: TRACTION NARRATIVE (HORIZONTAL SCROLL) */}
            <TractionNarrative />

            {/* SECTION 4: AI NARRATIVE (HORIZONTAL SCROLL) */}
            <AINarrative />

            {/* SECTION 5: WHY MATNEXT NARRATIVE (HORIZONTAL SCROLL) */}
            <WhyMatNextNarrative />

            {/* FOOTER + CONTACT: Unified horizontal-scroll narrative */}
            <FooterNarrative />
            <Analytics />
        </main>
    )
}

export default App

