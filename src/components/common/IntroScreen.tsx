import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SoundController } from '@/utils/SoundController'
import logo from '../../assets/MatNEXT.png'

interface IntroScreenProps {
    onExplore: () => void
}

const COLOR_TOKENS = {
    background: '#FFFFFF',
    primary: '#96CC39',
    textSecondary: '#0A1628'
};

const interpolate = (value: number, inputRange: [number, number], outputRange: [number, number]) => {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;

    if (value <= inputMin) return outputMin;
    if (value >= inputMax) return outputMax;

    return outputMin + (outputMax - outputMin) * (value - inputMin) / (inputMax - inputMin);
}

const PulsatingGrid: React.FC = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        let frameId: number;
        const loop = () => {
            setFrame(f => f + 1);
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const ROWS = 30;
    const COLS = 50;

    // We use innerWidth/Height for spacing calculation
    const SPACING_X = typeof window !== 'undefined' ? window.innerWidth / COLS : 40;
    const SPACING_Y = typeof window !== 'undefined' ? window.innerHeight / ROWS : 40;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: COLOR_TOKENS.background }}>
            {Array.from({ length: ROWS }).map((_, i) => (
                Array.from({ length: COLS }).map((_, j) => {
                    const baseUrlX = j * SPACING_X;
                    const baseUrlY = i * SPACING_Y;

                    // Organic "Turbulent" motion
                    // Use trig functions with different frequencies to simulate randomness
                    const noiseX = Math.sin(frame / 20 + i * 0.5) * 10 + Math.cos(frame / 30 + j * 0.3) * 5;
                    const noiseY = Math.cos(frame / 25 + j * 0.4) * 10 + Math.sin(frame / 35 + i * 0.2) * 5;

                    // Wave pulse based on distance from center
                    const centerX = COLS / 2;
                    const centerY = ROWS / 2;
                    const distance = Math.sqrt(Math.pow(j - centerX, 2) + Math.pow(i - centerY, 2));

                    // The "Wave" pulse
                    const wave = Math.sin(frame / 15 - distance / 3) * 0.5 + 0.5;

                    // Appearance properties
                    const size = interpolate(wave, [0, 1], [2, 5]);
                    const opacity = interpolate(wave, [0, 1], [0.1, 0.4]);

                    // Color variation (Subtle mix of grey and primary)
                    const color = wave > 0.8 ? COLOR_TOKENS.primary : '#D1D5DB';

                    return (
                        <div
                            key={`${i}-${j}`}
                            style={{
                                position: 'absolute',
                                left: baseUrlX + noiseX,
                                top: baseUrlY + noiseY,
                                width: size,
                                height: size,
                                borderRadius: '50%',
                                backgroundColor: color,
                                opacity,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    );
                })
            ))}
        </div>
    );
};

export const IntroScreen = ({ onExplore }: IntroScreenProps) => {
    const handleExplore = () => {
        SoundController.init()
        SoundController.playClickSound()
        onExplore()
    }

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
        >
            {/* TURBULENT PULSATING GRID BACKGROUND */}
            <PulsatingGrid />

            {/* CENTRAL BRANDING - STATIC LAYOUT */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* LOGO IMAGE */}
                <div className="mb-4">
                    <img src={logo} alt="MatNEXT Logo" className="h-20 w-auto object-contain select-none pointer-events-none" />
                </div>

                {/* SUBTITLE WITH SIMPLE LINES */}
                <div className="flex items-center gap-4 mt-2">
                    {/* Left Line */}
                    <div className="w-[120px] h-[1.5px] bg-gradient-to-r from-transparent to-[#96CC39]" />

                    <span
                        className="text-data-navy font-light uppercase tracking-wider whitespace-nowrap"
                        style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                    >
                        Stands for MaterialNEXT
                    </span>

                    {/* Right Line */}
                    <div className="w-[120px] h-[1.5px] bg-gradient-to-l from-transparent to-[#96CC39]" />
                </div>

                {/* SLOGAN */}
                <div className="mt-8">
                    <p
                        className="text-[#0A1628]/60 font-bold tracking-[0.2em] uppercase"
                        style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                    >
                        Intelligent Material Traceability System
                    </p>
                </div>

                {/* EXPLORE BUTTON */}
                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        boxShadow: [
                            "0 0 0px rgba(150, 204, 57, 0)",
                            "0 0 25px rgba(150, 204, 57, 0.3)",
                            "0 0 0px rgba(150, 204, 57, 0)"
                        ]
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        boxShadow: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    onClick={handleExplore}
                    onMouseEnter={() => SoundController.playHoverSound()}
                    className="mt-24 px-14 py-5 bg-[#96CC39] text-white rounded-none flex items-center gap-5 group hover:bg-data-navy transition-all duration-500 shadow-xl"
                >
                    <span className="text-[13px] font-bold tracking-[0.5em] uppercase">Explore</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 text-white" />
                </motion.button>
            </div>
        </motion.div>
    )
}