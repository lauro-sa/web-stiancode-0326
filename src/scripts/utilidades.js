// ============================================================
// utilidades.js — Funciones compartidas del sitio
// ============================================================

/**
 * Inicializa el botón de tema con 3 estados: claro → sistema → oscuro.
 * Un solo botón que cicla y anima el ícono correspondiente.
 * @param {string} idBoton — id del botón
 * @param {string} claveStorage — clave en localStorage
 */
export function iniciarToggleTema(idBoton, claveStorage = 'sc-tema', idsBotonesExtra = []) {
  const raiz    = document.documentElement;
  const botones = [idBoton, ...idsBotonesExtra]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (botones.length === 0) return;

  const CICLO   = ['claro', 'sistema', 'oscuro'];
  const TITULOS = { claro: 'Tema: Claro', sistema: 'Tema: Sistema', oscuro: 'Tema: Oscuro' };

  function temaDelSistema() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }

  function aplicar(preferencia) {
    const temaReal = preferencia === 'sistema' ? temaDelSistema() : preferencia;
    raiz.setAttribute('data-tema', temaReal);

    // Sincronizar todos los botones
    botones.forEach((btn) => {
      btn.setAttribute('title', TITULOS[preferencia]);
      btn.setAttribute('aria-label', TITULOS[preferencia]);
      btn.querySelectorAll('.icono-tema').forEach((icono) => {
        const esSol     = icono.classList.contains('icono-sol');
        const esSistema = icono.classList.contains('icono-sistema');
        const esLuna    = icono.classList.contains('icono-luna');
        const activo    = (esSol && preferencia === 'claro')
                       || (esSistema && preferencia === 'sistema')
                       || (esLuna && preferencia === 'oscuro');
        icono.classList.toggle('visible', activo);
      });
    });
  }

  const guardado = localStorage.getItem(claveStorage) || 'sistema';
  aplicar(guardado);

  // Click en cualquier botón cicla el tema
  botones.forEach((btn) => {
    btn.addEventListener('click', () => {
      const actual = localStorage.getItem(claveStorage) || 'sistema';
      const idx    = CICLO.indexOf(actual);
      const nuevo  = CICLO[(idx + 1) % CICLO.length];
      localStorage.setItem(claveStorage, nuevo);
      aplicar(nuevo);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem(claveStorage) || 'sistema') === 'sistema') aplicar('sistema');
  });
}

/**
 * Inicializa el menú mobile (hamburguesa + overlay).
 * @param {string} idBoton  — id del botón hamburguesa
 * @param {string} idMenu   — id del overlay del menú
 * @param {string} claseLinks — selector de los links del menú
 */
export function iniciarMenuMobile(idBoton, idMenu, claseLinks = '.link-menu') {
  const boton = document.getElementById(idBoton);
  const menu  = document.getElementById(idMenu);
  if (!boton || !menu) return;

  const links  = menu.querySelectorAll(claseLinks);
  const footer = menu.querySelector('.menu-mobile-footer');
  let estaAbierto = false;

  function resetearAnimaciones() {
    // Resetea las animaciones para que se reproduzcan de nuevo al abrir
    links.forEach((link) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
    });
    if (footer) {
      footer.style.opacity = '0';
      footer.style.transform = 'translateY(10px)';
    }
  }

  function alternarMenu() {
    estaAbierto = !estaAbierto;
    if (estaAbierto) resetearAnimaciones();
    boton.classList.toggle('on', estaAbierto);
    menu.classList.toggle('on',  estaAbierto);
    boton.setAttribute('aria-expanded', estaAbierto);
    document.body.style.overflow = estaAbierto ? 'hidden' : '';
  }

  boton.addEventListener('click', alternarMenu);

  // Cerrar al hacer clic en un link del menú
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (estaAbierto) alternarMenu();
    });
  });
}

/**
 * Inicializa la barra de progreso de scroll.
 * @param {string} idBarra — id del elemento de la barra
 */
export function iniciarBarraProgreso(idBarra) {
  const barra = document.getElementById(idBarra);
  if (!barra) return;

  window.addEventListener('scroll', () => {
    const scrollTotal    = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje     = (window.scrollY / scrollTotal) * 100;
    barra.style.width    = porcentaje + '%';
  }, { passive: true });
}

/**
 * Inicializa el fondo de la nav al hacer scroll.
 * @param {string} idNav — id del elemento nav
 * @param {number} umbral — px de scroll para activar el fondo (default: 40)
 */
export function iniciarNavScroll(idNav, umbral = 40) {
  const nav = document.getElementById(idNav);
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('fijo', window.scrollY > umbral);
  }, { passive: true });
}

/**
 * Smooth scroll a una sección con offset para la nav fija.
 * @param {number} offsetNav — altura de la nav en px (default: 76)
 */
export function iniciarSmoothScroll(offsetNav = 76) {
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      const destino = document.querySelector(enlace.getAttribute('href'));
      if (destino) {
        e.preventDefault();
        const posicion = destino.getBoundingClientRect().top + window.scrollY - offsetNav;
        window.scrollTo({ top: posicion, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Activa la animación de íconos SVG (stroke-draw) cuando entran en viewport.
 * Agrega la clase 'dibujado' al elemento padre cuando es visible.
 * @param {string} selector — selector de los elementos a observar
 */
export function iniciarAnimacionIconos(selector = '.fila-producto, .item-feature') {
  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('dibujado');
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach((el) => observador.observe(el));
}

/**
 * Efecto typewriter — el texto se escribe letra a letra al entrar en viewport.
 * El texto completo debe estar en el atributo data-texto del elemento.
 * @param {number} velocidad — ms entre cada carácter (default: 20ms)
 */
export function iniciarTypewriter(velocidad = 20) {
  function escribir(elemento) {
    if (elemento._escrito) return;
    elemento._escrito = true;

    const texto = elemento.getAttribute('data-texto');
    if (!texto) return;

    elemento.textContent = '';
    elemento.classList.add('escribiendo');

    let indice = 0;
    const intervalo = setInterval(() => {
      elemento.textContent = texto.slice(0, ++indice);
      if (indice >= texto.length) {
        clearInterval(intervalo);
        elemento.classList.remove('escribiendo');
      }
    }, velocidad);
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        // Pequeño delay para que el fade-in termine antes de escribir
        setTimeout(() => escribir(entrada.target), 300);
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.typewriter[data-texto]').forEach((el) => observador.observe(el));
}
