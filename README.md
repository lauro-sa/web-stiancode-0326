# S7ian Code — stiancode.dev

Sitio web profesional de S7ian Code. Desarrollo web, aplicaciones PWA y soluciones digitales.

Construido con [Astro](https://astro.build/) — HTML estático, cero JS innecesario, rendimiento máximo.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera sitio estático en /dist
npm run preview  # preview del build
```

## Estructura del proyecto

```
src/
├── components/
│   ├── ui/
│   │   └── IconoSVG.astro            Iconos SVG animados (stroke-draw)
│   ├── AgendarMeet.astro              Modal para agendar videollamada
│   ├── Boton.astro                    Componente botón reutilizable
│   ├── Footer.astro                   Footer flotante con panel expandible
│   ├── Hero.astro                     Sección hero con partículas
│   ├── ModalContacto.astro            Modal de contacto multi-paso
│   ├── Nav.astro                      Navegación con toggle tema + idioma
│   ├── SeccionLaboratorio.astro       Preview del laboratorio digital
│   ├── SeccionNoticias.astro          Preview de Pulso Tech
│   ├── SeccionProyectos.astro         Proyectos destacados con modal
│   ├── SeccionServicios.astro         Grilla de servicios
│   ├── SeccionSobre.astro             Bio + stats
│   └── SeccionStack.astro             Grilla de tecnologías
├── i18n/
│   ├── es.json                        Traducciones español
│   ├── en.json                        Traducciones inglés
│   └── utils.js                       Funciones t(), getLangFromUrl(), getLocalizedUrl()
├── layouts/
│   └── Plantilla.astro                Layout base (head, SEO, OG, hreflang, structured data)
├── pages/
│   ├── en/
│   │   ├── index.astro                Homepage (EN)
│   │   ├── about.astro                About me (EN)
│   │   ├── contact.astro              Contact (EN)
│   │   ├── lab.astro                  Digital Lab (EN)
│   │   ├── news.astro                 Tech Pulse (EN)
│   │   ├── privacy.astro              Privacy Policy (EN)
│   │   └── terms.astro                Terms & Conditions (EN)
│   ├── index.astro                    Página principal (ES)
│   ├── sobre-mi.astro                 Sobre mí (ES)
│   ├── contacto.astro                 Contacto (ES)
│   ├── laboratorio.astro              Laboratorio Digital (ES)
│   ├── novedades.astro                Pulso Tech (ES)
│   ├── privacidad.astro               Política de Privacidad (ES)
│   └── terminos.astro                 Términos y Condiciones (ES)
├── scripts/
│   ├── particulas.js                  Sistema de partículas canvas
│   └── utilidades.js                  Toggle tema, menú mobile, scroll, typewriter
├── styles/
│   ├── variables.css                  Tokens de diseño (colores, radios, transiciones)
│   └── global.css                     Estilos base
└── env.d.ts
```

## Internacionalización (i18n)

El sitio es bilingüe español/inglés:

- **Español** (default): rutas sin prefijo (`/`, `/contacto`, `/sobre-mi`)
- **Inglés**: rutas con `/en/` (`/en/`, `/en/contact`, `/en/about`)
- Todos los textos viven en `src/i18n/es.json` y `src/i18n/en.json`
- Para agregar/editar textos: modificar los JSON y usar `t(lang, 'clave')` en los componentes
- El mapa de rutas ES ↔ EN está en `src/i18n/utils.js` → `getLocalizedUrl()`

## SEO y Google Ads

El sitio está preparado para campañas de publicidad:

- **Sitemap**: generado automáticamente por `@astrojs/sitemap` en `/sitemap-index.xml`
- **robots.txt**: en `public/robots.txt`
- **Hreflang**: etiquetas `<link rel="alternate">` ES/EN/x-default en cada página
- **Open Graph + Twitter Cards**: meta tags dinámicos por página
- **Structured Data**: schema.org `ProfessionalService` + `Person`
- **Política de Privacidad**: `/privacidad` (ES) y `/en/privacy` (EN)
- **Términos y Condiciones**: `/terminos` (ES) y `/en/terms` (EN)

### Activar tracking (cuando estén listos los IDs)

En `src/layouts/Plantilla.astro` hay placeholders comentados:

1. **Google Analytics (GA4)**: descomentar y reemplazar `G-XXXXXXXXXX`
2. **Google Ads Conversion**: descomentar y reemplazar `AW-XXXXXXXXXX`
3. **Meta Pixel**: descomentar y reemplazar `PIXEL_ID`

## Qué editar

| Qué                        | Dónde                                              |
| --------------------------- | -------------------------------------------------- |
| Textos de cualquier sección | `src/i18n/es.json` y `src/i18n/en.json`            |
| Datos de contacto / redes   | `src/components/Footer.astro` → constante `DATOS`  |
| Colores y tokens de diseño  | `src/styles/variables.css`                          |
| Logos                       | `public/logo-claro.png` y `public/logo-oscuro.png` |
| Imagen OG (compartir)       | `public/og-image.png` (1200x630)                   |
| Favicons                    | `public/favicon.ico`, `favicon.png`, `apple-touch-icon.png` |
| Noticias Pulso Tech         | `src/pages/novedades.astro` → array de fuentes RSS |
| Disponibilidad AgendarMeet  | `src/components/AgendarMeet.astro` → `DIAS_DISPONIBLES` y `HORARIOS` |

## Dominio

Producción: **https://stiancode.dev**

Configurado en `astro.config.mjs` → `site`.
