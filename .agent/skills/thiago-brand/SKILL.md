---
name: thiago-brand
description: Official Brand Guidelines, Rosé Couture Palette, Panchang & Clash Display Typography, GSAP Motion, and Luxury Architecture for THIAGO VSC.
---

# THIAGO VSC — Brand Identity & Editorial Guidelines (v3.0 Awwwards Site of the Year Level)

## 1. Dirección de Arte & Visión Cinematográfica
"Rosé Couture": Inspiración en campañas de alta costura contemporánea (Dior Beauty, Jacquemus, Gentle Monster) combinada con la energía visual y cinética de *motionsites.ai*. Cero patrones genéricos de IA, cero fondos blancos de sección, cero gradientes. Una experiencia interactiva de lujo, cinematográfica y rica en micro-interacciones.

### La Firma de Marca: La Mariposa
La mariposa de trazo fino (`stroke: 1.5px`), originaria del hero, es el sello visual distintivo que se reitera como detalle de alta costura a lo largo de toda la experiencia (separadores, numeraciones, detalles de interfaz).

---

## 2. Paleta Oficial "Rosé Couture" (100% Colores Planos)

### Tema Claro (Por Defecto)
- `--petal`: `#FDE4EC` (Fondo suave de secciones como Zona Influencer, cookies)
- `--blush`: `#F8C8D8` (Fondo medio de secciones como TV Online, Prensa)
- `--rose`: `#F29BB8` (Fondo intenso suave de Próximos Eventos)
- `--brand`: `#E0457B` (Rosa de marca: fondos fuertes de Marquee, TikTok Feed, Footer, botones y acentos)
- `--berry`: `#A3285C` (Color para TODOS los textos sobre fondos rosa claro)
- `--champagne`: `#FFE9D6` (Texto y acento sobre `--brand`, detalle cálido premium)
- `--line`: `rgba(163, 40, 92, 0.18)` (Bordes y líneas)

> **REGLA DE ORO DE FONDOS**: El blanco puro `#FFFFFF` solo se permite en textos grandes sobre `--brand` y en los bordes de las tarjetas. **NUNCA como fondo de sección.**
>
> **Fondos Planos por Sección**:
> - Hero: vídeo (transición a `--brand`)
> - Marquee: `--brand` (`#E0457B`)
> - TV Online: `--blush` (`#F8C8D8`)
> - TikTok Feed: `--brand` (`#E0457B`)
> - Zona Influencer: `--petal` (`#FDE4EC`)
> - Próximos Eventos: `--rose` (`#F29BB8`)
> - Prensa: `--blush` (`#F8C8D8`)
> - Footer: `--brand` (`#E0457B`)

### Tema Oscuro "Noche Rosa" (data-theme="dark", Accesible AA)
- Fondo base: `#2B0F1E`
- Superficie tarjetas: `#3A1528`
- Texto principal: `#FFE4EE`
- Acento / Brand: `#E0457B`
- Líneas / Bordes: `rgba(255, 228, 238, 0.15)`
- Cero negro puro `#000000`.

---

## 3. Prohibiciones Absolutas (Tolerancia Cero)
- **CERO NEGRO O GRISES**: Prohibido `#000`, `black`, `gray-*`, `zinc-*`, `slate-*`, `neutral-*`, `stone-*`.
- **CERO GRADIENTES**: Prohibido `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-*`, `from-*`, `via-*`, `to-*`. Todos los fondos y rellenos son estrictamente planos.
- **CERO BLANCO DE FONDO DE SECCIÓN**: Prohibido usar `bg-white` como background de sección.
- **CERO CONTORNOS HUECOS**: Prohibido `text-stroke` o `-webkit-text-stroke`.
- **CERO PÍLDORAS O CHIPS COMO BOTÓN SOBRE TÍTULOS**.
- **CERO SOMBRAS GRISES**: La única sombra permitida en toda la web es:
  `box-shadow: 0 30px 60px -25px rgba(163, 40, 92, 0.35);`

---

## 4. Tipografía y Jerarquía
- **Cuerpo y Botones**: **Jost** (pesos 300-500, no se cambia).
- **Títulos de Sección (TV Online, TikTok Feed, Zona Influencer, Próximos Eventos)**:
  - Fuente: **Clash Display Medium (peso 500)** de Fontshare (localFont).
  - Escala: `clamp(2.25rem, 4.2vw, 4rem)`, `letter-spacing: -0.035em`, `line-height: 1`.
  - Primera palabra en el color del texto de la sección (`--berry`), segunda palabra en `--brand` (o en `--champagne` si el fondo de la sección es `--brand`).
  - Animación SplitText GSAP con máscara letra a letra.
- **Título del Hero y Marquees**:
  - Fuente: **Panchang** (Fontshare, pesos 600-800), extendida, imponente y editorial.
  - Hero Title: Panchang 700, `clamp(1.6rem, 2.6vw, 2.6rem)`, color `--champagne`, alineado a la izquierda sobre el cielo, max-width `24vw`.
  - Marquees: Panchang 800 en mayúsculas, `clamp(1.75rem, 3.5vw, 3.25rem)`, color `--champagne` sobre `--brand`.

---

## 5. Arquitectura de Movimiento (motionsites.ai)
- **Lenis Smooth Scroll** (`lerp: 0.08`) sincronizado con `gsap.ticker`.
- **Morph de Color de Fondo del Body**: Animación continua de fondo entre secciones mediante ScrollTrigger.
- **Preloader con Logo Original**: Reveal clip-path, destello a 20° `--champagne` al 35% con `mix-blend-mode: screen`, flotación `y: ±6px`, contador real 0-100, botones `[ Entrar con sonido ]` y `[ Entrar sin sonido ]`, apertura de telón en 2 paneles con CustomEase `(0.76, 0, 0.24, 1)` y Flip del logo al navbar.
- **Hero Video & Safe Zone**: Video MP4 optimizado < 8MB, poster fallback con play button si autoplay falla, pausa en out-of-view con IntersectionObserver, zona de la cara despejada 100%, parallax en scroll.
- **Marquees Reactivos**: SkewX hasta 8° e inversión de dirección según la velocidad del scroll.
- **TikTok Feed Pinned Track**: Flip a modal vertical fullscreen, autoplay en foco central, gestor global `activeMediaId` (audio exclusivo).
- **Cursor Magnético Personalizado**: Punto de 10px a 90px con `mix-blend-mode: difference` y labels reactivos ("Play", "Ver", "Abrir").
