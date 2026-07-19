import { useRef, Suspense } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useTranslation, Trans } from 'react-i18next'
import { Environment, PerspectiveCamera } from '@react-three/drei'

import {
    BarChart3,
    BarChart2,
    FileText,
    AlertTriangle,
    Wind,
    Map,
    Globe,
    ShieldAlert,
    Database,
    Network,
    RotateCcw,
    Users,
    Factory,
    Cpu,
    Zap,
    Layers,
    ScanLine,
    CloudRain,
    Recycle,
    FileCheck,
    Target,
    Brain,
    ShieldCheck,
    Plug,
    Lock,
    ArrowUpRight,
    LucideIcon
} from 'lucide-react'

import { useWindowSize } from '@/hooks/useWindowSize'

import { RotatingGlobe } from './TractionNarrative'
import { GenbaAIScanner } from './AINarrative'
import { DeconstructibleCar } from './DeconstructibleCar'

gsap.registerPlugin(ScrollTrigger)

// --- CARD TYPES & HELPER DATA ---

interface FeatureCardDef { title: string; desc: string; icon: LucideIcon }
const getFeatures = (t: any): FeatureCardDef[] => [
    { title: t('features.items.tracking.title'), desc: t('features.items.tracking.desc'), icon: BarChart3 },
    { title: t('features.items.mapping.title'), desc: t('features.items.mapping.desc'), icon: Map },
    { title: t('features.items.passport.title'), desc: t('features.items.passport.desc'), icon: Globe },
    { title: t('features.items.risk.title'), desc: t('features.items.risk.desc'), icon: ShieldAlert },
    { title: t('features.items.vault.title'), desc: t('features.items.vault.desc'), icon: Database },
    { title: t('features.items.network.title'), desc: t('features.items.network.desc'), icon: Network },
    { title: t('features.items.sustainability.title'), desc: t('features.items.sustainability.desc'), icon: RotateCcw },
    { title: t('features.items.portal.title'), desc: t('features.items.portal.desc'), icon: Users },
    { title: t('features.items.benchmarks.title'), desc: t('features.items.benchmarks.desc'), icon: Factory },
    { title: t('features.items.ai.title'), desc: t('features.items.ai.desc'), icon: Cpu },
    { title: t('features.items.efficiency.title'), desc: t('features.items.efficiency.desc'), icon: Zap },
    { title: t('features.items.architecture.title'), desc: t('features.items.architecture.desc'), icon: Layers },
]

interface MetricDef { icon: LucideIcon; index: string; number: string; suffix: string; label: string; desc: string }
const getMetrics = (t: any): MetricDef[] => [
    { icon: Factory, index: '01', number: '6', suffix: '', label: t('traction.items.industries.label'), desc: t('traction.items.industries.desc') },
    { icon: Users, index: '02', number: '25', suffix: '', label: t('traction.items.stakeholders.label'), desc: t('traction.items.stakeholders.desc') },
    { icon: ScanLine, index: '03', number: '1,20,000', suffix: ' Tons', label: t('traction.items.tracking.label'), desc: t('traction.items.tracking.desc') },
    { icon: CloudRain, index: '04', number: '3,56,760', suffix: ' Tons', label: t('traction.items.emissions.label'), desc: t('traction.items.emissions.desc') },
    { icon: Recycle, index: '05', number: '73', suffix: '%', label: t('traction.items.circularity.label'), desc: t('traction.items.circularity.desc') },
    { icon: FileCheck, index: '06', number: '15,000', suffix: '+', label: t('traction.items.compliance.label'), desc: t('traction.items.compliance.desc') },
]

interface AICardDef { icon: LucideIcon; index: string; title: string; desc: string }
const getAICards = (t: any): AICardDef[] => [
    { icon: Cpu, index: '01', title: t('ai.items.capture.title'), desc: t('ai.items.capture.desc') },
    { icon: BarChart2, index: '02', title: t('ai.items.risk.title'), desc: t('ai.items.risk.desc') },
    { icon: FileText, index: '03', title: t('ai.items.compliance.title'), desc: t('ai.items.compliance.desc') },
    { icon: ArrowUpRight, index: '04', title: t('ai.items.flow.title'), desc: t('ai.items.flow.desc') },
    { icon: AlertTriangle, index: '05', title: t('ai.items.anomaly.title'), desc: t('ai.items.anomaly.desc') },
    { icon: Wind, index: '06', title: t('ai.items.carbon.title'), desc: t('ai.items.carbon.desc') },
]


interface WhyCardDef { icon: LucideIcon; index: string; title: string; desc: string }
const getWhyCards = (t: any): WhyCardDef[] => [
    { icon: Target, index: '01', title: t('why.items.precision.title'), desc: t('why.items.precision.desc') },
    { icon: Brain, index: '02', title: t('why.items.ai.title'), desc: t('why.items.ai.desc') },
    { icon: Globe, index: '03', title: t('why.items.architecture.title'), desc: t('why.items.architecture.desc') },
    { icon: ShieldCheck, index: '04', title: t('why.items.compliance.title'), desc: t('why.items.compliance.desc') },
    { icon: Plug, index: '05', title: t('why.items.integration.title'), desc: t('why.items.integration.desc') },
    { icon: Lock, index: '06', title: t('why.items.audit.title'), desc: t('why.items.audit.desc') },
]

// --- CARD NODE RENDERING COMPONENTS ---

const FeatureNode = ({ feature, index }: { feature: FeatureCardDef, index: number }) => {
    const Icon = feature.icon;
    return (
        <div className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative">
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <div>
                <span className="text-[2.2rem] font-black text-electric-sulfur/50 hover:text-electric-sulfur leading-none block mb-[0.5rem] tracking-tighter select-none pointer-events-none">
                    {String(index).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">
                    {feature.title}
                </h3>
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">
                    {feature.desc}
                </p>
            </div>
        </div>
    );
};

const MetricNode = ({ metric }: { metric: MetricDef }) => {
    const Icon = metric.icon
    return (
        <div className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative">
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <div>
                <span className="text-[2.2rem] font-black text-electric-sulfur/50 leading-none block mb-[0.5rem] tracking-tighter select-none pointer-events-none">{metric.index}</span>
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <p className="text-[2.4rem] font-black tracking-tighter text-electric-sulfur leading-none mb-1">
                    {metric.number}<span className="text-xl">{metric.suffix}</span>
                </p>
                <h3 className="text-[11px] font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">{metric.label}</h3>
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">{metric.desc}</p>
            </div>
        </div>
    )
}

const AINode = ({ card }: { card: AICardDef }) => {
    const Icon = card.icon
    return (
        <div className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative">
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <div>
                <span className="text-[2.2rem] font-black text-electric-sulfur/50 leading-none block mb-[0.5rem] tracking-tighter select-none pointer-events-none">{card.index}</span>
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">{card.title}</h3>
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">{card.desc}</p>
            </div>
        </div>
    )
}

const WhyNode = ({ card }: { card: WhyCardDef }) => {
    const Icon = card.icon
    return (
        <div className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative">
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <div>
                <span className="text-[2.2rem] font-black text-electric-sulfur/50 leading-none block mb-[0.5rem] tracking-tighter select-none pointer-events-none">{card.index}</span>
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">{card.title}</h3>
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">{card.desc}</p>
            </div>
        </div>
    )
}



// --- MAIN UNIFIED NARRATIVE COMPONENT ---

export const UnifiedNarrative = () => {
    const { t } = useTranslation()
    const triggerRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Section container refs
    const featuresSectionRef = useRef<HTMLDivElement>(null)
    const tractionSectionRef = useRef<HTMLDivElement>(null)
    const aiSectionRef = useRef<HTMLDivElement>(null)
    const whySectionRef = useRef<HTMLDivElement>(null)

    // Refs for individual section elements
    const featuresTitleRef = useRef<HTMLDivElement>(null)
    const featuresTopTrackRef = useRef<HTMLDivElement>(null)
    const featuresBottomTrackRef = useRef<HTMLDivElement>(null)

    const tractionTitleRef = useRef<HTMLDivElement>(null)
    const tractionGraphicRef = useRef<HTMLDivElement>(null)
    const tractionTopTrackRef = useRef<HTMLDivElement>(null)
    const tractionBottomTrackRef = useRef<HTMLDivElement>(null)

    const aiTitleRef = useRef<HTMLDivElement>(null)
    const aiGraphicRef = useRef<HTMLDivElement>(null)
    const aiTopTrackRef = useRef<HTMLDivElement>(null)
    const aiBottomTrackRef = useRef<HTMLDivElement>(null)

    const whyTitleRef = useRef<HTMLDivElement>(null)
    const whyTopTrackRef = useRef<HTMLDivElement>(null)
    const whyBottomTrackRef = useRef<HTMLDivElement>(null)

    const { width, height } = useWindowSize()
    const W = width || window.innerWidth
    const H = height || window.innerHeight

    // Data lists
    const features = getFeatures(t)
    const topFeatures = features.slice(0, 6)
    const bottomFeatures = features.slice(6, 12)

    const metrics = getMetrics(t)
    const topMetrics = metrics.slice(0, 3)
    const bottomMetrics = metrics.slice(3, 6)

    const aiCards = getAICards(t)
    const topAICards = aiCards.slice(0, 3)
    const bottomAICards = aiCards.slice(3, 6)

    const whyCards = getWhyCards(t)
    const topWhyCards = whyCards.slice(0, 3)
    const bottomWhyCards = whyCards.slice(3, 6)

    useGSAP(() => {
        if (!triggerRef.current) return

        // 1. Calculate horizontal track widths
        const fTrackWidth = featuresTopTrackRef.current?.scrollWidth || (6 * 350)
        const tTrackWidth = tractionTopTrackRef.current?.scrollWidth || (3 * 350)
        const aiTrackWidth = aiTopTrackRef.current?.scrollWidth || (3 * 350)
        const whyTrackWidth = whyTopTrackRef.current?.scrollWidth || (3 * 350)

        // 2. Set Initial Positions
        // Card tracks start off-screen right relative to their own section blocks
        gsap.set([featuresTopTrackRef.current, featuresBottomTrackRef.current], { x: W })
        gsap.set([tractionTopTrackRef.current, tractionBottomTrackRef.current], { x: W })
        gsap.set([aiTopTrackRef.current, aiBottomTrackRef.current], { x: W })
        gsap.set([whyTopTrackRef.current, whyBottomTrackRef.current], { x: W })

        // Graphics start off-screen right relative to their own section blocks
        gsap.set(tractionGraphicRef.current, { x: W })
        gsap.set(aiGraphicRef.current, { x: W })

        // Titles (starting from Section 2) start from bottom right (H * 0.8) relative to their sections
        gsap.set(tractionTitleRef.current, { y: H * 0.8 })
        gsap.set(aiTitleRef.current, { y: H * 0.8 })
        gsap.set(whyTitleRef.current, { y: H * 0.8 })

        // Set initial positions for section containers (Option B starting offset)
        gsap.set([tractionSectionRef.current, aiSectionRef.current, whySectionRef.current], { x: W, y: H })

        // 3. Create Timeline & ScrollTrigger
        const totalScrollLength = fTrackWidth + W + tTrackWidth + W + aiTrackWidth + W + whyTrackWidth

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 1,
                start: 'top top',
                end: () => `+=${totalScrollLength}`,
                invalidateOnRefresh: true,
            }
        })

        // --- STAGE 1: FEATURES ---
        // Scroll Features card tracks
        tl.to([featuresTopTrackRef.current, featuresBottomTrackRef.current], {
            x: () => W - fTrackWidth,
            ease: 'none',
            duration: fTrackWidth
        })

        // Transition Features -> Traction
        tl.addLabel('features_exit')
        tl.to(featuresSectionRef.current, { x: -W, ease: 'power2.inOut', duration: W }, 'features_exit')
        tl.to(tractionSectionRef.current, { x: 0, y: 0, ease: 'power2.inOut', duration: W }, 'features_exit')
        tl.to(tractionTitleRef.current, { y: 0, ease: 'power2.out', duration: W }, 'features_exit')
        tl.to(tractionGraphicRef.current, { x: 0, ease: 'power2.out', duration: W }, 'features_exit')

        // --- STAGE 2: TRACTION ---
        // Scroll Traction card tracks
        tl.to([tractionTopTrackRef.current, tractionBottomTrackRef.current], {
            x: () => W - tTrackWidth,
            ease: 'none',
            duration: tTrackWidth
        })

        // Transition Traction -> AI
        tl.addLabel('traction_exit')
        tl.to(tractionSectionRef.current, { x: -W, ease: 'power2.inOut', duration: W }, 'traction_exit')
        tl.to(aiSectionRef.current, { x: 0, y: 0, ease: 'power2.inOut', duration: W }, 'traction_exit')
        tl.to(aiTitleRef.current, { y: 0, ease: 'power2.out', duration: W }, 'traction_exit')
        tl.to(aiGraphicRef.current, { x: 0, ease: 'power2.out', duration: W }, 'traction_exit')

        // --- STAGE 3: AI ---
        // Scroll AI card tracks
        tl.to([aiTopTrackRef.current, aiBottomTrackRef.current], {
            x: () => W - aiTrackWidth,
            ease: 'none',
            duration: aiTrackWidth
        })

        // Transition AI -> Why Choose Us
        tl.addLabel('ai_exit')
        tl.to(aiSectionRef.current, { x: -W, ease: 'power2.inOut', duration: W }, 'ai_exit')
        tl.to(whySectionRef.current, { x: 0, y: 0, ease: 'power2.inOut', duration: W }, 'ai_exit')
        tl.to(whyTitleRef.current, { y: 0, ease: 'power2.out', duration: W }, 'ai_exit')

        // --- STAGE 4: WHY CHOOSE US ---
        // Scroll Why Choose Us card tracks
        tl.to([whyTopTrackRef.current, whyBottomTrackRef.current], {
            x: () => W - whyTrackWidth,
            ease: 'none',
            duration: whyTrackWidth
        })

    }, { scope: triggerRef, dependencies: [W, H] })

    return (
        <section ref={triggerRef} className="relative w-full bg-white overflow-hidden">
            <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden bg-white select-none">
                
                {/* ═══ SECTION 1: FEATURES ═══ */}
                <div ref={featuresSectionRef} id="features" className="absolute inset-0 w-screen h-screen flex flex-col justify-between pt-[7rem] pb-[2rem] bg-white overflow-hidden z-10">
                    
                    {/* Top Row Cards */}
                    <div ref={featuresTopTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {topFeatures.map((feature, i) => (
                            <FeatureNode key={feature.title} feature={feature} index={i + 1} />
                        ))}
                    </div>

                    {/* Central Text Content */}
                    <div ref={featuresTitleRef} className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-0">
                        <div className="relative pointer-events-auto">
                            <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">
                                {t('features.title')}
                            </span>
                            <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                                {t('features.subtitle')}
                            </h2>
                            <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                                {t('features.scroll')}
                            </p>
                            <div style={{ fontFamily: 'Inter, sans-serif' }} className="absolute top-1/2 right-0 -translate-y-1/2 text-[clamp(10rem,18vw,20rem)] font-black font-italic text-electric-sulfur leading-none pointer-events-none select-none tracking-tighter">
                                12
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row Cards */}
                    <div ref={featuresBottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {bottomFeatures.map((feature, i) => (
                            <FeatureNode key={feature.title} feature={feature} index={i + 7} />
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION 2: TRACTION ═══ */}
                <div ref={tractionSectionRef} id="traction" className="absolute inset-0 w-screen h-screen flex flex-col justify-between pt-[7rem] pb-[2rem] bg-white overflow-hidden z-10">
                    
                    {/* Top Row Cards */}
                    <div ref={tractionTopTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {topMetrics.map(m => (
                            <MetricNode key={m.label} metric={m} />
                        ))}
                    </div>

                    {/* Central Text */}
                    <div ref={tractionTitleRef} className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-10 overflow-hidden">
                        <div className="relative pointer-events-auto z-10">
                            <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">
                                {t('traction.title')}
                            </span>
                            <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                                {t('traction.subtitle')}
                            </h2>
                            <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                                {t('traction.scroll')}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Row Cards */}
                    <div ref={tractionBottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {bottomMetrics.map(m => (
                            <MetricNode key={m.label} metric={m} />
                        ))}
                    </div>

                    {/* Globe Canvas Graphic */}
                    <div ref={tractionGraphicRef} className="absolute -right-25 w-[50vw] max-w-[900px] top-[12.5vh] h-[75vh] z-20 pointer-events-none">
                        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="w-full h-full" style={{ pointerEvents: 'none' }}>
                            <RotatingGlobe />
                        </Canvas>
                    </div>
                </div>

                {/* ═══ SECTION 3: AI CAPABILITIES ═══ */}
                <div ref={aiSectionRef} id="ai" className="absolute inset-0 w-screen h-screen flex flex-col justify-between pt-[7rem] pb-[2rem] bg-white overflow-hidden z-10">
                    
                    {/* Top Row Cards */}
                    <div ref={aiTopTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {topAICards.map(c => (
                            <AINode key={c.title} card={c} />
                        ))}
                    </div>

                    {/* Central Text */}
                    <div ref={aiTitleRef} className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-10 overflow-hidden">
                        <div className="relative pointer-events-auto z-10">
                            <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">
                                {t('ai.title')}
                            </span>
                            <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                                {t('ai.subtitle')}
                            </h2>
                            <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                                {t('ai.scroll')}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Row Cards */}
                    <div ref={aiBottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {bottomAICards.map(c => (
                            <AINode key={c.title} card={c} />
                        ))}
                    </div>

                    {/* Scanner Canvas Graphic */}
                    <div ref={aiGraphicRef} className="absolute -right-25 w-[50vw] max-w-[900px] top-[12.5vh] h-[75vh] z-20 pointer-events-none">
                        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="w-full h-full" style={{ pointerEvents: 'none' }}>
                            <GenbaAIScanner />
                        </Canvas>
                    </div>
                </div>

                {/* ═══ SECTION 4: WHY Choose Us ═══ */}
                <div ref={whySectionRef} id="why-matnext" className="absolute inset-0 w-screen h-screen flex flex-col justify-between pt-[7rem] pb-[2rem] bg-white overflow-hidden z-10">
                    
                    {/* Top Row Cards */}
                    <div ref={whyTopTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {topWhyCards.map(c => (
                            <WhyNode key={c.title} card={c} />
                        ))}
                    </div>

                    {/* Central text — 3D car replaces the right watermark */}
                    <div ref={whyTitleRef} className="relative flex-1 flex items-center px-10 md:px-20 overflow-hidden pointer-events-none">
                        
                        {/* Left: text content */}
                        <div className="relative pointer-events-auto z-10 flex-1">
                            <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">
                                {t('why.title')}
                            </span>
                            <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                                <Trans i18nKey="why.subtitle" components={{ br: <br /> }} />
                            </h2>
                            <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                                {t('why.scroll')}
                            </p>
                        </div>

                        {/* Right: 3D car — side-by-side with text */}
                        <div className="relative z-0 pointer-events-auto" style={{ width: '35%', height: '100%' }}>
                            <Canvas gl={{ antialias: true, alpha: true }} style={{ height: '100%', width: '100%' }}>
                                <Suspense fallback={null}>
                                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={25} />
                                    <DeconstructibleCar progress={0.25} isLoader={true} />
                                    <Environment preset="city" />
                                    <ambientLight intensity={0.5} />
                                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#96CC39" />
                                </Suspense>
                            </Canvas>
                        </div>
                    </div>

                    {/* Bottom Row Cards */}
                    <div ref={whyBottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {bottomWhyCards.map(c => (
                            <WhyNode key={c.title} card={c} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
