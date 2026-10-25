// Cinta de automatización en 3D: entran hojas y correos por la izquierda, pasan
// por el arco del flujo, salen convertidos en datos (cubos) y hacen crecer las
// barras de un informe a la derecha. Todo hecho con piezas sencillas de three.js,
// sin modelos que descargar.
//
// Se empaqueta junto a Byte en ../js/bit.js (ver entrada.js). Lo arranca
// js/cinta-arranque.js cuando la sección está cerca de verse.

import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight, PointLight,
  Group, Mesh, BoxGeometry, CylinderGeometry, SphereGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, Object3D, Shape, Path,
  ExtrudeGeometry, DoubleSide, Clock, MathUtils
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { prepararRenderer, resolucionAdaptativa, sombra, cajaRedonda } from './calidad.js';

const COLOR = {
  tinta: 0x15202B, azul: 0x1D4F7A, cielo: 0x2E6C9E, pizarra: 0x3F5266,
  tostado: 0xA94F0E, verde: 0x2C6259, papel: 0xF7F9FB, raya: 0xC9D2DC, cian: 0x6FD3FF
};

function mat(color, extra) {
  return new MeshStandardMaterial(Object.assign({ color: color, roughness: 0.5, metalness: 0.08 }, extra || {}));
}

// Engranaje de verdad: perfil con dientes trapezoidales, agujero y biselado.
function geoEngranaje(dientes, rRaiz, rPunta, grosor) {
  const forma = new Shape();
  const paso = (Math.PI * 2) / dientes;
  for (let i = 0; i < dientes; i++) {
    const a = i * paso;
    const pts = [[a, rRaiz], [a + paso * 0.18, rPunta], [a + paso * 0.48, rPunta], [a + paso * 0.66, rRaiz]];
    pts.forEach(function (p, k) {
      const x = Math.cos(p[0]) * p[1], y = Math.sin(p[0]) * p[1];
      if (i === 0 && k === 0) forma.moveTo(x, y); else forma.lineTo(x, y);
    });
    forma.absarc(0, 0, rRaiz, a + paso * 0.66, a + paso, false);
  }
  const agujero = new Path();
  agujero.absarc(0, 0, rRaiz * 0.32, 0, Math.PI * 2, true);
  forma.holes.push(agujero);
  // Aligeramientos: cuatro ventanas redondas, como en un engranaje mecanizado.
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4;
    const v = new Path();
    v.absarc(Math.cos(a) * rRaiz * 0.62, Math.sin(a) * rRaiz * 0.62, rRaiz * 0.16, 0, Math.PI * 2, true);
    forma.holes.push(v);
  }
  const g = new ExtrudeGeometry(forma, { depth: grosor, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 2, curveSegments: 10 });
  g.translate(0, 0, -grosor / 2);
  return g;
}

export function iniciarCinta(opciones) {
  const lienzo = opciones.lienzo;
  const quieto = !!opciones.quieto;

  const renderer = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'high-performance' });

  const escena = new Scene();
  const camara = new PerspectiveCamera(30, 1, 0.1, 200);
  prepararRenderer(renderer, escena, { exposicion: 1.05, entorno: 0.6 });

  escena.add(new HemisphereLight(0xffffff, 0x8a99aa, 1.0));
  const sol = new DirectionalLight(0xffffff, 1.7);
  sol.position.set(4, 9, 6);
  escena.add(sol);
  const contra = new DirectionalLight(0x9fd8ff, 0.7);
  contra.position.set(-6, 4, -6);
  escena.add(contra);

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
  const base = new Mesh(new BoxGeometry(1, 0.2, 1.4), mat(COLOR.tinta, { roughness: 0.75 }));
  base.position.y = -0.12;
  cinta.add(base);
  // Barandillas a los lados, con un brillo metálico.
  const matBarandilla = mat(0x8796A6, { metalness: 0.7, roughness: 0.3 });
  const barandillas = [-0.74, 0.74].map(function (z) {
    const b = new Mesh(new BoxGeometry(1, 0.08, 0.06), matBarandilla);
    b.position.set(0, 0.0, z);
    cinta.add(b);
    return b;
  });
  const sombraCinta = sombra(1, 2.6, 0.7);
  sombraCinta.position.y = -0.235;
  cinta.add(sombraCinta);
  const rodillos = [new Mesh(new CylinderGeometry(0.16, 0.16, 1.44, 20), mat(COLOR.pizarra)), new Mesh(new CylinderGeometry(0.16, 0.16, 1.44, 20), mat(COLOR.pizarra))];
  rodillos.forEach(function (r) { r.rotation.x = Math.PI / 2; r.position.y = -0.12; cinta.add(r); });
  // Listones: 40 piezas en una sola llamada de dibujo.
  const LISTONES = 40;
  const listones = new InstancedMesh(new BoxGeometry(0.07, 0.02, 1.3), mat(COLOR.pizarra, { roughness: 0.6, metalness: 0.3 }), LISTONES);
  cinta.add(listones);
  const muñeco = new Object3D();

  // ---- Entrada: bandeja con papeles ----
  const entrada = new Group();
  mundo.add(entrada);
  const bandeja = new Mesh(cajaRedonda(1.3, 0.14, 1.3, 0.05), mat(COLOR.pizarra, { metalness: 0.25, roughness: 0.45 }));
  bandeja.position.y = 0.06;
  entrada.add(bandeja);
  const sombraEntrada = sombra(1.9, 1.9, 0.8);
  sombraEntrada.position.y = 0.005;
  entrada.add(sombraEntrada);
  for (let i = 0; i < 4; i++) {
    const p = new Mesh(cajaRedonda(0.8, 0.05, 1, 0.012, 2), mat(COLOR.papel, { roughness: 0.85 }));
    p.position.set(Math.sin(i * 2.1) * 0.05, 0.15 + i * 0.06, Math.cos(i * 1.7) * 0.05);
    p.rotation.y = Math.sin(i * 3.3) * 0.18;
    entrada.add(p);
  }

  // ---- Arco del flujo, con engranaje y luz que escanea ----
  const arco = new Group();
  mundo.add(arco);
  const matArco = mat(COLOR.azul, { metalness: 0.35, roughness: 0.35 });
  [-0.85, 0.85].forEach(function (z) {
    const pilar = new Mesh(cajaRedonda(0.32, 2.1, 0.32, 0.07), matArco);
    pilar.position.set(0, 1.0, z);
    arco.add(pilar);
    const pie = sombra(0.9, 0.9, 0.9);
    pie.position.set(0, -0.215, z);
    arco.add(pie);
  });
  const viga = new Mesh(cajaRedonda(0.42, 0.4, 2.1, 0.08), matArco);
  viga.position.y = 2.2;
  arco.add(viga);
  // Tira de luz bajo la viga: se enciende cada vez que una hoja pasa a dato.
  const matTira = new MeshBasicMaterial({ color: COLOR.cian, toneMapped: false });
  const tira = new Mesh(new BoxGeometry(0.08, 0.03, 1.5), matTira);
  tira.position.y = 1.99;
  arco.add(tira);
  const luzEscaner = new PointLight(COLOR.cian, 0, 4, 1.6);
  luzEscaner.position.set(0, 1.4, 0);
  arco.add(luzEscaner);
  const engranaje = new Group();
  engranaje.position.set(0, 2.85, 0.15);
  arco.add(engranaje);
  const matEngranaje = mat(COLOR.tostado, { metalness: 0.55, roughness: 0.32 });
  engranaje.add(new Mesh(geoEngranaje(12, 0.52, 0.68, 0.2), matEngranaje));
  // Un piñón pequeño engranado al grande, girando al revés.
  const piñon = new Mesh(geoEngranaje(8, 0.26, 0.38, 0.16), mat(COLOR.cielo, { metalness: 0.55, roughness: 0.32 }));
  piñon.position.set(0.98, 0.32, -0.02);
  arco.add(piñon);
  piñon.position.add(engranaje.position);
  const eje = new Mesh(new CylinderGeometry(0.1, 0.1, 0.34, 20), mat(COLOR.tinta, { metalness: 0.6, roughness: 0.3 }));
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
  const peana = new Mesh(cajaRedonda(2.1, 0.14, 1.3, 0.05), mat(COLOR.pizarra, { metalness: 0.25, roughness: 0.45 }));
  peana.position.y = 0.06;
  salida.add(peana);
  const sombraSalida = sombra(2.8, 1.9, 0.8);
  sombraSalida.position.y = 0.005;
  salida.add(sombraSalida);
  const coloresBarra = [COLOR.azul, COLOR.cielo, COLOR.verde, COLOR.tostado];
  const barras = coloresBarra.map(function (c, i) {
    const b = new Mesh(cajaRedonda(0.34, 1, 0.5, 0.04, 2), mat(c, { roughness: 0.35, metalness: 0.15 }));
    b.position.set(-0.69 + i * 0.46, 0.12, 0);
    b.userData = { alto: 0.3 + i * 0.12, objetivo: 0.3 + i * 0.12 };
    salida.add(b);
    return b;
  });

  // ---- Piezas que viajan: papel antes del arco, cubo de datos después ----
  const geoPapel = cajaRedonda(0.62, 0.04, 0.8, 0.012, 2);
  // Los tres renglones de cada hoja, unidos en una sola pieza.
  const geoRenglon = mergeGeometries([0, 1, 2].map(function (k) {
    return new BoxGeometry(0.42, 0.012, 0.05).translate(-0.04 + (k === 2 ? -0.08 : 0), 0.027, -0.22 + k * 0.2);
  }));
  const geoCubo = cajaRedonda(0.4, 0.4, 0.4, 0.07);
  const matPapel = mat(COLOR.papel);
  const matRenglon = mat(COLOR.raya);
  const matSobre = mat(0xF3E3D3);
  const piezas = [];
  for (let i = 0; i < 9; i++) {
    const g = new Group();
    const papel = new Group();
    const hoja = new Mesh(geoPapel, i % 3 === 2 ? matSobre : matPapel);
    papel.add(hoja);
    papel.add(new Mesh(geoRenglon, matRenglon));
    const cubo = new Mesh(geoCubo, mat(coloresBarra[i % 4], { emissive: coloresBarra[i % 4], emissiveIntensity: 0.3, roughness: 0.28, metalness: 0.1 }));
    cubo.position.y = 0.2;
    const sombraPieza = sombra(0.95, 1.05, 0.75);
    g.add(papel, cubo, sombraPieza);
    g.visible = false;
    g.userData = { papel: papel, cubo: cubo, sombra: sombraPieza, x: 0, fase: 'libre', barra: i % 4, t: 0, giro: (Math.random() - 0.5) * 0.4 };
    mundo.add(g);
    piezas.push(g);
  }

  // ---- Paquetes de datos que saltan del arco al informe ----
  const geoPaquete = new SphereGeometry(0.07, 10, 8);
  const matPaquete = new MeshBasicMaterial({ color: COLOR.cian, toneMapped: false });
  const matHalo = new MeshBasicMaterial({ color: COLOR.cian, transparent: true, opacity: 0.18, depthWrite: false, toneMapped: false });
  const paquetes = [];
  for (let i = 0; i < 5; i++) {
    const p = new Mesh(geoPaquete, matPaquete);
    const halo = new Mesh(geoPaquete, matHalo);
    halo.scale.setScalar(2.4);
    p.add(halo);
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
    barandillas.forEach(function (b) { b.scale.x = largo; });
    sombraCinta.scale.x = largo + 1.2;
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
  const resolucion = resolucionAdaptativa(renderer, ajustar);
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
    for (let i = 0; i < LISTONES; i++) {
      const x = ((i * 0.55 + t * VELOCIDAD) % 22);
      muñeco.position.set(-largo / 2 + (x % largo), -0.01, 0);
      muñeco.scale.setScalar(x < largo ? 1 : 0);
      muñeco.updateMatrix();
      listones.setMatrixAt(i, muñeco.matrix);
    }
    listones.instanceMatrix.needsUpdate = true;
    rodillos.forEach(function (r) { r.rotation.y = t * 4; });
    engranaje.rotation.z = -t * 1.4;
    piñon.rotation.z = t * 1.4 * (12 / 8) + 0.2;

    if (t > siguiente) { lanzar(); siguiente = t + 1.5 + Math.random() * 0.5; }

    pulso = Math.max(0, pulso - dt * 2.2);
    matLuz.opacity = 0.1 + pulso * 0.45;
    luzEscaner.intensity = pulso * 6;
    matTira.color.setHex(COLOR.cian).multiplyScalar(0.55 + pulso * 1.2);
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

    // Cada pieza lleva su sombra pegada a la cinta; más tenue cuanto más alto vuela.
    piezas.forEach(function (p) {
      const u = p.userData;
      if (u.fase === 'libre') return;
      const suelo = u.fase === 'vuelo' ? 0.14 : -0.005;
      u.sombra.position.y = suelo - p.position.y + 0.02;
      u.sombra.material.opacity = MathUtils.clamp(0.8 - (p.position.y - suelo) * 0.35, 0.1, 0.8);
      u.sombra.rotation.z = -p.rotation.y;
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
      const real = reloj.getDelta();
      resolucion.medir(real);
      const dt = Math.min(0.05, real);
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
