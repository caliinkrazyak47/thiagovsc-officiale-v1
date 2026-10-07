---
name: premium-motion
description: Physics-based fluid motion, GSAP ScrollTrigger orchestration, smooth Lenis scrolling, text reveal masks, and adaptive magnetic custom cursor for THIAGO VSC.
---

# Premium Motion Skill — THIAGO VSC

## 1. Motores de Movimiento
- **Smooth Scroll**: `lenis` / `lenis/react` con configuración optimizada (`lerp: 0.08`, `smoothWheel: true`).
- **Orquestación**: GSAP + `ScrollTrigger` para revelados coordinados con el scroll del usuario.
- **Curva de Aceleración (Ease)**: `cubic-bezier(0.22, 1, 0.36, 1)` (curva natural de amortiguación elástica de alta costura).
- **Accesibilidad**: Respeto estricto a `@media (prefers-reduced-motion: reduce)` desactivando transforms invasivos.

## 2. Tipologías de Animación
- **Reveal de Títulos Línea a Línea**:
  - Enmascaramiento `overflow: hidden` con `y: '100%' -> 0` y `stagger`.
- **Revelado de Imágenes**:
  - `clip-path: inset(100% 0 0 0)` -> `clip-path: inset(0% 0 0 0)` de abajo hacia arriba.
- **Parallax Suave**:
  - Tipografía gigante de fondo (ej. `"CHIRI"`, `"THIAGO"`) desplazándose verticalmente a velocidad desacoplada del scroll (`yPercent: -20` a `20`).

## 3. Cursor Editorial Personalizado
- **Estado Reposo**: Círculo de color `--pink` de `12px` de diámetro que sigue el puntero con inercia suave.
- **Estado Interactivo (Hover sobre vídeos/tarjetas)**:
  - Crece a `64px` de diámetro.
  - Centra una etiqueta tipográfica en mayúsculas: `"VER"` o `"PLAY"` en tipografía monoespaciada/sans limpia.
- Desactivación automática en dispositivos táctiles (`@media (pointer: coarse)` o pantallas táctiles).
