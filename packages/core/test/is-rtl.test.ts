// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest"
import { isRTL } from "../src/foundation/platform/env"

describe("isRTL", () => {
  test("returns false for null or undefined", () => {
    expect(isRTL(null)).toBe(false)
    expect(isRTL(undefined)).toBe(false)
  })

  test("resolves dir attribute from element without reading computed style", () => {
    const el = document.createElement("div")
    el.setAttribute("dir", "rtl")
    const spy = vi.spyOn(window, "getComputedStyle")

    expect(isRTL(el)).toBe(true)
    expect(spy).not.toHaveBeenCalled()

    el.setAttribute("dir", "ltr")
    expect(isRTL(el)).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  test("resolves dir attribute from ancestor without reading computed style", () => {
    const parent = document.createElement("div")
    parent.setAttribute("dir", "rtl")
    const child = document.createElement("span")
    parent.appendChild(child)
    document.body.appendChild(parent)

    const spy = vi.spyOn(window, "getComputedStyle")
    expect(isRTL(child)).toBe(true)
    expect(spy).not.toHaveBeenCalled()

    parent.setAttribute("dir", "ltr")
    expect(isRTL(child)).toBe(false)
    expect(spy).not.toHaveBeenCalled()

    parent.remove()
    spy.mockRestore()
  })

  test("closest dir attribute overrides ancestor dir attribute", () => {
    const parent = document.createElement("div")
    parent.setAttribute("dir", "rtl")
    const child = document.createElement("div")
    child.setAttribute("dir", "ltr")
    const grandChild = document.createElement("span")
    child.appendChild(grandChild)
    parent.appendChild(child)
    document.body.appendChild(parent)

    const spy = vi.spyOn(window, "getComputedStyle")
    expect(isRTL(grandChild)).toBe(false)
    expect(spy).not.toHaveBeenCalled()

    parent.remove()
    spy.mockRestore()
  })

  test("resolves dir from documentElement when ancestor has no dir", () => {
    document.documentElement.setAttribute("dir", "rtl")
    const el = document.createElement("div")
    document.body.appendChild(el)

    const spy = vi.spyOn(window, "getComputedStyle")
    expect(isRTL(el)).toBe(true)
    expect(spy).not.toHaveBeenCalled()

    document.documentElement.removeAttribute("dir")
    el.remove()
    spy.mockRestore()
  })

  test("resolves dir through shadow DOM boundaries", () => {
    const host = document.createElement("div")
    host.setAttribute("dir", "rtl")
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: "open" })
    const inner = document.createElement("span")
    shadow.appendChild(inner)

    const spy = vi.spyOn(window, "getComputedStyle")
    expect(isRTL(inner)).toBe(true)
    expect(spy).not.toHaveBeenCalled()

    host.remove()
    spy.mockRestore()
  })

  test("falls back to getComputedStyle when no dir attribute is set", () => {
    const el = document.createElement("div")
    document.body.appendChild(el)
    el.style.direction = "rtl"

    const spy = vi.spyOn(window, "getComputedStyle")
    expect(isRTL(el)).toBe(true)
    expect(spy).toHaveBeenCalled()

    el.remove()
    spy.mockRestore()
  })
})
