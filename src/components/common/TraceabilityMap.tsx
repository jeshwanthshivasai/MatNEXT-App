import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface TraceabilityMapProps {
    scrollProgress: number
}

const materials = [
    { name: 'STEEL', value: 85, color: '#8E9196', desc: 'Body Frame' },
    { name: 'LITHIUM', value: 45, color: '#D4D4D8', desc: 'Battery Cells' },
    { name: 'COBALT', value: 25, color: '#3B82F6', desc: 'Cathode' },
    { name: 'COPPER', value: 70, color: '#F97316', desc: 'Wiring Harness' },
    { name: 'ALUMINIUM', value: 60, color: '#94A3B8', desc: 'Chassis' }
]

export const TraceabilityMap = ({ scrollProgress }: TraceabilityMapProps) => {
    const container = useRef<HTMLDivElement>(null)
    const hasAnimated = useRef(false)

    let newStatsOpacity = 0;
    let visibility = 0;
    let separationProgress = 0;

    // Step 2 & 3 Combined: Fade in, Separate, Hold, Re-merge, then Fade out
    if (scrollProgress >= 0.15 && scrollProgress <= 0.25) {
        // Entrance fade
        newStatsOpacity = (scrollProgress - 0.15) / 0.1;
        visibility = 0;
        separationProgress = 0;
    } else if (scrollProgress > 0.25 && scrollProgress <= 0.45) {
        // Open
        newStatsOpacity = 1;
        const rawProgress = (scrollProgress - 0.25) / 0.20;
        separationProgress = rawProgress * (2 - rawProgress); // easeOut quadratic
        visibility = 1;
    } else if (scrollProgress > 0.45 && scrollProgress <= 0.80) {
        // Hold open
        newStatsOpacity = 1;
        separationProgress = 1;
        visibility = 1;
    } else if (scrollProgress > 0.80 && scrollProgress <= 0.95) {
        // Close back up
        newStatsOpacity = 1;
        const rawProgress = (scrollProgress - 0.80) / 0.15;
        // Reverse quadratic easeIn to close smoothly
        separationProgress = 1 - (rawProgress * rawProgress);
        // Fade out the inner matrix text as it closes
        visibility = Math.max(0, 1 - rawProgress * 2);
    } else if (scrollProgress > 0.95 && scrollProgress <= 0.98) {
        // Immediate fade out once closed
        newStatsOpacity = Math.max(0, 1 - ((scrollProgress - 0.95) / 0.03));
        separationProgress = 0;
        visibility = 0;
    }

    const isVisible = scrollProgress > 0.25 && scrollProgress < 0.98;

    useEffect(() => {
        if (isVisible && !hasAnimated.current && container.current) {
            hasAnimated.current = true

            // Stagger reveal each material column is removed for the Wipe effect.
            // But we ensure they are fully visible.
            gsap.set(container.current.querySelectorAll('.t-col'), { y: 0, opacity: 1 })

            // Animate the fill bars
            gsap.fromTo(
                container.current.querySelectorAll('.t-fill'),
                { scaleX: 0 },
                { scaleX: 1, stagger: 0.1, duration: 1.2, ease: 'expo.out', delay: 0.3 }
            )

            // Counter animation
            const counters = container.current.querySelectorAll('.t-counter')
            counters.forEach((el, i) => {
                gsap.fromTo(el,
                    { textContent: 0 },
                    {
                        textContent: materials[i].value,
                        duration: 1.5,
                        ease: 'power3.out',
                        snap: { textContent: 1 },
                        delay: 0.2 + i * 0.1,
                    }
                )
            })
        }

        // Reset if scrolled back
        if (!isVisible && hasAnimated.current) {
            hasAnimated.current = false
        }
    }, [isVisible])

    return (
        <div
            ref={container}
            className="fixed inset-0 z-20 flex items-end justify-center pb-20 pointer-events-none"
        >
            <div className="w-full relative flex items-center justify-center">

                {/* Left Stat */}
                <div
                    className="absolute z-20 flex flex-col items-center pointer-events-auto"
                    style={{
                        bottom: '0',
                        left: '50%',
                        transform: `translate(calc(-50% - 132px - min(48vw, 556px) * ${separationProgress}), 0)`,
                        opacity: newStatsOpacity,
                    }}
                >
                    {/* Industrial Styled Box */}
                    <div className="h-[220px] w-56 bg-electric-sulfur/10 flex flex-col justify-center items-center relative overflow-hidden group">

                        {/* Centered Number */}
                        <span className="text-5xl md:text-[54px] font-black tracking-tighter text-electric-sulfur leading-none relative z-10" style={{ fontFamily: 'var(--font-sans)' }}>
                            99.8%
                        </span>

                        {/* Smaller, Centered Title Text */}
                        <span className="text-[10px] md:text-[10px] opacity-60 mt-3 font-bold text-data-navy font-sans uppercase tracking-widest text-center relative z-10 leading-tight">
                            Compliance Score
                        </span>
                    </div>
                </div>

                {/* Right Stat */}
                <div
                    className="absolute z-20 flex flex-col items-center pointer-events-auto"
                    style={{
                        bottom: '0',
                        left: '50%',
                        transform: `translate(calc(-50% + 132px + min(48vw, 556px) * ${separationProgress}), 0)`,
                        opacity: newStatsOpacity,
                    }}
                >
                    {/* Industrial Styled Box */}
                    <div className="h-[220px] w-56 bg-electric-sulfur/10 flex flex-col justify-center items-center relative overflow-hidden group">

                        {/* Centered Number */}
                        <span className="text-5xl md:text-[54px] font-black tracking-tighter text-electric-sulfur leading-none relative z-10" style={{ fontFamily: 'var(--font-sans)' }}>
                            2.4M
                        </span>

                        {/* Smaller, Centered Title Text */}
                        <span className="text-[10px] md:text-[10px] opacity-60 mt-3 font-bold text-data-navy font-sans uppercase tracking-widest text-center relative z-10 leading-tight">
                            Units Tracked
                        </span>
                    </div>
                </div>

                {/* Main Traceability Map (Untouched Content except for mask) */}
                <div
                    className="w-full max-w-6xl mx-auto px-10 relative z-10 flex flex-col justify-end h-[220px]"
                    style={{
                        opacity: visibility,
                        pointerEvents: visibility > 0.1 ? 'auto' : 'none',
                        // Mask bounds calculation: 
                        // At separationProgress = 0, mask is fully closed (inset 50% from both sides).
                        // At separationProgress = 1, mask is fully open (inset 0%).
                        // However, to trace the inner edge, we offset by the half distance traveled by the stats (using that complex calc math).
                        // Note: The stats move linearly * outward * from the center, so mapping directly to linear progress percentage is correct, we just needed to ensure the Z-indices prevent overlapping. Given the stats are translucent `bg-data-navy/5`, any underlying text shows up. 
                        // To perfectly trace the inner edge of the boxes, the inset on each side must equal the *remaining* distance the boxes have to travel. 
                        clipPath: `inset(-300px calc(50% * (1 - ${separationProgress})) 0 calc(50% * (1 - ${separationProgress})))`,
                    }}
                >
                    {/* Header Absolute above the 220px block to match mockups */}
                    <div className="absolute bottom-[240px] left-10 right-10 flex flex-col items-center justify-center text-center">
                        <div>
                            <span className="text-xl text-data-navy font-mono uppercase tracking-[0.5em] opacity-100 block mb-1">
                                Circular Economy Matrix
                            </span>
                            <span className="text-md font-mono uppercase tracking-[0.3em] font-bold text-electric-sulfur">
                                Material Extraction // Live
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-[2px] h-[220px] w-full bg-transparent">
                        {materials.map((mat) => (
                            <div key={mat.name} className="t-col flex-1 flex flex-col justify-end relative group cursor-crosshair opacity-0 border-l border-data-navy/0 hover:border-data-navy/20 transition-colors">
                                {/* Metadata on hover */}
                                <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm font-mono uppercase tracking-[0.3em] opacity-100 block">{mat.desc}</span>
                                </div>

                                <div className="px-4 pb-4">
                                    {/* Percentage number */}
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span
                                            className="t-counter text-3xl lg:text-5xl font-black tracking-tighter text-data-navy group-hover:text-electric-sulfur transition-colors duration-300"
                                            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                                        >
                                            0
                                        </span>
                                        <span className="text-lg font-bold opacity-20">%</span>
                                    </div>

                                    {/* Material name */}
                                    <span className="text-sm font-mono tracking-[0.3em] font-bold uppercase block mb-3" style={{ color: mat.color }}>
                                        {mat.name}
                                    </span>

                                    {/* Fill bar */}
                                    <div className="w-full h-[2px] bg-data-navy/5 relative overflow-hidden">
                                        <div
                                            className="t-fill absolute left-0 top-0 bottom-0 bg-electric-sulfur origin-left"
                                            style={{ width: `${mat.value}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
