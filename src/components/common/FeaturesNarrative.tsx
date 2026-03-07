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

gsap.registerPlugin(ScrollTrigger)

// All 12 features — flat, no groups
// All 12 features definition helper
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
            className="feature-card w-[350px] shrink-0 flex flex-col justify-between py-8 px-8 border-l border-data-navy/5 group hover:bg-neutral-50/80 transition-colors duration-500 relative"
        >
            {/* Hover accent */}
            <div className="absolute left-0 top-0 w-[3px] h-full bg-electric-sulfur scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

            {/* Top section */}
            <div>
                {/* Index number */}
                <span className="text-[2rem] font-black text-electric-sulfur/50 hover:text-electric-sulfur leading-none block mb-2 tracking-tighter select-none pointer-events-none">
                    {String(index).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-data-navy/5 flex items-center justify-center mb-5 group-hover:bg-electric-sulfur group-hover:text-data-navy transition-colors duration-500">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 max-w-[280px]">
                    {feature.desc}
                </p>
            </div>

            {/* Bottom accent line */}
            {/* <div className="flex items-center gap-3 pt-6">
                <div className="w-6 h-[1px] bg-data-navy/10 group-hover:w-12 group-hover:bg-electric-sulfur transition-all duration-500" />
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] opacity-20 group-hover:opacity-60 transition-opacity duration-500">
                    {String(index).padStart(2, '0')} / 12
                </span>
            </div> */}
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

    const features = getFeatures(t)
    const topFeatures = features.slice(0, 6);
    const bottomFeatures = features.slice(6, 12);

    useGSAP(() => {
        if (!topTrackRef.current || !bottomTrackRef.current || !contentWrapperRef.current || !sectionRef.current || !contentContainerRef.current) return

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

    }, { scope: sectionRef })

    return (
        // Outer wrapper: stays pinned and hides the off-screen inner content
        // Uses negative margin to pull the trigger up and overlap the end of the Hero's 200vh pinned scroll
        <section ref={sectionRef} id="features" className="relative w-full overflow-hidden z-[50] h-screen bg-transparent -mt-[100vh]">

            {/* Inner sliding container: starts off-screen right and slides in */}
            <div ref={contentContainerRef} className="absolute inset-0 w-full h-full bg-white pt-28 pb-8 flex flex-col pointer-events-auto">
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
