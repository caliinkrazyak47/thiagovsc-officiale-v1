---
name: thiago-motion
description: High-end animation physics, Lenis smooth scrolling, GSAP ScrollTrigger orchestration, initial butterfly loader, magnetic buttons, and custom interactive cursor for THIAGO VSC.
---

# THIAGO VSC — Premium Motion Architecture

## 1. Motores y Easing
- **Smooth Scrolling**: Lenis (`@studio-freight/react-lenis`), configuración `lerp: 0.08, smoothWheel: true`.
- **GSAP + ScrollTrigger**: Orquestación reactiva vinculada al desplazamiento del usuario.
- **Curva de Easing de Referencia**: `cubic-bezier(0.22, 1, 0.36, 1)` con duraciones fluidas de `0.9s` a `1.3s`.
- **Accesibilidad**: `@media (prefers-reduced-motion: reduce)` desactiva animaciones no esenciales.

## 2. Loader Inicial de Marca (1.5 segundos)
- **Fondo**: `--porcelana` (`#FFF6F9`).
- **Animación**:
  - Trazo SVG de la mariposa insignia dibujándose mediante `stroke-dasharray` / `stroke-dashoffset`.
  - Al completar el dibujo (1.2s), el telón se desplaza verticalmente hacia arriba (`translateY: -100%`) revelando la experiencia sin parpadeos.

## 3. Coreografías de Entrada y Revelado
- **Titulares**:
  - Revelado palabra por palabra con máscara `overflow: hidden`, elevándose desde `translateY(100%)` a `0`, con un escalonado (*stagger*) de `0.06s`.
- **Imágenes y Pósters**:
  - Revelado de abajo hacia arriba mediante `clip-path: inset(100% 0 0 0)` transformándose a `inset(0 0 0 0)`, desacelerando con escala de `1.15` a `1`.
- **Parallax en el Hero**:
  - Al hacer scroll, la imagen de fondo escala a `1.1` y el titular sube a mayor velocidad que el viewport para generar profundidad física.
- **Marquee Cinético**:
  - Se acelera e inclina sutilmente en función de la velocidad de scroll del usuario.
- **TikTok Horizontal Scroll Pinned**:
  - Sección anclada (*pinned*) con GSAP ScrollTrigger: al girar la rueda hacia abajo, las tarjetas se desplazan suavemente en el eje horizontal. En pantallas móviles degrada a slider con `scroll-snap`.
- **Cartas 3D con Abanico y Tilt**:
  - En la sección Influencer, las cartas apiladas con rotaciones de `-6°`, `3°` y `8°` se despliegan en abanico al entrar en pantalla y responden al puntero con un balanceo (*tilt*) tridimensional sutil.

## 4. Cursor Editorial Personalizado
- **Reposo**: Círculo de color `--rosa` de `10px` con `mix-blend-mode: multiply` que persigue el ratón con amortiguación elástica.
- **Interactivo (Videos / Tarjetas)**:
  - Crece a `80px` de diámetro.
  - Centra la tipografía "Play" o "Ver" en *Jost*.
- Oculto de forma estricta en dispositivos móviles y pantallas táctiles (`pointer: coarse`).

## 5. Botones Magnéticos
- Botones de acción principales que responden a la proximidad del puntero, atrayéndose suavemente hasta `8px` en la dirección del cursor.
