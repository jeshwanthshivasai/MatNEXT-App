import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { BackgroundShader } from '@/components/common/BackgroundShader'
import { DeconstructibleCar } from '@/components/common/DeconstructibleCar'
import { FloatingMaterial } from '@/components/common/FloatingMaterial'
import { Infographic3D } from '@/components/common/Infographic3D'
import { Loader } from '@/components/common/Loader'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
    BarChart3,
    RotateCcw,
    Users,
    Factory,
    Layers,
    ArrowRight,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
    Zap,
    Network,
    Cpu,
    Database,
    Globe,
    Map,
    ShieldAlert
} from 'lucide-react'
import logo from './assets/MatNEXT.png'

gsap.registerPlugin(ScrollTrigger)

function App() {
    const container = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isLanding, setIsLanding] = useState(false)
    const [entryProgress, setEntryProgress] = useState(1) // 1 to 0 (Falling down)
    const lenisRef = useRef<Lenis | null>(null)

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

        lenis.on('scroll', (e: any) => {
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
            end: '+=500%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                setScrollProgress(self.progress)
            }
        })

        // Hero fade on scroll
        gsap.to(".hero-fade", {
            scrollTrigger: {
                trigger: ".hero-wrapper",
                start: "0% top",
                end: "20% top",
                scrub: true
            },
            opacity: 0,
            y: -100,
            pointerEvents: "none"
        })

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
            <div className="noise-overlay" />

            {/* GLOBAL 3D CANVAS */}
            <div className="fixed inset-0 -z-10 h-screen w-full">
                <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                        <BackgroundShader />
                        <DeconstructibleCar progress={(loading || isLanding) ? -entryProgress : scrollProgress} isLoader={false} />

                        {/* Material Crystals */}
                        <FloatingMaterial type="steel" position={[-2, 1, 0]} scrollProgress={scrollProgress} />
                        <FloatingMaterial type="lithium" position={[2.5, 2, -1]} scrollProgress={scrollProgress} />
                        <FloatingMaterial type="cobalt" position={[3, -1, 1]} scrollProgress={scrollProgress} />
                        <FloatingMaterial type="copper" position={[-3, -2, -2]} scrollProgress={scrollProgress} />
                        <FloatingMaterial type="aluminium" position={[1.5, -2.5, 0.5]} scrollProgress={scrollProgress} />

                        {/* 3D Infographics */}
                        <Infographic3D progress={scrollProgress} entryProgress={entryProgress} />

                        <Environment preset="city" />
                        <ambientLight intensity={1.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                    </Suspense>
                </Canvas>
            </div>

            {loading && <Loader onComplete={onLoaderComplete} />}

            {/* Navigation */}
            <nav
                style={{
                    opacity: (!loading && scrollProgress < 0.3) ? 1 : (scrollProgress > 0.45 ? 1 : 0),
                    pointerEvents: (!loading && (scrollProgress < 0.3 || scrollProgress > 0.45)) ? 'auto' : 'none',
                    zIndex: 100
                }}
                className="fixed top-0 flex w-full items-center justify-between px-10 py-6 text-data-navy transition-all duration-700 bg-white border-b border-data-navy/10"
            >
                <div className="flex items-center">
                    <img src={logo} alt="MatNEXT Logo" className="h-5 w-auto object-contain" style={{ filter: 'none' }} />
                </div>
                <div className="hidden gap-10 text-[10px] font-bold uppercase tracking-[0.3em] md:flex opacity-70">
                    {['Features', 'Traction', 'AI', 'Why-MatNEXT', 'Customers'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-electric-sulfur transition-all duration-300">/{item.replace('-', ' ')}</a>
                    ))}
                </div>
                <button className="btn-premium py-2.5 px-6 text-[10px] tracking-widest">Request Platform Demo</button>
            </nav>

            {/* SECTION 1: HERO OVERHAUL */}
            <div className="hero-wrapper relative w-full overflow-hidden bg-transparent">
                <section className="h-screen w-full flex flex-col justify-center p-10 md:p-20 pt-56 bg-transparent">
                    <div className="hero-fade hero-content z-10">
                        <h1
                            className="hero-reveal text-editorial-h1 uppercase text-data-navy max-w-4xl mb-10 opacity-0"
                        >
                            Product and Material Tracking,<br />
                            Traceability and Sustainability Platform
                        </h1>
                        <p
                            className="hero-reveal max-w-xl text-editorial-p opacity-0 mb-12"
                        >
                            MatNEXT is an end-to-end materials traceability and management platform that enables OEMs and value chain partners to track recycled content, carbon footprint, and regulatory compliance across every stage of production.
                        </p>
                        <div
                            className="hero-reveal flex gap-6 opacity-0"
                        >
                            <button className="btn-premium group flex items-center gap-4 pointer-events-auto">
                                Request Platform Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="btn-outline pointer-events-auto">Explore the <span className="text-electric-sulfur font-bold">Engine</span></button>
                        </div>
                    </div>
                </section>

                {/* SCROLL TOOLTIP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (!loading && !isLanding && scrollProgress < 0.1) ? 1 : 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-10 flex items-center gap-6 opacity-40 z-20 pointer-events-none"
                >
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-[1px] h-12 bg-data-navy/20 relative overflow-hidden">
                            <motion.div
                                animate={{ y: [0, 48] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-1/2 bg-electric-sulfur"
                            />
                        </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Scroll to Explore</span>
                </motion.div>
            </div>

            {/* SECTION 2: FEATURES */}
            <section id="features" className="relative min-h-screen bg-white/80 backdrop-blur-sm section-padding">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-32 border-b border-data-navy/10 pb-16">
                    <div>
                        <span className="text-electric-sulfur text-mono-label block mb-6">Platform Capabilities</span>
                        <h2 className="text-[10vw] text-data-navy font-black leading-[0.8] uppercase tracking-tighter">Industrial<br />Intelligence</h2>
                    </div>
                    <p className="max-w-sm text-[11px] uppercase font-mono opacity-50 text-right leading-loose pt-10 lg:pt-0">
                        A massive 12-layer capability suite designed to automate regulatory extraction and circularity intelligence across 20+ tiers.
                    </p>
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

            {/* SECTION 3: TRACTION - 3D INFOGRAPHIC ANCHOR */}
            <section id="traction" className="relative h-[150vh] bg-transparent pointer-events-none" />

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

            {/* SECTION 6: PREMIUM CONTACT FORM */}
            <section id="customers" className="relative min-h-screen bg-neutral-900 text-white section-padding">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32">
                    <div>
                        <span className="text-electric-sulfur text-mono-label block mb-8">Get In Touch</span>
                        <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none mb-10">Ready to Get <span className="text-electric-sulfur">Sustainable?</span></h2>
                        <p className="text-xl opacity-60 font-mono leading-loose mb-16 uppercase font-bold">
                            Partner with MatNEXT to build resilient, compliant and sustainable supply chains across your value chain.
                        </p>

                        <div className="space-y-12">
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-white/5 rounded-full"><Mail className="w-8 h-8 text-electric-sulfur" /></div>
                                <div>
                                    <span className="text-mono-label opacity-40 block mb-2">Email Address</span>
                                    <span className="text-xl font-bold">info-matnext@genbanext.com</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-white/5 rounded-full"><Phone className="w-8 h-8 text-electric-sulfur" /></div>
                                <div>
                                    <span className="text-mono-label opacity-40 block mb-2">Phone Number</span>
                                    <span className="text-xl font-bold">+81 80-8529-3858</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-white/5 rounded-full"><MapPin className="w-8 h-8 text-electric-sulfur" /></div>
                                <div>
                                    <span className="text-mono-label opacity-40 block mb-2">Global Nodes</span>
                                    <span className="text-xl font-bold">Mumbai // Tokyo // San Francisco</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-data-navy p-12 lg:p-24 border border-white/5">
                        <form className="space-y-16">
                            <div className="space-y-4">
                                <label className="text-[10px] text-electric-sulfur font-bold uppercase tracking-widest opacity-60">01 // Full Name</label>
                                <input type="text" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-electric-sulfur outline-none font-mono text-xl transition-colors uppercase tracking-tight" placeholder="JOHN DOE" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-4">
                                    <label className="text-[10px] text-electric-sulfur font-bold uppercase tracking-widest opacity-60">02 // Business Email</label>
                                    <input type="email" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-electric-sulfur outline-none font-mono text-xl transition-colors uppercase tracking-tight" placeholder="EMAIL@COMPANY.COM" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] text-electric-sulfur font-bold uppercase tracking-widest opacity-60">03 // Industry</label>
                                    <div className="relative">
                                        <select className="w-full bg-transparent border-b border-white/10 py-6 focus:border-electric-sulfur outline-none font-mono text-xl transition-colors appearance-none pr-10 uppercase tracking-tight">
                                            <option>SELECT INDUSTRY</option>
                                            <option>AUTOMOTIVE</option>
                                            <option>STEEL</option>
                                            <option>BATTERY</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] text-electric-sulfur font-bold uppercase tracking-widest opacity-60">04 // Message</label>
                                <textarea className="w-full bg-transparent border-b border-white/10 py-6 focus:border-electric-sulfur outline-none font-mono text-xl transition-colors min-h-[120px] resize-none uppercase tracking-tight" placeholder="PROJECT DETAILS..." />
                            </div>
                            <button className="btn-premium w-full py-10 text-xl group flex items-center justify-center gap-6 bg-electric-sulfur text-data-navy hover:bg-white">
                                SECURE PROTOCOL ACCESS <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-data-navy text-white section-padding border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="lg:col-span-2">
                        <img src={logo} alt="MatNEXT" className="h-6 w-auto mb-12 opacity-100" style={{ filter: 'none' }} />
                        <p className="max-w-md text-[11px] font-mono opacity-30 leading-loose uppercase font-bold mb-12">
                            Advanced traceability and sustainability intelligence for the industrial value chain. Real-time digital passports for a circular future.
                        </p>
                    </div>

                    <div>
                        <span className="text-[10px] text-electric-sulfur font-bold block mb-12 uppercase tracking-widest">Platform_Core</span>
                        <ul className="space-y-4 text-[11px] font-mono uppercase tracking-widest font-bold opacity-40">
                            {['Features', 'Traction', 'AI', 'Why-MatNEXT', 'Access'].map(item => (
                                <li key={item}><a href={`#${item.toLowerCase()}`} className="hover:text-electric-sulfur hover:opacity-100 transition-all">/{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="text-[10px] text-electric-sulfur font-bold block mb-12 uppercase tracking-widest">Global_Nodes</span>
                        <ul className="space-y-4 text-[11px] font-mono uppercase tracking-widest font-bold opacity-40">
                            {['Mumbai', 'Tokyo', 'San Francisco', 'London', 'Berlin'].map(item => (
                                <li key={item} className="cursor-default hover:text-white hover:opacity-100 transition-all">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <span className="text-[10px] font-mono opacity-30 uppercase tracking-[0.3em]">© 2026 MatNext. All Rights Reserved.</span>
                    <div className="flex gap-10 text-[10px] font-mono opacity-30 uppercase tracking-[0.3em]">
                        <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
                        <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </main>
    )
}

export default App
