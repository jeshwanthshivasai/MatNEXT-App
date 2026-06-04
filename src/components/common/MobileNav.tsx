import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SoundController } from '@/utils/SoundController'
import logo from '@/assets/MatNEXT.png'

interface MobileNavProps {
    scrollToSection: (id: string) => void
    loading: boolean
    isFooterReached: boolean
    scrollProgress: number
}

export const MobileNav = ({ scrollToSection, loading, isFooterReached, scrollProgress }: MobileNavProps) => {
    const { t, i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const isNavVisible =
        (!loading && scrollProgress < 0.3 && !isFooterReached) ||
        (scrollProgress > 0.45 && !isFooterReached)

    const navItems = [
        { label: t('nav.features'), id: 'features' },
        { label: t('nav.traction'), id: 'traction' },
        { label: t('nav.ai'), id: 'ai' },
        { label: t('nav.why'), id: 'why-matnext' },
        { label: t('nav.customers'), id: 'customers' },
    ]

    const handleNavClick = (id: string) => {
        SoundController.playClickSound()
        scrollToSection(`#${id}`)
        setIsOpen(false)
    }

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code)
        SoundController.playClickSound()
        setIsOpen(false)
    }

    return (
        <div
            className="md:hidden"
            style={{
                opacity: isNavVisible ? 1 : 0,
                pointerEvents: isNavVisible ? 'auto' : 'none',
                transition: 'opacity 0.7s ease',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
            }}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-data-navy/10">
                <img
                    src={logo}
                    alt="MatNEXT"
                    className="h-5 w-auto object-contain cursor-pointer"
                    onClick={() => {
                        SoundController.playClickSound()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                />
                <button
                    onClick={() => {
                        setIsOpen(o => !o)
                        SoundController.playClickSound()
                    }}
                    className="text-data-navy hover:text-electric-sulfur transition-colors p-1"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="bg-white border-b border-data-navy/10 shadow-lg px-6 py-4 flex flex-col"
                    >
                        {/* Nav items */}
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                onMouseEnter={() => SoundController.playHoverSound()}
                                className="text-left text-[10px] font-bold tracking-[0.3em] uppercase text-data-navy hover:text-electric-sulfur transition-colors py-3 border-b border-data-navy/5 last:border-0"
                            >
                                /{item.label}
                            </button>
                        ))}

                        {/* Language selector */}
                        <div className="flex items-center gap-2 pt-4 pb-2">
                            <Languages className="w-3 h-3 text-data-navy/50" />
                            {[
                                { code: 'en', label: 'EN' },
                                { code: 'jp', label: 'JP' },
                                { code: 'th', label: 'TH' },
                            ].map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 transition-colors ${
                                        i18n.language === lang.code
                                            ? 'bg-electric-sulfur text-white'
                                            : 'text-data-navy/50 hover:text-data-navy'
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            className="mt-3 btn-premium w-full flex items-center justify-center gap-3 py-3 text-[10px] tracking-widest"
                            onClick={() => {
                                SoundController.playClickSound()
                                setIsOpen(false)
                            }}
                        >
                            {t('nav.demo')} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
