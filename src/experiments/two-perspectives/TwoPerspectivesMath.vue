<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { gamma, rapidity } from '@/physics'
import { useLocale } from '@/composables/useLocale'
import { localizeTwoPerspectivesMathText } from '@/i18n/two-perspectives-math'
import type { Level } from '@/levels'

const props = defineProps<{ level: Level; beta: number }>()
const { locale } = useLocale()
const tx = (value: string) => localizeTwoPerspectivesMathText(value, locale.value)

const f = (value: number, digits = 3) => value.toFixed(digits)
const phi = computed(() => rapidity(props.beta))

const gammaDisplay = computed(() => '\\gamma = ' + f(gamma(props.beta)))
const velocityAddition = computed(
  () => `w = \\frac{c + v}{1 + c\\,v/c^2} = \\frac{1 + ${f(props.beta, 2)}}{1 + ${f(props.beta, 2)}}\\,c = c`,
)
const rapidityDisplay = computed(() => '\\varphi = \\operatorname{artanh}(' + f(props.beta, 2) + ') = ' + f(phi.value, 4))
const metricCheck = computed(
  () =>
    `\\begin{aligned} &\\cosh^2\\varphi - \\sinh^2\\varphi \\\\ &= ${f(Math.cosh(phi.value) ** 2, 4)} - ${f(Math.sinh(phi.value) ** 2, 4)} = 1 \\end{aligned}`,
)
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>
        {{ tx('A description here means a set of mathematical rules for turning a situation into predictions you can measure. The three descriptions start from different ideas:') }}
      </p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">{{ tx('Description') }}</th><th scope="col">{{ tx('Basic idea') }}</th><th scope="col">{{ tx('Everyday speeds') }}</th><th scope="col">{{ tx('Near light speed') }}</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{{ tx('Galilean') }}</th>
              <td>{{ tx('One time for everyone; speeds add') }}</td>
              <td>{{ tx('Excellent (except for light)') }}</td>
              <td>{{ tx('Wrong') }}</td>
            </tr>
            <tr>
              <th scope="row">{{ tx('Space + time, Lorentz-related') }}</th>
              <td>{{ tx('Separate space and time, mixed when you change observer') }}</td>
              <td>{{ tx('Correct') }}</td>
              <td>{{ tx('Correct') }}</td>
            </tr>
            <tr>
              <th scope="row">{{ tx('Spacetime') }}</th>
              <td>{{ tx('One geometry; everyone agrees on the interval') }}</td>
              <td>{{ tx('Correct') }}</td>
              <td>{{ tx('Correct') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <InfoCallout kind="physics" :title="tx('Key idea')">
        <p>
          {{ tx('Measurements decide between descriptions. The Galilean description fails near the speed of light. The other two never disagree with each other, so measurements alone cannot choose between them: they are two ways of writing the same physics.') }}
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>{{ tx('From Galilean to Lorentz') }}</h3>
      <p>{{ tx('Galilean:') }}</p>
      <MathFormula display tex="t' = t, \qquad x' = x - v\,t" />
      <p>{{ tx('Lorentz:') }}</p>
      <MathFormula display tex="\begin{aligned} t' &= \gamma\left(t - \frac{v\,x}{c^2}\right) \\ x' &= \gamma\,(x - v\,t) \end{aligned}" />
      <p>
        {{ tx("For") }} <MathFormula tex="v \ll c" />, <MathFormula tex="\gamma \approx 1 + \tfrac{v^2}{2c^2}" />{{ tx(", so the clock correction is tiny (second order in") }} <MathFormula tex="v/c" />{{ tx("). The term") }} <MathFormula tex="v x / c^2" /> {{ tx("is different: for distant events it can be large even at modest speeds. It is the relativity of simultaneity, and Galilean physics leaves it out entirely.") }}
      </p>

      <h3>{{ tx('Why speeds do not simply add') }}</h3>
      <p>{{ tx('Differentiating the Lorentz transformation gives the velocity rule') }}</p>
      <MathFormula display tex="w = \frac{u + v}{1 + u v / c^2}." />
      <p>{{ tx('For light (') }}<MathFormula tex="u = c" />{{ tx(') at your current ship speed:') }}</p>
      <MathFormula display :tex="velocityAddition" />

      <h3>{{ tx('Simultaneity') }}</h3>
      <MathFormula display tex="\Delta t' = \gamma\left(\Delta t - \frac{v\,\Delta x}{c^2}\right)" />
      <p>{{ tx("so with") }} <MathFormula tex="\Delta t = 0" />:</p>
      <MathFormula display tex="\Delta t' = -\gamma\,\frac{v\,\Delta x}{c^2}" />
      <p>
        {{ tx("Events simultaneous for the Earth (") }}<MathFormula tex="\Delta t = 0" />{{ tx(") are not simultaneous for the ship. At your speed,") }}
        <MathFormula :tex="gammaDisplay" />.
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>{{ tx('Why the two relativistic descriptions must agree') }}</h3>
      <p>
        {{ tx('In matrix form, a boost is a hyperbolic rotation of') }} <MathFormula tex="x^\mu = (ct, x)" /> {{ tx('by the rapidity') }} <MathFormula tex="\varphi" />:
      </p>
      <MathFormula display tex="\Lambda(\varphi) = \begin{pmatrix} \cosh\varphi & -\sinh\varphi \\ -\sinh\varphi & \cosh\varphi \end{pmatrix}" />
      <p>{{ tx('It preserves the metric') }} <MathFormula tex="\eta = \operatorname{diag}(1, -1)" />:</p>
      <MathFormula display tex="\begin{gathered} \Lambda^{\mathsf T}\eta\,\Lambda = \eta \\ \Longleftrightarrow\; \cosh^2\varphi - \sinh^2\varphi = 1 \end{gathered}" />
      <p>
        {{ tx('With') }} <MathFormula :tex="rapidityDisplay" />:
      </p>
      <MathFormula display :tex="metricCheck" />
      <p>
        {{ tx('Writing') }} <MathFormula tex="\cosh\varphi = \gamma" /> {{ tx('and') }} <MathFormula tex="\sinh\varphi = \gamma\beta" /> {{ tx('turns') }}
        <MathFormula tex="\Lambda" /> {{ tx('into the Lorentz transformation of the space + time description, term by term. Every measurable prediction is either an') }} <strong>{{ tx('invariant') }}</strong> {{ tx('(a proper time, the vanishing interval of light, the sign of') }}
        <MathFormula tex="s^2" />{{ tx(') or a') }} <strong>{{ tx('component in a stated frame') }}</strong> {{ tx('(the time between the flashes for the ship). Both formalisms compute both kinds, and they compute them with the same group of transformations. So their predictions cannot differ.') }}
      </p>

      <h3>{{ tx('“Space + time” is spacetime with an observer chosen') }}</h3>
      <p>
        {{ tx('Choose an observer with 4-velocity') }} <MathFormula tex="u^\mu" />{{ tx('. Their time is the component along') }} <MathFormula tex="u" />{{ tx(', and their space is everything orthogonal to it:') }}
      </p>
      <MathFormula display tex="\begin{gathered} c\,t_u = \eta_{\mu\nu}\,u^\mu x^\nu \\ \text{space}_u = \{\, x : \eta_{\mu\nu}\,u^\mu x^\nu = 0 \,\} \end{gathered}" />
      <p>{{ tx('Different observers make different splits. The space + time description is one such split, made explicitly.') }}</p>

      <h3>{{ tx('Looking ahead: the 3 + 1 split in general relativity') }}</h3>
      <p>{{ tx('In curved spacetime the ADM formalism splits spacetime into a stack of spatial slices. In the (−, +, +, +) sign convention usual in GR,') }}</p>
      <MathFormula display tex="\begin{aligned} ds^2 = &-N^2\,dt^2 \\ &+ \gamma_{ij}\,(dx^i + N^i dt)(dx^j + N^j dt) \end{aligned}" />
      <p>
        {{ tx('with the lapse') }} <MathFormula tex="N" /> {{ tx('(how much proper time passes between slices), the shift') }} <MathFormula tex="N^i" />{{ tx(', and the spatial metric') }}
        <MathFormula tex="\gamma_{ij}" />{{ tx(', which evolves in time. The choice of slicing is again free, and measurable predictions do not depend on it. Module 5 builds on this.') }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}

.table-wrap {
  overflow-x: auto;
  margin-bottom: 12px;
}

table {
  border-collapse: collapse;
  font-size: 0.92rem;
}

th,
td {
  padding: 6px 10px;
  border: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

thead th {
  background: var(--surface-2);
}
</style>
