import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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

/* ─── Animated SVG neural-net ─────────────────── */
const NeuralAccent = () => {
    const svgRef = useRef<SVGSVGElement>(null)
    useEffect(() => {
        if (!svgRef.current) return
        const nodes = svgRef.current.querySelectorAll('circle')
        nodes.forEach((node, i) => {
            gsap.to(node, { opacity: 0.15 + Math.random() * 0.7, scale: 0.5 + Math.random(), duration: 1.5 + Math.random() * 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.12, transformOrigin: 'center center' })
        })
    }, [])

    const pts: [number, number][] = [
        [50, 80], [150, 40], [250, 100], [350, 50], [450, 90],
        [100, 160], [200, 140], [300, 170], [400, 130], [500, 160],
        [80, 240], [180, 210], [280, 250], [380, 220], [480, 240],
    ]
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 9], [10, 11], [11, 12], [12, 13], [13, 14], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 10], [6, 11], [7, 12], [8, 13], [9, 14]]
    return (
        <svg ref={svgRef} viewBox="0 0 560 310" className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid meet">
            {edges.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#96CC39" strokeWidth="0.8" opacity="0.4" />)}
            {pts.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill="#96CC39" opacity="0.5" />)}
        </svg>
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
            <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1 pt-28 pb-10">

                <div ref={topTrackRef} className="flex items-stretch w-max relative z-10 shrink-0 border-y border-data-navy/5 h-[30vh] max-h-[280px]">
                    {topCards.map(c => <AINode key={c.title} card={c} />)}
                </div>

                <div className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-0 overflow-hidden">
                    <NeuralAccent />
                    <div className="relative pointer-events-auto z-10">
                        <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">Artificial Intelligence</span>
                        <h2 className="text-[7vw] md:text-[5vw] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                            AI-Powered<br />Intelligence.
                        </h2>
                        <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                            Scroll to explore all 6 AI capabilities →
                        </p>
                        <div style={{ fontFamily: 'Inter, sans-serif' }} className="absolute top-1/2 right-0 -translate-y-1/2 text-[18vw] font-black text-electric-sulfur leading-none pointer-events-none select-none tracking-tighter">
                            AI
                        </div>
                    </div>
                </div>

                <div ref={bottomTrackRef} className="flex items-stretch w-max relative z-10 shrink-0 border-y border-data-navy/5 h-[30vh] max-h-[280px]">
                    {bottomCards.map(c => <AINode key={c.title} card={c} />)}
                </div>

            </div>
        </section>
    )
}
