import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    BarChart3,
    RotateCcw,
    Map,
    ShieldAlert,
    Globe,
    Database,
    Network,
    Cpu,
    Zap,
    Users,
    Factory,
    Layers,
    LucideIcon
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Grouping the original 12 features into 4 cohesive Pillars
const narrativeData = [
    {
        id: "01",
        title: "TRACEABILITY INTELLIGENCE",
        abstractTitle: "Tracking Node",
        color: "bg-emerald-500",
        features: [
            { title: 'Tracking & Traceability', desc: 'Real-time intelligence tracks every material, batch, and transaction across your chain.', icon: BarChart3 },
            { title: 'Dynamic Mapping', desc: 'Visualize your entire supply chain network from extraction to final assembly.', icon: Map },
            { title: 'Material Passport', desc: 'Every product gets a digital twin containing its entire lifecycle history.', icon: Globe }
        ]
    },
    {
        id: "02",
        title: "PLATFORM & RISK SECURITY",
        abstractTitle: "Secured Ledger",
        color: "bg-blue-500",
        features: [
            { title: 'Risk Intelligence', desc: 'Predictive analytics identify supply chain disruptions before they occur.', icon: ShieldAlert },
            { title: 'Compliance Vault', desc: 'Securely store all regulatory documentation in a tamper-proof ledger.', icon: Database },
            { title: 'Supplier Network', desc: 'Onboard and manage thousands of suppliers with automated data verification.', icon: Network }
        ]
    },
    {
        id: "03",
        title: "SUSTAINABILITY ENGINE",
        abstractTitle: "Carbon Nexus",
        color: "bg-electric-sulfur",
        features: [
            { title: 'Sustainability Engine', desc: 'Automate carbon accounting and ESG compliance with precision data protocols.', icon: RotateCcw },
            { title: 'Stakeholder Portal', desc: 'Seamlessly share supply chain data with customers and regulatory bodies.', icon: Users },
            { title: 'Industry Benchmarks', desc: 'Compare your sustainability performance against global competitors.', icon: Factory }
        ]
    },
    {
        id: "04",
        title: "AUTONOMOUS OPERATIONS",
        abstractTitle: "AI Automation",
        color: "bg-purple-500",
        features: [
            { title: 'AI Automation', desc: 'Harness ML to extract and verify data from complex supply chain documents.', icon: Cpu },
            { title: 'Operational Efficiency', desc: 'Streamline procurement and logistics with data-driven workflows.', icon: Zap },
            { title: 'Scalable Architecture', desc: 'Built for enterprise-scale operations, handling millions of transactions safely.', icon: Layers }
        ]
    }
]

interface FeatureCardProps {
    title: string;
    desc: string;
    icon: LucideIcon;
}

const FeatureCard = ({ title, desc, icon: Icon }: FeatureCardProps) => (
    <div className="group relative bg-white/60 backdrop-blur-md border border-data-navy/5 p-8 flex flex-col justify-start transition-all duration-500 hover:bg-white/90 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-electric-sulfur/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="mb-6 w-12 h-12 bg-data-navy/5 rounded-full flex items-center justify-center text-data-navy group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
            <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h4 className="text-xl font-black uppercase tracking-tighter mb-3 leading-tight">{title}</h4>
        <p className="text-[11px] font-mono leading-loose opacity-60 uppercase font-bold max-w-sm">
            {desc}
        </p>
    </div>
)

export const FeaturesNarrative = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const pinContainerRef = useRef<HTMLDivElement>(null)
    const scrollWrapperRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const sections = gsap.utils.toArray('.narrative-panel')

        // Ensure horizontal scrolling tracks perfectly with the window
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                refreshPriority: 1, // Let the hero 400vh pin calculate first
                // Make the scroll area feel substantial (400vh)
                end: () => "+=" + (scrollWrapperRef.current?.offsetWidth || window.innerWidth * 4)
            }
        })

        // Inner animations: Parallax the abstract title for each panel
        sections.forEach((section: any, i) => {
            gsap.fromTo(section.querySelector('.abstract-title'),
                { x: 200, opacity: 0 },
                {
                    x: -200,
                    opacity: 0.2, // very subtle watermark effect
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        scrub: true,
                        start: () => `+=${i * window.innerWidth}`,
                        end: () => `+=${(i + 1) * window.innerWidth}`
                    }
                }
            )
        })

    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="features-narrative" className="relative h-screen w-full bg-[#FAFAFA] overflow-hidden -mt-[40vh] z-20">
            {/* 
              This is the sticky container. 
              Its height is 100vh, but it's pinned by ScrollTrigger while we scrub through the 400vh parent distance 
            */}
            <div ref={pinContainerRef} className="h-screen w-full flex items-center pt-24 pb-10">

                {/* 
                  The extra-wide wrapper holding our 4 panels side-by-side.
                  w-[400vw] because there are 4 panels.
                */}
                <div ref={scrollWrapperRef} className="flex h-full w-[400vw]">
                    {narrativeData.map((pillar) => (
                        <div key={pillar.id} className="narrative-panel relative w-screen h-full flex items-center px-10 md:px-20 shrink-0 border-r border-data-navy/5 overflow-hidden">

                            {/* Animated Abstract Background Title */}
                            <div className="abstract-title absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black text-data-navy/5 leading-none whitespace-nowrap z-0 pointer-events-none select-none tracking-tighter" style={{ WebkitTextStroke: '2px rgba(26,29,35,0.05)', color: 'transparent' }}>
                                {pillar.abstractTitle}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full max-w-7xl mx-auto relative z-10">

                                {/* Left Side: The Story / Typography */}
                                <div className="lg:col-span-5 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-2 h-2 rounded-full ${pillar.color} animate-pulse`} />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-data-navy/40">
                                            Data Pillar _{pillar.id}
                                        </span>
                                    </div>
                                    <h2 className="text-[5vw] lg:text-[4.5rem] font-black uppercase tracking-tighter leading-[0.85] mb-8 text-data-navy">
                                        {pillar.title}
                                    </h2>
                                </div>

                                {/* Right Side: The Bento Box of 3 Features */}
                                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Make the first item span 2 columns for a masonry/bento effect */}
                                    <div className="md:col-span-2">
                                        <FeatureCard {...pillar.features[0]} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FeatureCard {...pillar.features[1]} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FeatureCard {...pillar.features[2]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global Section Overlay/Border */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-t border-white/20 shadow-[inset_0_20px_50px_rgba(255,255,255,0.8)]" />
        </section>
    )
}
