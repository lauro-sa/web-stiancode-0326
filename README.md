# stiancode — Landing page de stiancode.dev

Proyecto Astro para la landing page de **stiancode.dev**.

## Estructura

```
src/
├── components/
│   ├── ui/
│   │   └── IconoSVG.astro       ← Íconos SVG animados (stroke-draw)
│   ├── Nav.astro                 ← Navegación con toggle tema
│   ├── Hero.astro                ← Sección hero
│   ├── SeccionServicios.astro    ← Grilla de servicios
│   ├── SeccionProyectos.astro    ← Lista de proyectos
│   ├── SeccionSobre.astro        ← Bio + stats
│   └── Footer.astro
├── layouts/
│   └── Plantilla.astro           ← Layout base (head, SEO, scripts)
├── pages/
│   └── index.astro               ← Página principal
├── scripts/
│   ├── particulas.js             ← Sistema de partículas (compartido con Salix)
│   └── utilidades.js             ← Funciones comunes
└── styles/
    ├── variables.css             ← Tokens de diseño
    └── global.css                ← Estilos base
```

## Instalación

```bash
npm install
npm run dev
```

## Qué editar

- **Textos del hero** → `src/components/Hero.astro` → constante `CONTENIDO`
- **Servicios** → `src/components/SeccionServicios.astro` → array `SERVICIOS`
- **Proyectos** → `src/components/SeccionProyectos.astro` → array `PROYECTOS`
- **Bio y stats** → `src/components/SeccionSobre.astro` → constante `CONTENIDO`
- **Redes sociales** → `src/components/Footer.astro` → constante `DATOS`
- **Email/WhatsApp** → Footer.astro + index.astro (buscar `EDITAR`)
- **Colores** → `src/styles/variables.css`
- **Logo** → buscar `S7` en Nav.astro y Footer.astro → reemplazar con SVG real
- **SEO** → `src/layouts/Plantilla.astro`
