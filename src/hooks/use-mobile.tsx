import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const getSnapshot = () => {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia(QUERY).matches
}

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined
  }

  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}
