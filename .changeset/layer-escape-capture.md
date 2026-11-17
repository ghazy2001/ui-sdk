---
"@ui-sdk/core": patch
---

Popup layers handle Escape in the capture phase so that `event.preventDefault()` runs before ancestor bubbling listeners, preventing ancestor handlers from misinterpreting the Escape or blocking popup dismissal.
