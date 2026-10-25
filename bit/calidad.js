// Piezas comunes de las escenas 3D (cinta e infraestructura): el punto medio
// entre que se vea lo mejor posible y que vaya fluido en cualquier equipo.
//
// - Luz de estudio (RoomEnvironment) para que los materiales tengan brillos y
//   reflejos de verdad, calculada una sola vez.
// - Tono «neutral», que respeta los colores de la marca.
// - Sombras de contacto falsas (una mancha suave bajo cada objeto): dan
//   profundidad sin el coste de las sombras reales.
// - Resolución adaptativa: empieza en la nitidez de la pantalla (hasta 2x) y,
//   si el equipo no llega a ~50 fps, baja un escalón; si va sobrado, sube.

import {
  NeutralToneMapping, SRGBColorSpace, PMREMGenerator, CanvasTexture, Mesh,
  PlaneGeometry, MeshBasicMaterial
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function prepararRenderer(renderer, escena, opciones) {
  const o = opciones || {};
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = o.exposicion || 1.0;
  const pmrem = new PMREMGenerator(renderer);
  const sala = new RoomEnvironment();
  escena.environment = pmrem.fromScene(sala, 0.04).texture;
  escena.environmentIntensity = o.entorno == null ? 0.55 : o.entorno;
  sala.dispose();
  pmrem.dispose();
}

// Equipos modestos: sin 3D en movimiento (se pinta una sola imagen).
export function equipoModesto() {
  const n = navigator;
  return (n.hardwareConcurrency && n.hardwareConcurrency <= 2) || (n.deviceMemory && n.deviceMemory <= 2);
}

const ESCALONES = [2, 1.75, 1.5, 1.25, 1, 0.85, 0.75];

export function resolucionAdaptativa(renderer, redimensionar) {
  const tope = Math.min(window.devicePixelRatio || 1, 2);
  const escalones = ESCALONES.filter(function (e) { return e <= tope + 0.001; });
  if (!escalones.length || escalones[0] < tope) escalones.unshift(tope);
  let i = 0;
  let marcos = 0, acumulado = 0, buenas = 0, calma = 0;
  renderer.setPixelRatio(escalones[i]);

  function cambiar(nuevo) {
    i = nuevo;
    renderer.setPixelRatio(escalones[i]);
    redimensionar();
    calma = 3;        // deja asentarse un par de tandas antes de volver a medir
  }

  return {
    // Llamar en cada fotograma con el tiempo real que ha pasado (segundos).
    medir: function (dt) {
      if (dt <= 0 || dt > 0.25) return;   // pestaña dormida o tirón aislado
      marcos++;
      acumulado += dt;
      if (marcos < 45) return;
      const media = acumulado / marcos;
      marcos = 0; acumulado = 0;
      if (calma > 0) { calma--; return; }
      if (media > 1 / 48 && i < escalones.length - 1) { buenas = 0; cambiar(i + 1); }
      else if (media < 1 / 58) { if (++buenas >= 4 && i > 0) { buenas = 0; cambiar(i - 1); } }
      else buenas = 0;
    },
    escala: function () { return escalones[i]; }
  };
}

// Una sola textura de sombra para todas las escenas.
let texturaSombra = null;
function sombraTextura() {
  if (texturaSombra) return texturaSombra;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(10,20,32,0.55)');
  r.addColorStop(0.45, 'rgba(10,20,32,0.28)');
  r.addColorStop(1, 'rgba(10,20,32,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  texturaSombra = new CanvasTexture(c);
  texturaSombra.colorSpace = SRGBColorSpace;
  return texturaSombra;
}

const geoSombra = new PlaneGeometry(1, 1);
export function sombra(ancho, fondo, opacidad) {
  const m = new Mesh(geoSombra, new MeshBasicMaterial({
    map: sombraTextura(), transparent: true, depthWrite: false, opacity: opacidad == null ? 1 : opacidad, toneMapped: false
  }));
  m.rotation.x = -Math.PI / 2;
  m.scale.set(ancho, fondo, 1);
  m.renderOrder = -1;
  return m;
}

// Cajas con los cantos redondeados, reutilizando la geometría si se repite.
const cajas = new Map();
export function cajaRedonda(w, h, d, radio, segmentos) {
  const r = Math.min(radio == null ? 0.06 : radio, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
  const clave = [w, h, d, r, segmentos || 3].join('|');
  if (!cajas.has(clave)) cajas.set(clave, new RoundedBoxGeometry(w, h, d, segmentos || 3, r));
  return cajas.get(clave);
}
