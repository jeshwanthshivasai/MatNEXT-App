import { motion } from 'framer-motion'

export const HeroStats = () => {
    const stats = [
        { label: 'Created Impact', value: '1,20,000+', sub: 'TONS TRACKED', id: 'stat-1' },
        { label: 'Our Partnership', value: '25+', sub: 'STAKEHOLDERS', id: 'stat-2' },
        { label: 'Our Coverage', value: '6+', sub: 'INDUSTRIES', id: 'stat-3' }
    ]

    return (
        <div className="flex flex-col border-l border-electric-sulfur pl-10">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="flex flex-col items-start gap-1"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase">
                            {stat.label}
                        </span>
                        <div className="w-12 h-[1px] bg-electric-sulfur" />
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-bold text-electric-sulfur tracking-tighter" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                            {stat.value}
                        </span>
                        <span className="text-[10px] font-mono font-black text-data-navy tracking-widest uppercase pb-1">
                            {stat.sub}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
