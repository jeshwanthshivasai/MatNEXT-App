import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react'
import logo from '../../assets/MatNEXT.png'

gsap.registerPlugin(ScrollTrigger)

/* ───────── Bento Card ───────── */
const BentoCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null)
    useGSAP(() => {
        if (!ref.current) return
        gsap.from(ref.current, {
            y: 24, opacity: 0, duration: 0.7, delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 92%' }
        })
    })
    return (
        <div ref={ref} className={className}
            style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)', overflow: 'hidden', transition: 'box-shadow 0.4s, border-color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
        >
            {children}
        </div>
    )
}

/* ───────── Nav Link ───────── */
const NavLink = ({ label }: { label: string }) => (
    <a href="#" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)',
        color: 'rgba(0,0,0,0.4)', fontSize: 12, letterSpacing: '0.02em',
        transition: 'color 0.3s', textDecoration: 'none',
    }}
        onMouseEnter={e => (e.currentTarget.style.color = '#96CC39')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
    >
        <span>{label}</span>
        <ArrowUpRight style={{ width: 12, height: 12 }} />
    </a>
)

/* ═══════════════════════════════════════
   FooterNarrative — full-viewport bento
   ═══════════════════════════════════════ */
export const FooterNarrative = () => {
    const SIDE_GAP = 32 // equal left/right gap
    const HEADER_GAP = 80 // gap below header
    const GRID_GAP = 12

    return (
        <footer
            id="customers"
            style={{
                position: 'relative',
                zIndex: 50,
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                background: '#FFFFFF',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Ambient */}
            <div style={{ position: 'absolute', top: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'rgba(150,204,57,0.04)', filter: 'blur(120px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -150, right: -150, width: 400, height: 400, borderRadius: '50%', background: 'rgba(150,204,57,0.03)', filter: 'blur(100px)', pointerEvents: 'none' }} />

            {/* ── Content wrapper: fills viewport minus header ── */}
            <div style={{
                paddingTop: HEADER_GAP,
                paddingBottom: 0,
                paddingLeft: SIDE_GAP,
                paddingRight: SIDE_GAP,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: `calc(100vh - ${HEADER_GAP}px)`,
            }}>

                {/* ════════ BENTO GRID — fills available space ════════ */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    gap: GRID_GAP,
                    minHeight: 0,
                }}>

                    {/* ── LEFT: CONTACT FORM ── */}
                    <div style={{ flex: '0 0 55%', display: 'flex' }}>
                        <BentoCard className="w-full" delay={0}>
                            <div style={{ padding: '24px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#96CC39', fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 10 }}>Get in Touch</span>
                                <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)', fontWeight: 900, color: '#0A0A0A', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 6 }}>
                                    Let's Build<br />Something Great
                                </h2>
                                <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 11, fontFamily: 'monospace', marginBottom: 20, maxWidth: 340, lineHeight: 1.5 }}>
                                    Reach out to discuss how MatNEXT can transform your supply chain operations.
                                </p>

                                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr auto', gap: 10, flex: 1 }} onSubmit={e => e.preventDefault()}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Full Name</label>
                                        <input type="text" placeholder="Enter your full name"
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: '10px 12px', color: '#0A0A0A', fontSize: 12, outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Business Email</label>
                                        <input type="email" placeholder="name@company.com"
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: '10px 12px', color: '#0A0A0A', fontSize: 12, outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Industry Segment</label>
                                        <select style={{ width: '100%', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: '10px 12px', color: 'rgba(0,0,0,0.3)', fontSize: 12, outline: 'none', appearance: 'none' as const, cursor: 'pointer' }}>
                                            <option>Select Industry</option>
                                            <option>Automotive</option>
                                            <option>Renewables</option>
                                            <option>Aerospace</option>
                                            <option>Electronics</option>
                                            <option>Steel &amp; Metals</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Annual Material Volume</label>
                                        <input type="text" placeholder="e.g., 10,000 Tons/year"
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: '10px 12px', color: '#0A0A0A', fontSize: 12, outline: 'none' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                                        <label style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Message</label>
                                        <textarea placeholder="Tell us about your requirements..."
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: '10px 12px', color: '#0A0A0A', fontSize: 12, outline: 'none', flex: 1, minHeight: 80, resize: 'none' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <button type="submit"
                                            style={{ width: '100%', background: '#96CC39', color: '#000', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '12px 0', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.4s' }}
                                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(150,204,57,0.2)'; e.currentTarget.style.filter = 'brightness(1.08)' }}
                                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.filter = 'none' }}
                                        >
                                            Send Message
                                            <Send style={{ width: 13, height: 13 }} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </BentoCard>
                    </div>

                    {/* ── RIGHT: FOOTER INFO ── */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: GRID_GAP, minWidth: 0, minHeight: 0 }}>

                        {/* Brand — full width */}
                        <BentoCard delay={0.06}>
                            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={logo} alt="MatNEXT" style={{ height: 18, width: 'auto', flexShrink: 0 }} />
                                <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 11, lineHeight: 1.45, margin: 0 }}>
                                    Advanced product and material tracking, traceability and sustainability platform for the industrial value chain.
                                </p>
                            </div>
                        </BentoCard>

                        {/* Locations + Direct Line — side by side, equal height */}
                        <div style={{ display: 'flex', gap: GRID_GAP, flex: 1 }}>
                            <BentoCard className="w-full" delay={0.1}>
                                <div style={{ padding: '14px 16px', height: '100%' }}>
                                    <span style={{ fontSize: 8, color: 'rgba(150,204,57,0.8)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: 10 }}>HQ Locations</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[{ city: 'Mumbai', country: 'India' }, { city: 'Tokyo', country: 'Japan' }].map(loc => (
                                            <div key={loc.city} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(150,204,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <MapPin style={{ width: 11, height: 11, color: '#96CC39' }} />
                                                </div>
                                                <div>
                                                    <span style={{ color: 'rgba(0,0,0,0.6)', fontSize: 12, display: 'block', lineHeight: 1.1 }}>{loc.city}</span>
                                                    <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{loc.country}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </BentoCard>

                            <BentoCard className="w-full" delay={0.13}>
                                <div style={{ padding: '14px 16px', height: '100%' }}>
                                    <span style={{ fontSize: 8, color: 'rgba(150,204,57,0.8)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: 10 }}>Direct Line</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <a href="mailto:info-matnext@genbanext.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(0,0,0,0.4)', textDecoration: 'none', fontSize: 10, transition: 'color 0.3s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#96CC39')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
                                        >
                                            <Mail style={{ width: 13, height: 13, flexShrink: 0, color: '#96CC39', opacity: 0.6 }} />
                                            <span style={{ wordBreak: 'break-all', lineHeight: 1.3 }}>info-matnext@genbanext.com</span>
                                        </a>
                                        <a href="tel:+818085293858" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(0,0,0,0.4)', textDecoration: 'none', fontSize: 11, transition: 'color 0.3s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#96CC39')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
                                        >
                                            <Phone style={{ width: 13, height: 13, flexShrink: 0, color: '#96CC39', opacity: 0.6 }} />
                                            <span>+81 80-8529-3858</span>
                                        </a>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>

                        {/* Quick Links — full width */}
                        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                            <BentoCard className="w-full" delay={0.16}>
                                <div style={{ padding: '12px 18px' }}>
                                    <span style={{ fontSize: 8, color: 'rgba(150,204,57,0.8)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: 4 }}>Quick Links</span>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                                        <div>
                                            <NavLink label="Features" />
                                            <NavLink label="Live Data" />
                                            <NavLink label="Our Partners" />
                                            <NavLink label="AI Intelligence" />
                                        </div>
                                        <div>
                                            <NavLink label="Why Choose Us" />
                                            <NavLink label="Testimonials" />
                                            <NavLink label="Contact" />
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>
                    </div>
                </div>

                {/* ════════ COPYRIGHT ════════ */}
                <div style={{ marginTop: 20, paddingTop: 16, paddingBottom: 16, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.18)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                        © 2026 MatNEXT. Built for Global Industry.
                    </span>
                    <div style={{ display: 'flex', gap: 28, fontSize: 9, color: 'rgba(0,0,0,0.18)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.45)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
                        >Privacy Policy</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.45)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
                        >Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
