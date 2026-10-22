// Cinta de automatización en 3D: entran hojas y correos por la izquierda, pasan
// por el arco del flujo, salen convertidos en datos (cubos) y hacen crecer las
// barras de un informe a la derecha. Todo hecho con piezas sencillas de three.js,
// sin modelos que descargar.
//
// Se empaqueta junto a Byte en ../js/bit.js (ver entrada.js). Lo arranca
// js/cinta-arranque.js cuando la sección está cerca de verse.

import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight,
  SRGBColorSpace, Group, Mesh, BoxGeometry, CylinderGeometry, TorusGeometry,
  SphereGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial,
  DoubleSide, Clock, MathUtils
} from 'three';

const COLOR = {
  tinta: 0x15202B, azul: 0x1D4F7A, cielo: 0x2E6C9E, pizarra: 0x3F5266,
  tostado: 0xA94F0E, verde: 0x2C6259, papel: 0xF7F9FB, raya: 0xC9D2DC, cian: 0x6FD3FF
};

function mat(color, extra) {
  return new MeshStandardMaterial(Object.assign({ color: color, roughness: 0.55, metalness: 0.08 }, extra || {}));
}

export function iniciarCinta(opciones) {
  const lienzo = opciones.lienzo;
  const quieto = !!opciones.quieto;

  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;

  const escena = new Scene();
  const camara = new PerspectiveCamera(30, 1, 0.1, 200);

  escena.add(new HemisphereLight(0xffffff, 0x8a99aa, 1.9));
  const sol = new DirectionalLight(0xffffff, 1.6);
  sol.position.set(4, 9, 6);
  escena.add(sol);

  // Separación entre estaciones: menos en pantallas estrechas.
  let S = 6;
  // Vista de tres cuartos para que se vea el arco entero.
  const GIRO = -0.38;
  const mundo = new Group();
  mundo.rotation.y = GIRO;
  escena.add(mundo);

  // ---- Cinta ----
  const cinta = new Group();
  mundo.add(cinta);
  const base = new Mesh(new BoxGeometry(1, 0.2, 1.4), mat(COLOR.tinta, { roughness: 0.8 }));
  base.position.y = -0.12;
  cinta.add(base);
  const rodillos = [new Mesh(new CylinderGeometry(0.16, 0.16, 1.44, 20), mat(COLOR.pizarra)), new Mesh(new CylinderGeometry(0.16, 0.16, 1.44, 20), mat(COLOR.pizarra))];
  rodillos.forEach(function (r) { r.rotation.x = Math.PI / 2; r.position.y = -0.12; cinta.add(r); });
  const listones = [];
  const geoListon = new BoxGeometry(0.07, 0.02, 1.3);
  const matListon = mat(COLOR.pizarra, { roughness: 0.9 });
  for (let i = 0; i < 40; i++) {
    const l = new Mesh(geoListon, matListon);
    l.position.y = -0.01;
    cinta.add(l);
    listones.push(l);
  }

  // ---- Entrada: bandeja con papeles ----
  const entrada = new Group();
  mundo.add(entrada);
  const bandeja = new Mesh(new BoxGeometry(1.3, 0.12, 1.3), mat(COLOR.pizarra));
  bandeja.position.y = 0.06;
  entrada.add(bandeja);
  for (let i = 0; i < 4; i++) {
    const p = new Mesh(new BoxGeometry(0.8, 0.05, 1), mat(COLOR.papel));
    p.position.set(Math.sin(i * 2.1) * 0.05, 0.15 + i * 0.06, Math.cos(i * 1.7) * 0.05);
    p.rotation.y = Math.sin(i * 3.3) * 0.18;
    entrada.add(p);
  }

  // ---- Arco del flujo, con engranaje y luz que escanea ----
  const arco = new Group();
  mundo.add(arco);
  const matArco = mat(COLOR.azul, { metalness: 0.2 });
  [-0.85, 0.85].forEach(function (z) {
    const pilar = new Mesh(new BoxGeometry(0.32, 2.1, 0.32), matArco);
    pilar.position.set(0, 1.0, z);
    arco.add(pilar);
  });
  const viga = new Mesh(new BoxGeometry(0.42, 0.4, 2.1), matArco);
  viga.position.y = 2.2;
  arco.add(viga);
  const engranaje = new Group();
  engranaje.position.set(0, 2.85, 0.15);
  arco.add(engranaje);
  const matEngranaje = mat(COLOR.tostado, { metalness: 0.3, roughness: 0.4 });
  engranaje.add(new Mesh(new TorusGeometry(0.42, 0.13, 10, 28), matEngranaje));
  for (let i = 0; i < 10; i++) {
    const diente = new Mesh(new BoxGeometry(0.16, 0.2, 0.2), matEngranaje);
    const a = (i / 10) * Math.PI * 2;
    diente.position.set(Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0);
    diente.rotation.z = a;
    engranaje.add(diente);
  }
  const eje = new Mesh(new CylinderGeometry(0.12, 0.12, 0.3, 16), mat(COLOR.tinta));
  eje.rotation.x = Math.PI / 2;
  engranaje.add(eje);
  const matLuz = new MeshBasicMaterial({ color: COLOR.cian, transparent: true, opacity: 0.12, side: DoubleSide, depthWrite: false });
  const luz = new Mesh(new PlaneGeometry(0.06, 1.95), matLuz);
  luz.rotation.x = -Math.PI / 2;
  luz.rotation.z = Math.PI / 2;
  const cortina = new Mesh(new PlaneGeometry(1.7, 1.95), matLuz);
  cortina.rotation.y = Math.PI / 2;
  cortina.position.y = 1.0;
  arco.add(cortina);
  luz.position.y = 2.0;
  arco.add(luz);

  // ---- Salida: informe de barras ----
  const salida = new Group();
  mundo.add(salida);
  const peana = new Mesh(new BoxGeometry(2.1, 0.12, 1.3), mat(COLOR.pizarra));
  peana.position.y = 0.06;
  salida.add(peana);
  const coloresBarra = [COLOR.azul, COLOR.cielo, COLOR.verde, COLOR.tostado];
  const barras = coloresBarra.map(function (c, i) {
    const b = new Mesh(new BoxGeometry(0.34, 1, 0.5), mat(c));
    b.position.set(-0.69 + i * 0.46, 0.12, 0);
    b.userData = { alto: 0.3 + i * 0.12, objetivo: 0.3 + i * 0.12 };
    salida.add(b);
    return b;
  });

  // ---- Piezas que viajan: papel antes del arco, cubo de datos después ----
  const geoPapel = new BoxGeometry(0.62, 0.04, 0.8);
  const geoRenglon = new BoxGeometry(0.42, 0.012, 0.05);
  const geoCubo = new BoxGeometry(0.4, 0.4, 0.4);
  const matPapel = mat(COLOR.papel);
  const matRenglon = mat(COLOR.raya);
  const matSobre = mat(0xF3E3D3);
  const piezas = [];
  for (let i = 0; i < 9; i++) {
    const g = new Group();
    const papel = new Group();
    const hoja = new Mesh(geoPapel, i % 3 === 2 ? matSobre : matPapel);
    papel.add(hoja);
    for (let k = 0; k < 3; k++) {
      const r = new Mesh(geoRenglon, matRenglon);
      r.position.set(-0.04 + (k === 2 ? -0.08 : 0), 0.027, -0.22 + k * 0.2);
      papel.add(r);
    }
    const cubo = new Mesh(geoCubo, mat(coloresBarra[i % 4], { emissive: coloresBarra[i % 4], emissiveIntensity: 0.25 }));
    cubo.position.y = 0.2;
    g.add(papel, cubo);
    g.visible = false;
    g.userData = { papel: papel, cubo: cubo, x: 0, fase: 'libre', barra: i % 4, t: 0, giro: (Math.random() - 0.5) * 0.4 };
    mundo.add(g);
    piezas.push(g);
  }

  // ---- Paquetes de datos que saltan del arco al informe ----
  const geoPaquete = new SphereGeometry(0.07, 10, 8);
  const matPaquete = new MeshBasicMaterial({ color: COLOR.cian });
  const paquetes = [];
  for (let i = 0; i < 5; i++) {
    const p = new Mesh(geoPaquete, matPaquete);
    p.userData.desfase = i / 5;
    mundo.add(p);
    paquetes.push(p);
  }

  function colocar() {
    entrada.position.x = -S;
    arco.position.x = 0;
    salida.position.x = S;
    const largo = 2 * S + 3.2;
    base.scale.x = largo;
    rodillos[0].position.x = -largo / 2;
    rodillos[1].position.x = largo / 2;
    cinta.userData.largo = largo;
  }

  function ajustar() {
    const w = lienzo.clientWidth || 800;
    const h = lienzo.clientHeight || 300;
    renderer.setSize(w, h, false);
    const aspecto = w / h;
    camara.aspect = aspecto;
    S = aspecto < 1.9 ? 2.9 : (aspecto < 2.8 ? 4.6 : 6);
    colocar();
    // Distancia para que quepan las tres estaciones con aire a los lados.
    const mitad = S + (aspecto < 1.9 ? 1.7 : 2.4);
    const dist = Math.max(aspecto < 1.9 ? 6 : 9, mitad / (Math.tan(MathUtils.degToRad(camara.fov / 2)) * aspecto) + 1.5);
    camara.position.set(0, dist * 0.42, dist);
    camara.lookAt(0, 0.75, 0);
    camara.updateProjectionMatrix();
  }
  ajustar();
  window.addEventListener('resize', ajustar);

  const VELOCIDAD = 1.35;
  let siguiente = 0;
  let recarga = 0;
  let pulso = 0;
  let apuntaX = 0;

  function lanzar() {
    const p = piezas.find(function (x) { return x.userData.fase === 'libre'; });
    if (!p) return;
    const u = p.userData;
    u.x = -S + 0.1;
    u.fase = 'papel';
    u.t = 0;
    p.visible = true;
    u.papel.visible = true;
    u.cubo.visible = false;
    u.papel.scale.setScalar(1);
    p.position.set(u.x, 0.6, 0);
    p.rotation.set(0, u.giro, 0);
  }

  function paso(t, dt) {
    const largo = cinta.userData.largo;
    // Listones de la cinta en marcha.
    listones.forEach(function (l, i) {
      const x = ((i * 0.55 + t * VELOCIDAD) % 22);
      l.position.x = -largo / 2 + (x % largo);
      l.visible = x < largo;
    });
    rodillos.forEach(function (r) { r.rotation.y = t * 4; });
    engranaje.rotation.z = -t * 1.4;

    if (t > siguiente) { lanzar(); siguiente = t + 1.5 + Math.random() * 0.5; }

    pulso = Math.max(0, pulso - dt * 2.2);
    matLuz.opacity = 0.1 + pulso * 0.45;
    luz.position.z = Math.sin(t * 3) * 0.85;

    piezas.forEach(function (p) {
      const u = p.userData;
      if (u.fase === 'libre') return;
      if (u.fase === 'papel' || u.fase === 'cubo') {
        // Baja de la bandeja a la cinta y avanza.
        u.x += VELOCIDAD * dt;
        p.position.x = u.x;
        p.position.y = MathUtils.lerp(p.position.y, 0.04, 0.12);
        if (u.fase === 'papel' && u.x > 0) {
          u.fase = 'cubo';
          u.t = 0;
          u.papel.visible = false;
          u.cubo.visible = true;
          pulso = 1;
        }
        if (u.fase === 'cubo') {
          u.t += dt;
          const s = u.t < 0.35 ? 0.4 + Math.sin(u.t / 0.35 * Math.PI / 2) * 0.75 : 1.15 - Math.min(0.15, (u.t - 0.35) * 0.6);
          u.cubo.scale.setScalar(s);
          u.cubo.rotation.y += dt * 1.6;
          if (u.x > S - 1.6) {
            u.fase = 'vuelo';
            u.t = 0;
            u.desde = { x: u.x, y: p.position.y };
          }
        }
      } else if (u.fase === 'vuelo') {
        // Salta en arco a lo alto de su barra.
        u.t += dt / 0.7;
        const b = barras[u.barra];
        const destinoX = S + b.position.x, destinoY = b.userData.alto + 0.35;
        const k = Math.min(1, u.t);
        p.position.x = MathUtils.lerp(u.desde.x, destinoX, k);
        p.position.y = MathUtils.lerp(u.desde.y, destinoY, k) + Math.sin(k * Math.PI) * 1.2;
        u.cubo.scale.setScalar(1 - k * 0.6);
        u.cubo.rotation.x += dt * 5;
        if (k >= 1) {
          b.userData.objetivo = Math.min(2.6, b.userData.objetivo + 0.32);
          u.fase = 'libre';
          p.visible = false;
        }
      }
    });

    // Barras: crecen hacia su objetivo y, al llenarse, vuelven a empezar.
    let llenas = 0;
    barras.forEach(function (b, i) {
      const u = b.userData;
      u.alto = MathUtils.lerp(u.alto, u.objetivo, 0.08);
      b.scale.y = u.alto;
      b.position.y = 0.12 + u.alto / 2;
      if (u.objetivo >= 2.5) llenas++;
    });
    if (llenas >= 2 && t > recarga) {
      barras.forEach(function (b, i) { b.userData.objetivo = 0.3 + i * 0.12; });
      recarga = t + 2;
    }

    // Paquetes de datos del arco al informe.
    paquetes.forEach(function (p) {
      const k = (t * 0.45 + p.userData.desfase) % 1;
      p.position.set(MathUtils.lerp(0.2, S, k), 2.4 + Math.sin(k * Math.PI) * 1.1 - k * 0.9, 0);
      p.scale.setScalar(Math.sin(k * Math.PI) * 1.3 + 0.2);
    });

    // Un poco de paralaje con el puntero.
    mundo.rotation.y = MathUtils.lerp(mundo.rotation.y, GIRO + apuntaX * 0.1, 0.05);
  }

  const reloj = new Clock();
  let visible = true;
  let enPantalla = true;

  if (quieto) {
    // Foto fija: unas cuantas piezas repartidas por la cinta.
    for (let i = 0; i < 160; i++) paso(i / 30, 1 / 30);
    renderer.render(escena, camara);
  } else {
    renderer.setAnimationLoop(function () {
      if (!visible || !enPantalla) { reloj.getDelta(); return; }
      const dt = Math.min(0.05, reloj.getDelta());
      paso(reloj.elapsedTime, dt);
      renderer.render(escena, camara);
    });
    lienzo.closest('section').addEventListener('pointermove', function (e) {
      const r = lienzo.getBoundingClientRect();
      apuntaX = MathUtils.clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    }, { passive: true });
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { enPantalla = e[0].isIntersecting; }).observe(lienzo);
    }
  }

  return { parar: function () { renderer.setAnimationLoop(null); renderer.dispose(); } };
}
