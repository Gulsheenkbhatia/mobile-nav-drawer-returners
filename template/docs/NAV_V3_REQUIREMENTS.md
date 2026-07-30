# Nav V3 Requirements Registry — v1.0

**Spec version:** 1.0  
**Date:** 2026-06-26  
**Prototype:** [mobile-nav-drawer.vercel.app](https://mobile-nav-drawer.vercel.app/)  
**Figma:** [Nav Redesign FY26-27 — Handoff canvas](https://www.figma.com/design/xSgWjrAdmKMtV5fce0XsdJ/Nav-Redesign---FY26-27?node-id=2166-6227)

## Terminology

| Design (Figma) | Code (prototype / PWA) |
|----------------|------------------------|
| T1 Invoked State | L1 base panel |
| T2 Click State | L2 drill overlay |
| T3 Click State | L3 drill overlay |

## Requirement tiers

| Tier | Meaning | Dev can start? | Change process |
|------|---------|----------------|----------------|
| **Frozen** | Wrong = broken UX or PWA conflict | Yes | Design + eng sign-off |
| **Stable** | Agreed; tune via tokens | Yes | Token update + changelog |
| **Polish** | Non-blocking visual gap | Yes | Polish lane anytime |
| **Open** | TBC | No for that item | Promote when resolved |

**Dev Ready** = all Frozen items for a template pass; Polish may differ; Open items documented.

## Figma badge system

| Badge | Tier | Usage |
|-------|------|-------|
| `LOCK` | Frozen | Link to `REQ-NAV-###` |
| `STABLE` | Stable | Annotate CSS var name (e.g. `--spacing-4`) |
| `POLISH` | Polish | Safe to ship v1 without exact match |
| `OPEN` | Open | Excluded from Dev Ready |

Unconstrained tweak notes go on the **Polish Backlog** frame — not on LOCK frames.

---

## Frozen requirements

| ID | Requirement |
|----|-------------|
| REQ-NAV-001 | T1 shows search, brand tabs, L1 category list (vertical), utility footer, optional content spots |
| REQ-NAV-002 | T2/T3 hide search and utility footer |
| REQ-NAV-003 | Drill uses overlay stack (L1 base + sliding L2/L3 overlays), not horizontal 3-panel track |
| REQ-NAV-004 | Drill back slides panel right (reverses enter); revealed panel does **not** replay enter animation |
| REQ-NAV-005 | PWA-owned chrome unchanged: exposed header, menu/search icon, in-menu search field, brand tabs, close |
| REQ-NAV-006 | L2 body resolves to `flat-sections` OR `sub-category-sections` via `resolveNavDrillL2Body()` |
| REQ-NAV-007 | Section eyebrows on L2 flat sections only; never L3; rules in `navEyebrowVisibility.ts` |
| REQ-NAV-008 | "View All" links do not drill (`navLinkChevron.ts`) |
| REQ-NAV-009 | Content-spot layouts: L1 `l1-1`…`l1-3`; L2 `l2-1`…`l2-6` |
| REQ-NAV-010 | Image aspect ratios: `16:9` and `4:5` (`tileAspectRatio`) |
| REQ-NAV-011 | Coach / Outlet brand tabs; Coachtopia as L1 category under Coach (not third tab) |
| REQ-NAV-012 | Motion arming protocol: `--entered` + `nav-enter-group--enter` / `--idle` / `--exit` (see `NAV_V3_MOTION.md`) |
| REQ-NAV-013 | Close menu via X, scrim tap, Escape; `body.drawerOpened` scroll lock |
| REQ-NAV-014 | Brand switch resets drill stack |

---

## Stable requirements

| ID | Requirement | Token / reference |
|----|-------------|-------------------|
| REQ-NAV-101 | L1 nav link typography | `--text-20`, `--font-face1-extended` |
| REQ-NAV-101b | L2/L3 drill link + header typography | `--text-16`, `--font-face1-extended` |
| REQ-NAV-102 | Utility footer typography | `--text-12` |
| REQ-NAV-103 | Horizontal page margin | `--spacing-4` (16px) |
| REQ-NAV-104 | Spacing scale | 4px increments (`--spacing-*`) |
| REQ-NAV-105 | Drill section gap | 32px (`NAV_DRILL_SECTION_GAP_PX` / `--spacing-8`) |
| REQ-NAV-106 | Link gap within section | 16px (`NAV_DRILL_LINK_GAP_PX` / `--spacing-4`) |
| REQ-NAV-107 | Content-spot bottom gradient | 30% height, `--linear-gradient-scrim-bottom` |
| REQ-NAV-108 | Content-spot label inset | `--nav-content-spot-label-inset` = `var(--spacing-3)` (12px) bottom **and** left |
| REQ-NAV-109 | Drill title ellipsis | 28 characters (`navDrillTitle.ts`) |
| REQ-NAV-110 | Content-spot gutters | 1px between tiles, full-bleed L2 under headline |
| REQ-NAV-111 | Drawer duration | `--transition-duration-drawer` (400ms) |
| REQ-NAV-112 | Scrim duration | `--transition-duration-scrim` (400ms) |
| REQ-NAV-113 | Drill panel duration | `--transition-duration-drill` (500ms) |
| REQ-NAV-114 | Nav link enter duration | `--transition-duration-nav-link-enter` (480ms) |
| REQ-NAV-115 | Content spot enter duration | `--transition-duration-content` (700ms) |

---

## Polish requirements (deferrable)

| ID | Requirement |
|----|-------------|
| REQ-NAV-201 | Drill/scrim duration fine-tuning within ±100ms of tokens |
| REQ-NAV-202 | Stagger step 0.04 vs 0.05s |
| REQ-NAV-203 | Placeholder collage copy / campaign imagery |
| REQ-NAV-204 | Outlet-specific marketing assets vs Coach reuse |

---

## Open requirements (do not block v1)

| ID | Requirement |
|----|-------------|
| REQ-NAV-301 | Post-interaction nav link highlight |
| REQ-NAV-302 | First-time vs returner journey differences — **prototype:** terminal L2/L3 link → real PLP → menu reopen at **exact drill depth** where the link was clicked + white row highlight on that link |
| REQ-NAV-303 | L1 three-across 16:9 variant (if distinct from `l1-3` hero+duo) |

---

## Template matrix (Frozen structure)

### T1 — Invoked

| Body template | Content spots | Placement |
|---------------|---------------|-----------|
| Text-only | — | — |
| Eyebrow + list | — | — |
| List only | 1 / 2 / 3 images | Top (above categories) |
| List only | 1 / 2 / 3 images | Middle (above utility, Outlet inline) |

### T2 — Click state

| Body template | Content spots | Placement |
|---------------|---------------|-----------|
| Same as T1 text templates | 1 / 2(4:5) / 2(16:9) / 3 / 4 / 6 | Top (under headline) |
| Sub-category chevron rows | Optional grid + eyebrow | Under headline |

### T3 — Click state

| Body template | Content spots |
|---------------|---------------|
| Text-only / eyebrow + list / list only | None |

---

## Golden journeys

| ID | Path | Prototype status |
|----|------|------------------|
| JRN-001 | Coach HP → Invoked → Bags T2 | Ready |
| JRN-002 | Coach HP → Invoked → Women T2 → Shoes T3 | Ready |
| JRN-003 | Coach HP → Invoked → Coachtopia | Partial (L2 spot) |
| JRN-004 | Outlet HP → Invoked → Bags T2 | Ready |
| JRN-005 | Outlet HP → Invoked → Women T2 → Shoes T3 | Ready |
| JRN-006 | Coachtopia HP → Invoked → Bags / Women / Shoes | Partial |

Gallery: `?gallery=nav` on prototype URL.
