"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { IntroLoader } from "./IntroLoader";

interface IntroState {
  /** True once the loader has cleared and the hero may start its entrance. */
  ready: boolean;
}

const IntroContext = createContext<IntroState>({ ready: true });

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const handleDone = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready: ready || !!reduceMotion }), [
    ready,
    reduceMotion,
  ]);

  return (
    <IntroContext.Provider value={value}>
      {!reduceMotion ? <IntroLoader onDone={handleDone} /> : null}
      {children}
    </IntroContext.Provider>
  );
}
