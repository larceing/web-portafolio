// «Mi infraestructura» en 3D: las peticiones entran por el proxy con candado,
// llegan al servidor y a los contenedores de las apps; de vez en cuando cae un
// contenedor nuevo (un despliegue) y, cada noche, un Byte en miniatura lleva la
// copia de seguridad a la caja fuerte.
//
// Se empaqueta junto a Byte en ../js/bit.js. Lo arranca js/cinta-arranque.js.

import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight,
  SRGBColorSpace, Group, Mesh, BoxGeometry, CylinderGeometry, TorusGeometry,
  SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, Color, Clock,
  MathUtils, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const COLOR = {
  tinta: 0x15202B, azul: 0x1D4F7A, cielo: 0x2E6C9E, pizarra: 0x3F5266,
  tostado: 0xA94F0E, verde: 0x2C6259, suelo: 0xDCE3EA, cian: 0x6FD3FF, oro: 0xE8B04A
};
const DIA = new Color(0xEAF2FA), NOCHE = new Color(0x15202B);

function mat(color, extra) {
  return new MeshStandardMaterial(Object.assign({ color: color, roughness: 0.55, metalness: 0.1 }, extra || {}));
}
function caja(w, h, d, m) { return new Mesh(new BoxGeometry(w, h, d), m); }

export function iniciarInfra(opciones) {
  const lienzo = opciones.lienzo;
  const quieto = !!opciones.quieto;

  const renderer = new WebGLRenderer({ canvas: lienzo, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  const fondo = DIA.clone();
  renderer.setClearColor(fondo, 1);

  const escena = new Scene();
  const camara = new PerspectiveCamera(30, 1, 0.1, 200);
  const cielo = new HemisphereLight(0xffffff, 0x8a99aa, 1.8);
  escena.add(cielo);
  const sol = new DirectionalLight(0xffffff, 1.5);
  sol.position.set(4, 9, 6);
  escena.add(sol);

  const GIRO = -0.32;
  const mundo = new Group();
  mundo.rotation.y = GIRO;
  escena.add(mundo);

  // ---- Suelo ----
  const suelo = caja(15, 0.2, 4.2, mat(COLOR.suelo, { roughness: 0.9 }));
  suelo.position.y = -0.1;
  mundo.add(suelo);

  // ---- Proxy: arco con candado (HTTPS) ----
  const proxy = new Group();
  proxy.position.x = -5.2;
  mundo.add(proxy);
  const matProxy = mat(COLOR.pizarra);
  [-0.75, 0.75].forEach(function (z) { const p = caja(0.3, 1.8, 0.3, matProxy); p.position.set(0, 0.9, z); proxy.add(p); });
  const viga = caja(0.4, 0.3, 1.85, matProxy);
  viga.position.y = 1.9;
  proxy.add(viga);
  const candado = new Group();
  candado.position.set(0, 2.55, 0);
  proxy.add(candado);
  const matOro = mat(COLOR.oro, { metalness: 0.5, roughness: 0.35 });
  candado.add(caja(0.5, 0.42, 0.2, matOro));
  const asa = new Mesh(new TorusGeometry(0.17, 0.05, 8, 20, Math.PI), matOro);
  asa.position.y = 0.2;
  candado.add(asa);

  // ---- Servidor: armario con luces ----
  const servidor = new Group();
  servidor.position.x = -2.2;
  mundo.add(servidor);
  const armario = caja(1.3, 2.8, 1.2, mat(COLOR.tinta, { roughness: 0.7 }));
  armario.position.y = 1.4;
  servidor.add(armario);
  const luces = [];
  for (let i = 0; i < 6; i++) {
    const placa = caja(1.1, 0.3, 0.05, mat(COLOR.pizarra));
    placa.position.set(0, 0.45 + i * 0.4, 0.61);
    servidor.add(placa);
    for (let k = 0; k < 3; k++) {
      const m = new MeshBasicMaterial({ color: k === 0 ? 0x5fe0a0 : COLOR.cian });
      const led = caja(0.07, 0.07, 0.03, m);
      led.position.set(0.3 + k * 0.13, 0.45 + i * 0.4, 0.645);
      led.userData.fase = Math.random() * 10;
      led.userData.ritmo = 2 + Math.random() * 5;
      servidor.add(led);
      luces.push(led);
    }
  }

  // ---- Contenedores de las apps ----
  const coloresApp = [COLOR.azul, COLOR.cielo, COLOR.verde, COLOR.tostado, COLOR.pizarra, COLOR.azul];
  const huecos = [];
  for (let fila = 0; fila < 2; fila++) {
    for (let col = 0; col < 3; col++) huecos.push({ x: 0.3 + col * 1.15, y: 0.35 + fila * 0.72, z: 0 });
  }
  const geoCont = new BoxGeometry(1.05, 0.66, 1.3);
  const geoNervio = new BoxGeometry(0.04, 0.6, 1.32);
  function contenedor(color) {
    const g = new Group();
    const m = mat(color, { metalness: 0.25, roughness: 0.5 });
    g.add(new Mesh(geoCont, m));
    for (let i = 0; i < 5; i++) {
      const n = new Mesh(geoNervio, m);
      n.position.x = -0.4 + i * 0.2;
      g.add(n);
    }
    mundo.add(g);
    return g;
  }
  const apps = huecos.map(function (h, i) {
    const c = contenedor(coloresApp[i]);
    c.position.set(h.x, h.y, h.z);
    c.userData = { hueco: i, cae: 0 };
    return c;
  });
  let siguienteDespliegue = 4;

  // ---- Caja fuerte de las copias ----
  const fuerte = new Group();
  fuerte.position.x = 5.4;
  mundo.add(fuerte);
  const cuerpoFuerte = caja(1.3, 1.4, 1.2, mat(0x5b6b7c, { metalness: 0.5, roughness: 0.35 }));
  cuerpoFuerte.position.y = 0.7;
  fuerte.add(cuerpoFuerte);
  const puerta = new Group();
  puerta.position.set(-0.5, 0.7, 0.62);
  fuerte.add(puerta);
  const hoja = new Mesh(new CylinderGeometry(0.45, 0.45, 0.08, 28), mat(0x7d8c9c, { metalness: 0.6, roughness: 0.3 }));
  hoja.rotation.x = Math.PI / 2;
  hoja.position.x = 0.5;
  puerta.add(hoja);
  const rueda = new Mesh(new TorusGeometry(0.2, 0.04, 8, 20), matOro);
  rueda.position.set(0.5, 0, 0.06);
  puerta.add(rueda);

  // ---- Paquetes: peticiones que entran por el proxy ----
  const geoPaq = new SphereGeometry(0.08, 10, 8);
  const matPaq = new MeshBasicMaterial({ color: COLOR.cian });
  const paquetes = [];
  for (let i = 0; i < 6; i++) {
    const p = new Mesh(geoPaq, matPaq);
    p.userData = { desfase: i / 6, destino: i % 6 };
    mundo.add(p);
    paquetes.push(p);
  }

  // ---- Estrellas y luna para la noche ----
  const posEstrellas = [];
  for (let i = 0; i < 90; i++) posEstrellas.push((Math.random() - 0.5) * 22, 2.5 + Math.random() * 4, -3 - Math.random() * 3);
  const geoEstrellas = new BufferGeometry();
  geoEstrellas.setAttribute('position', new Float32BufferAttribute(posEstrellas, 3));
  const matEstrellas = new PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0 });
  escena.add(new Points(geoEstrellas, matEstrellas));
  const luna = new Mesh(new SphereGeometry(0.35, 20, 14), new MeshBasicMaterial({ color: 0xF4EBC8, transparent: true, opacity: 0 }));
  luna.position.set(4.5, 4.6, -4);
  escena.add(luna);

  // ---- Byte en miniatura (el mismo modelo, de la caché) ----
  const byte = { obj: null, carga: null };
  const paquete = caja(0.32, 0.26, 0.32, mat(COLOR.tostado));
  paquete.visible = false;
  mundo.add(paquete);
  if (opciones.modelo) {
    new GLTFLoader().load(opciones.modelo, function (gltf) {
      const b = gltf.scene;
      b.scale.setScalar(1.35);
      ['blink', 'happy', 'wink'].forEach(function (n) { const o = b.getObjectByName('Eyes_' + n); if (o) o.visible = false; });
      mundo.add(b);
      byte.obj = b;
      byte.brazos = [b.getObjectByName('ArmPivot1'), b.getObjectByName('ArmPivot-1')];
    });
  }

  function ajustar() {
    const w = lienzo.clientWidth || 800;
    const h = lienzo.clientHeight || 300;
    renderer.setSize(w, h, false);
    const aspecto = w / h;
    camara.aspect = aspecto;
    const mitad = 7.4;
    const dist = Math.max(10, mitad / (Math.tan(MathUtils.degToRad(camara.fov / 2)) * aspecto) + 2);
    camara.position.set(0, dist * 0.34, dist);
    camara.lookAt(0, 1.2, 0);
    camara.updateProjectionMatrix();
  }
  ajustar();
  window.addEventListener('resize', ajustar);

  const CICLO = 18;          // segundos de un día completo
  const DESDE_NOCHE = 0.55;  // parte del ciclo en que anochece
  let apuntaX = 0;

  // Posición de reposo de Byte: sentado encima del servidor.
  const casa = { x: -2.2, y: 3.05, z: 0.1 };

  function paso(t, dt) {
    const fase = (t % CICLO) / CICLO;
    // 0 = día pleno, 1 = noche cerrada.
    const noche = MathUtils.smoothstep(fase, DESDE_NOCHE - 0.06, DESDE_NOCHE + 0.04) * (1 - MathUtils.smoothstep(fase, 0.93, 1));
    fondo.copy(DIA).lerp(NOCHE, noche);
    renderer.setClearColor(fondo, 1);
    cielo.intensity = 1.8 - noche * 1.0;
    sol.intensity = 1.5 - noche * 1.1;
    matEstrellas.opacity = noche * 0.9;
    luna.material.opacity = noche;

    // Luces del servidor parpadeando.
    luces.forEach(function (l) { l.visible = Math.sin(t * l.userData.ritmo + l.userData.fase) > -0.3; });
    candado.rotation.y = Math.sin(t * 1.2) * 0.4;

    // Peticiones: del exterior al proxy, al servidor y a un contenedor.
    paquetes.forEach(function (p) {
      const k = (t * 0.32 + p.userData.desfase) % 1;
      const destino = apps[p.userData.destino].position;
      let x, y;
      if (k < 0.5) {
        x = MathUtils.lerp(-7.4, -2.2, k / 0.5);
        y = 1.0 + Math.sin(k / 0.5 * Math.PI) * 0.3;
      } else {
        const q = (k - 0.5) / 0.5;
        x = MathUtils.lerp(-2.2, destino.x, q);
        y = MathUtils.lerp(1.6, destino.y + 0.4, q) + Math.sin(q * Math.PI) * 1.0;
      }
      p.position.set(x, y, 0.75 * Math.sin(p.userData.desfase * 6.28) * 0.4);
      p.visible = noche < 0.6 || k < 0.5;
    });

    // Despliegues: de vez en cuando un contenedor sube y baja uno nuevo.
    if (t > siguienteDespliegue && noche < 0.1) {
      const c = apps[Math.floor(Math.random() * apps.length)];
      if (!c.userData.cae) c.userData.cae = 0.0001;
      siguienteDespliegue = t + 5 + Math.random() * 3;
    }
    apps.forEach(function (c, i) {
      const h = huecos[c.userData.hueco];
      if (c.userData.cae) {
        c.userData.cae += dt / 1.6;
        const k = c.userData.cae;
        if (k < 0.4) {
          c.position.y = h.y + (k / 0.4) * 4;                    // se va hacia arriba
        } else if (k < 0.45) {
          if (!c.userData.cambiado) {
            const nuevo = mat(coloresApp[(i + Math.floor(t)) % coloresApp.length], { metalness: 0.25, roughness: 0.5 });
            c.children.forEach(function (m) { m.material = nuevo; });
            c.userData.cambiado = true;
          }
        } else if (k < 1) {
          const q = (k - 0.45) / 0.55;
          c.position.y = h.y + 4 * Math.pow(1 - q, 2) - Math.sin(q * Math.PI * 3) * 0.08 * q; // baja con rebote
        } else {
          c.position.y = h.y;
          c.userData.cae = 0;
          c.userData.cambiado = false;
        }
      }
    });

    // Byte: de noche lleva la copia del servidor a la caja fuerte.
    const b = byte.obj;
    let abre = 0;
    if (b) {
      const k = MathUtils.clamp((fase - (DESDE_NOCHE + 0.04)) / 0.32, 0, 1);
      const destino = { x: 5.4, y: 1.0, z: 1.25 };
      let x = casa.x, y = casa.y, z = casa.z;
      paquete.visible = false;
      if (k > 0 && k < 1) {
        if (k < 0.45) {                       // ida, con la copia
          const q = MathUtils.smoothstep(k / 0.45, 0, 1);
          x = MathUtils.lerp(casa.x, destino.x, q);
          y = MathUtils.lerp(casa.y, destino.y, q) + Math.sin(q * Math.PI) * 0.9;
          z = MathUtils.lerp(casa.z, destino.z, q);
          paquete.visible = true;
          abre = MathUtils.smoothstep(k, 0.3, 0.45);
        } else if (k < 0.6) {                 // deja la copia
          x = destino.x; y = destino.y; z = destino.z;
          paquete.visible = k < 0.52;
          abre = 1 - MathUtils.smoothstep(k, 0.53, 0.6);
        } else {                              // vuelta
          const q = MathUtils.smoothstep((k - 0.6) / 0.4, 0, 1);
          x = MathUtils.lerp(destino.x, casa.x, q);
          y = MathUtils.lerp(destino.y, casa.y, q) + Math.sin(q * Math.PI) * 0.9;
          z = MathUtils.lerp(destino.z, casa.z, q);
        }
      }
      const volando = k > 0 && k < 1;
      b.position.set(x, y + Math.sin(t * 2.4) * 0.05, z);
      b.rotation.y = volando ? (k < 0.6 ? 0.9 : -0.9) : Math.sin(t * 0.5) * 0.5;
      b.rotation.z = volando ? (k < 0.6 ? -0.15 : 0.15) : 0;
      if (byte.brazos[0]) byte.brazos[0].rotation.z = paquete.visible ? 1.3 : 0.1 + Math.sin(t * 1.6) * 0.06;
      if (byte.brazos[1]) byte.brazos[1].rotation.z = paquete.visible ? -1.3 : -0.1 - Math.sin(t * 1.6) * 0.06;
      // La copia va en brazos, delante de la barriga.
      paquete.position.set(x, y + 0.05 + Math.sin(t * 2.4) * 0.05, z + 0.42);
    }
    puerta.rotation.y = -abre * 1.6;
    rueda.rotation.z = t * 0.8;

    mundo.rotation.y = MathUtils.lerp(mundo.rotation.y, GIRO + apuntaX * 0.08, 0.05);
  }

  const reloj = new Clock();
  let visible = true, enPantalla = true;
  if (quieto) {
    for (let i = 0; i < 90; i++) paso(i / 30, 1 / 30);
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
