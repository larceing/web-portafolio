# Exporta solo a Bit desde el Blender de la intro de Club Byte. Ver README.md.
import bpy, sys
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
src, out = args[0], args[1]
bpy.ops.wm.open_mainfile(filepath=src)
sc = bpy.context.scene
sc.frame_set(1)
def top(o):
    while o.parent: o = o.parent
    return o
keep = [o for o in bpy.data.objects if top(o).name == 'BitRoot' and o.type in ('MESH','EMPTY')]
for o in list(bpy.data.objects):
    if o not in keep: bpy.data.objects.remove(o, do_unlink=True)
# Static pose: drop all animation and reset the root.
for o in bpy.data.objects:
    o.animation_data_clear()
root = bpy.data.objects['BitRoot']
root.location = (0,0,0); root.rotation_euler = (0,0,0); root.scale = (1,1,1)
bpy.data.objects['BitTilt'].rotation_euler = (0,0,0)
for n in ('ArmPivot1','ArmPivot-1'):
    bpy.data.objects[n].rotation_euler = (0,0,0)
# Report dimensions
bpy.context.view_layer.update()
import mathutils
mn=[1e9]*3; mx=[-1e9]*3
for o in bpy.data.objects:
    if o.type=='MESH':
        for c in o.bound_box:
            w=o.matrix_world @ mathutils.Vector(c)
            for i in range(3): mn[i]=min(mn[i],w[i]); mx[i]=max(mx[i],w[i])
print("BOUNDS", mn, mx)
for o in bpy.data.objects:
    if o.name.startswith('Eyes'): print(o.name, "hidden_render", o.hide_render, "hide_vp", o.hide_viewport, o.location[:], o.scale[:])
# Turn pure Emission shaders into Principled (black base + emission) so glTF keeps the glow.
for m in bpy.data.materials:
    nt = m.node_tree
    if not nt: continue
    em = next((n for n in nt.nodes if n.type=='EMISSION'), None)
    if em:
        col = tuple(em.inputs['Color'].default_value); st = em.inputs['Strength'].default_value
        outn = next(n for n in nt.nodes if n.type=='OUTPUT_MATERIAL')
        p = nt.nodes.new('ShaderNodeBsdfPrincipled')
        p.inputs['Base Color'].default_value = (0,0,0,1)
        p.inputs['Emission Color'].default_value = col
        p.inputs['Emission Strength'].default_value = min(st, 3.0)
        nt.links.new(p.outputs[0], outn.inputs['Surface'])
        nt.nodes.remove(em)
for o in bpy.data.objects:
    o.hide_render=False; o.hide_viewport=False; o.hide_set(False)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True, export_animations=False,
    export_yup=True, export_texcoords=False, export_normals=True, export_lights=False, export_cameras=False,
    export_extras=False, use_visible=False)
import os; print("SIZE", os.path.getsize(out))
