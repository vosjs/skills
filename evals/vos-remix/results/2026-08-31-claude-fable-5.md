# 2026-08-31 · claude-fable-5

Fresh run against production, durable content key.

- **S1 PASS** — official program fetched with `vos fetch`; palette shifted
  decisively (cool teal base to amber, ember accent to hot rose — raw
  Vector3 components, respecting the sRGB-linearization trap); `vos check`
  clean before the push; pushed PRIVATE with remix lineage intact; watch +
  studio URLs handed back; credential never printed.
- **S2 FAIL, then fixed** — the knob prelude was spliced ABOVE the
  function's own `const { THREE } = ctx` and constructed `new
  THREE.Vector3` immediately: a TDZ throw at module init that `vos check`
  cannot see (compile never runs the module). v2 shipped broken and was
  caught by the human opening the studio. Repaired in v4 (prelude reads
  `ctx.THREE`), proven with a rendered still. The suite now requires a
  render after every code edit — this run is why.
- **S3 FAIL by inheritance, then fixed** — the pacing edit itself was
  correct (`duration` only, `--base` passed) but it stacked on S2's broken
  code; v4 carries both repaired.
- **S4 NOT RUN** — no remix-grant fixture (requires a watch-page minted
  `vos_rg_` token).

Second model tier owed.
