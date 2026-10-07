---
name: brand-palette
description: Strict color palette tokens and contrast rules for THIAGO VSC. Enforces pure flat backgrounds, dark plum ink text, and bans black, generic grays, and gradients.
---

# Brand Palette Skill — THIAGO VSC

## 1. Tokens Fundamentales
Tokens obligatorios definidos en `:root` y configurados en `tailwind.config.ts`:

- `--pink`: `#DE4176` (Rosa signature extraído del código oficial de la web).
- `--white`: `#FFFFFF` (Blanco puro para fondos limpios y contrastes).
- `--blush`: `#FFF4F7` (Blanco rosado para alternar fondos de sección con calidez editorial).
- `--ink`: `#3B0D22` (Ciruela ultra-oscuro de alta gama). Sustituye al color negro en TODOS los textos y trazos.

## 2. Reglas Estrictas y Prohibiciones
- **PROHIBIDO**:
  - `#000`, `black`, `bg-black`, `text-black`.
  - Escalas de grises genéricas: `gray-*`, `zinc-*`, `slate-*`, `neutral-*`.
  - Gradientes de cualquier tipo: `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-*`, `from-*`, `via-*`, `to-*`. Todos los fondos deben ser planos y puros.
  - `text-stroke` o `-webkit-text-stroke` (títulos con contorno hueco).

## 3. Sombras Permitidas
Únicamente se permite la siguiente elevación refinada y difusa para tarjetas y elementos elevados:
`box-shadow: 0 30px 60px -20px rgba(59, 13, 34, 0.18);` (o clase equivalente `shadow-editorial`).
Quedan prohibidos los halos de color de offset cero o sombras negras duras.
