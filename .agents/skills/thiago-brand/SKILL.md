---
name: thiago-brand
description: Official Brand Guidelines, High-Fashion Editorial Palette, Luxury Typography, and Design Rules for THIAGO VSC.
---

# THIAGO VSC — Brand Identity & Editorial Guidelines

## 1. Dirección de Arte
"Revista de moda de lujo en rosa": inspirada en publicaciones de alta gama como *Vogue* o campañas editoriales de *Dior Beauty*, fusionada con la vitalidad urbana y sonora de una emisora digital contemporánea. Estética elegante, delicada y exclusiva.

### La Firma de Marca: La Mariposa
La mariposa de trazo fino (`stroke: 1.5px`, color `--rosa`), originaria del hero, es el sello visual distintivo que se reitera como detalle de alta costura a lo largo de toda la experiencia (separadores, numeraciones, detalles de interfaz).

## 2. Paleta Oficial (Colores Planos Exclusivos)
- `--perla`: `#FFFFFF` (Fondo principal y superficies limpias)
- `--porcelana`: `#FFF6F9` (Fondo alterno cálido)
- `--polvo`: `#FBE3EC` (Fondo suave de secciones destacadas como TikTok)
- `--rosa`: `#DE4176` (Rosa signature de la web. Acentos, llamadas a la acción, botones y fondo fuerte)
- `--frambuesa`: `#B03366` (Color exclusivo para TODOS los textos: titulares, subtítulos y párrafos)
- `--nacar`: `rgba(224, 69, 123, 0.14)` (Bordes sutiles, divisiones micrométricas y líneas de sección)

## 3. Prohibiciones Absolutas (Tolerancia Cero)
- **CERO NEGRO O TONOS OSCUROS**: Prohibido `#000`, `black`, `gray-*`, `zinc-*`, `slate-*`, `neutral-*`, `stone-*`, o cualquier color con luminosidad por debajo del 35%.
- **CERO GRADIENTES**: Prohibido `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-*`, `from-*`, `via-*`, `to-*`. Todos los fondos y rellenos son estrictamente planos.
- **CERO CONTORNOS HUECOS**: Prohibido `text-stroke` o `-webkit-text-stroke`.
- **CERO PÍLDORAS O CHIPS COMO BOTÓN SOBRE TÍTULOS**: Prohibidas las cajas o etiquetas con forma de botón encima de los títulos.
- **CERO SOMBRAS NEGRAS**: La única sombra permitida en toda la web es:
  `box-shadow: 0 24px 48px -24px rgba(176, 51, 102, 0.25);`
- **CERO HUECOS VACÍOS**: Prohibido dejar más de un bloque de aire sin contenido. Todo el grid de 12 columnas debe respirar armonía y plenitud editorial.

## 4. Tipografía Editorial de Alta Gama
- **Titulares**: *Bodoni Moda*, pesos 400 y 500.
  - Una palabra de cada título en estilo itálica (`font-style: italic`).
  - Mayúsculas y minúsculas naturales (Title Case / Sentence Case), **NUNCA todo en mayúsculas**.
  - Escala moderada de alta costura: H2 `clamp(2.25rem, 4vw, 3.75rem)`, `line-height: 1.05`, `letter-spacing: -0.01em`.
  - El único texto de escala monumental permitido es el nombre "THIAGO" en el footer.
- **Sobretítulos (Eyebrows)**:
  - En lugar de píldoras o cajas: un número y una palabra en *Jost* 12px, tracking `0.3em`, color `--rosa`, precedido por la mariposa de línea de 14px.
  - Ejemplo: `🦋 01  En directo`. Sin borde ni fondo.
- **Cuerpo de Texto**:
  - *Jost*, pesos 300-400, `16-17px`, `line-height: 1.7`, color `--frambuesa` (`#B03366`).
- **Botones y CTAs**:
  - *Jost*, `13px`, mayúsculas, tracking `0.2em`.

## 5. Arquitectura de Layout y Ritmo de Fondos
- **Grid**: 12 columnas, márgenes laterales de `6vw`, padding vertical de secciones `clamp(4.5rem, 8vw, 7.5rem)`.
- **Ritmo Cromático de Fondos**:
  1. Hero: Imagen cinematográfica original (sin duplicar logo)
  2. Marquee: `--rosa` (`#DE4176`)
  3. TV Online: `--perla` (`#FFFFFF`)
  4. TikTok Feed: `--polvo` (`#FBE3EC`)
  5. Zona Influencer: `--porcelana` (`#FFF6F9`)
  6. Próximos Eventos: `--perla` (`#FFFFFF`)
  7. Prensa: `--porcelana` (`#FFF6F9`)
  8. Footer: `--rosa` (`#DE4176`)
- **Separadores**: Línea limpia de 1px en `--nacar` (`rgba(224, 69, 123, 0.14)`).
- **Radios Geométricos**: 20px en tarjetas (`rounded-[20px]`), 999px en botones (`rounded-full`).
