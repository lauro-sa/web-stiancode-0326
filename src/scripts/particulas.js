// ============================================================
// particulas.js — Sistema de partículas con conexiones y repulsión
//
// Partículas con colores de marca (violeta/azul) que flotan
// dentro del contenedor padre del canvas. Líneas conectan
// partículas cercanas. El mouse las repele suavemente.
// ============================================================

/**
 * Paleta de colores — violeta y azul de la marca S7ian Code
 */
const PALETA_CLARO = [
  { r: 137, g: 100, b: 232, op: 0.25 },  // Violeta marca
  { r: 76,  g: 156, b: 208, op: 0.22 },  // Azul marca
  { r: 167, g: 139, b: 250, op: 0.20 },  // Violeta claro
  { r: 96,  g: 176, b: 224, op: 0.18 },  // Azul claro
  { r: 120, g: 120, b: 160, op: 0.12 },  // Gris azulado
];

const PALETA_OSCURO = [
  { r: 167, g: 139, b: 250, op: 0.35 },  // Violeta claro
  { r: 96,  g: 176, b: 224, op: 0.30 },  // Azul claro
  { r: 137, g: 100, b: 232, op: 0.28 },  // Violeta marca
  { r: 76,  g: 156, b: 208, op: 0.25 },  // Azul marca
  { r: 140, g: 140, b: 180, op: 0.15 },  // Gris azulado
];

// Constantes de física
const RADIO_REPULSION = 120;
const FUERZA_REPULSION = 3.5;
const FRICCION = 0.95;
const FUERZA_RETORNO = 0.008;
const VELOCIDAD_MAXIMA = 4;
const DISTANCIA_CONEXION = 140;   // px — distancia máxima para dibujar líneas
const OPACIDAD_LINEA_MAX = 0.12;  // opacidad máxima de las líneas

function obtenerPaleta() {
  const tema = document.documentElement.getAttribute('data-tema');
  return tema === 'oscuro' ? PALETA_OSCURO : PALETA_CLARO;
}

function crearParticula(ancho, alto, paleta) {
  const color = paleta[Math.floor(Math.random() * paleta.length)];
  return {
    x:    Math.random() * ancho,
    y:    Math.random() * alto,
    posicionHomeX: Math.random() * ancho,
    posicionHomeY: Math.random() * alto,
    velocidadX: (Math.random() - 0.5) * 0.3,
    velocidadY: (Math.random() - 0.5) * 0.3,
    radio:     Math.random() * 2.0 + 0.8,
    opacidad:  color.op,
    fase:      Math.random() * Math.PI * 2,
    colorR:    color.r,
    colorG:    color.g,
    colorB:    color.b,
  };
}

/**
 * Inicializa partículas dentro del contenedor padre del canvas
 * @param {string} idCanvas — id del elemento <canvas>
 */
export function iniciarParticulas(idCanvas) {
  const canvas = document.getElementById(idCanvas);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let ancho = 0, alto = 0;
  let particulas = [];
  let mouseX = -9999, mouseY = -9999;
  let rectCanvas = canvas.getBoundingClientRect();

  function ajustarTamaño() {
    rectCanvas = canvas.getBoundingClientRect();
    ancho = canvas.width  = rectCanvas.width;
    alto  = canvas.height = rectCanvas.height;
  }

  function inicializarParticulas() {
    const paleta = obtenerPaleta();
    // Densidad más baja para un look más limpio
    const cantidad = Math.min(Math.floor((ancho * alto) / 10000), 80);
    particulas = Array.from({ length: cantidad }, () => crearParticula(ancho, alto, paleta));
  }

  ajustarTamaño();
  inicializarParticulas();

  // Mouse relativo al canvas
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - rectCanvas.left;
    mouseY = e.clientY - rectCanvas.top;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  window.addEventListener('resize', () => {
    ajustarTamaño();
    inicializarParticulas();
  }, { passive: true });

  // Observar cambios de tema para actualizar colores
  const observer = new MutationObserver(() => {
    const paleta = obtenerPaleta();
    particulas.forEach((p) => {
      const color = paleta[Math.floor(Math.random() * paleta.length)];
      p.colorR = color.r;
      p.colorG = color.g;
      p.colorB = color.b;
      p.opacidad = color.op;
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });

  function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    // Actualizar posiciones
    particulas.forEach((p) => {
      // Repulsión del mouse
      const distX = p.x - mouseX;
      const distY = p.y - mouseY;
      const distancia = Math.sqrt(distX * distX + distY * distY) || 1;

      if (distancia < RADIO_REPULSION) {
        const intensidad = FUERZA_REPULSION * Math.pow(1 - distancia / RADIO_REPULSION, 1.5);
        p.velocidadX += (distX / distancia) * intensidad;
        p.velocidadY += (distY / distancia) * intensidad;
      }

      // Retorno al home
      p.velocidadX += (p.posicionHomeX - p.x) * FUERZA_RETORNO;
      p.velocidadY += (p.posicionHomeY - p.y) * FUERZA_RETORNO;

      // Drift orgánico del home
      p.posicionHomeX += (Math.random() - 0.5) * 0.2;
      p.posicionHomeY += (Math.random() - 0.5) * 0.2;
      p.posicionHomeX = Math.max(20, Math.min(ancho - 20, p.posicionHomeX));
      p.posicionHomeY = Math.max(20, Math.min(alto  - 20, p.posicionHomeY));

      // Fricción y límite
      p.velocidadX *= FRICCION;
      p.velocidadY *= FRICCION;
      const vel = Math.sqrt(p.velocidadX ** 2 + p.velocidadY ** 2);
      if (vel > VELOCIDAD_MAXIMA) {
        p.velocidadX = (p.velocidadX / vel) * VELOCIDAD_MAXIMA;
        p.velocidadY = (p.velocidadY / vel) * VELOCIDAD_MAXIMA;
      }

      p.x += p.velocidadX;
      p.y += p.velocidadY;
    });

    // Dibujar conexiones entre partículas cercanas
    for (let i = 0; i < particulas.length; i++) {
      for (let j = i + 1; j < particulas.length; j++) {
        const a = particulas[i];
        const b = particulas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DISTANCIA_CONEXION) {
          const opacidad = OPACIDAD_LINEA_MAX * (1 - dist / DISTANCIA_CONEXION);
          // Color promedio entre las dos partículas
          const r = Math.round((a.colorR + b.colorR) / 2);
          const g = Math.round((a.colorG + b.colorG) / 2);
          const bl = Math.round((a.colorB + b.colorB) / 2);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${opacidad})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Dibujar partículas
    particulas.forEach((p) => {
      p.fase += 0.006;
      const opacidadFinal = Math.max(0, p.opacidad + Math.sin(p.fase) * 0.06);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.colorR},${p.colorG},${p.colorB},${opacidadFinal})`;
      ctx.fill();
    });

    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}
