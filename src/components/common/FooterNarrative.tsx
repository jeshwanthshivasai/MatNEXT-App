import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Send, MapPin, Mail, ArrowUpRight, Phone } from 'lucide-react'
// import { DeconstructibleCar } from './DeconstructibleCar'
// import { Environment, PerspectiveCamera } from '@react-three/drei'

// import logo from '../../assets/MatNEXT.png'
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
            meshRef.current.rotation.x = 0 // perfectly straight equator
        }
    })
    return (
        <lineSegments ref={meshRef as any} scale={0.70}>
            <edgesGeometry attach="geometry" args={[new THREE.SphereGeometry(2.5, 16, 16)]} />
            <lineBasicMaterial attach="material" color="#96CC39" opacity={1} transparent />
        </lineSegments>
    )
}

/* ─── 3D Car ─────── */
// const FooterCar = ({ direction }: { direction: 1 | -1 }) => {
//     const { scene } = useGLTF(carModelUrl)
//     const groupRef = useRef<THREE.Group>(null)
//     const cloned = useMemo(() => scene.clone(true), [scene])

//     useFrame((_s, delta) => {
//         if (groupRef.current) {
//             groupRef.current.rotation.y += delta * 0.5 * direction
//         }
//     })

//     return (
//         <group ref={groupRef} scale={0.55}>
//             <primitive object={cloned} />
//         </group>
//     )
// }

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
            !globeContainerRef.current || !contactRef.current || !copyrightRef.current) return

        // Initial states
        gsap.set(leftHandRef.current, { x: '-100%', opacity: 0 })
        gsap.set(rightHandRef.current, { x: '100%', opacity: 0 })
        gsap.set(globeContainerRef.current, { scale: 0.3, opacity: 0 })
        if (logoRef.current) gsap.set(logoRef.current, { scale: 0, opacity: 0 })
        if (topCarRef.current) gsap.set(topCarRef.current, { scale: 0, opacity: 0 })
        if (bottomCarRef.current) gsap.set(bottomCarRef.current, { scale: 0, opacity: 0 })

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
        tl.to(leftHandRef.current, { x: '0%', opacity: 0.8, duration: 0.55, ease: 'power3.out' }, 0)
        tl.to(rightHandRef.current, { x: '0%', opacity: 0.8, duration: 0.55, ease: 'power3.out' }, 0)
        tl.to(globeContainerRef.current, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.05)

        // Phase 2: Logo + Cars (55% → 100%)
        if (logoRef.current) {
            tl.to(logoRef.current, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.7)' }, 0.58)
        }
        if (topCarRef.current) {
            tl.to(topCarRef.current, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.65)
        }
        if (bottomCarRef.current) {
            tl.to(bottomCarRef.current, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.72)
        }

        // Standalone Logo Pulse (independent of scroll)
        if (logoRef.current) {
            gsap.to(logoRef.current, {
                scale: 1.08,
                duration: 1.25,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })
        }

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
            {/* ═══ CONTACT FORM — Bento Style ═══ */}
            <div
                ref={contactRef}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 'clamp(380px, 30vw, 550px)',
                    zIndex: 25,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}
            >
                <div style={{
                    // background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    padding: '20px',
                    border: '0.5px solid #96CC39',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                }}>
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#96CC39', marginBottom: 8, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>Get in Touch</h3>
                        <p style={{ color: 'rgba(0,0,0,1)', fontSize: 10.5, lineHeight: 1.5, letterSpacing: '0.01em', maxWidth: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 1, height: 12, background: '#96CC39' }} />
                            Reach out to discuss how MatNEXT can transform your supply chain operations.
                        </p>
                    </div>

                    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }} onSubmit={e => e.preventDefault()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Full Name</label>
                            <input type="text" placeholder="Enter your full name"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(0,0,0,0.2)', padding: '12px 16px', fontSize: 11, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                                onFocus={e => e.currentTarget.style.borderColor = '#96CC39'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Business Email</label>
                            <input type="email" placeholder="name@company.com"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(0,0,0,0.2)', padding: '12px 16px', fontSize: 11, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                                onFocus={e => e.currentTarget.style.borderColor = '#96CC39'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Industry Segment</label>
                            <div style={{ position: 'relative' }}>
                                <select style={{ width: '100%', background: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(0,0,0,0.2)', padding: '12px 16px', fontSize: 11, outline: 'none', color: 'rgba(0,0,0,0.7)', appearance: 'none' as const, cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 500 }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#96CC39'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'}>
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
                                style={{ width: '100%', background: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(0,0,0,0.2)', padding: '12px 16px', fontSize: 11, outline: 'none', color: '#0A0A0A', transition: 'all 0.2s ease', fontWeight: 500 }}
                                onFocus={e => e.currentTarget.style.borderColor = '#96CC39'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
                            <label style={{ fontSize: 9, fontWeight: 900, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Message</label>
                            <textarea placeholder="Tell us about your requirements..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(0,0,0,0.2)', padding: '14px 16px', fontSize: 11, outline: 'none', color: '#0A0A0A', minHeight: 80, resize: 'none', transition: 'all 0.2s ease', lineHeight: 1.6, fontWeight: 500 }}
                                onFocus={e => e.currentTarget.style.borderColor = '#96CC39'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'} />
                        </div>
                        <button type="submit"
                            style={{ gridColumn: 'span 2', background: '#96CC39', color: '#000', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '14px 0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', marginTop: 8, boxShadow: '0 8px 24px rgba(150,204,57,0.1)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#A5D64C';
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#96CC39';
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            }}
                        >
                            Send Message <Send style={{ width: 14, height: 14, strokeWidth: 2, rotate: '45deg' }} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ═══ INFO CARD — Bento Grid Style ═══ */}
            <div
                ref={copyrightRef}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    width: 'clamp(380px, 30vw, 550px)',
                    zIndex: 25,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12
                }}
            >
                {/* Intro Tile */}
                <div style={{
                    gridColumn: 'span 2',
                    // background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    padding: '20px',
                    border: '0.5px solid #96CC39',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#96CC39', lineHeight: 0.8, marginBottom: 16, letterSpacing: '-0.06em' }}>MatNEXT</h2>
                    <p style={{ color: 'rgba(0,0,0,1)', fontSize: 10.5, lineHeight: 1.6, letterSpacing: '0.01em', maxWidth: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 1, height: 30, background: '#96CC39' }} />
                        Advanced product and material tracking, traceability & <br /> sustainability platform for the industrial value chain.
                    </p>
                </div>

                {/* HQ Locations Tile */}
                <div style={{
                    // background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
                    padding: '20px 20px',
                    border: '0.5px solid #96CC39',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#96CC39', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 20 }}>HQ LOCATIONS</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(150,204,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={12} color="#96CC39" strokeWidth={3} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ fontSize: 10, color: '#0A0A0A', letterSpacing: '0.1em' }}>MUMBAI</div>
                                <div style={{ width: 1, height: 12, background: '#96CC39' }} />
                                <div style={{ fontSize: 10, color: 'rgba(0, 0, 0, 1)', letterSpacing: '0.1em' }}>INDIA 🇮🇳</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(150,204,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={12} color="#96CC39" strokeWidth={3} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ fontSize: 10, color: 'rgba(0, 0, 0, 1)', letterSpacing: '0.1em' }}>TOKYO</div>
                                <div style={{ width: 1, height: 12, background: '#96CC39' }} />
                                <div style={{ fontSize: 10, color: 'rgba(0, 0, 0, 1)', letterSpacing: '0.1em' }}>JAPAN 🇯🇵</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Direct Line Tile */}
                <div style={{
                    // background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
                    padding: '20px 20px',
                    border: '0.5px solid #96CC39',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#96CC39', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 20 }}>DIRECT LINE</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(0,0,0,1)', fontSize: 11 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(150,204,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={12} color="#96CC39" strokeWidth={3} />
                            </div>
                            INFO-MATNEXT@GENBANEXT.COM
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(0,0,0,1)', fontSize: 11 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(150,204,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={12} color="#96CC39" strokeWidth={3} />
                            </div>
                            +81 80-8529-3858
                        </div>
                    </div>
                </div>

                {/* Quick Links Tile */}
                <div style={{
                    gridColumn: 'span 2',
                    // background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
                    padding: '20px 20px',
                    border: '0.5px solid #96CC39',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#96CC39', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>QUICK LINKS</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40 }}>
                        {[
                            'Features', 'Traction',
                            'Genba AI', 'Why MatNEXT',
                            'Our Partners', 'Contact'
                        ].map((link) => (
                            <a
                                key={link}
                                href="#"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    color: 'rgba(0,0,0,0.5)',
                                    textDecoration: 'none',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    padding: '5px 0',
                                    borderBottom: '0.5px solid #96CC39',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.borderBottomColor = '#96CC39';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'rgba(0,0,0,0.5)';
                                    e.currentTarget.style.borderBottomColor = '#96CC39';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                {link}
                                <ArrowUpRight size={14} style={{ opacity: 1, color: '#96CC39' }} />
                            </a>
                        ))}
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0.5 }}>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>© 2026 MatNEXT. All rights reserved.</div>
                    </div>
                </div>
            </div>

            {/* ═══ LEFT HAND — from top-left, closer to center ═══ */}
            <img
                ref={leftHandRef}
                src={handLeftSvg}
                alt=""
                style={{
                    position: 'absolute',
                    top: '-5%',
                    rotate: '-7deg',
                    left: '-0.5%',
                    width: 'clamp(1000px, 80vw, 1100px)',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                    opacity: 0,
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
                    rotate: '7deg',
                    right: '-2%',
                    width: 'clamp(1000px, 80vw, 1100px)',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                    opacity: 0,
                }}
            />

            {/* ═══ CENTER: Globe + Logo + Cars ═══ */}
            <div
                ref={globeContainerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    width: 'clamp(550px, 50vw, 750px)',
                    height: 'clamp(550px, 50vw, 750px)',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
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
                <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <FooterGlobe />
                </Canvas>


                {/* ── Top Car (anticlockwise) ── */}
                {/* <div
                    ref={topCarRef}
                    style={{
                        position: 'absolute',
                        top: '18%',
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        width: 'clamp(80px, 7vw, 120px)',
                        height: 'clamp(50px, 4vw, 70px)',
                        zIndex: 26,
                    }}
                >
                    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }} style={{ pointerEvents: 'none', }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[3, 5, 3]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <FooterCar direction={1} />
                        </Suspense>
                    </Canvas>
                </div> */}

                {/* ── MatNEXT Logo (pulsing center) ── */}
                {/* <div
                    ref={logoRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 30,
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={logo}
                        alt="MatNEXT"
                        style={{
                            width: 'clamp(60px, 6vw, 100px)',
                            height: 'auto',
                        }}
                    />
                </div> */}

                {/* ── Bottom Car (clockwise) ── */}
                {/* <div
                    ref={bottomCarRef}
                    style={{
                        position: 'absolute',
                        bottom: '18%',
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        width: 'clamp(80px, 7vw, 120px)',
                        height: 'clamp(50px, 4vw, 70px)',
                        zIndex: 26,
                    }}
                >
                    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }} style={{ pointerEvents: 'none' }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[3, 5, 3]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <FooterCar direction={-1} />
                        </Suspense>
                    </Canvas>
                </div> */}
            </div>

        </footer>
    )
}

useGLTF.preload(carModelUrl)
