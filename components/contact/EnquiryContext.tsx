"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EnquiryModal } from "./EnquiryModal";

interface EnquiryState {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const EnquiryContext = createContext<EnquiryState>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

/**
 * The three "Start a project" calls to action sit in three different corners
 * of the tree — the nav, the hero and the contact section — and all open the
 * same dialog, so the open state lives above them rather than being lifted
 * through each one.
 */
export function useEnquiry() {
  return useContext(EnquiryContext);
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal open={isOpen} onClose={close} />
    </EnquiryContext.Provider>
  );
}
