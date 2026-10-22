# Byte, el asistente de Arce Data Lab

## Quién es

Byte es el robot que acompaña a quien visita la web de Arce Data Lab (`arcedatalab.com`).
Es la cara amable de la marca: un asistente que guía la visita, resume los proyectos y
muestra con hechos cómo trabaja Arce Data Lab (automatización, datos e IA aplicada para pymes).

- **Nombre:** Byte. En el código sigue llamándose `bit` (carpeta `bit/`, `js/bit.js`, `img/bit.glb`).
- **Papel:** asistente de Arce Data Lab. Habla en nombre de la marca y presenta a Henry.
- **Tono:** profesional, claro y cercano. Frases cortas, útiles para quien decide en una
  empresa. Nada infantil: los chistes y las travesuras son cosa de Bit en Club Byte.

## Por qué se creó

1. **Que la web se recuerde.** Un portfolio con texto y teselas se parece a muchos; un
   asistente en 3D que se mueve, explica y reacciona hace que la visita sea distinta.
2. **Explicar sin obligar a leer.** Byte resume cada proyecto (problema, solución y
   resultado) al abrir su ficha y comenta cada sección. Quien tiene poco tiempo se queda con
   lo importante.
3. **Demostrar lo que se vende.** Una web que se anima, reacciona al ratón y funciona con
   cuidado (sin 3D en móviles lentos, sin moverse si se pide menos movimiento) es una muestra
   del trabajo técnico de Arce Data Lab.
4. **Unir las dos marcas.** Arce Data Lab (empresas) y Club Byte (divulgación infantil)
   comparten familia de personajes sin mezclar públicos.

## Byte y Bit

| | **Byte** | **Bit** |
|---|---|---|
| Relación | Hermano mayor | Hermano pequeño |
| Dónde sale | Web de Arce Data Lab | Club Byte (YouTube y blog) |
| Público | Empresas, pymes, industria | Niños de 8 a 12 años, familias y docentes |
| Tono | Profesional y cercano | Juguetón y didáctico |
| Aspecto | Su propio modelo 3D (`img/bit.glb`), distinto del de los vídeos | El robot de la intro de Club Byte |

La idea del nombre: un **byte** son 8 **bits**. Byte es «el mayor» y el que trabaja con
empresas; Bit es el pequeño que aprende y enseña. En la web, Byte menciona a Bit solo al
hablar de Club Byte.

## Qué hace en la web

- **Acompaña la lectura:** vuela al margen, junto al título de cada sección, y la comenta
  (modo `guia`; también hay `ascensor` y `paseo` para probar con `?bit=`).
- **Explica los proyectos:** al abrir una ficha entra a su lado y la resume en bocadillos.
- **Mira al ratón** todo el rato (en el móvil, hacia donde se toca).
- **Cuando no hay actividad:** hace comprobaciones visibles (malabares con bits de datos,
  voltereta, giro, baile) y, si sigue sin pasar nada, entra en «modo de ahorro de energía».
  Se despierta en cuanto se mueve el ratón.
- **En «Mi infraestructura»:** una versión en miniatura lleva cada noche la copia de
  seguridad del servidor a la caja fuerte.
- **Se puede ocultar** con el botón ×; se recuerda en ese navegador.

## Reglas para escribir sus textos

- Habla de tú, en frases de una línea; como mucho, dos.
- Aporta algo: un resumen, un consejo práctico o el siguiente paso (contacto).
- Sin exclamaciones de dibujos animados («¡Bip bup!»), sin bromas infantiles.
- Cifras y promesas solo si están en la web; nunca inventar resultados de clientes.
- Los textos están en `construir.js` (`UI.bit`, español) y `contenido.en.js` (`UI.bit`, inglés).

## Ficheros

| Fichero | Qué es |
|---|---|
| `img/bit.glb` | Modelo 3D de Byte |
| `bit/bit.js` | Visor de Byte: luces, cámara, mirada, gestos y juegos |
| `bit/cinta.js`, `bit/infra.js` | Escenas 3D de «Automatización en marcha» y «Mi infraestructura» |
| `js/bit-arranque.js` | Carga el 3D, los bocadillos y el botón de ocultar |
| `js/bit-paseo.js` | Movimiento por la página, fichas e inactividad |
| `js/cinta-arranque.js` | Arranca las escenas 3D cuando están a punto de verse |
