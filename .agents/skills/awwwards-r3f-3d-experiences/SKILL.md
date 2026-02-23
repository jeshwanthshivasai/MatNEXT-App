---
name: Awwwards React Three Fiber (R3F) 3D Experiences
description: Techniques for integrating WebGL and 3D into React applications via React Three Fiber to create stunning, immersive website hero sections and interactive backgrounds.
---

# Awwwards React Three Fiber (R3F) 3D

Integrating 3D elements elevates a B2B SaaS website from "good" to "world-class Awwwards winner". 

## 1. Scene Optimization (Crucial)
- **Geometry & Textures**: Keep poly-count extremely low. Compress textures using WebP or basis (`.ktx2`). Use glTF (`.glb`) formats and run them through `gltfjsx` for declarative React components.
- **InstancedMesh**: If rendering many identical objects (like particles, abstract cubes, data nodes), you MUST use `InstancedMesh` to keep draw calls at a minimum (ideally 1).
- **Drei Components**: Heavily utilize `@react-three/drei` utilities like `Environment`, `ContactShadows`, `Float`, `PresentationControls`, and `Html`.

## 2. Seamless HTML & WebGL Integration
- **Drei HTML Component**: Use `<Html>` from `@react-three/drei` to perfectly map DOM elements to 3D coordinates (tooltips, labels, data overlays on 3D models).
- **View component**: For mixing 3D elements seamlessly across standard HTML pages, leverage the `<View>` component from Drei to avoid creating multiple rigid heavy canvases. Use one global `<Canvas>` with multiple Views.

## 3. Lighting & Materials
- **Environment Lighting**: Avoid heavy dynamic point lights if possible. Use HDRI maps via Drei's `<Environment>` for realistic, performant reflections and lighting.
- **Custom Shaders**: For truly mind-blowing visuals (liquid distorts, particle flows representing B2B data), use custom GLSL shaders with `shaderMaterial`.
- **Bake Shadows**: Whenever possible, bake lighting and shadows directly into the textures using Blender before exporting to WebGL. Overusing `castShadow` and `receiveShadow` in real-time kills framerates.

## 4. Loading States
- **Suspense & Preloaders**: WebGL assets are heavy. ALWAYS wrap R3F scenes in `React.Suspense`. 
- **Progress Bars**: Build beautiful, branded, GSAP-animated loading screens utilizing Drei's `useProgress()` hook so the user is entertained while assets load.

*No framerate drops allowed. A 60 FPS experience is mandatory for an Awwwards-level feel.*
