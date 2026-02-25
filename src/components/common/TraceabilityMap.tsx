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

    // Explosion starts at 0.6, fully visible by 0.7
    // Fades out from 0.9 to 1.0 as the car explosion completes
    let visibility = 0
    if (scrollProgress >= 0.6 && scrollProgress <= 0.7) {
        visibility = (scrollProgress - 0.6) / 0.1
    } else if (scrollProgress > 0.7 && scrollProgress <= 0.9) {
        visibility = 1
    } else if (scrollProgress > 0.9 && scrollProgress <= 1.0) {
        visibility = Math.max(0, 1 - ((scrollProgress - 0.9) / 0.1))
    }

    const isVisible = scrollProgress > 0.55 && scrollProgress < 0.95

    useEffect(() => {
        if (isVisible && !hasAnimated.current && container.current) {
            hasAnimated.current = true

            // Stagger reveal each material column
            gsap.fromTo(
                container.current.querySelectorAll('.t-col'),
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power4.out' }
            )

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
            className="fixed inset-0 z-20 flex items-end justify-center pb-20 pointer-events-none transition-opacity duration-500"
            style={{
                opacity: visibility,
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            <div className="w-full max-w-6xl mx-auto px-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <span className="text-xl text-data-navy font-mono uppercase tracking-[0.5em] opacity-30 block mb-1">
                            Circular Economy Matrix
                        </span>
                        <span className="text-md font-mono uppercase tracking-[0.3em] font-bold text-electric-sulfur">
                            Material Extraction // Live
                        </span>
                    </div>
                    <span className="text-md font-mono uppercase tracking-[0.4em] opacity-20">
                        Recycled Content %
                    </span>
                </div>

                {/* Material Columns */}
                <div className="flex gap-[2px] h-[220px]">
                    {materials.map((mat) => (
                        <div key={mat.name} className="t-col flex-1 flex flex-col justify-end relative group cursor-crosshair opacity-0 border-l border-data-navy/5 hover:border-data-navy/20 transition-colors">
                            {/* Metadata on hover */}
                            <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[8px] font-mono uppercase tracking-[0.3em] opacity-40 block">{mat.desc}</span>
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
    )
}
