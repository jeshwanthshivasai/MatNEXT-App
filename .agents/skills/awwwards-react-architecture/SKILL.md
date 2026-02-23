---
name: Awwwards React Architecture
description: Best practices for scaling and structuring world-class React web applications, focusing on performance, maintainability, and advanced pattern usage.
---

# Awwwards React Architecture

For a top-tier B2B SaaS website, the React architecture must be flawless, performant, and highly scalable.

## 1. File & Component Structure
- **Feature-Centric Modules**: Group by feature rather than type (e.g., `features/authentication/` instead of `components/` and `hooks/` separated at the root).
- **Atomic Design Principles**: Break UI into Atoms, Molecules, Organisms, and Templates. 
- **Absolute Imports**: Always configure and use absolute imports (e.g., `@/components/...`) to avoid messy `../../../` relative paths.

## 2. State & Data Management
- **Server State vs Client State**: Clearly separate them. Use **React Query** or **SWR** for server state (caching, deduplication) and **Zustand** or React Context for minimal, global client state.
- **Immutability & Purity**: Keep React components pure. Side-effects belong in well-isolated custom hooks.

## 3. Performance & Optimization
- **Dynamic Imports**: Lazy-load heavy components (like 3D scenes or complex charts) using `React.lazy` and `Suspense`.
- **Memoization**: Use `useMemo` and `useCallback` appropriately, especially when passing props down to deeply nested or highly animated interactive components.
- **Render Optimization**: Avoid unnecessary re-renders. Component structure should isolate state changes to the smallest possible branch of the DOM tree.

## 4. Modern Hooks & APIs
- **Custom Hooks for Logic Extraction**: UI components should be strictly presentational. Complex business logic or animation orchestration must be extracted into custom hooks (e.g., `useScrollSequence`, `usePricingCalculator`).

Remember: A beautiful UI built on a fragile architecture will ultimately fail. The code must be as elegant as the visual result.
