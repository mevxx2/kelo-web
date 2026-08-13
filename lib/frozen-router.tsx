"use client";

import { useContext, useRef, type ReactNode } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

/*
 * The App Router swaps route content the instant navigation commits, so by the
 * time an AnimatePresence tries to play an exit animation the outgoing subtree
 * has already re-rendered as the *incoming* page. FrozenRouter pins the router
 * context to the value it had on mount, which keeps the outgoing tree rendering
 * its own content until its exit animation finishes.
 *
 * This is the one place the project reaches into a Next internal
 * (`next/dist/shared/lib/app-router-context.shared-runtime`). It is stable
 * across Next 13.4–14.x. If a future upgrade moves it, delete FrozenRouter and
 * drop the AnimatePresence exit prop on its callers — you lose exit
 * animations, nothing else.
 *
 * Shared by `components/page-transition.tsx` (top-level route swaps) and
 * `components/funnel-transition.tsx` (the /get-started step transitions) so
 * this reach-in exists in exactly one place.
 */
export function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
