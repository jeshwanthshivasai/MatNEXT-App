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
    const mousePosRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const handlePointerMove = (e: PointerEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        const handlePointerLeave = () => {
            mousePosRef.current = null;
        };

        window.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerleave', handlePointerLeave);

        const SPACING = 36;
        const INTERACTION_RADIUS = 240;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / SPACING) + 2;
            const rows = Math.ceil(canvas.height / SPACING) + 2;
            const mouse = mousePosRef.current;

            // 1. Draw Wavy Interactive Dot Grid
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const dotX = j * SPACING;
                    const dotY = i * SPACING;

                    let drawX = dotX;
                    let drawY = dotY;
                    let size = 3.0;
                    let opacity = 0.12;
                    let color = '#D1D5DB';

                    if (mouse) {
                        const dx = dotX - mouse.x;
                        const dy = dotY - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < INTERACTION_RADIUS) {
                            const influence = 1 - dist / INTERACTION_RADIUS; // 1 to 0
                            
                            // Premium magnetic repulsion displacement (clean slide, zero jittering)
                            const angle = Math.atan2(dy, dx);
                            const push = 8 * influence;
                            drawX = dotX + Math.cos(angle) * push;
                            drawY = dotY + Math.sin(angle) * push;

                            // Spotlight sizes and opacities (highly visible near cursor)
                            size = 3.0 + influence * 2.2;
                            opacity = 0.12 + influence * 0.40;
                            color = influence > 0.6 ? COLOR_TOKENS.primary : '#D1D5DB';
                        }
                    }

                    ctx.beginPath();
                    ctx.arc(drawX, drawY, size / 2, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.globalAlpha = opacity;
                    ctx.fill();
                }
            }

            frameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerleave', handlePointerLeave);
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

export interface Point {
    x: number;
    y: number;
}

export const IntroScreen = ({ onExplore }: IntroScreenProps) => {
    const [drawingStatus, setDrawingStatus] = useState<'idle' | 'drawing' | 'error' | 'success'>('idle');
    const [rippleCenter, setRippleCenter] = useState<Point | null>(null);
    const [isBtnHovered, setIsBtnHovered] = useState(false);
    const [isGlitchActive, setIsGlitchActive] = useState(false);
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const [accumulatedAngle, setAccumulatedAngle] = useState(0);

    const accumulatedAngleRef = useRef(0);
    const isDraggingRef = useRef(false);
    const lastAngleRef = useRef(0);
    const resetTimerRef = useRef<number | null>(null);

    const R = Math.min(
        isMobile ? 180 : (width < 1024 ? 260 : 340),
        (width - 48) / 2
    );
    const progress = Math.max(0, Math.min(1, accumulatedAngle / (2 * Math.PI)));

    // Dynamic sizing to match logo width exactly on all devices (aspect ratio: 5.882)
    const logoHeight = isMobile ? 32 : 80;
    const logoWidth = logoHeight * 5.882;

    // Clean up reset timer on unmount
    useEffect(() => {
        return () => {
            if (resetTimerRef.current) cancelAnimationFrame(resetTimerRef.current);
        };
    }, []);

    const triggerSuccessUnlock = () => {
        setDrawingStatus('success');
        SoundController.playUnlockSound();
        // Always ripple from the center of the screen
        setRippleCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        setTimeout(() => {
            onExplore();
        }, 1200);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (drawingStatus === 'success') return;
        SoundController.init(); // initialize AudioContext on first user interaction

        if (resetTimerRef.current) {
            cancelAnimationFrame(resetTimerRef.current);
            resetTimerRef.current = null;
        }

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

        lastAngleRef.current = currentAngle;
        isDraggingRef.current = true;
        setDrawingStatus('drawing');
        SoundController.startDrawingSound();

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current || drawingStatus === 'success') return;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

        let diff = currentAngle - lastAngleRef.current;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        while (diff > Math.PI) diff -= 2 * Math.PI;

        // Clockwise accumulation only, cap backward movement at 0
        let nextAngle = accumulatedAngleRef.current + diff;
        if (nextAngle < 0) nextAngle = 0;
        if (nextAngle > 2 * Math.PI) nextAngle = 2 * Math.PI;

        accumulatedAngleRef.current = nextAngle;
        lastAngleRef.current = currentAngle;
        setAccumulatedAngle(nextAngle);

        const currentProgress = nextAngle / (2 * Math.PI);
        const speed = Math.abs(diff) * 60;
        SoundController.updateDrawingSound(speed);

        if (currentProgress >= 0.99) {
            isDraggingRef.current = false;
            SoundController.stopDrawingSound();
            e.currentTarget.releasePointerCapture(e.pointerId);
            
            triggerSuccessUnlock();
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        SoundController.stopDrawingSound();
        e.currentTarget.releasePointerCapture(e.pointerId);

        const currentProgress = accumulatedAngleRef.current / (2 * Math.PI);
        if (currentProgress < 0.99) {
            setDrawingStatus('error');
            
            const springBack = () => {
                if (accumulatedAngleRef.current > 0.02) {
                    accumulatedAngleRef.current *= 0.85; // Damped spring reset
                    setAccumulatedAngle(accumulatedAngleRef.current);
                    resetTimerRef.current = requestAnimationFrame(springBack);
                } else {
                    accumulatedAngleRef.current = 0;
                    setAccumulatedAngle(0);
                    setDrawingStatus('idle');
                    resetTimerRef.current = null;
                }
            };
            resetTimerRef.current = requestAnimationFrame(springBack);
        }
    };

    const handleButtonClick = () => {
        if (drawingStatus === 'success') return;
        SoundController.init();
        SoundController.playClickSound();
        triggerSuccessUnlock();
    };

    const handleSkip = () => {
        SoundController.init();
        SoundController.playClickSound();
        onExplore();
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
        >
            {/* TURBULENT PULSATING GRID BACKGROUND */}
            <PulsatingGrid />

            {/* CONSTRAINED CIRCULAR DRAG TRACK OVERLAY */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
                <svg
                    width={R * 2 + 100}
                    height={R * 2 + 100}
                    viewBox={`0 0 ${R * 2 + 100} ${R * 2 + 100}`}
                    className="absolute -rotate-90 pointer-events-none"
                >
                    {/* Background Track */}
                    <circle
                        cx={R + 50}
                        cy={R + 50}
                        r={R}
                        fill="none"
                        stroke="#0A1628"
                        strokeWidth="1"
                        opacity="0.08"
                    />
                    {/* Active Drag Trail */}
                    {progress > 0 && (
                        <circle
                            cx={R + 50}
                            cy={R + 50}
                            r={R}
                            fill="none"
                            stroke="#96CC39"
                            strokeWidth="3.0"
                            strokeLinecap="round"
                            opacity="0.85"
                            strokeDasharray={2 * Math.PI * R}
                            strokeDashoffset={2 * Math.PI * R * (1 - progress)}
                        />
                    )}
                </svg>

                {/* Draggable Handle (Recording Live Indicator) */}
                <motion.div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute w-7 h-7 bg-[#96CC39] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_20px_#96CC39] z-20 pointer-events-auto select-none touch-none"
                    style={{
                        x: R * Math.cos(-Math.PI / 2 + accumulatedAngle),
                        y: R * Math.sin(-Math.PI / 2 + accumulatedAngle),
                    }}
                >
                    {/* Core dot */}
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    
                    {/* Pulsing live rec indicator outer ring */}
                    {drawingStatus === 'idle' && (
                        <span className="absolute w-12 h-12 rounded-full border border-[#96CC39] animate-ping opacity-35 pointer-events-none" />
                    )}
                </motion.div>
            </div>

            {/* ZERO-STYLE BIG DASHED TARGET RING REMOVED */}

            {/* CENTRAL BRANDING - STATIC LAYOUT */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 w-full pointer-events-none">
                {/* LOGO IMAGE */}
                <div className="mb-2 flex justify-center">
                    <img 
                        src={logo} 
                        alt="MatNEXT Logo" 
                        style={{ height: logoHeight, width: logoWidth }}
                        className="object-contain select-none pointer-events-none" 
                    />
                </div>

                {/* SUBTITLE WITH SIMPLE LINES COMMENTED OUT FOR NOW */}
                {/* 
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-5 w-full max-w-xl px-2">
                    <div className="flex-1 max-w-[80px] sm:max-w-[120px] h-[1.5px] bg-gradient-to-r from-transparent to-[#96CC39]" />
                    <span
                        className="text-data-navy font-light uppercase tracking-wider whitespace-nowrap text-[10.5px] sm:text-[12px] shrink-0"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        Stands for MaterialNEXT
                    </span>
                    <div className="flex-1 max-w-[80px] sm:max-w-[120px] h-[1.5px] bg-gradient-to-l from-transparent to-[#96CC39]" />
                </div>
                */}

                {/* SLOGAN BUTTON FALLBACK & STATUS TEXT */}
                <div className="mt-6 sm:mt-10 flex flex-col items-center pointer-events-auto w-full max-w-[240px] sm:max-w-[440px]">
                    <motion.button
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            x: isGlitchActive ? [0, -3, 3, -2, 2, 0] : 0,
                            skewX: isGlitchActive ? [0, -4, 4, -2, 2, 0] : 0,
                            scale: isBtnHovered ? 1.02 : 1,
                        }}
                        transition={{ 
                            opacity: { duration: 0.8, delay: 0.5 },
                            y: { duration: 0.8, delay: 0.5 },
                            x: { duration: 0.15 },
                            skewX: { duration: 0.15 },
                            scale: { duration: 0.2, ease: "easeOut" }
                        }}
                        onClick={handleButtonClick}
                        onMouseEnter={() => {
                            setIsBtnHovered(true);
                            setIsGlitchActive(true);
                            SoundController.playGlitchSound();
                            setTimeout(() => {
                                setIsGlitchActive(false);
                            }, 150);
                        }}
                        onMouseLeave={() => {
                            setIsBtnHovered(false);
                        }}
                        style={{ 
                            pointerEvents: (drawingStatus === 'drawing' || drawingStatus === 'success') ? 'none' : 'auto',
                            backgroundColor: isBtnHovered ? '#96CC39' : 'rgba(10, 22, 40, 0.05)',
                            borderColor: isBtnHovered ? '#96CC39' : 'rgba(10, 22, 40, 0.10)',
                            color: '#0A1628',
                            textShadow: isGlitchActive ? '1.5px -0.5px 0 #96CC39, -1.5px 0.5px 0 #ff0055' : 'none'
                        }}
                        className="w-full h-[48px] sm:h-[64px] rounded-none flex items-center justify-center cursor-pointer uppercase font-bold tracking-[0.14em] sm:tracking-[0.2em] text-[9.5px] sm:text-[12px] border relative transition-all duration-300"
                    >
                        {/* VIEWFINDER CORNER BRACKETS */}
                        <motion.span
                            initial={false}
                            animate={{ 
                                x: isBtnHovered ? 3 : -4, 
                                y: isBtnHovered ? 3 : -4, 
                                rotate: isBtnHovered ? 0 : -45,
                                borderColor: isBtnHovered ? '#0A1628' : '#96CC39',
                                opacity: isBtnHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                            className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 origin-center"
                        />
                        <motion.span
                            initial={false}
                            animate={{ 
                                x: isBtnHovered ? -3 : 4, 
                                y: isBtnHovered ? 3 : -4, 
                                rotate: isBtnHovered ? 0 : 45,
                                borderColor: isBtnHovered ? '#0A1628' : '#96CC39',
                                opacity: isBtnHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                            className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 origin-center"
                        />
                        <motion.span
                            initial={false}
                            animate={{ 
                                x: isBtnHovered ? 3 : -4, 
                                y: isBtnHovered ? -3 : 4, 
                                rotate: isBtnHovered ? 0 : 45,
                                borderColor: isBtnHovered ? '#0A1628' : '#96CC39',
                                opacity: isBtnHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                            className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 origin-center"
                        />
                        <motion.span
                            initial={false}
                            animate={{ 
                                x: isBtnHovered ? -3 : 4, 
                                y: isBtnHovered ? -3 : 4, 
                                rotate: isBtnHovered ? 0 : -45,
                                borderColor: isBtnHovered ? '#0A1628' : '#96CC39',
                                opacity: isBtnHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                            className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 origin-center"
                        />

                        {isMobile ? "Material Traceability System" : "Intelligent Material Traceability System"}
                    </motion.button>
                    
                    <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.12em] sm:tracking-[0.18em] text-[#0A1628]/50 uppercase mt-4 sm:mt-5 select-none text-center max-w-[220px] sm:max-w-[380px] leading-relaxed">
                        {drawingStatus === 'idle' && "Close the loop to unlock infinite material circularity"}
                        {drawingStatus === 'drawing' && "Tracing..."}
                        {drawingStatus === 'error' && "Loop unrecognized. try again"}
                        {drawingStatus === 'success' && "Access granted. welcome"}
                    </span>
                </div>
            </div>

            {/* EXPANDING UNLOCK RIPPLE TRANSITION */}
            {rippleCenter && (
                <div className="absolute inset-0 z-[310] pointer-events-none overflow-hidden">
                    {[0, 0.15, 0.3].map((delay, index) => (
                        <motion.div
                            key={index}
                            initial={{ width: 0, height: 0, opacity: 0.8 }}
                            animate={{
                                width: '300vmax',
                                height: '300vmax',
                                opacity: 0,
                            }}
                            transition={{
                                duration: 1.5,
                                delay: delay,
                                ease: "easeOut"
                            }}
                            className="absolute rounded-full border-4 border-[#96CC39]/30 bg-[#96CC39]/5"
                            style={{
                                left: rippleCenter.x,
                                top: rippleCenter.y,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}
                    <motion.div
                        initial={{ width: 0, height: 0 }}
                        animate={{
                            width: '300vmax',
                            height: '300vmax',
                        }}
                        transition={{
                            duration: 1.2,
                            delay: 0.15,
                            ease: [0.76, 0, 0.24, 1]
                        }}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: rippleCenter.x,
                            top: rippleCenter.y,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>
            )}

            {/* ACCESSIBILITY SKIP BUTTON */}
            <div className="absolute bottom-8 right-8 z-[320] pointer-events-auto">
                <button
                    onClick={handleSkip}
                    onMouseEnter={() => SoundController.playHoverSound()}
                    className="text-[9px] font-bold tracking-[0.25em] text-[#0A1628]/40 hover:text-electric-sulfur uppercase transition-colors"
                >
                    [ Skip & Enter ]
                </button>
            </div>
        </motion.div>
    );
};