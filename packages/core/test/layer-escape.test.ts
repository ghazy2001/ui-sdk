// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest"
import { mount } from "../src/testing"
import { popover } from "../src/components/popover/popover"
import { dialog } from "../src/components/dialog/dialog"

const mounts: { unmount: () => void }[] = []
afterEach(() => {
  mounts.splice(0).forEach((mounted) => mounted.unmount())
  document.body.replaceChildren()
})

describe("popup layer Escape in capture phase", () => {
  test("ancestor sees defaultPrevented true when popup handles Escape", async () => {
    let ancestorSawEscape = false
    let ancestorSawDefaultPrevented = false

    const host = document.createElement("div")
    host.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        ancestorSawEscape = true
        ancestorSawDefaultPrevented = event.defaultPrevented
      }
    })
    document.body.appendChild(host)

    const view = mount(
      popover,
      { defaultOpen: true },
      `<div>
        <trigger><button>Open</button></trigger>
        <content><button id="inside">Inside</button></content>
      </div>`
    )
    mounts.push(view)
    host.appendChild(view.root)

    const inside = host.querySelector<HTMLButtonElement>("#inside")!
    inside.focus()

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
    inside.dispatchEvent(event)

    expect(view.state.open).toBe(false)
    expect(ancestorSawEscape).toBe(true)
    expect(ancestorSawDefaultPrevented).toBe(true)

    host.remove()
  })

  test("ancestor calling stopPropagation during bubbling does not prevent popup from closing", async () => {
    const host = document.createElement("div")
    host.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.stopPropagation()
      }
    })
    document.body.appendChild(host)

    const view = mount(
      dialog,
      { defaultOpen: true },
      `<div>
        <trigger><button>Open</button></trigger>
        <content><button id="inside-dialog">Inside Dialog</button></content>
      </div>`
    )
    mounts.push(view)
    host.appendChild(view.root)

    const inside = host.querySelector<HTMLButtonElement>("#inside-dialog")!
    inside.focus()

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
    inside.dispatchEvent(event)

    expect(view.state.open).toBe(false)

    host.remove()
  })
})
