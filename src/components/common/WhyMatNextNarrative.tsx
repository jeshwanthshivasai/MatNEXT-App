import { useRef, Suspense } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useTranslation, Trans } from 'react-i18next'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { DeconstructibleCar } from './DeconstructibleCar'
import { Target, Brain, Globe, ShieldCheck, Plug, Lock, LucideIcon } from 'lucide-react'
import { useWindowSize } from '@/hooks/useWindowSize'

gsap.registerPlugin(ScrollTrigger)

interface WhyCard { icon: LucideIcon; index: string; title: string; desc: string }

// Cards helper function
const getWhyCards = (t: any): WhyCard[] => [
    { icon: Target, index: '01', title: t('why.items.precision.title'), desc: t('why.items.precision.desc') },
    { icon: Brain, index: '02', title: t('why.items.ai.title'), desc: t('why.items.ai.desc') },
    { icon: Globe, index: '03', title: t('why.items.architecture.title'), desc: t('why.items.architecture.desc') },
    { icon: ShieldCheck, index: '04', title: t('why.items.compliance.title'), desc: t('why.items.compliance.desc') },
    { icon: Plug, index: '05', title: t('why.items.integration.title'), desc: t('why.items.integration.desc') },
    { icon: Lock, index: '06', title: t('why.items.audit.title'), desc: t('why.items.audit.desc') },
]

const WhyNode = ({ card }: { card: WhyCard }) => {
    const Icon = card.icon
    return (
        <div
            className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative"
        >
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

export const WhyMatNextNarrative = () => {
    const { t } = useTranslation()
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const topTrackRef = useRef<HTMLDivElement>(null)
    const bottomTrackRef = useRef<HTMLDivElement>(null)
    const mobileTrackRef = useRef<HTMLDivElement>(null)

    const { width } = useWindowSize()
    const isMobile = width < 768

    const whyCards = getWhyCards(t)
    const topCards = whyCards.slice(0, 3)
    const bottomCards = whyCards.slice(3, 6)

    useGSAP(() => {
        if (!sectionRef.current) return

        if (isMobile) {
            if (!contentContainerRef.current || !contentWrapperRef.current || !mobileTrackRef.current) return
            const getMobileTrackHeight = () => mobileTrackRef.current!.scrollHeight
            const getWindowHeight = () => window.innerHeight
            const getWindowWidth = () => window.innerWidth
            const getMobileScrollDist = () => Math.max(0, getMobileTrackHeight() - getWindowHeight() + 350)

            // Start offscreen to the right
            gsap.set(contentContainerRef.current, { xPercent: 100 })
            gsap.set(mobileTrackRef.current, { y: 0 })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    start: "top top",
                    end: () => `+=${getMobileScrollDist() + getWindowWidth() * 1.5}`,
                }
            })

            // Phase 0: Slide in from right
            tl.to(contentContainerRef.current, {
                xPercent: 0,
                ease: "none",
                duration: () => getWindowWidth() * 0.5
            })

            // Phase 1: Scroll vertically stacked cards
            tl.to(mobileTrackRef.current, {
                y: () => -getMobileScrollDist(),
                ease: "none",
                duration: getMobileScrollDist
            })

            // Phase 2: Slide out left
            tl.to(contentWrapperRef.current, {
                x: () => -getWindowWidth(),
                ease: "none",
                duration: () => getWindowWidth()
            })

            return
        }

        // DESKTOP GSAP TIMELINE (100% UNTOUCHED ORIGINAL)
        if (!topTrackRef.current || !bottomTrackRef.current || !contentWrapperRef.current) return
        const getTrackWidth = () => topTrackRef.current!.scrollWidth
        const getWindowWidth = () => window.innerWidth

        gsap.set([topTrackRef.current, bottomTrackRef.current], { x: () => getWindowWidth() })

        const tl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, pin: true, scrub: 1, invalidateOnRefresh: true, start: 'top top', end: () => `+=${getTrackWidth() + getWindowWidth()}` }
        })
        tl.to([topTrackRef.current, bottomTrackRef.current], { x: () => getWindowWidth() - getTrackWidth(), ease: 'none', duration: () => getTrackWidth() })
        tl.to(contentWrapperRef.current, { x: () => -getWindowWidth(), ease: 'none', duration: () => getWindowWidth() })
    }, { scope: sectionRef, dependencies: [isMobile] })

    if (isMobile) {
        return (
            <section ref={sectionRef} id="why-matnext" className="relative w-full overflow-hidden z-[50] h-screen bg-transparent mt-0">
                <div ref={contentContainerRef} className="absolute inset-0 w-full h-full bg-white pt-24 pb-8 flex flex-col pointer-events-auto">
                    <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1">
                        
                        {/* Header side-by-side: stats title left, 3D car right */}
                        <div className="flex items-center justify-between px-6 mb-4">
                            <div>
                                <span className="text-electric-sulfur text-[10px] font-mono uppercase tracking-[0.4em] font-bold block mb-1">
                                    {t('why.title')}
                                </span>
                                <h2 className="text-[1.5rem] font-black uppercase tracking-tighter leading-tight text-data-navy max-w-[60vw]">
                                    {t('why.subtitle')}
                                </h2>
                            </div>
                            <div className="w-20 h-20 relative select-none pointer-events-none pr-2">
                                <Canvas camera={{ position: [0, 0, 10], fov: 22 }} className="w-full h-full" style={{ pointerEvents: 'none' }}>
                                    <Suspense fallback={null}>
                                        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={22} />
                                        <DeconstructibleCar progress={0.25} isLoader={true} />
                                        <ambientLight intensity={0.5} />
                                        <Environment preset="city" />
                                    </Suspense>
                                </Canvas>
                            </div>
                        </div>

                        {/* Scrolling container */}
                        <div className="flex-1 overflow-hidden relative px-6">
                            <div ref={mobileTrackRef} className="flex flex-col gap-4 pb-20">
                                {whyCards.map((c) => {
                                    const Icon = c.icon
                                    return (
                                        <div key={c.title} className="w-full border-l-[3px] border-electric-sulfur/20 hover:border-electric-sulfur bg-neutral-50/50 p-4 transition-colors relative group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-data-navy/5 flex items-center justify-center group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                                                    <Icon className="w-4 h-4 stroke-[1.5]" />
                                                </div>
                                                <h3 className="text-sm font-black uppercase tracking-tighter leading-none text-data-navy">
                                                    {c.title}
                                                </h3>
                                            </div>
                                            <p className="text-[10px] font-mono uppercase leading-normal opacity-50">
                                                {c.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        )
    }

    // ORIGINAL DESKTOP/TABLET LAYOUT (100% UNTOUCHED)
    return (
        <section ref={sectionRef} id="why-matnext" className="relative w-full overflow-hidden z-[50] h-screen bg-white flex flex-col">
            <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1 pt-[7rem] pb-[2rem]">

                <div ref={topTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                    {topCards.map(c => <WhyNode key={c.title} card={c} />)}
                </div>

                {/* Central text — 3D car replaces the right watermark */}
                <div className="relative flex-1 flex items-center px-10 md:px-20 overflow-hidden pointer-events-none">

                    {/* Left: text content */}
                    <div className="relative pointer-events-auto z-10 flex-1">
                        <span className="text-electric-sulfur text-[11px] font-mono uppercase tracking-[0.4em] font-bold block mb-4">{t('why.title')}</span>
                        <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.85] text-data-navy max-w-3xl mb-4">
                            <Trans i18nKey="why.subtitle" components={{ br: <br /> }} />
                        </h2>
                        <p className="text-[11px] font-mono uppercase tracking-wider opacity-40 leading-loose max-w-lg">
                            {t('why.scroll')}
                        </p>
                    </div>

                    {/* Right: 3D car — same height as text content area, no watermark text */}
                    <div className="relative z-0 pointer-events-auto" style={{ width: '35%', height: '100%' }}>
                        <Canvas gl={{ antialias: true, alpha: true }}>
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

                <div ref={bottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                    {bottomCards.map(c => <WhyNode key={c.title} card={c} />)}
                </div>

            </div>
        </section>
    )
}
