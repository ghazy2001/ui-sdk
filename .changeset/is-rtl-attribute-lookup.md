---
"@ui-sdk/core": patch
---

`isRTL` resolves direction from the nearest `dir` attribute and document before falling back to computed style, avoiding forced synchronous style recalculations during component mounting and opening.
