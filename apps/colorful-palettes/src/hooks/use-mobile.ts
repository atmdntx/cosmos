import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const getServerSnapshot = () => false;

const getSnapshot = () => {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
    return false;
  }
  return window.matchMedia(query).matches;
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
    return () => {};
  }
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
};

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
