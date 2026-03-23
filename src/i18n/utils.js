// ============================================================
// utils.js — Utilidades de internacionalización (i18n)
// ============================================================
import es from './es.json';
import en from './en.json';

const traducciones = { es, en };

/**
 * Devuelve la traducción para una clave en el idioma indicado.
 * Si no existe en el idioma pedido, cae al español como fallback.
 * @param {string} lang — 'es' | 'en'
 * @param {string} clave — clave de traducción (ej: 'hero_titulo')
 * @returns {string}
 */
export function t(lang, clave) {
  return traducciones[lang]?.[clave] ?? traducciones['es']?.[clave] ?? clave;
}

/**
 * Detecta el idioma a partir de la URL de Astro.
 * /en/... → 'en', todo lo demás → 'es'
 * @param {URL} url
 * @returns {'es'|'en'}
 */
export function getLangFromUrl(url) {
  const [, segmento] = url.pathname.split('/');
  if (segmento === 'en') return 'en';
  return 'es';
}

/**
 * Genera la URL equivalente en el otro idioma.
 * @param {URL} url
 * @param {'es'|'en'} targetLang
 * @returns {string}
 */
export function getLocalizedUrl(url, targetLang) {
  const pathname = url.pathname;

  // Mapa de rutas es ↔ en
  const rutasEsToEn = {
    '/': '/en/',
    '/sobre-mi': '/en/about',
    '/contacto': '/en/contact',
    '/laboratorio': '/en/lab',
    '/novedades': '/en/news',
    '/privacidad': '/en/privacy',
    '/terminos': '/en/terms',
  };

  const rutasEnToEs = Object.fromEntries(
    Object.entries(rutasEsToEn).map(([es, en]) => [en, es])
  );

  if (targetLang === 'en') {
    // Buscar la ruta sin trailing slash
    const limpia = pathname.replace(/\/$/, '') || '/';
    return rutasEsToEn[limpia] || '/en' + pathname;
  } else {
    const limpia = pathname.replace(/\/$/, '') || '/';
    return rutasEnToEs[limpia] || pathname.replace(/^\/en/, '') || '/';
  }
}

/** Idiomas disponibles */
export const locales = ['es', 'en'];
export const defaultLocale = 'es';
