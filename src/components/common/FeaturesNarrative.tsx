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
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '@/hooks/useWindowSize'

gsap.registerPlugin(ScrollTrigger)

// All 12 features — flat, no groups
const getFeatures = (t: any): { title: string; desc: string; icon: LucideIcon }[] => [
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

const FeatureNode = ({ feature, index }: { feature: { title: string; desc: string; icon: LucideIcon }, index: number }) => {
    const Icon = feature.icon;
    return (
        <div
            className="feature-card w-[21.875rem] shrink-0 flex flex-col justify-between py-[2rem] px-[2rem] border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative"
        >
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

export const FeaturesNarrative = () => {
    const { t } = useTranslation()
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const topTrackRef = useRef<HTMLDivElement>(null)
    const bottomTrackRef = useRef<HTMLDivElement>(null)
    const mobileTrackRef = useRef<HTMLDivElement>(null)

    const { width } = useWindowSize()
    const isMobile = width < 768

    const features = getFeatures(t)
    const topFeatures = features.slice(0, 6);
    const bottomFeatures = features.slice(6, 12);

    useGSAP(() => {
        if (!contentContainerRef.current || !sectionRef.current || !contentWrapperRef.current) return

        if (isMobile) {
            if (!mobileTrackRef.current) return
            const getMobileTrackHeight = () => mobileTrackRef.current!.scrollHeight
            const getWindowHeight = () => window.innerHeight
            const getWindowWidth = () => window.innerWidth
            // Calculate scroll distance needed to read all cards
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

        // Desktop logic
        if (!topTrackRef.current || !bottomTrackRef.current) return
        const getTrackWidth = () => topTrackRef.current!.scrollWidth
        const getWindowWidth = () => window.innerWidth

        // Initially position tracks off-screen to the right
        gsap.set([topTrackRef.current, bottomTrackRef.current], {
            x: () => getWindowWidth()
        })

        // Pre-set the inner scrolling content to start off-screen right
        gsap.set(contentContainerRef.current, { xPercent: 100 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current, // Pin the outer wrapper
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                start: "top top",
                end: () => `+=${getTrackWidth() + getWindowWidth() * 1.5}`, // Added extra scroll length for entrance
            }
        })

        // Phase 0: Slide the inner container in from the right over the pinned outer wrapper
        tl.to(contentContainerRef.current, {
            xPercent: 0,
            ease: "none",
            duration: () => getWindowWidth() * 0.5
        })

        // Phase 1: Cards scroll from off-screen right to their final left position 
        tl.to([topTrackRef.current, bottomTrackRef.current], {
            x: () => getWindowWidth() - getTrackWidth(),
            ease: "none",
            duration: () => getTrackWidth()
        })

        // Phase 2: Slide the whole wrapper (containing text and tracks) off to the left
        tl.to(contentWrapperRef.current, {
            x: () => -getWindowWidth(),
            ease: "none",
            duration: () => getWindowWidth()
        })

    }, { scope: sectionRef, dependencies: [isMobile] })

    if (isMobile) {
        return (
            <section ref={sectionRef} id="features" className="relative w-full overflow-hidden z-[50] h-screen bg-transparent mt-0">
                {/* Inner sliding container: starts off-screen right and slides in */}
                <div ref={contentContainerRef} className="absolute inset-0 w-full h-full bg-white pt-24 pb-8 flex flex-col pointer-events-auto">
                    <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1">
                        
                        {/* Header side-by-side: title left, watermark 12 right */}
                        <div className="flex items-center justify-between px-6 mb-4">
                            <div>
                                <span className="text-electric-sulfur text-[10px] font-mono uppercase tracking-[0.4em] font-bold block mb-1">
                                    {t('features.title')}
                                </span>
                                <h2 className="text-[1.5rem] font-black uppercase tracking-tighter leading-tight text-data-navy max-w-[65vw]">
                                    {t('features.subtitle')}
                                </h2>
                            </div>
                            <div className="text-[4rem] font-black text-electric-sulfur leading-none select-none tracking-tighter opacity-80 pr-2">
                                12
                            </div>
                        </div>

                        {/* Scrolling container */}
                        <div className="flex-1 overflow-hidden relative px-6">
                            <div ref={mobileTrackRef} className="flex flex-col gap-4 pb-20">
                                {features.map((feature, i) => (
                                    <div key={feature.title} className="w-full border-l-[3px] border-electric-sulfur/20 hover:border-electric-sulfur bg-neutral-50/50 p-4 transition-colors relative group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[1.2rem] font-black text-electric-sulfur/70 leading-none">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-sm font-black uppercase tracking-tighter leading-none text-data-navy">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-[10px] font-mono uppercase leading-normal opacity-50">
                                            {feature.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        )
    }

    return (
        // Outer wrapper: stays pinned and hides the off-screen inner content
        // Uses negative margin to pull the trigger up and overlap the end of the Hero's 200vh pinned scroll
        <section ref={sectionRef} id="features" className="relative w-full overflow-hidden z-[50] h-screen bg-transparent -mt-[100vh]">

            {/* Inner sliding container: starts off-screen right and slides in */}
            <div ref={contentContainerRef} className="absolute inset-0 w-full h-full bg-white pt-[7rem] pb-[2rem] flex flex-col pointer-events-auto">
                <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between flex-1">

                    {/* Top Row Cards */}
                    <div ref={topTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {topFeatures.map((feature, i) => (
                            <FeatureNode key={feature.title} feature={feature} index={i + 1} />
                        ))}
                    </div>

                    {/* Central Text Content */}
                    <div className="relative flex-1 flex flex-col justify-center px-10 md:px-20 pointer-events-none z-0">
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
                    <div ref={bottomTrackRef} className="flex items-stretch gap-0 w-max relative z-10 shrink-0 border-y border-data-navy/5">
                        {bottomFeatures.map((feature, i) => (
                            <FeatureNode key={feature.title} feature={feature} index={i + 7} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
