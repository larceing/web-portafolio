// Bit, el robot de Club Byte, como acompañante en 3D.
//
// Se empaqueta con esbuild en ../js/bit.js (ver README de esta carpeta).
// Lo carga js/bit-arranque.js cuando la página ya está quieta, así que no
// retrasa la primera pintura. El modelo sale del Blender de la intro de
// Club Byte (club_byte_v3.blend) exportado a img/bit.glb.

import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight,
  SRGBColorSpace, ACESFilmicToneMapping, Clock, MathUtils
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
  let mirarX = 0, mirarY = 0;
  let saludoHasta = 0;
  let felizHasta = 0;
  let parpadeoEn = 2.5;
  let visible = true;
  const reloj = new Clock();

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
      resolver({ saludar: saludar, alegrar: alegrar, parar: parar, foto: foto });
    }, undefined, rechazar);

    function ponerOjos(cual) {
      Object.keys(estado.ojos).forEach(function (k) {
        if (estado.ojos[k]) estado.ojos[k].visible = (k === cual);
      });
    }

    function saludar() { saludoHasta = reloj.getElapsedTime() + 2.2; felizHasta = saludoHasta; }
    function alegrar() { felizHasta = reloj.getElapsedTime() + 1.4; }

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

      // Flota arriba y abajo, como en la intro.
      bit.position.y = Math.sin(t * 1.6) * 0.025;

      // Mira hacia el puntero, con suavidad.
      const inc = estado.inclinacion;
      inc.rotation.y = MathUtils.lerp(inc.rotation.y, mirarX * 0.55, 0.08);
      inc.rotation.x = MathUtils.lerp(inc.rotation.x, -mirarY * 0.25, 0.08);
      inc.rotation.z = Math.sin(t * 0.9) * 0.03;

      estado.anillos.forEach(function (a, i) { a.rotation.y = t * (i ? -1.1 : 0.8); });

      // Brazos: balanceo suave y saludo con el derecho.
      const saluda = t < saludoHasta;
      if (estado.brazoD) {
        const objetivo = saluda ? 2.3 + Math.sin(t * 14) * 0.35 : 0.08 + Math.sin(t * 1.6) * 0.06;
        estado.brazoD.rotation.z = MathUtils.lerp(estado.brazoD.rotation.z, objetivo, 0.18);
      }
      if (estado.brazoI) {
        estado.brazoI.rotation.z = MathUtils.lerp(estado.brazoI.rotation.z, -0.08 - Math.sin(t * 1.6 + 1) * 0.06, 0.18);
      }

      // Ojos: felices al saludar, y un parpadeo cada pocos segundos.
      if (t < felizHasta) {
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
      const r = lienzo.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      mirarX = MathUtils.clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
      mirarY = MathUtils.clamp((e.clientY - cy) / (window.innerHeight / 2), -1, 1);
    }, { passive: true });

    lienzo.addEventListener('click', function () { saludar(); alPulsar(); });

    // No gasta batería cuando la pestaña no se ve.
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
    });
  });
}
