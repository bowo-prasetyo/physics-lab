<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { directionAngles, norm, type Vec3 } from '@/physics'
import type { Level } from '@/levels'

const props = defineProps<{
  level: Level
  start: Vec3
  end: Vec3
  displacement: Vec3
  primed: Vec3
  distance: number
  yawDeg: number
  frameIsStandard: boolean
}>()

const f = (x: number, digits = 3) => {
  const v = Number(x.toFixed(digits))
  return String(Object.is(v, -0) ? 0 : v)
}
const vecTex = (v: Vec3) => `(${f(v.x, 2)},\\ ${f(v.y, 2)},\\ ${f(v.z, 2)})`

const displacementExample = computed(() => {
  const d = props.displacement
  return (
    `\\begin{aligned} \\Delta\\mathbf r &= \\mathbf r_{\\text{end}} - \\mathbf r_{\\text{start}} = ${vecTex(d)} \\\\ ` +
    `|\\Delta\\mathbf r| &= \\sqrt{${f(d.x, 2)}^2 + ${f(d.y, 2)}^2 + ${f(d.z, 2)}^2} \\\\ &= ${f(norm(d))}\\ \\text{m} \\end{aligned}`
  )
})

const invariantExample = computed(() => {
  const [d, p] = [props.displacement, props.primed]
  return (
    `\\begin{aligned} \\Delta\\mathbf r &= ${vecTex(d)} \\\\ \\Delta\\mathbf r' &= ${vecTex(p)} \\\\ ` +
    `|\\Delta\\mathbf r| &= ${f(norm(d))}, \\quad |\\Delta\\mathbf r'| = ${f(norm(p))} \\end{aligned}`
  )
})

const angles = computed(() => directionAngles(props.displacement))
const rotationTex = computed(() => {
  const a = (props.yawDeg * Math.PI) / 180
  const [c, s] = [f(Math.cos(a)), f(Math.sin(a))]
  const ms = s === '0' ? '0' : s.startsWith('-') ? s.slice(1) : `-${s}`
  return (
    `\\begin{aligned} R_z(\\varphi) &= \\begin{pmatrix} \\cos\\varphi & -\\sin\\varphi & 0 \\\\ \\sin\\varphi & \\cos\\varphi & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\\\ ` +
    `&= \\begin{pmatrix} ${c} & ${ms} & 0 \\\\ ${s} & ${c} & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\end{aligned}`
  )
})
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>A position in space needs three numbers, its <strong>coordinates</strong>, measured along three perpendicular axes from an origin:</p>
      <MathFormula display tex="\mathbf r = (x,\ y,\ z)" />
      <p>The <strong>displacement</strong> is the change in position: end minus start, with a size and a direction. For your journey:</p>
      <MathFormula display :tex="displacementExample" />
      <p>
        That is Pythagoras’ theorem in three dimensions. The <strong>distance travelled</strong>, the length of the whole path, is
        {{ f(distance) }} m.
      </p>
      <InfoCallout kind="physics" title="Key idea">
        <p>
          Distance is how far you went; displacement is how far you ended up from where you started, and in which direction. A round trip has a
          distance but no displacement.
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>Displacements add as vectors</h3>
      <MathFormula display tex="\begin{gathered} \Delta\mathbf r = \Delta\mathbf r_1 + \Delta\mathbf r_2 + \cdots \\ \text{(component by component)} \end{gathered}" />
      <h3>Changing the coordinate system</h3>
      <p>A second system with origin <MathFormula tex="\mathbf O" /> and axes turned by a rotation <MathFormula tex="R" /> gives every point new coordinates:</p>
      <MathFormula display tex="\mathbf r' = R^{\mathsf T}(\mathbf r - \mathbf O), \qquad \Delta\mathbf r' = R^{\mathsf T}\,\Delta\mathbf r" />
      <p>
        The origin cancels from every displacement. The rotation changes the components, but not the length, because a rotation matrix
        satisfies <MathFormula tex="R^{\mathsf T} R = I" />:
      </p>
      <MathFormula display tex="|\Delta\mathbf r'|^2 = \Delta\mathbf r^{\mathsf T} R R^{\mathsf T} \Delta\mathbf r = |\Delta\mathbf r|^2" />
      <p v-if="!frameIsStandard">Your journey in both coordinate systems:</p>
      <MathFormula v-if="!frameIsStandard" display :tex="invariantExample" />
      <p v-else class="muted">Move or turn the second coordinate system to see both sets of numbers here.</p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>Rotations and the invariant dot product</h3>
      <p>Turning the axes by <MathFormula tex="\varphi" /> about z (here <MathFormula :tex="`\\varphi = ${f(yawDeg, 0)}^\\circ`" />):</p>
      <MathFormula display :tex="rotationTex" />
      <p>
        Every rotation preserves the dot product <MathFormula tex="\mathbf a \cdot \mathbf b = \delta_{ij}\,a^i b^j" />, and with it all lengths
        and angles. Rotations and shifts of the origin together make up the <strong>Euclidean group</strong>: the symmetries of space.
      </p>
      <h3>Direction</h3>
      <p v-if="angles">
        The unit vector <MathFormula tex="\hat{\mathbf r} = \Delta\mathbf r / |\Delta\mathbf r|" /> has components equal to the cosines of the
        angles it makes with the three axes. Here those angles are <MathFormula :tex="`${f(angles[0], 1)}^\\circ,\\ ${f(angles[1], 1)}^\\circ,\\ ${f(angles[2], 1)}^\\circ`" />.
      </p>
      <p v-else class="muted">Make a journey to see its direction.</p>
      <h3>Shortest in space, longest in spacetime</h3>
      <p>The triangle inequality: the size of a sum of displacements is never more than the sum of their sizes.</p>
      <MathFormula display tex="\Bigl|\sum_i \Delta\mathbf r_i\Bigr| \le \sum_i |\Delta\mathbf r_i|" />
      <p>
        So the straight line is the shortest path in Euclidean space. In Minkowski spacetime the minus sign in
        <MathFormula tex="s^2 = c^2 t^2 - |\Delta\mathbf r|^2" /> reverses the inequality: the straight (inertial) worldline between two events
        has the <em>longest</em> proper time. The Lorentz group of Experiment E plays the role that the Euclidean group plays here.
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}
</style>
