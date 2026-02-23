import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { DeconstructibleCar } from './DeconstructibleCar'

export const Loader = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0)
    const [showWebsite, setShowWebsite] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    // Wait for explosion animation to finish
                    setTimeout(() => {
                        setShowWebsite(true)
                        setTimeout(onComplete, 1000)
                    }, 2000)
                    return 100
                }
                return prev + 0.5 // Slower, smoother boot
            })
        }, 30)

        return () => clearInterval(interval)
    }, [onComplete])

    // Map loader progress (0-100):
    // 0 to 75 -> Rotation (0 to 0.75 in DeconstructibleCar)
    // 75 to 100 -> Explosion (0.75 to 1.0 in DeconstructibleCar)
    const getCarProgress = () => {
        return progress / 100
    }

    return (
        <AnimatePresence>
            {!showWebsite && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-data-navy text-electric-sulfur font-mono overflow-hidden"
                >
                    {/* 3D LOADING CANVAS */}
                    <div className="absolute inset-0 w-full h-full">
                        <Canvas gl={{ antialias: true, alpha: true }}>
                            <Suspense fallback={null}>
                                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                                <DeconstructibleCar progress={getCarProgress()} isLoader={true} />
                                <Environment preset="city" />
                                <ambientLight intensity={1} />
                                <pointLight position={[10, 10, 10]} />
                            </Suspense>
                        </Canvas>
                    </div>

                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: progress === 100 ? 0 : 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="absolute top-10 left-10 text-[10px] opacity-40 uppercase tracking-[0.4em]">
                            MatNEXT Protocol // v2.0.26 // Initializing_System
                        </div>

                        <div className="relative z-10 w-full max-w-2xl px-10 mt-auto mb-32">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-5xl font-black tracking-tighter italic leading-none">BOOTING</span>
                                <div className="text-right">
                                    <span className="block text-[10px] opacity-40 uppercase tracking-widest mb-1">System_Integrity</span>
                                    <span className="text-4xl font-black tabular-nums">{Math.floor(progress)}%</span>
                                </div>
                            </div>

                            <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-electric-sulfur shadow-[0_0_20px_#96CC39]"
                                />
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] uppercase tracking-[0.5em] opacity-60 animate-pulse">
                                    Please wait while we load our next gen platform
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-10 right-10 text-[10px] opacity-40 uppercase tracking-[0.4em] text-right">
                            Deep-Tier Supply Chain Traceability<br />
                            Industrial Grade Intelligence
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
