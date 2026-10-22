// Bit, el robot de Club Byte, como acompañante en 3D.
//
// Se empaqueta con esbuild en ../js/bit.js (ver README de esta carpeta).
// Lo carga js/bit-arranque.js cuando la página ya está quieta, así que no
// retrasa la primera pintura. El modelo sale del Blender de la intro de
// Club Byte (club_byte_v3.blend) exportado a img/bit.glb.

import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight,
  SRGBColorSpace, ACESFilmicToneMapping, Clock, MathUtils,
  Mesh, BoxGeometry, MeshStandardMaterial
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function iniciarBit(opciones) {
  const lienzo = opciones.lienzo;
  const quieto = !!opciones.quieto;
  const alPulsar = opciones.alPulsar || function () {};

  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const escena = new Scene();
  const camara = new PerspectiveCamera(30, 1, 0.1, 20);
  camara.position.set(0, 0.02, 2.05);
  camara.lookAt(0, -0.04, 0);

  escena.add(new HemisphereLight(0xdfe9ff, 0x1d2836, 1.6));
  const clave = new DirectionalLight(0xffffff, 2.4);
  clave.position.set(1.2, 1.6, 2.2);
  escena.add(clave);
  const contra = new DirectionalLight(0x6fd3ff, 1.4);
  contra.position.set(-1.6, 0.6, -1.2);
  escena.add(contra);

  function ajustar() {
    const w = lienzo.clientWidth || 160;
    const h = lienzo.clientHeight || 200;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  }
  ajustar();
  window.addEventListener('resize', ajustar);

  const estado = { bit: null, inclinacion: null, brazoD: null, brazoI: null, ojos: {}, anillos: [] };
  // Dónde está el ratón (o el dedo), en píxeles de la ventana.
  const raton = { x: 0, y: 0, hay: false };
  let saludoHasta = 0;
  let felizHasta = 0;
  let parpadeoEn = 2.5;
  let visible = true;
  const reloj = new Clock();

  // Juegos para cuando nadie hace nada: voltereta, giro, malabares con bits y dormir.
  const juego = { tipo: null, desde: 0, hasta: 0 };
  let dormido = false;
  const DURACION = { voltereta: 1.3, giro: 1.1, malabares: 6.5, baile: 4 };
  const bits = [0, 1, 2].map(function (i) {
    const m = new Mesh(new BoxGeometry(0.075, 0.075, 0.075),
      new MeshStandardMaterial({ color: 0x6fd3ff, emissive: 0x2aa8e0, emissiveIntensity: 0.9, roughness: 0.3 }));
    m.visible = false;
    escena.add(m);
    return m;
  });

  return new Promise(function (resolver, rechazar) {
    new GLTFLoader().load(opciones.modelo, function (gltf) {
      const bit = gltf.scene;
      escena.add(bit);
      estado.bit = bit;
      estado.inclinacion = bit.getObjectByName('BitTilt') || bit;
      estado.brazoD = bit.getObjectByName('ArmPivot1');
      estado.brazoI = bit.getObjectByName('ArmPivot-1');
      ['open', 'blink', 'happy', 'wink'].forEach(function (n) {
        estado.ojos[n] = bit.getObjectByName('Eyes_' + n);
      });
      ['HoverRing', 'HoverRing2'].forEach(function (n) {
        const o = bit.getObjectByName(n);
        if (o) estado.anillos.push(o);
      });
      ponerOjos('open');

      if (quieto) {
        renderer.render(escena, camara);
      } else {
        saludar();
        renderer.setAnimationLoop(fotograma);
      }
      resolver({ saludar: saludar, alegrar: alegrar, parar: parar, foto: foto, jugar: jugar, dormir: dormir, despertar: despertar });
    }, undefined, rechazar);

    function ponerOjos(cual) {
      Object.keys(estado.ojos).forEach(function (k) {
        if (estado.ojos[k]) estado.ojos[k].visible = (k === cual);
      });
    }

    function saludar() { saludoHasta = reloj.getElapsedTime() + 2.2; felizHasta = saludoHasta; }
    function alegrar() { felizHasta = reloj.getElapsedTime() + 1.4; }

    function jugar(tipo) {
      if (!DURACION[tipo]) return 0;
      dormido = false;
      const t = reloj.getElapsedTime();
      juego.tipo = tipo;
      juego.desde = t;
      juego.hasta = t + DURACION[tipo];
      if (tipo !== 'malabares') felizHasta = juego.hasta;
      return DURACION[tipo];
    }
    function dormir() { juego.tipo = null; dormido = true; }
    function despertar() {
      if (!dormido) return false;
      dormido = false;
      saludar();
      return true;
    }

    function parar() {
      renderer.setAnimationLoop(null);
      renderer.dispose();
    }

    function foto() {
      renderer.render(escena, camara);
      return lienzo.toDataURL('image/png');
    }

    function fotograma() {
      if (!visible) return;
      const t = reloj.getElapsedTime();
      const bit = estado.bit;

      // Flota arriba y abajo, como en la intro (más despacio si duerme).
      bit.position.y = dormido ? Math.sin(t * 0.7) * 0.012 - 0.02 : Math.sin(t * 1.6) * 0.025;

      // Juego en curso: k va de 0 a 1.
      if (juego.tipo && t > juego.hasta) {
        juego.tipo = null;
        bits.forEach(function (b) { b.visible = false; });
      }
      const k = juego.tipo ? (t - juego.desde) / (juego.hasta - juego.desde) : 0;
      const suave = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      bit.rotation.x = juego.tipo === 'voltereta' ? -suave * Math.PI * 2 : 0;
      bit.rotation.y = juego.tipo === 'giro' ? suave * Math.PI * 2 : 0;
      if (juego.tipo === 'voltereta' || juego.tipo === 'giro') bit.position.y += Math.sin(k * Math.PI) * 0.12;
      if (juego.tipo === 'baile') {
        bit.position.x = Math.sin(t * 7) * 0.05;
        bit.rotation.z = Math.sin(t * 7) * 0.12;
        bit.position.y += Math.abs(Math.sin(t * 7)) * 0.04;
      } else {
        bit.position.x = 0;
        bit.rotation.z = 0;
      }
      const malabares = juego.tipo === 'malabares';
      bits.forEach(function (b, i) {
        b.visible = malabares;
        if (!malabares) return;
        // Tres bits en un ocho delante del pecho, con un poco de rebote.
        const f = t * 3.2 + i * (Math.PI * 2 / 3);
        b.position.set(Math.sin(f) * 0.2, 0.04 + Math.abs(Math.cos(f)) * 0.2, 0.36);
        b.rotation.set(t * 4 + i, t * 3, 0);
      });

      // Mira hacia el puntero, con suavidad.
      const inc = estado.inclinacion;
      // Mira al ratón todo el rato: se calcula en cada fotograma desde donde
      // está Byte ahora, así que también lo sigue mientras vuela por la página.
      let mirarX = 0, mirarY = 0;
      if (raton.hay) {
        const r = lienzo.getBoundingClientRect();
        mirarX = MathUtils.clamp(Math.atan2(raton.x - (r.left + r.width / 2), 420), -1.05, 1.05);
        mirarY = MathUtils.clamp(Math.atan2(raton.y - (r.top + r.height * 0.4), 520), -0.55, 0.6);
      }
      inc.rotation.y = MathUtils.lerp(inc.rotation.y, (dormido || malabares) ? 0 : mirarX, 0.12);
      // Dormido cabecea; con malabares mira hacia los bits.
      inc.rotation.x = MathUtils.lerp(inc.rotation.x, dormido ? 0.3 : (malabares ? -0.18 : mirarY * 0.6), 0.12);
      inc.rotation.z = Math.sin(t * 0.9) * 0.03;

      estado.anillos.forEach(function (a, i) { a.rotation.y = t * (i ? -1.1 : 0.8); });

      // Brazos: balanceo suave y saludo con el derecho.
      const saluda = t < saludoHasta;
      const brazosArriba = malabares ? Math.sin(t * 6.4) : 0;
      const bailaBrazos = juego.tipo === 'baile' ? Math.sin(t * 7) : 0;
      if (estado.brazoD) {
        const objetivo = saluda ? 2.3 + Math.sin(t * 14) * 0.35 : (malabares ? 0.9 + brazosArriba * 0.4 : (bailaBrazos ? 1.4 + bailaBrazos * 0.8 : 0.08 + Math.sin(t * 1.6) * 0.06));
        estado.brazoD.rotation.z = MathUtils.lerp(estado.brazoD.rotation.z, objetivo, 0.18);
      }
      if (estado.brazoI) {
        estado.brazoI.rotation.z = MathUtils.lerp(estado.brazoI.rotation.z, malabares ? -0.9 + brazosArriba * 0.4 : (bailaBrazos ? -1.4 + bailaBrazos * 0.8 : -0.08 - Math.sin(t * 1.6 + 1) * 0.06), 0.18);
      }

      // Ojos: felices al saludar, y un parpadeo cada pocos segundos.
      if (dormido) {
        ponerOjos('blink');
      } else if (t < felizHasta) {
        ponerOjos('happy');
      } else if (t > parpadeoEn && t < parpadeoEn + 0.13) {
        ponerOjos('blink');
      } else {
        if (t >= parpadeoEn + 0.13) parpadeoEn = t + 2.5 + Math.random() * 3;
        ponerOjos('open');
      }

      renderer.render(escena, camara);
    }

    window.addEventListener('pointermove', function (e) {
      raton.x = e.clientX;
      raton.y = e.clientY;
      raton.hay = true;
    }, { passive: true });

    lienzo.addEventListener('click', function () { saludar(); alPulsar(); });

    // No gasta batería cuando la pestaña no se ve.
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
    });
  });
}
