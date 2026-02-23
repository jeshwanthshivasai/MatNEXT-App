---
name: Awwwards Performance Auditing & Optimization
description: Advanced strategies for performance auditing, Core Web Vitals optimization, and ensuring a blazing-fast premium web experience.
---

# Awwwards Performance & Speed

An Awwwards-winning site must be fast. Lag or slow loading ruins the premium illusion and hurts conversion.

## 1. Auditing & Core Web Vitals (CWV)
- **Lighthouse & PageSpeed Insights**: Regularly audit for LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift). Aim for 90+ on all metrics.
- **Developer Tools**: Use Chrome DevTools "Performance" and "Network" tabs to identify heavy assets, long tasks, and render-blocking scripts.

## 2. Image & Asset Optimization
- **Next-Gen Formats**: Use WebP or AVIF for all images. Use video (MP4/WebM) instead of heavy GIFs.
- **Asset Compression**: Use tools like `sharp` or cloud-based CDNs to serve optimized, correctly-sized assets. 
- **Font Optimization**: Use `font-display: swap`, preload critical fonts, and subset font files to only include the characters you actually use.

## 3. Code Optimization & Delivery
- **Tree-Shaking**: Ensure you are only shipping the code you use. Audit heavy dependencies (like Three.js or GSAP libraries) and only import what's necessary.
- **Strategic Lazy-Loading**: Lazy-load everything below the fold. Use `IntersectionObserver` or library-specific lazy-loading features for 3D scenes and heavy interactive modules.
- **Critical CSS**: Ensure styles required for the hero section are loaded immediately to prevent layout shifts.

*Speed is not a luxury; it is the foundation of a premium user experience.*
