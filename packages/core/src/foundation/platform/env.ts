const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined"

// iPhone and iPad, including iPads that report a Mac.
function isIOS() {
  return (
    isBrowser &&
    (/iP(hone|ad|od)/.test(navigator.platform) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
  )
}

/**
 * Whether `el` lays out right to left: the nearest `dir` attribute, else its computed direction. False on the server.
 * @stable
 */
function isRTL(el: Element | null | undefined) {
  if (!el || !isBrowser) {
    return false
  }
  let current: Element | null = el
  while (current) {
    const dir = current.closest?.("[dir]")?.getAttribute("dir")?.toLowerCase()
    if (dir === "rtl" || dir === "ltr") {
      return dir === "rtl"
    }
    const root = current.getRootNode?.()
    current = root instanceof ShadowRoot ? (root.host as Element) : null
  }
  const docDir = el.ownerDocument?.documentElement
    ?.getAttribute("dir")
    ?.toLowerCase()
  if (docDir === "rtl" || docDir === "ltr") {
    return docDir === "rtl"
  }
  return getComputedStyle(el).direction === "rtl"
}

export { isBrowser, isIOS, isRTL }
