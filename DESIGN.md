# Design System: La Revoltosa (Thiago VSC Official)
Awwwards-Tier Vanguard Design Architecture

## 1. Visual Theme & Atmosphere
An ultra-exclusive, high-fashion / urban club culture digital experience.
The aesthetic fuses Swiss typographic discipline with luxury hardware materiality (Braun, Teenage Engineering, Apple Pro).
Solid architectural color blocks (Solid Pink #DE4176 & Pure White #FFFFFF) grounded on OLED black hardware enclosures.

- **Density:** 4 (Curated & Balanced, generous macro-whitespace)
- **Variance:** 8 (Architectural Asymmetry, dynamic 3D stages)
- **Motion:** 8 (Physics-driven custom cubic-beziers, haptic button response)

## 2. Color Palette & Roles
- **Solid Signature Pink** (`#DE4176`) — Primary brand background & active states
- **Solid Pure White** (`#FFFFFF`) — High-contrast editorial stage surface
- **Deep Obsidian** (`#08070B` / `#0D0B12`) — Studio hardware enclosure surfaces
- **Text Primary Light** (`#F5F5F7` / `#FFFFFF`) — Primary headlines & labels
- **Text Muted** (`#8E8E98` / `rgba(255,255,255,0.7)`) — Technical telemetry
- **Cyan Accent** (`#00ADEF`) — 4K broadcast status & signal indicator
- **Red Alert** (`#EF4444`) — Live transmission indicator

## 3. Typography Architecture
- **Display / Major Titles:** `Syne` (font-black, tracking-[-0.04em], uppercase)
- **UI / Body / Navigation:** `Plus Jakarta Sans` (font-bold/black, tracking-[0.14em])
- **Telemetry / Studio Metadata:** `Roboto Mono` (font-mono, tabular-nums)
- **Banned:** Generic system fonts (Inter, Arial, Roboto sans).

## 4. Component Stylings & Hardware Enclosures
- **Double-Bezel (Doppelrand):** All major cards (TikTok Feed, Influencer 3D stage, Radio Album Art) utilize concentric nested enclosures (`p-2 rounded-[2.25rem]` outer shell wrapping `rounded-[calc(2.25rem-0.5rem)]` inner core).
- **Haptic Buttons:** All interactive controls implement physical tactile feedback on `:active` (`active:scale-[0.97]`).
- **Precision Tuner:** Analog/digital FM frequency ruler with calibrated tick marks and sliding illuminated indicator.
- **Strict Anti-Patterns:** ZERO emojis anywhere, ZERO arrow glyphs (`→`, `↗`), NO generic drop shadows.

## 5. Motion & Physics
- `--ease-agency`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-spring`: `cubic-bezier(0.23, 1, 0.32, 1)`
- Smooth spring interpolation across 3D Cover Flow, TV stage, and video decks.
