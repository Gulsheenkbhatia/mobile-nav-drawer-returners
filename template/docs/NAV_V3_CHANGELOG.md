# Nav V3 Handoff Changelog

## v1.0 — 2026-06-26

Initial developer handoff package.

### Added

- `docs/NAV_V3_REQUIREMENTS.md` — tiered requirement registry with IDs
- `docs/NAV_V3_HANDOFF.md` — component map, data contracts, PWA checklist
- `docs/NAV_V3_MOTION.md` — motion arming protocol and tokens
- `docs/FIGMA_HANDOFF_GUIDE.md` — Figma canvas structure and badge system
- `packages/nav-v3/` — extractable module boundary + `integration.md`
- Nav template gallery (`?gallery=nav`) for layout QA
- `--nav-content-spot-label-inset` token (12px)
- `l2-3` content-spot layout CSS (hero + 2-up)
- Outlet `outlet-men-men` L2 content spots

### Fixed

- README / HANDOFF motion table aligned to code (drill 500ms, scrim 400ms)
- Content-spot label inset: 12px on both axes (was 16px left)

### Known gaps (Open tier)

- REQ-NAV-301: Post-click nav link highlight
- REQ-NAV-302: Returner journey — **prototype implemented** (PLP round-trip, exact drill-depth restore, link highlight; Coach header resets to homepage)
- REQ-NAV-303: L1 three-across 16:9 variant TBD

### Polish lane (non-blocking)

- REQ-NAV-203: Placeholder "Copy Goes Here" labels
- REQ-NAV-204: Outlet-specific imagery
