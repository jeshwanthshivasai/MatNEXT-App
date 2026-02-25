import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Factory, Users, ScanLine, CloudRain, Recycle, FileCheck, Star, LucideIcon } from 'lucide-react'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

interface MetricCardProps {
    icon: LucideIcon;
    number: string;
    suffix?: string;
    targetValue: number;
    delay?: number;
    label: string;
    description: string;
    pills?: string[];
    index: number;
}

const formatNumber = (val: number, isCommaSpaced: boolean) => {
    if (!isCommaSpaced) return Math.floor(val).toString();
    // Indian formatting (e.g. 1,20,000 or 3,56,760) as seen in screenshot
    const str = Math.floor(val).toString();
    if (str.length <= 3) return str;
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
}

const MetricCard = ({ icon: Icon, number, suffix = '', label, description, pills, targetValue, index }: MetricCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const countRef = useRef<HTMLSpanElement>(null)
    const requiresComma = number.includes(',');

    useGSAP(() => {
        // Form Entrance Animation
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1
        })

        // Number Counter Animation
        const obj = { val: 0 }
        gsap.to(obj, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            val: targetValue,
            duration: 2,
            ease: "expo.out",
            delay: index * 0.05 + 0.2,
            onUpdate: () => {
                if (countRef.current) {
                    countRef.current.innerText = formatNumber(obj.val, requiresComma)
                }
            }
        })
    }, { scope: cardRef })

    return (
        <div
            ref={cardRef}
            className="group relative bg-white border border-data-navy/5 rounded-3xl p-10 lg:p-12 flex flex-col items-center text-center justify-center transition-all duration-700 hover:border-electric-sulfur/50 hover:shadow-[0_20px_50px_-12px_rgba(26,29,35,0.05)] overflow-hidden"
        >
            {/* Top Border Accent on hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-sulfur to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform scale-x-0 group-hover:scale-x-100 origin-center" />

            <div className="mb-6 p-4 bg-electric-sulfur/5 rounded-2xl text-electric-sulfur group-hover:bg-electric-sulfur/10 transition-colors duration-500">
                <Icon className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="flex items-baseline gap-1 mb-2">
                <span ref={countRef} className="text-5xl lg:text-[4rem] font-black tracking-tighter text-data-navy leading-none">
                    0
                </span>
                <span className="text-2xl font-bold text-data-navy tracking-tighter">{suffix}</span>
            </div>

            <h3 className="text-[11px] font-bold text-electric-sulfur tracking-widest uppercase mb-3 font-mono">
                {label}
            </h3>

            <p className="text-sm text-data-navy/50 font-mono tracking-tight leading-relaxed max-w-[280px]">
                {description}
            </p>

            {pills && pills.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {pills.map((pill, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-electric-sulfur/30 bg-electric-sulfur/5 text-[10px] uppercase font-bold text-electric-sulfur/80 tracking-widest font-mono group-hover:bg-electric-sulfur/10 group-hover:text-electric-sulfur transition-colors duration-300">
                            <Star className="w-2.5 h-2.5" />
                            {pill}
                        </div>
                    ))}
                </div>
            )}

            {/* Subtle Grid Background Pattern inside cards */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1d23 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        </div>
    )
}

export const TractionMetrics = () => {
    const containerRef = useRef<HTMLElement>(null)

    const metricsData = [
        {
            icon: Factory,
            number: "6",
            targetValue: 6,
            label: "INDUSTRIES COVERED",
            description: "Automotive, HVAC, Steel, Plastic, Aluminium, Battery",
            pills: ["Automotive", "HVAC", "Steel", "Plastic", "Aluminium", "Battery"]
        },
        {
            icon: Users,
            number: "25",
            targetValue: 25,
            label: "STAKEHOLDERS ONBOARDED",
            description: "Active organizations across the value chain."
        },
        {
            icon: ScanLine,
            number: "1,20,000",
            suffix: "Tons",
            targetValue: 120000,
            label: "TRACKING & TRACEABILITY",
            description: "Tonnes of material tracked end-to-end."
        },
        {
            icon: CloudRain,
            number: "3,56,760",
            suffix: "Tons",
            targetValue: 356760,
            label: "VERIFIED EMISSIONS",
            description: "Tonnes of GHG measured and verified."
        },
        {
            icon: Recycle,
            number: "73",
            suffix: "%",
            targetValue: 73,
            label: "CIRCULARITY INDEX",
            description: "Average circularity score across flows."
        },
        {
            icon: FileCheck,
            number: "15,000+",
            suffix: "+",
            targetValue: 15000,
            label: "AUTOMATED COMPLIANCE",
            description: "Reports generated via AI intelligence."
        }
    ]

    useGSAP(() => {
        // Title entrance animation
        gsap.from(".metrics-header", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
    }, { scope: containerRef })

    return (
        <section ref={containerRef} id="traction-metrics" className="relative min-h-screen bg-white section-padding z-30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 metrics-header">
                    <span className="text-electric-sulfur text-mono-label block mb-6">LIVE TELEMETRY</span>
                    <h2 className="text-[6vw] lg:text-7xl text-data-navy font-black leading-[0.8] uppercase tracking-tighter">
                        Real time numbers
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metricsData.map((metric, i) => (
                        <MetricCard key={i} index={i} {...metric} />
                    ))}
                </div>
            </div>

            {/* Soft geometric accent */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-electric-sulfur/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-data-navy/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </section>
    )
}
