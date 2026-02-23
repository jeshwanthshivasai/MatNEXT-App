---
name: Awwwards GSAP Scroll & Interactions
description: Utilizing GSAP, ScrollTrigger, and smooth scrolling for creating award-winning interactive web animations and layout transitions.
---

# Awwwards GSAP Animations

GSAP is the industry standard for award-winning web animation. For a B2B SaaS site, animations should feel purposeful, smooth, and highly polished, not chaotic.

## 1. Smooth Scrolling Foundation
- **Lenis**: ALWAYS pair GSAP ScrollTrigger with a smooth scroll library like **Lenis** (by Studio Freight). Native browser scrolling feels too abrupt for premium experiences. Sync ScrollTrigger with Lenis's `requestAnimationFrame`.

## 2. Advanced ScrollTrigger Techniques
- **Pinning & Scrubbing**: Use `pin: true` to lock sections in place while scrolling through their content (e.g., horizontal scrolling sections, or fading features in and out while the hero image stays pinned). Use `scrub: true` (or a numeric value like `scrub: 1` for smoothness) to tie animation playheads exactly to the scrollbar.
- **Staggers**: Use `stagger` for animating lists, grids, or bento boxes gracefully. Staggering elements by `0.05s` or `0.1s` creates a cascading, professional feel.
- **Text Reveal**: Break text into lines or characters (using SplitText or a custom React component) and use GSAP to reveal them smoothly. E.g., `y: "100%", opacity: 0` to `y: 0, opacity: 1` enclosed in an `overflow: hidden` wrapper.

## 3. React Integration with GSAP
- **useGSAP Hook**: ALWAYS use the official `@gsap/react` package and the `useGSAP()` hook for animations inside React. This ensures perfect cleanup and avoids memory leaks or double-firings during React strict-mode re-renders.
- **Refs & Scopes**: Pass a `ref` wrapper to `useGSAP({ scope: containerRef })` so you can use simple string selectors (like `.box`) safely without querying the global DOM.

## 4. Animation Philosophy Check
- **Easing**: Default `power1.out` is generic. Use `expo.out`, `power4.out`, or custom cubic-bezier curves for a snappy yet smooth luxury feel.
- **Subtlety**: B2B SaaS animations should project confidence. Over-the-top, spinning, bouncing elements look cheap. Prefer micro-interactions, subtle parallax, slow scale-ins, and elegant fade/slide reveals.
