// import { useState, useEffect } from 'react'

// interface WindowSize {
//     width: number
//     height: number
// }

// export function useWindowSize(): WindowSize {
//     const [size, setSize] = useState<WindowSize>({
//         width: typeof window !== 'undefined' ? window.innerWidth : 1280,
//         height: typeof window !== 'undefined' ? window.innerHeight : 900,
//     })

//     useEffect(() => {
//         let rafId: number
//         const handler = () => {
//             cancelAnimationFrame(rafId)
//             rafId = requestAnimationFrame(() => {
//                 setSize({ width: window.innerWidth, height: window.innerHeight })
//             })
//         }
//         window.addEventListener('resize', handler, { passive: true })
//         return () => {
//             window.removeEventListener('resize', handler)
//             cancelAnimationFrame(rafId)
//         }
//     }, [])

//     return size
// }
