<script setup lang="ts">
/**
 * A 3D view of a journey through space (Three.js), with z pointing up as in
 * physics. It draws the axes, a floor grid, the path, the displacement arrow,
 * optionally the displacement's components and a second coordinate system.
 * It renders only when something changes, not on every animation frame.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { frameAxes, type CoordinateFrame, type Vec3 } from '@/physics'

export type View = '3d' | 'top' | 'front' | 'side'

const props = defineProps<{
  points: readonly Vec3[]
  bound: number
  frame: CoordinateFrame
  showFrame: boolean
  showComponents: boolean
  view: View
  /** Changes to this number re-apply `view` even if it is unchanged. */
  viewKey: number
}>()

const container = ref<HTMLDivElement | null>(null)
const failed = ref(false)

let renderer: THREE.WebGLRenderer | null = null
let labels: CSS2DRenderer | null = null
let camera: THREE.PerspectiveCamera
let controls: OrbitControls | null = null
let resizeObserver: ResizeObserver | null = null
const scene = new THREE.Scene()
const dynamic = new THREE.Group() // everything rebuilt when the journey or frame changes
scene.add(dynamic)
type Disposable = { dispose(): void }
// GPU resources are released when the part of the scene that owns them is rebuilt.
let staticResources: Disposable[] = []
let dynamicResources: Disposable[] = []
let collecting: Disposable[] = staticResources
const colourQuery = window.matchMedia('(prefers-color-scheme: dark)')

const AXIS_COLOURS = { x: 0xe5484d, y: 0x30a46c, z: 0x3e63dd }

function cssColour(name: string, fallback: string): THREE.Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new THREE.Color(value || fallback)
}

function label(text: string, className: string, position: THREE.Vector3): CSS2DObject {
  const el = document.createElement('span')
  el.textContent = text
  el.className = `scene-label ${className}`
  const obj = new CSS2DObject(el)
  obj.position.copy(position)
  return obj
}

function track<T extends Disposable>(thing: T): T {
  collecting.push(thing)
  return thing
}

function release(list: Disposable[]) {
  for (const r of list) r.dispose()
  list.length = 0
}

function line(points: THREE.Vector3[], material: THREE.LineBasicMaterial | THREE.LineDashedMaterial): THREE.Line {
  const geometry = track(new THREE.BufferGeometry().setFromPoints(points))
  const l = new THREE.Line(geometry, track(material))
  if (material instanceof THREE.LineDashedMaterial) l.computeLineDistances()
  return l
}

const v3 = (p: Vec3) => new THREE.Vector3(p.x, p.y, p.z)

/** Fixed parts: grid on the floor (z = 0) and the three axes with labels. */
function buildStatic(): THREE.Group {
  release(staticResources)
  collecting = staticResources
  const g = new THREE.Group()
  const n = props.bound
  const grid = new THREE.GridHelper(2 * n, 2 * n, cssColour('--axis', '#8a93a6'), cssColour('--grid', '#e5e8ef'))
  grid.rotation.x = Math.PI / 2 // GridHelper lies in the xz-plane; turn it into the xy-plane
  track(grid.geometry)
  track(grid.material as THREE.Material)
  g.add(grid)
  for (const [axis, dir] of [['x', new THREE.Vector3(1, 0, 0)], ['y', new THREE.Vector3(0, 1, 0)], ['z', new THREE.Vector3(0, 0, 1)]] as const) {
    const colour = AXIS_COLOURS[axis]
    g.add(line([dir.clone().multiplyScalar(-n), dir.clone().multiplyScalar(n)], new THREE.LineBasicMaterial({ color: colour })))
    const cone = new THREE.Mesh(track(new THREE.ConeGeometry(0.25, 0.8, 16)), track(new THREE.MeshBasicMaterial({ color: colour })))
    cone.position.copy(dir.clone().multiplyScalar(n + 0.4))
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    g.add(cone)
    g.add(label(axis, `axis axis-${axis}`, dir.clone().multiplyScalar(n + 1.4)))
    for (const t of [-8, -4, 4, 8]) if (Math.abs(t) < n) g.add(label(String(t), 'tick', dir.clone().multiplyScalar(t)))
  }
  return g
}

let staticGroup: THREE.Group | null = null

/** Parts that depend on the journey and the second frame. */
function buildDynamic() {
  release(dynamicResources)
  collecting = dynamicResources
  for (const child of [...dynamic.children]) {
    dynamic.remove(child)
    if (child instanceof CSS2DObject) child.element.remove()
  }
  const accent = cssColour('--accent', '#1f4fd1')
  const success = cssColour('--success', '#17794a')
  const observer = cssColour('--observer', '#c2410c')
  const muted = cssColour('--text-muted', '#556079')
  const pts = props.points.map(v3)
  const start = pts[0] as THREE.Vector3
  const end = pts[pts.length - 1] as THREE.Vector3

  if (pts.length > 1) {
    dynamic.add(line(pts, new THREE.LineBasicMaterial({ color: accent })))
    for (const p of pts.slice(1, -1)) {
      const dot = new THREE.Mesh(track(new THREE.SphereGeometry(0.12, 12, 12)), track(new THREE.MeshBasicMaterial({ color: accent })))
      dot.position.copy(p)
      dynamic.add(dot)
    }
  }

  const startMarker = new THREE.Mesh(track(new THREE.SphereGeometry(0.28, 20, 20)), track(new THREE.MeshBasicMaterial({ color: success })))
  startMarker.position.copy(start)
  dynamic.add(startMarker)
  dynamic.add(label('start', 'point', start.clone().add(new THREE.Vector3(-1.1, -1.1, 0.4))))

  const object = new THREE.Mesh(track(new THREE.SphereGeometry(0.42, 24, 24)), track(new THREE.MeshLambertMaterial({ color: accent })))
  object.position.copy(end)
  dynamic.add(object)

  const d = end.clone().sub(start)
  const length = d.length()
  if (length > 1e-9) {
    const arrow = new THREE.ArrowHelper(d.clone().normalize(), start, length, observer.getHex(), Math.min(0.9, length * 0.3), Math.min(0.5, length * 0.18))
    track(arrow.line.geometry)
    track(arrow.cone.geometry)
    track(arrow.line.material as THREE.Material)
    track(arrow.cone.material as THREE.Material)
    dynamic.add(arrow)
    dynamic.add(label('Δr', 'displacement', start.clone().add(d.clone().multiplyScalar(0.5)).add(new THREE.Vector3(0, 0, 0.7))))
  }

  if (props.showComponents && length > 1e-9) {
    const a = start.clone()
    const b = new THREE.Vector3(end.x, start.y, start.z)
    const c = new THREE.Vector3(end.x, end.y, start.z)
    for (const [from, to, axis] of [[a, b, 'x'], [b, c, 'y'], [c, end, 'z']] as const) {
      if (from.distanceTo(to) < 1e-9) continue
      dynamic.add(line([from, to], new THREE.LineDashedMaterial({ color: AXIS_COLOURS[axis], dashSize: 0.35, gapSize: 0.2 })))
    }
  }

  if (props.showFrame) {
    const o = v3(props.frame.origin)
    frameAxes(props.frame).forEach((axis, i) => {
      const dir = v3(axis)
      const name = (['x′', 'y′', 'z′'] as const)[i] as string
      dynamic.add(line([o, o.clone().add(dir.clone().multiplyScalar(6))], new THREE.LineDashedMaterial({ color: muted, dashSize: 0.4, gapSize: 0.25 })))
      dynamic.add(label(name, 'primed', o.clone().add(dir.clone().multiplyScalar(6.8))))
    })
    dynamic.add(label('O′', 'primed', o.clone().add(new THREE.Vector3(0, 0, -0.8))))
  }
}

function render() {
  if (!renderer || !labels) return
  renderer.render(scene, camera)
  labels.render(scene, camera)
}

/** Far enough back that the whole box, labels included, fits the narrower field of view. */
function fitDistance(): number {
  const halfFov = Math.min(camera.fov, camera.fov * camera.aspect) * (Math.PI / 360)
  return (props.bound + 2) / Math.tan(halfFov) + props.bound * 0.4
}

function applyView() {
  if (!controls) return
  const directions: Record<View, THREE.Vector3> = {
    '3d': new THREE.Vector3(0.62, -0.82, 0.55),
    top: new THREE.Vector3(0, -0.00003, 1),
    front: new THREE.Vector3(0, -1, 0.00003),
    side: new THREE.Vector3(1, 0, 0.00003),
  }
  camera.position.copy(directions[props.view].normalize().multiplyScalar(fitDistance()))
  controls.target.set(0, 0, 0)
  controls.update()
  render()
}

function resize() {
  const el = container.value
  if (!el || !renderer || !labels) return
  const width = el.clientWidth
  const height = Math.max(280, Math.min(560, Math.round(width * 0.68)))
  renderer.setSize(width, height)
  labels.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  if (controls) {
    // Keep the student's viewing direction; only adjust how far back the camera is.
    const offset = camera.position.clone().sub(controls.target).setLength(fitDistance())
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }
  render()
}

function rebuildColours() {
  if (staticGroup) {
    scene.remove(staticGroup)
    for (const child of staticGroup.children) if (child instanceof CSS2DObject) child.element.remove()
  }
  staticGroup = buildStatic()
  scene.add(staticGroup)
  buildDynamic()
  render()
}

onMounted(() => {
  const el = container.value
  if (!el) return
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    failed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  labels = new CSS2DRenderer()
  labels.domElement.className = 'scene-labels'
  el.appendChild(labels.domElement)

  camera = new THREE.PerspectiveCamera(40, 1.5, 0.1, 500)
  camera.up.set(0, 0, 1) // physics convention: z points up
  scene.add(new THREE.AmbientLight(0xffffff, 1.6))
  const sun = new THREE.DirectionalLight(0xffffff, 1.4)
  sun.position.set(10, -6, 20)
  scene.add(sun)

  controls = new OrbitControls(camera, labels.domElement)
  controls.enableDamping = false
  controls.minDistance = 8
  controls.maxDistance = props.bound * 6
  controls.addEventListener('change', render)

  rebuildColours()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(el)
  resize()
  applyView()
  colourQuery.addEventListener('change', rebuildColours)
})

watch(
  () => [props.points, props.frame, props.showFrame, props.showComponents],
  () => {
    buildDynamic()
    render()
  },
  { deep: true },
)
watch(() => [props.view, props.viewKey], applyView)

onBeforeUnmount(() => {
  colourQuery.removeEventListener('change', rebuildColours)
  resizeObserver?.disconnect()
  controls?.dispose()
  release(staticResources)
  release(dynamicResources)
  renderer?.dispose()
  renderer?.domElement.remove()
  labels?.domElement.remove()
})
</script>

<template>
  <div class="scene-wrap">
    <div ref="container" class="scene" />
    <p v-if="failed" class="no-webgl">The 3D view needs WebGL, which this browser does not offer. The readouts and controls still work.</p>
  </div>
</template>

<style scoped>
.scene-wrap {
  position: relative;
}

.scene {
  position: relative;
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  overflow: hidden;
  touch-action: none;
}

.scene :deep(canvas) {
  display: block;
}

.scene :deep(.scene-labels) {
  position: absolute;
  inset: 0;
}

.scene :deep(.scene-label) {
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
  text-shadow: 0 0 3px var(--surface), 0 0 3px var(--surface);
}

.scene :deep(.axis) {
  font-size: 16px;
}

.scene :deep(.axis-x) {
  color: #e5484d;
}

.scene :deep(.axis-y) {
  color: #30a46c;
}

.scene :deep(.axis-z) {
  color: #3e63dd;
}

.scene :deep(.tick) {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.scene :deep(.point) {
  color: var(--success);
}

.scene :deep(.displacement) {
  color: var(--observer);
}

.scene :deep(.primed) {
  color: var(--text-muted);
}

.no-webgl {
  padding: 16px;
  margin: 0;
}
</style>
