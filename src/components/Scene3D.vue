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
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

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
  /**
   * Compass words for the axes, e.g. { x: ['west', 'east'] }: shown at the
   * negative and positive end of each axis. Omit for plain x, y, z.
   */
  directions?: Partial<Record<'x' | 'y' | 'z', readonly [string, string]>>
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

const formatPoint = (p: Vec3) => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`
const startPoint = () => props.points[0] ?? { x: 0, y: 0, z: 0 }
const endPoint = () => props.points[props.points.length - 1] ?? startPoint()
const displacement = () => ({
  x: endPoint().x - startPoint().x,
  y: endPoint().y - startPoint().y,
  z: endPoint().z - startPoint().z,
})
const description = () => {
  const start = formatPoint(startPoint())
  const current = formatPoint(endPoint())
  const delta = formatPoint(displacement())
  if (locale.value === 'id') {
    return `Tampilan 3D interaktif lintasan dalam koordinat Kartesius. Sumbu x mengarah ke timur, y ke utara, dan z ke atas. Titik awal ${start}; posisi saat ini ${current}; perpindahan ${delta} meter. Gunakan preset tampilan untuk sudut kamera standar. Alternatif numerik tersedia di bawah.`
  }
  if (locale.value === 'ja') {
    return `デカルト座標での経路を示すインタラクティブな 3D 表示です。x 軸は東、y 軸は北、z 軸は上向きです。始点 ${start}、現在位置 ${current}、変位 ${delta} m。標準的なカメラ角度には表示プリセットを使用してください。数値による表示も利用できます。`
  }
  return `Interactive 3D view of a path in Cartesian coordinates. x points east, y north and z up. Start ${start}; current position ${current}; displacement ${delta} metres. Use the view presets for standard camera angles. A numerical alternative follows.`
}

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
    const words = props.directions?.[axis]
    const axisLabels = [label(words ? `${axis} · ${localizeExperimentText(words[1], locale.value)}` : axis, `axis axis-${axis}`, dir.clone().multiplyScalar(n + (words && axis !== 'z' ? 2.8 : 1.4)))]
    // (A longer label is centred further out so it clears the arrowhead.)
    if (words) axisLabels.push(label(localizeExperimentText(words[0], locale.value) ?? words[0], 'direction', dir.clone().multiplyScalar(-n - 1)))
    for (const t of [-8, -4, 4, 8]) if (Math.abs(t) < n) axisLabels.push(label(String(t), 'tick', dir.clone().multiplyScalar(t)))
    for (const l of axisLabels) {
      l.userData.axis = dir
      g.add(l)
    }
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
  dynamic.add(label(locale.value === 'id' ? 'awal' : locale.value === 'ja' ? '始点' : 'start', 'point', start.clone().add(new THREE.Vector3(-1.1, -1.1, 0.4))))

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

const viewDirection = new THREE.Vector3()

/** Hide an axis's labels while it points (almost) at the viewer: they would all pile up in the middle. */
function hideEndOnLabels() {
  if (!staticGroup) return
  camera.getWorldDirection(viewDirection)
  for (const child of staticGroup.children) {
    const axis = child.userData.axis as THREE.Vector3 | undefined
    if (axis) child.visible = Math.abs(axis.dot(viewDirection)) < 0.95
  }
}

function render() {
  if (!renderer || !labels) return
  hideEndOnLabels()
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
  labels.domElement.setAttribute('aria-hidden', 'true')
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
    <div ref="container" class="scene" role="img" :aria-label="description()" />
    <details class="scene-data">
      <summary>{{ localizeExperimentText('Read the 3D coordinates as text', locale) }}</summary>
      <dl>
        <div><dt>{{ localizeExperimentText('Starting point (x, y, z)', locale) }}</dt><dd>{{ formatPoint(startPoint()) }} m</dd></div>
        <div><dt>{{ localizeExperimentText('Current point (x, y, z)', locale) }}</dt><dd>{{ formatPoint(endPoint()) }} m</dd></div>
        <div><dt>{{ localizeExperimentText('Displacement (Δx, Δy, Δz)', locale) }}</dt><dd>{{ formatPoint(displacement()) }} m</dd></div>
        <div><dt>{{ localizeExperimentText('Distance between start and current point', locale) }}</dt><dd>{{ Math.hypot(displacement().x, displacement().y, displacement().z).toFixed(2) }} m</dd></div>
        <div><dt>{{ localizeExperimentText('Path points recorded', locale) }}</dt><dd>{{ points.length }}</dd></div>
      </dl>
      <p class="muted small">{{ localizeExperimentText('Coordinates use the standard axes: x east, y north, z up. The displacement is the straight-line change from the starting point, not the total path length.', locale) }}</p>
    </details>
    <p v-if="failed" class="no-webgl">{{ localizeExperimentText('The 3D view needs WebGL, which this browser does not offer. The readouts and controls still work.', locale) }}</p>
  </div>
</template>

<style scoped>
.scene-wrap {
  position: relative;
}

.scene {
  position: relative;
  /* The label renderer gives each label its own z-index; keep them below the sticky site header. */
  isolation: isolate;
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
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

.scene :deep(.direction) {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
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

.scene-data {
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
}
.scene-data summary { cursor: pointer; color: var(--accent); font-weight: 650; }
.scene-data dl { display: grid; gap: 6px; margin: 10px 0; }
.scene-data dl div { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 12px; }
.scene-data dt { color: var(--text-muted); }
.scene-data dd { margin: 0; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.scene-data .small { font-size: .82rem; margin: 0; }
.no-webgl {
  padding: 16px;
  margin: 0;
}
</style>
