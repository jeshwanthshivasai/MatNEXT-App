import React from 'react'

interface DotGridBackgroundProps {
    className?: string
}

/**
 * MKBHD-style dot grid: static white dots on data-navy with a radial vignette.
 * Pure CSS — resolution-independent, scales responsively via clamp().
 */
export const DotGridBackground: React.FC<DotGridBackgroundProps> = ({ className = '' }) => {
    return (
        <div
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{ backgroundColor: '#1A1D23' }}
        >
            {/* Dot grid layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1.5px)',
                    backgroundSize:
                        'clamp(14px, 2.2vmin, 28px) clamp(14px, 2.2vmin, 28px)',
                    backgroundPosition: 'center center',
                }}
            />
            {/* Radial vignette to darken the edges like the MKBHD reference */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(10,12,16,0.55) 75%, rgba(10,12,16,0.85) 100%)',
                }}
            />
        </div>
    )
}
