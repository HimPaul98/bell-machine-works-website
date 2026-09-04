// lib/motion/scroll-engine.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type FrameCallback = (scrollY: number) => void;

interface ScrollEngineValue {
  registerFrameCallback: (id: string, callback: FrameCallback) => () => void;
}

const ScrollEngineContext = createContext<ScrollEngineValue | null>(null);

/** True when the user has requested reduced motion. Every motion primitive
 *  in this phase must check this and render its final, static state
 *  instead of animating when it's true. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Registers `callback` to run once per Lenis scroll event with the
 *  current scrollY. No-ops under prefers-reduced-motion — the provider
 *  never boots Lenis in that case, so the callback simply never fires. */
export function useScrollFrame(callback: FrameCallback) {
  const engine = useContext(ScrollEngineContext);
  const id = useId();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!engine) return;
    return engine.registerFrameCallback(id, (y) => callbackRef.current(y));
  }, [engine, id]);
}

export function ScrollEngineProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const callbacksRef = useRef(new Map<string, FrameCallback>());

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let rafId = 0;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;

    function broadcast(scrollY: number) {
      for (const callback of callbacksRef.current.values()) callback(scrollY);
    }

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      lenis.on("scroll", ({ scroll }: { scroll: number }) => broadcast(scroll));
      broadcast(window.scrollY);

      (window as typeof window & { __scrollEngine?: unknown }).__scrollEngine = { lenis };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, [reducedMotion]);

  const registerFrameCallback = (id: string, callback: FrameCallback) => {
    callbacksRef.current.set(id, callback);
    return () => {
      callbacksRef.current.delete(id);
    };
  };

  return (
    <ScrollEngineContext.Provider value={{ registerFrameCallback }}>
      {children}
    </ScrollEngineContext.Provider>
  );
}
