import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { BackgroundShader } from '@/components/common/BackgroundShader'
import { DeconstructibleCar } from '@/components/common/DeconstructibleCar'
import { HeroStats } from '@/components/common/HeroStats'
import { TraceabilityMap } from './components/common/TraceabilityMap'
import { TractionMetrics } from '@/components/common/TractionMetrics'
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
    BarChart3,
    RotateCcw,
    Map,
    ShieldAlert,
    Globe,
    Database,
    Network,
    Cpu,
    Zap,
    Layers,
    Users,
    Factory
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
            onUpdate: (self) => {
                setScrollProgress(self.progress)
            }
        })

        // Hero fade on scroll - Handled by state in render now

        const horizontalSection = document.querySelector('.horizontal-scroll-content')
        if (horizontalSection) {
            gsap.to(horizontalSection, {
                x: () => -(horizontalSection.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: '.horizontal-wrapper',
                    start: 'top top',
                    end: () => `+=${horizontalSection.scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            })
        }
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

    const features = [
        { title: 'Tracking & Traceability', desc: 'Real-time traceability intelligence tracks every material, batch, and transaction across your value chain.', icon: BarChart3 },
        { title: 'Sustainability Engine', desc: 'Automate carbon accounting and ESG compliance with precision-engineered data protocols.', icon: RotateCcw },
        { title: 'Dynamic Mapping', desc: 'Visualize your entire supply chain network from raw material extraction to final assembly.', icon: Map },
        { title: 'Risk Intelligence', desc: 'Predictive analytics identify supply chain disruptions and compliance vulnerabilities before they occur.', icon: ShieldAlert },
        { title: 'Material Passport', desc: 'Every product gets a digital twin containing its entire lifecycle and sustainability history.', icon: Globe },
        { title: 'Compliance Vault', desc: 'Securely store and manage all regulatory documentation and certifications in a tamper-proof ledger.', icon: Database },
        { title: 'Supplier Network', desc: 'Onboard and manage thousands of suppliers with automated data verification and scoring.', icon: Network },
        { title: 'AI Automation', desc: 'Harness the power of machine learning to extract and verify data from complex supply chain documents.', icon: Cpu },
        { title: 'Operational Efficiency', desc: 'Streamline procurement and logistics with data-driven insights and automated workflows.', icon: Zap },
        { title: 'Stakeholder Portal', desc: 'Seamlessly share supply chain data with customers, investors, and regulatory bodies.', icon: Users },
        { title: 'Industry Benchmarks', desc: 'Compare your sustainability performance against industry standards and global competitors.', icon: Factory },
        { title: 'Scalable Architecture', desc: 'Built for enterprise-scale operations, handling millions of transactions with military-grade security.', icon: Layers }
    ]

    const whyMatNext = [
        { id: '01', title: 'Deep Tier Precision', desc: 'We don\'t just track Direct Suppliers. We track the entire value chain back to the source.' },
        { id: '02', title: 'Industrial Grade AI', desc: 'Custom ML models built specifically for complex material data and industrial documents.' },
        { id: '03', title: 'Global Architecture', desc: 'Nodes in every major industrial hub—Mumbai to San Francisco—ensuring zero latency.' },
        { id: '04', title: 'Compliance Ready', desc: 'Built-in frameworks for EU Battery Passport, US Clean Air Act, and more.' },
        { id: '05', title: 'Seamless Integration', desc: 'Connects with existing ERPs like SAP, Oracle, and Dynamics in minutes, not months.' },
        { id: '06', title: 'Audit-Proof Proof', desc: 'Tamper-proof traceability that withstands the most rigorous regulatory audits.' }
    ]

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

            {/* SECTION 2: FEATURES */}
            <section id="features" className="relative z-20 min-h-screen bg-white/80 backdrop-blur-sm section-padding -mt-[40vh]">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-32 border-b border-data-navy/10 pb-16">
                    <div>
                        <span className="text-electric-sulfur text-mono-label block mb-6">Platform Capabilities</span>
                        <h2 className="text-[5.18vw] text-data-navy font-black leading-[0.8] uppercase tracking-tighter">Comprehensive Sustainability Engine</h2>
                    </div>
                    {/* <p className="max-w-sm text-[11px] uppercase font-mono opacity-50 text-right leading-loose pt-10 lg:pt-0">
                        A massive 12-layer tracking and traceability suite designed to automate regulatory extraction and circularity intelligence across 20+ tiers.
                    </p> */}
                </div>

                <div className="flex flex-col">
                    {features.map((feat, i) => (
                        <div
                            key={feat.title}
                            className="group relative flex items-center justify-between py-12 border-b border-data-navy/5 hover:bg-neutral-50 transition-colors duration-700 px-4 cursor-pointer"
                        >
                            <div className="flex items-center gap-12 lg:gap-24">
                                <span className="text-mono-label opacity-20 group-hover:opacity-100 group-hover:text-electric-sulfur transition-all">0{i + 1}</span>
                                <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-700">
                                    {feat.title}
                                </h3>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <p className="text-[12px] font-mono text-right font-bold uppercase leading-relaxed text-data-navy/60">
                                    {feat.desc}
                                </p>
                                <div className="p-3 bg-data-navy rounded-full">
                                    <feat.icon className="w-5 h-5 text-electric-sulfur" />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-electric-sulfur/0 group-hover:bg-electric-sulfur/5 -z-10 transition-colors duration-700" />
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 3: TRACTION METRICS (BENTO GRID) */}
            <div id="traction" className="relative z-30">
                <TractionMetrics />
            </div>

            {/* SECTION 4: AI OVERHAUL */}
            <section id="ai" className="relative min-h-screen bg-data-navy section-padding text-white overflow-hidden">
                <div className="text-center mb-32 relative z-10">
                    <span className="text-electric-sulfur text-mono-label block mb-6">Artificial Intelligence</span>
                    <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none mb-10">AI-Powered <span className="text-outline text-transparent" style={{ WebkitTextStroke: '2px #FFFFFF' }}>Intelligence</span></h2>
                    <p className="max-w-4xl mx-auto text-xl opacity-60 font-mono leading-relaxed px-10">
                        MatNEXT embeds AI throughout the entire platform — not as a feature, but as the core engine driving intelligent data capture, predictive analytics, and automated compliance.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32 max-w-7xl mx-auto relative z-10">
                    {[
                        { title: 'Smart Data Capture', desc: 'AI reads supplier emails and documents, eliminating the need for partners to log in. No portal, no training required.' },
                        { title: 'Predictive Risk Scoring', desc: 'ML models continuously analyze supply chain signals to forecast disruptions before they impact operations.' },
                        { title: 'Automated Compliance', desc: 'Regulatory-aware AI automatically generates audit-ready CBAM, EPR, and IRA reports.' },
                        { title: 'Material Flow Optimization', desc: 'AI recommends optimal recycled-to-virgin ratios, routing decisions, and inventory strategies.' },
                        { title: 'Emission Anomaly Detection', desc: 'Real-time AI monitoring flags irregularities in GHG data, ensuring data integrity and compliance trust.' },
                        { title: 'Carbon Intelligence', desc: 'AI models fill data gaps to calculate granular Scope 3 emissions with high accuracy.' }
                    ].map((item, i) => (
                        <div key={item.title} className="group relative flex gap-12 border-l border-white/10 pl-12 hover:border-electric-sulfur transition-colors duration-700">
                            <span className="text-mono-label text-electric-sulfur/30 group-hover:text-electric-sulfur transition-colors">0{i + 1}</span>
                            <div>
                                <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter group-hover:translate-x-2 transition-transform duration-700">{item.title}</h3>
                                <p className="text-[13px] opacity-40 font-mono leading-loose uppercase group-hover:opacity-100 transition-opacity duration-700">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-10 grid-rows-10">
                    {Array.from({ length: 100 }).map((_, i) => <div key={i} className="border-[0.5px] border-white"></div>)}
                </div>
            </section>

            {/* SECTION 5: WHY MATNEXT? */}
            <section id="why-matnext" className="relative min-h-screen bg-white/80 backdrop-blur-sm section-padding">
                <div className="text-center mb-32">
                    <span className="text-electric-sulfur text-mono-label block mb-6">Why Choose Us</span>
                    <h2 className="text-[10vw] text-data-navy font-black leading-none uppercase tracking-tighter">Why <span className="text-outline text-transparent" style={{ WebkitTextStroke: '2px #0A0A0B' }}>MatNEXT?</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
                    {whyMatNext.map((item) => (
                        <div key={item.id} className="relative group p-12 border border-data-navy/5 hover:bg-neutral-50 transition-all duration-700 cursor-pointer">
                            <span className="text-[12vw] font-black absolute top-0 right-10 text-neutral-100 group-hover:text-electric-sulfur/5 transition-colors z-0 select-none">
                                {item.id}
                            </span>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-black uppercase mb-8 leading-[0.85] tracking-tighter">
                                    {item.title}
                                </h3>
                                <p className="max-w-md text-[13px] opacity-50 font-mono leading-loose uppercase font-bold">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 6: PREMIUM CONTACT FORM - PRISTINE INDUSTRIAL */}
            <section id="customers" className="relative min-h-screen bg-white text-data-navy section-padding border-t border-data-navy/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                        <div className="lg:col-span-5">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-electric-sulfur text-mono-label block mb-8"
                            >
                                Contact_Gateway
                            </motion.span>
                            <h2 className="text-[7vw] font-black uppercase tracking-tighter leading-[0.85] mb-12">
                                Secure your <br />
                                <span className="text-electric-sulfur outline-text">Competitive</span> <br />
                                Advantage
                            </h2>
                            <p className="text-sm opacity-50 font-mono leading-loose mb-16 uppercase font-bold max-w-sm">
                                Deploy MatNEXT traceability intelligence across your global industrial nodes.
                            </p>

                            <div className="space-y-10 border-l border-data-navy/10 pl-10">
                                <div className="group cursor-pointer">
                                    <span className="text-[10px] opacity-30 block mb-2 uppercase tracking-widest font-mono">Channel_01</span>
                                    <span className="text-lg font-bold group-hover:text-electric-sulfur transition-colors italic">info-matnext@genbanext.com</span>
                                </div>
                                <div className="group cursor-pointer">
                                    <span className="text-[10px] opacity-30 block mb-2 uppercase tracking-widest font-mono">Channel_02</span>
                                    <span className="text-lg font-bold group-hover:text-electric-sulfur transition-colors italic">+81 80-8529-3858</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 bg-slate-50 p-10 lg:p-20 border border-data-navy/5 relative overflow-hidden">
                            {/* Subtle Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'linear-gradient(#1A1D23 1px, transparent 1px), linear-gradient(90deg, #1A1D23 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                            />

                            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[9px] text-data-navy/40 font-bold uppercase tracking-[0.3em]">01_Global_Identity</label>
                                    <input type="text" className="w-full bg-transparent border-b border-data-navy/10 py-5 focus:border-electric-sulfur outline-none font-mono text-lg transition-all placeholder:opacity-20 uppercase" placeholder="Enter Full Name" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] text-data-navy/40 font-bold uppercase tracking-[0.3em]">02_Secure_Email</label>
                                    <input type="email" className="w-full bg-transparent border-b border-data-navy/10 py-5 focus:border-electric-sulfur outline-none font-mono text-lg transition-all placeholder:opacity-20 uppercase" placeholder="Email@Network.com" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] text-data-navy/40 font-bold uppercase tracking-[0.3em]">03_Industrial_Sector</label>
                                    <select className="w-full bg-transparent border-b border-data-navy/10 py-5 focus:border-electric-sulfur outline-none font-mono text-lg transition-all appearance-none uppercase">
                                        <option>Select Tier</option>
                                        <option>Automotive</option>
                                        <option>Renewables</option>
                                        <option>Aerospace</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[9px] text-data-navy/40 font-bold uppercase tracking-[0.3em]">04_Data_Requirements</label>
                                    <textarea className="w-full bg-transparent border-b border-data-navy/10 py-5 focus:border-electric-sulfur outline-none font-mono text-lg transition-all min-h-[100px] resize-none placeholder:opacity-20 uppercase" placeholder="Describe Project Scope" />
                                </div>
                                <div className="md:col-span-2 pt-10">
                                    <button className="btn-premium w-full !py-8 text-sm group flex items-center justify-center gap-6 bg-data-navy text-white hover:bg-electric-sulfur hover:text-data-navy">
                                        INITIALIZE ACCESS PROTOCOL <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER: THE MUSEUM OF INNOVATION */}
            <footer className="relative bg-white pt-32 pb-10 border-t border-data-navy/5 overflow-hidden">
                <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }} className="absolute top-0 left-1/2 -translate-x-1/2 text-[20vw] font-black text-electric-sulfur/10 leading-none select-none pointer-events-none font-">
                    MATNEXT
                </div>

                <div className="max-w-7xl mx-auto px-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 border-b border-data-navy/5 pb-20">
                        <div className="lg:col-span-4">
                            <img src={logo} alt="MatNEXT" className="h-6 w-auto mb-10" />
                            <p className="max-w-xs text-[11px] font-mono opacity-40 leading-loose uppercase font-bold tracking-tight">
                                Establishing the global standard for industrial material traceability and digital product passports.
                            </p>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                            <div>
                                <span className="text-[9px] text-electric-sulfur font-bold block mb-10 uppercase tracking-widest">Platform_Node</span>
                                <ul className="space-y-4 text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-30">
                                    {['Features', 'Traction', 'Intelligence', 'Network'].map(item => (
                                        <li key={item}><a href="#" className="hover:text-data-navy hover:opacity-100 transition-all">/{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-[9px] text-electric-sulfur font-bold block mb-10 uppercase tracking-widest">Resource_Center</span>
                                <ul className="space-y-4 text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-30">
                                    {['Documentation', 'API_Vault', 'Library', 'Status'].map(item => (
                                        <li key={item}><a href="#" className="hover:text-data-navy hover:opacity-100 transition-all">/{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-[9px] text-electric-sulfur font-bold block mb-10 uppercase tracking-widest">Global_Operations</span>
                                <ul className="space-y-4 text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-30">
                                    {['Mumbai', 'Tokyo', 'San Francisco', 'Berlin'].map(item => (
                                        <li key={item} className="cursor-default hover:text-data-navy hover:opacity-100 transition-all">{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-[9px] text-electric-sulfur font-bold block mb-10 uppercase tracking-widest">Connect_System</span>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 border border-data-navy/10 flex items-center justify-center hover:border-electric-sulfur transition-colors cursor-pointer opacity-40 hover:opacity-100">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div className="w-8 h-8 border border-data-navy/10 flex items-center justify-center hover:border-electric-sulfur transition-colors cursor-pointer opacity-40 hover:opacity-100">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full h-[60vh] mb-20 bg-slate-50/50 border border-data-navy/5 flex items-center justify-center overflow-hidden group">
                        <div className="absolute top-8 left-8 text-mono-label opacity-30">Vehicle_Architecture_v4.2</div>
                        <div className="absolute bottom-8 right-8 text-mono-label opacity-30 text-right">3D_Model_Exhibition<br />[Orbit_Enabled]</div>

                        <div className="absolute inset-0 z-0">
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

                    <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-data-navy/5 gap-10">
                        <span className="text-[9px] font-mono opacity-30 uppercase tracking-[0.4em]">© 2026 MatNext Terminal. Built for Global Industry.</span>
                        <div className="flex gap-10 text-[9px] font-mono opacity-20 uppercase tracking-[0.4em]">
                            <a href="#" className="hover:opacity-100 transition-opacity">Legal_Intellectual</a>
                            <a href="#" className="hover:opacity-100 transition-opacity">System_Protocols</a>
                        </div>
                    </div>
                </div>
            </footer>
            <Analytics />
        </main>
    )
}

export default App

