import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SoundController } from '@/utils/SoundController'
import { useWindowSize } from '@/hooks/useWindowSize'
import logo from '../../assets/MatNEXT.png'

interface IntroScreenProps {
    onExplore: () => void
}

const COLOR_TOKENS = {
    background: '#FFFFFF',
    primary: '#96CC39',
    textSecondary: '#0A1628'
};

const PulsatingGrid: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let startTime = performance.now();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // 100% Match with original desktop grid layout dimensions
        const ROWS = 30;
        const COLS = 50;

        const render = (now: number) => {
            const time = (now - startTime) / 1000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const SPACING_X = canvas.width / COLS;
            const SPACING_Y = canvas.height / ROWS;

            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    const baseUrlX = j * SPACING_X + SPACING_X / 2;
                    const baseUrlY = i * SPACING_Y + SPACING_Y / 2;

                    // Organic "Turbulent" motion scaled to time in seconds
                    const noiseX = Math.sin(time * 3.0 + i * 0.5) * 10 + Math.cos(time * 2.0 + j * 0.3) * 5;
                    const noiseY = Math.cos(time * 2.4 + j * 0.4) * 10 + Math.sin(time * 1.7 + i * 0.2) * 5;

                    // Wave pulse based on distance from center
                    const centerX = COLS / 2;
                    const centerY = ROWS / 2;
                    const distance = Math.sqrt(Math.pow(j - centerX, 2) + Math.pow(i - centerY, 2));

                    // The "Wave" pulse (scaled to time in seconds to fix 120Hz screen double-speed)
                    const wave = Math.sin(time * 4.0 - distance / 3) * 0.5 + 0.5;

                    // Appearance properties
                    const size = 2 + wave * 3; // 2px to 5px
                    const opacity = 0.1 + wave * 0.3; // 0.1 to 0.4

                    // Color variation (Subtle mix of grey and primary)
                    const color = wave > 0.8 ? COLOR_TOKENS.primary : '#D1D5DB';

                    // Draw the dot
                    ctx.beginPath();
                    ctx.arc(baseUrlX + noiseX, baseUrlY + noiseY, size / 2, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.globalAlpha = opacity;
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ backgroundColor: COLOR_TOKENS.background }}
        />
    );
};

const MaterialViewfinder = ({ isHovered }: { isHovered: boolean }) => {
    return (
        <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
        >
            {/* Top Left Corner */}
            <motion.path
                d="M4 8V4H8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                animate={{
                    x: isHovered ? 2 : 0,
                    y: isHovered ? 2 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Top Right Corner */}
            <motion.path
                d="M16 4H20V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                animate={{
                    x: isHovered ? -2 : 0,
                    y: isHovered ? 2 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Bottom Left Corner */}
            <motion.path
                d="M4 16V20H8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                animate={{
                    x: isHovered ? 2 : 0,
                    y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Bottom Right Corner */}
            <motion.path
                d="M16 20H20V16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                animate={{
                    x: isHovered ? -2 : 0,
                    y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Center Dot */}
            <motion.circle
                cx="12"
                cy="12"
                r="1.5"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isHovered ? [0.4, 1, 0.4] : 0,
                    scale: isHovered ? [0.8, 1.2, 0.8] : 0,
                }}
                transition={{
                    opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    default: { duration: 0.3 }
                }}
            />
        </motion.svg>
    );
};

export const IntroScreen = ({ onExplore }: IntroScreenProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const { width } = useWindowSize()
    const isMobile = width < 768

    const handleExplore = () => {
        SoundController.init()
        SoundController.playClickSound()
        onExplore()
    }

    const buttonContainerWidth = isMobile ? Math.min(width - 32, 320) : 480
    const buttonExploreWidth = isMobile ? 140 : 180

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
            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
                {/* LOGO IMAGE */}
                <div className="mb-2">
                    <img src={logo} alt="MatNEXT Logo" className="h-16 sm:h-20 w-auto object-contain select-none pointer-events-none" />
                </div>

                {/* SUBTITLE WITH SIMPLE LINES */}
                <div className="flex items-center justify-center gap-4 mt-5 w-full max-w-xl">
                    {/* Left Line */}
                    {!isMobile && <div className="w-[120px] h-[1.5px] bg-gradient-to-r from-transparent to-[#96CC39]" />}

                    <span
                        className="text-data-navy font-light uppercase tracking-wider whitespace-nowrap text-[10px] sm:text-[12px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        Stands for MaterialNEXT
                    </span>

                    {/* Right Line */}
                    {!isMobile && <div className="w-[120px] h-[1.5px] bg-gradient-to-l from-transparent to-[#96CC39]" />}
                </div>

                {/* MORPHING EXPLORE BUTTON container */}
                <div 
                    style={{ width: buttonContainerWidth }}
                    className="mt-12 h-[64px] flex items-center justify-center cursor-pointer"
                    onMouseEnter={() => {
                        setIsHovered(true)
                        SoundController.playHoverSound()
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.button
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            width: isHovered ? buttonExploreWidth : buttonContainerWidth,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            width: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
                            layout: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
                        }}
                        onClick={handleExplore}
                        className="relative h-[64px] bg-[#96CC39] text-white rounded-none flex items-center justify-center overflow-hidden cursor-pointer"
                        style={{ width: '100%' }}
                    >
                        <div className="relative h-8 w-full flex items-center justify-center pointer-events-none">
                            {/* State 1: Slogan (Default) */}
                            <motion.div 
                                initial={{ y: 0, opacity: 1 }}
                                animate={{ 
                                    y: isHovered ? -40 : 0,
                                    opacity: isHovered ? 0 : 1
                                }}
                                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                                className="absolute flex items-center justify-center whitespace-nowrap px-4"
                            >
                                <span 
                                    className="text-[9px] sm:text-[13px] font-bold tracking-[0.12em] sm:tracking-[0.2em] uppercase leading-none"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {isMobile ? "Material Traceability System" : "Intelligent Material Traceability System"}
                                </span>
                            </motion.div>
                            
                            {/* State 2: Explore (Hovered) */}
                            <motion.div 
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ 
                                    y: isHovered ? 0 : 40,
                                    opacity: isHovered ? 1 : 0
                                }}
                                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                                className="absolute flex items-center justify-center whitespace-nowrap gap-3"
                            >
                                <span 
                                    className="text-[11px] sm:text-[13px] font-bold tracking-[0.2em] uppercase leading-none"
                                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                >
                                    Explore
                                </span>
                                <MaterialViewfinder isHovered={isHovered} />
                            </motion.div>
                        </div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}