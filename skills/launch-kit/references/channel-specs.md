# Channel specs — readable mirror

Source of truth: `schema/channel-specs.json` in the `@vosjs/cli` npm
package (loop over the JSON, don't hand-type from this table). Verified
against official platform docs 2026-08-04 — platform specs drift, so
re-verify quarterly against the channels' current docs.

## Video (4 cuts from one document)

| Cut | Spec | Destinations |
| --- | --- | --- |
| Main demo | 16:9 1920×1080 MP4 H.264+AAC, 60–120s, captions burned in | YouTube (public) — the same upload serves the CWS promo video and the Product Hunt video (both take YouTube URLs only) |
| Feed cut | 16:9 or 1:1, 30–60s, ≤140s / 512MB free tier, **H.264+AAC only** (HEVC/VP9/AV1 rejected) | X native upload |
| Vertical cut | 9:16 1080×1920, 30–90s, critical text inside a centered ~900×1160 safe zone | YouTube Shorts + LinkedIn native vertical |
| README loop | 16:9, 10–20s, **≤10MB** MP4 (GitHub free-plan ceiling) | GitHub README |

## Images

| Asset | Exact spec |
| --- | --- |
| YouTube thumbnail | 1280×720, <2MB |
| CWS screenshots | 1–5 × **1280×800** (real UX only — misleading images are a removal-grade violation), full bleed, square corners |
| CWS small promo tile | 440×280 (listings without one rank lower), no text, fill the region |
| CWS marquee | 1400×560 (carousel eligibility) |
| CWS icon | 128×128 PNG, 96×96 art + 16px transparent padding |
| Product Hunt thumbnail | 240×240, GIF animates on hover only, first frame must stand alone, <3MB |
| Product Hunt gallery | 4–8 × 1270×760, first image is the hero, GIF allowed |
| X in-feed image | 1200×675 |
| LinkedIn feed image | 1200×627 (or 1080×1350 vertical) |
| OG card | 1200×630, <1MB, text in the center ~1080×600, explicit `twitter:card=summary_large_image` (og:image alone gets the small card) |
| GitHub social preview | 1280×640, <1MB, key text ≥50px from every edge |
