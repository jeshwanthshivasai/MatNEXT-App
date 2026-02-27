import { useRef, Suspense, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Send, MapPin, Mail } from 'lucide-react'

import logo from '../../assets/MatNEXT.png'
import handLeftSvg from '../../assets/1.svg'
import handRightSvg from '../../assets/2.svg'

gsap.registerPlugin(ScrollTrigger)

const carModelUrl = '/models/generic_sedan_car_optimized.glb'

/* ─── Wireframe Globe ─────── */
const FooterGlobe = () => {
    const meshRef = useRef<THREE.LineSegments>(null)
    useFrame((_s, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.15
            meshRef.current.rotation.x = -0.05
        }
    })
    return (
        <lineSegments ref={meshRef as any} scale={1.0}>
            <edgesGeometry attach="geometry" args={[new THREE.SphereGeometry(2.5, 16, 16)]} />
            <lineBasicMaterial attach="material" color="#96CC39" opacity={0.35} transparent />
        </lineSegments>
    )
}

/* ─── 3D Car ─────── */
const FooterCar = ({ direction }: { direction: 1 | -1 }) => {
    const { scene } = useGLTF(carModelUrl)
    const groupRef = useRef<THREE.Group>(null)
    const cloned = useMemo(() => scene.clone(true), [scene])

    useFrame((_s, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.5 * direction
        }
    })

    return (
        <group ref={groupRef} scale={0.55}>
            <primitive object={cloned} />
        </group>
    )
}

/* ═══════════════════════════════════════
   FooterNarrative
   Sistine-chapel diagonal layout:
     - Left hand from top-left
     - Right hand from bottom-right
     - Globe + cars + logo at center
     - Contact form card top-right
     - Copyright card bottom-left
   ═══════════════════════════════════════ */
export const FooterNarrative = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const leftHandRef = useRef<HTMLImageElement>(null)
    const rightHandRef = useRef<HTMLImageElement>(null)
    const globeContainerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const topCarRef = useRef<HTMLDivElement>(null)
    const bottomCarRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)
    const copyrightRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!sectionRef.current || !leftHandRef.current || !rightHandRef.current ||
            !globeContainerRef.current || !logoRef.current || !topCarRef.current ||
            !bottomCarRef.current || !contactRef.current || !copyrightRef.current) return

        // Initial states
        gsap.set(leftHandRef.current, { x: '-100%', opacity: 0 })
        gsap.set(rightHandRef.current, { x: '100%', opacity: 0 })
        gsap.set(globeContainerRef.current, { scale: 0.3, opacity: 0 })
        gsap.set(logoRef.current, { scale: 0, opacity: 0 })
        gsap.set(topCarRef.current, { scale: 0, opacity: 0 })
        gsap.set(bottomCarRef.current, { scale: 0, opacity: 0 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                start: 'top top',
                end: '+=2500',
            }
        })

        // Phase 1: Hands reveal + Globe (0% → 55%)
        tl.to(leftHandRef.current, { x: '0%', opacity: 1, duration: 0.55, ease: 'power3.out' }, 0)
        tl.to(rightHandRef.current, { x: '0%', opacity: 1, duration: 0.55, ease: 'power3.out' }, 0)
        tl.to(globeContainerRef.current, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.05)

        // Phase 2: Logo + Cars (55% → 100%)
        tl.to(logoRef.current, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.7)' }, 0.58)
        tl.to(topCarRef.current, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.65)
        tl.to(bottomCarRef.current, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.72)

    }, { scope: sectionRef })

    return (
        <footer
            ref={sectionRef}
            id="customers"
            style={{
                position: 'relative',
                zIndex: 50,
                width: '100vw',
                height: '100vh',
                marginLeft: 'calc(-50vw + 50%)',
                background: '#FFFFFF',
                overflow: 'hidden',
            }}
        >
            {/* ═══ CONTACT FORM — top-right corner ═══ */}
            <div
                ref={contactRef}
                style={{
                    position: 'absolute',
                    top: 100,
                    right: 15,
                    width: 'clamp(380px, 30vw, 550px)',
                    background: 'linear-gradient(135deg, rgba(245,245,245,0.8) 0%, rgba(230,230,230,0.6) 100%)',
                    // backdropFilter: 'blur(20px)',
                    padding: '20px 20px 20px',
                    zIndex: 25,
                    border: '0.4px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.04)',
                }}
            >
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#96CC39', marginBottom: 12, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>Get in Touch</h3>
                    <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 10, lineHeight: 1.5, letterSpacing: '0.01em', maxWidth: '100%' }}>
                        Reach out to discuss how MatNEXT can transform your supply chain operations.
                    </p>
                </div>

                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }} onSubmit={e => e.preventDefault()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Full Name</label>
                        <input type="text" placeholder="Enter your full name"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(0,0,0,0.5)', padding: '14px 16px', fontSize: 12, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                            onFocus={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}
                            onBlur={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Business Email</label>
                        <input type="email" placeholder="name@company.com"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(0,0,0,0.5)', padding: '14px 16px', fontSize: 12, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                            onFocus={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}
                            onBlur={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Industry Segment</label>
                        <div style={{ position: 'relative' }}>
                            <select style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(0,0,0,0.5)', padding: '14px 16px', fontSize: 12, outline: 'none', color: 'rgba(0,0,0,0.7)', appearance: 'none' as const, cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 500 }}
                                onFocus={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}
                                onBlur={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}>
                                <option>Select Industry</option>
                                <option>Automotive</option>
                                <option>Steel</option>
                                <option>Plastic</option>
                                <option>Aluminium</option>
                                <option>Battery</option>
                                <option>HVAC</option>
                                <option>Others</option>
                            </select>
                            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(0,0,0,0.2)', fontSize: 10 }}>▼</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Annual Volume</label>
                        <input type="text" placeholder="e.g., 10,000 Tons/year"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(0,0,0,0.5)', padding: '14px 16px', fontSize: 12, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                            onFocus={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}
                            onBlur={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Message</label>
                        <textarea placeholder="Tell us about your requirements..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(0,0,0,0.5)', padding: '16px', fontSize: 12, outline: 'none', color: '#0A0A0A', minHeight: 90, resize: 'none', transition: 'all 0.2s ease', lineHeight: 1.6, fontWeight: 500 }}
                            onFocus={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'}
                            onBlur={e => e.currentTarget.style.border = '0.5px solid rgba(0,0,0,0.5)'} />
                    </div>
                    <button type="submit"
                        style={{ gridColumn: 'span 2', background: '#96CC39', color: '#000', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', marginTop: 12, boxShadow: '0 10px 30px rgba(150,204,57,0.15)' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#A5D64C';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(150,204,57,0.25)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#96CC39';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(150,204,57,0.15)';
                        }}
                    >
                        Send Message <Send style={{ width: 16, height: 16, strokeWidth: 2, rotate: '45deg' }} />
                    </button>
                </form>
            </div>

            {/* ═══ COPYRIGHT INFO — bottom-left corner ═══ */}
            <div
                ref={copyrightRef}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    width: 'clamp(380px, 30vw, 550px)',
                    background: 'linear-gradient(135deg, rgba(245,245,245,0.8) 0%, rgba(230,230,230,0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    padding: '44px 40px 32px',
                    zIndex: 25,
                    border: '0.4px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.04)',
                }}
            >
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 950, color: '#96CC39', lineHeight: 0.8, marginBottom: 20, letterSpacing: '-0.06em', opacity: 0.9 }}>MatNEXT</h2>
                    <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 10.5, lineHeight: 1.7, letterSpacing: '0.01em', maxWidth: '100%' }}>
                        Building the global infrastructure for material traceability <br />and sustainable industrial value chains.
                    </p>
                </div>

                {/* Locations & Contact — Precision Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: 40, borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Mumbai HQ</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0A0A0A', fontSize: 12, fontWeight: 500 }}>
                            <MapPin size={12} color="#96CC39" strokeWidth={3} />
                            India
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tokyo Office</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0A0A0A', fontSize: 12, fontWeight: 500 }}>
                            <MapPin size={12} color="#96CC39" strokeWidth={3} />
                            Japan
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Inquiries</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0A0A0A', fontSize: 12, fontWeight: 500 }}>
                            <Mail size={12} color="#96CC39" strokeWidth={3} />
                            info-matnext@genbanext.com
                        </div>
                    </div>
                </div>

                {/* Navigation Links — High Contrast Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 32px', borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Features', 'Live Data', 'Our Partners', 'AI Integration'].map(link => (
                            <a key={link} href="#" style={{ color: 'rgba(0,0,0,0.4)', textDecoration: 'none', fontSize: 11, fontWeight: 600, transition: 'all 0.2s ease' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#000'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}>
                                {link}
                            </a>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Why Choose Us', 'Testimonials', 'Contact', 'Legal', 'Privacy'].map(link => (
                            <a key={link} href="#" style={{ color: 'rgba(0,0,0,0.4)', textDecoration: 'none', fontSize: 11, fontWeight: 600, transition: 'all 0.2s ease' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#000'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}>
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Final Branding & Date */}
                <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.3 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>© 2026 MatNEXT CORP</div>
                    <div style={{ fontSize: 8, fontWeight: 700 }}>VER. 4.0.2</div>
                </div>
            </div>

            {/* ═══ LEFT HAND — from top-left, closer to center ═══ */}
            <img
                ref={leftHandRef}
                src={handLeftSvg}
                alt=""
                style={{
                    position: 'absolute',
                    top: '12%',
                    left: '-0.5%',
                    rotate: '3deg',
                    width: 'clamp(900px, 60vw, 1000px)',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />

            {/* ═══ RIGHT HAND — from bottom-right, closer to center ═══ */}
            <img
                ref={rightHandRef}
                src={handRightSvg}
                alt=""
                style={{
                    position: 'absolute',
                    bottom: '2%',
                    rotate: '5deg',
                    right: '-0.5%',
                    width: 'clamp(900px, 60vw, 1000px)',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />

            {/* ═══ CENTER: Globe + Logo + Cars ═══ */}
            <div
                ref={globeContainerRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'clamp(320px, 32vw, 480px)',
                    height: 'clamp(320px, 32vw, 480px)',
                    zIndex: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* 2D Globe vibe: Large soft radial glow */}
                <div style={{
                    position: 'absolute',
                    inset: '-10%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(230,230,230,0.4) 0%, transparent 75%)',
                    pointerEvents: 'none',
                }} />

                {/* Rotating Globe Canvas */}
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <FooterGlobe />
                </Canvas>


                {/* ── Top Car (anticlockwise) ── */}
                <div
                    ref={topCarRef}
                    style={{
                        position: 'absolute',
                        top: '18%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'clamp(80px, 7vw, 120px)',
                        height: 'clamp(50px, 4vw, 70px)',
                        zIndex: 6,
                    }}
                >
                    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }} style={{ pointerEvents: 'none' }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[3, 5, 3]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <FooterCar direction={1} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* ── MatNEXT Logo (pulsing center) ── */}
                <div
                    ref={logoRef}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 7,
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={logo}
                        alt="MatNEXT"
                        style={{
                            width: 'clamp(60px, 6vw, 100px)',
                            height: 'auto',
                            animation: 'logoPulse 2.5s ease-in-out infinite',
                        }}
                    />
                </div>

                {/* ── Bottom Car (clockwise) ── */}
                <div
                    ref={bottomCarRef}
                    style={{
                        position: 'absolute',
                        bottom: '18%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'clamp(80px, 7vw, 120px)',
                        height: 'clamp(50px, 4vw, 70px)',
                        zIndex: 6,
                    }}
                >
                    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }} style={{ pointerEvents: 'none' }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[3, 5, 3]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <FooterCar direction={-1} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* Pulse keyframes */}
            <style>{`
                @keyframes logoPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.08); }
                }
            `}</style>
        </footer>
    )
}

useGLTF.preload(carModelUrl)
