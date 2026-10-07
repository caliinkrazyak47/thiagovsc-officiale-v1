---
name: editorial-typography
description: High-end editorial typography hierarchy rules for THIAGO VSC. Enforces Archivo Black display headers, Instrument Serif Italic accents, JetBrains Mono technical badges, and Inter body text.
---

# Editorial Typography Skill — THIAGO VSC

## 1. Fuentes Tipográficas
- **Sans Display**: `Archivo Black` (o `Clash Display Bold`). Pesada, geométrica, impacto de revista de moda.
- **Serif Italic**: `Instrument Serif` (en cursiva/italic). Elegancia y contraste poético de alta costura.
- **Monoespaciada**: `JetBrains Mono`. Rigor técnico para coordenadas, badges y metadatos.
- **Cuerpo / Lectura**: `Inter` (17px, line-height 1.6, color `--ink` al 75%).

## 2. Títulos de Sección (Arquitectura en Dos Líneas)
Todo encabezado principal de sección se compone estrictamente en **dos líneas**:
1. **Primera línea**: En sans display (`Archivo Black`), mayúsculas, color `--ink`.
2. **Segunda línea**: En serif itálica (`Instrument Serif Italic`), color `--pink`, sin contorno (`text-stroke: none`).
   - Ejemplos:
     - `TV` (Sans en `--ink`) + `Online` (Serif Italic en `--pink`)
     - `TikTok` (Sans en `--white` sobre fondo rosa) + `Feed` (Serif Italic en `--blush`)
     - `Zona` (Sans en `--ink`) + `Influencer` (Serif Italic en `--pink`)
     - `Próximos` (Sans en `--ink`) + `Eventos` (Serif Italic en `--pink`)

## 3. Escalas y Métricas
- **H2 Títulos de Sección**: `font-size: clamp(3rem, 8vw, 8.5rem); line-height: 0.9; letter-spacing: -0.04em;`.
- **Etiquetas y Píldoras de Telemetría**:
  - Fuente: `JetBrains Mono`.
  - Tamaño: `11px`.
  - Tracking: `0.2em` (`tracking-[0.2em]`).
  - Color de texto: `--pink`.
  - Borde: `1px solid var(--pink)`.
  - Fondo: `transparent` (fondo transparente).
  - Prefijo numérico obligatorio: `"01 /"`, `"02 /"`, etc. (nunca `"01 —"` ni emojis ni flechas).
- **Cuerpo de Texto**:
  - `Inter`, `17px`, `line-height: 1.6`, color `--ink` al 75% (`text-[rgba(59,13,34,0.75)]`).
