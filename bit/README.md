# Bit, el robot de Club Byte, en 3D

Bit acompaña la visita desde la esquina de la web: flota, parpadea, mira hacia el
puntero, saluda al pulsarlo y comenta cada sección con un bocadillo.

## Piezas

| Fichero | Qué es |
|---|---|
| `../img/bit.glb` | El modelo. Sale de `VIDEOS YOUTUBE\club_byte\club_byte_v3.blend` (solo Bit, sin ciudad ni habitación, sin animación) |
| `../img/bit.webp` | Foto de Bit. Se ve mientras carga el 3D y siempre que no hay 3D |
| `bit.js` | El visor (three.js): luces, cámara y animación hecha en código |
| `../js/bit.js` | `bit.js` + three.js empaquetados y minimizados (unos 140 KB comprimido) |
| `../js/bit-arranque.js` | Decide si carga el 3D, los bocadillos y el botón de ocultar |

Los textos de los bocadillos están en `construir.js` (`UI.bit`) y en
`contenido.en.js` (`UI.bit`).

El 3D **no** se carga si el navegador no tiene WebGL, si la persona pide menos
movimiento o ahorro de datos, o si ha ocultado a Bit (se recuerda en su navegador).
Se carga cuando la página ya ha terminado de cargar, así que no la retrasa.

## Volver a generar el visor

```
cd bit
npm install
npm run construir
cd ..
node construir.js
```

## Volver a exportar el modelo desde Blender

Con Blender 4.2 o posterior (o `pip install bpy`):

```
blender -b --python bit/exportar_bit.py -- "...\club_byte_v3.blend" bit-sin-optimizar.glb
npx @gltf-transform/cli simplify bit-sin-optimizar.glb b2.glb --ratio 0.5 --error 0.0008
npx @gltf-transform/cli quantize b2.glb img/bit.glb
```

(Con `pip install bpy`, en lugar de `blender -b --python`: `python bit/exportar_bit.py <blend> <salida>`.)

El script deja solo los objetos que cuelgan de `BitRoot`, quita la animación y
convierte los materiales de emisión para que el brillo cian llegue al glTF. El
visor busca por nombre `BitTilt`, `ArmPivot1`, `ArmPivot-1`, `Eyes_open`,
`Eyes_blink`, `Eyes_happy`, `Eyes_wink`, `HoverRing` y `HoverRing2`: si cambian
en Blender, hay que cambiarlos en `bit.js`.
