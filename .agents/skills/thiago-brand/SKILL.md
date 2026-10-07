---
name: thiago-brand
description: Official Brand Guidelines, High-Fashion Editorial Palette, Clash Display Typography, and Design Rules for THIAGO VSC.
---

# THIAGO VSC — Brand Identity & Editorial Guidelines (v2.0 Awwwards Level)

## 1. Dirección de Arte
"Revista de moda de lujo en rosa": inspirada en publicaciones de alta gama como *Vogue* o campañas editoriales de *Dior Beauty*, fusionada con la vitalidad urbana y sonora de una emisora digital contemporánea. Estética elegante, delicada y exclusiva.

### La Firma de Marca: La Mariposa
La mariposa de trazo fino (`stroke: 1.5px`, color `--rosa`), originaria del hero, es el sello visual distintivo que se reitera como detalle de alta costura a lo largo de toda la experiencia (separadores, numeraciones, detalles de interfaz). Aparece en todas las secciones precediendo el número, excepto en TV Online (que es puramente minimalista).

## 2. Paleta Oficial (Colores Planos Exclusivos)
- `--perla`: `#FFFFFF` (Fondo principal y superficies limpias)
- `--porcelana`: `#FFF6F9` (Fondo alterno cálido de alta costura)
- `--polvo`: `#FBE3EC` (Fondo suave de secciones destacadas como TikTok y bisel de TV)
- `--rosa`: `#DE4176` (Rosa signature de la web: botones, acentos, segunda palabra de títulos, footer y marquees)
- `--frambuesa`: `#B03366` (Color exclusivo para textos principales: primera palabra de títulos y párrafos)
- `--nacar`: `rgba(224, 69, 123, 0.14)` (Bordes sutiles, divisiones micrométricas y líneas de sección)

## 3. Prohibiciones Absolutas (Tolerancia Cero)
- **CERO NEGRO O TONOS OSCUROS**: Prohibido `#000`, `black`, `gray-*`, `zinc-*`, `slate-*`, `neutral-*`, `stone-*`, o cualquier color con luminosidad por debajo del 35%.
- **CERO GRADIENTES**: Prohibido `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-*`, `from-*`, `via-*`, `to-*`. Todos los fondos y rellenos son estrictamente planos.
- **CERO CONTORNOS HUECOS**: Prohibido `text-stroke` o `-webkit-text-stroke`.
- **CERO PÍLDORAS O CHIPS COMO BOTÓN SOBRE TÍTULOS**: Prohibidas las cajas o etiquetas con forma de botón encima de los títulos.
- **CERO SOMBRAS NEGRAS**: La única sombra permitida en toda la web es:
  `box-shadow: 0 24px 48px -24px rgba(176, 51, 102, 0.25);`
- **CERO HUECOS VACÍOS**: Prohibido dejar más de un bloque de aire sin contenido. Todo el grid de 12 columnas debe respirar armonía y plenitud editorial.

## 4. Tipografía y Jerarquía
- **Títulos de Sección (TV Online, TikTok Feed, Zona Influencer, Próximos Eventos)**:
  - Fuente: **Clash Display Medium (peso 500)** de Fontshare (cargada localmente con `next/font/local`).
  - Estilo moderno: mayúsculas y minúsculas naturales (Sentence/Title Case), `letter-spacing: -0.035em`, `line-height: 1`.
  - Tamaño moderado: `clamp(2.25rem, 4.2vw, 4rem)`.
  - **Bicolor**: Primera palabra en `--frambuesa` (`#B03366`) y segunda palabra en `--rosa` (`#DE4176`). Misma fuente, sin itálica y sin contorno.
  - Animación: Cada letra entra desde `y: 110%` con máscara (SplitText, stagger `0.025`), y la palabra rosa entra `0.15s` después.
- **Hero Title**:
  - Clash Display blanco, `clamp(1.75rem, 2.8vw, 2.75rem)`.
  - Ubicación: Arriba a la izquierda sobre el cielo (`left: 6vw`, `top: 18vh`, `max-width: 24vw`).
  - Zona segura de la cara respetada estrictamente: ancho 28%-72%, alto 8%-70% 100% despejados.
  - En móvil (<768px): El título se coloca debajo del hero sobre fondo `--porcelana`.
- **Sobretítulos (Eyebrows)**:
  - Número y palabra en *Jost* 12px, tracking `0.3em`, color `--rosa`, con mariposa de línea de 14px delante (ej: `🦋 02  Viral`). Sin borde ni fondo. En TV Online no se incluye.
- **Cuerpo de Texto y Párrafos**:
  - *Jost*, pesos 300-400, `16-17px`, `line-height: 1.7`, color `--frambuesa` (`#B03366`).
- **Botones y CTAs**:
  - *Jost*, `13px`, mayúsculas, tracking `0.2em`, radio `999px` (`btn-luxury`).
- **Footer**:
  - Giant "THIAGO" en Bodoni Moda blanco, de ancho completo, con revelado letra a letra.

## 5. Arquitectura de Secciones
1. **Hero**: Vídeo original intacto, sin logo duplicado. Título sobre el cielo a la izquierda sin tocar la cara.
2. **Marquee 1**: Fondo `--rosa` (`#DE4176`), texto blanco en Bodoni itálica, separadores con mariposa de línea.
3. **TV Online**: Minimalista, 100vh en escritorio. Solo título centrado "TV Online" (TV frambuesa + Online rosa), reproductor centrado `width: min(1100px, 88vw)`, 16:9, bisel 12px en `--polvo`, scroll scrub de scale 0.85/48px a 1/24px.
4. **TikTok Feed**: Fondo `--polvo` (`#FBE3EC`). Pinned horizontal track con GSAP ScrollTrigger y `useGSAP`, barra de progreso `--rosa`, contador, centrado dinámico (scale 1.06 vs 0.92), inclinación por inercia, lazy loading. Móvil: snap horizontal nativo.
5. **Zona Influencer**: Fondo `--porcelana` (`#FFF6F9`). Montaje de fotos en abanico 3D con tilt, métricas de impacto en Bodoni, bio y botón Linktree.
6. **Próximos Eventos**: Fondo `--perla` (`#FFFFFF`). Título "Próximos" (frambuesa) + "Eventos" (rosa), 6 carteles de moda con duotone multiply que revelan color en hover.
7. **Prensa**: Fondo `--porcelana` (`#FFF6F9`), logos en rosa al 45% que ascienden al 100% en hover, divididos por mariposas.
8. **Footer**: Fondo `--rosa` (`#DE4176`), THIAGO monumental, enlaces con subrayado de izq a der, sello de mariposa y textos legales.
