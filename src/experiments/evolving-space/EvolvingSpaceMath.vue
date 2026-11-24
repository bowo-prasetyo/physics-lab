<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { expansionFactor, hubbleRateToday, type Cosmology, type Expansion } from '@/physics'
import type { Level } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeEvolvingSpaceMathText } from '@/i18n/evolving-space-math'

const { locale } = useLocale()
const tx = (value: string) => localizeEvolvingSpaceMathText(value, locale.value)

const props = defineProps<{
  level: Level
  cosmology: Cosmology
  expansion: Expansion
  a: number
  hubble: number | null
  target: number
}>()

const f = (x: number, digits = 3) => Number(x.toPrecision(digits)).toString()

const distanceExample = computed(() => {
  const d = props.a * props.target
  return `d(t) = a(t)\\,d_0 = ${f(props.a)} \\times ${f(props.target)}\\ \\text{Gly} = ${f(d)}\\ \\text{Gly}`
})

const hubbleExample = computed(() => {
  if (props.hubble === null) return null
  const d = props.a * props.target
  return (
    `\\begin{aligned} v &= H\\,d = ${f(props.hubble)}\\ \\text{Gyr}^{-1} \\times ${f(d)}\\ \\text{Gly} \\\\ ` +
    `&= ${f(props.hubble * d)}\\,c \\end{aligned}`
  )
})

const friedmannExample = computed(() => {
  const c = props.cosmology
  const e = props.a > 1e-6 ? expansionFactor(c, props.a) : null
  const omegaK = 1 - c.omegaR - c.omegaM - c.omegaL
  const terms = [
    c.omegaR ? `${f(c.omegaR, 2)}\\,a^{-4}` : '',
    c.omegaM ? `${f(c.omegaM, 3)}\\,a^{-3}` : '',
    Math.abs(omegaK) > 1e-10 ? `${f(omegaK, 3)}\\,a^{-2}` : '',
    c.omegaL ? `${f(c.omegaL, 3)}` : '',
  ].filter(Boolean)
  // One term per line so it fits on a phone.
  return (
    `\\begin{aligned} \\frac{H^2}{H_0^2} &= ${terms.join(' \\\\ &\\quad + ')} \\\\ ` +
    (e === null ? '' : `&= ${f(e * e)} \\quad (a = ${f(props.a)}) `) +
    `\\end{aligned}`
  )
})

const age = computed(() => (props.expansion.hasBigBang ? props.expansion.tToday : null))
const hubbleTime = computed(() => 1 / hubbleRateToday(props.cosmology))
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>
        {{ tx('In the standard cosmological model, the scale factor') }} <strong><MathFormula tex="a(t)" /></strong> {{ tx('describes how the proper distance between galaxies that follow the general cosmic expansion (and are not gravitationally or otherwise bound) changes with time:') }}
      </p>
      <MathFormula display tex="d(t) = a(t)\,d_0" />
      <p>{{ tx('Here') }} <MathFormula tex="d_0" /> {{ tx('is the distance today, when') }} <MathFormula tex="a = 1" />. {{ tx('For your distant galaxy, right now:') }}</p>
      <MathFormula display :tex="distanceExample" />
      <h3>{{ tx('Hubble’s law follows') }}</h3>
      <p>
        {{ tx('For galaxies following the general cosmic expansion, the rate at which their proper distance changes is proportional to that distance: a galaxy twice as far away has twice the recession rate. This is') }} <strong>{{ tx('Hubble’s law') }}</strong>:
      </p>
      <MathFormula display tex="v = H\,d" />
      <h3>{{ tx('Light is stretched too') }}</h3>
      <p>
        {{ tx('As the universe evolves, the wavelength of light measured by observers following the cosmic expansion increases in proportion to the scale factor. This cosmological redshift is a consequence of the changing spacetime geometry—not light being dragged through a stretching material. Light emitted when the scale factor was') }} <MathFormula tex="a" /> {{ tx('therefore has a wavelength today larger by a factor') }} <MathFormula tex="1/a" />:
      </p>
      <MathFormula display tex="1 + z = \frac{1}{a}" />
      <InfoCallout kind="physics" :title="tx('Key idea')">
        <p>
          {{ tx('There is no central explosion or preferred centre. In the idealized FLRW model, proper distances between comoving, unbound galaxies increase as the scale factor changes. This describes the geometry of spacetime; it does not mean space is a material substance flowing or stretching galaxies. Each such galaxy sees the same large-scale pattern.') }}
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>{{ tx('Hubble’s law from the scale factor') }}</h3>
      <MathFormula display tex="\begin{aligned} d &= a(t)\,d_0 \\ \Longrightarrow\; \dot d &= \dot a\,d_0 = \frac{\dot a}{a}\,d = H\,d \end{aligned}" />
      <p>{{ tx('with the Hubble rate') }} <MathFormula tex="H \equiv \dot a / a" />.</p>
      <p v-if="hubbleExample">{{ tx('For your distant galaxy now (with') }} <MathFormula tex="c = 1\ \text{Gly/Gyr}" />):</p>
      <MathFormula v-if="hubbleExample" display :tex="hubbleExample" />
      <p>
        {{ tx('Here') }} <MathFormula tex="v = H d" /> {{ tx('is the rate of change of proper distance on constant-cosmic-time slices (the recession rate), not a local measurement of a galaxy moving past a nearby observer. Beyond the') }} <strong>{{ tx('Hubble distance') }}</strong> <MathFormula tex="c/H" />, {{ tx('this rate can exceed') }} <MathFormula tex="c" />. {{ tx('That does not violate relativity: no nearby observer measures a passing galaxy or light signal moving through their local space faster than light.') }}
      </p>

      <h3>{{ tx('The Friedmann equation') }}</h3>
      <p>{{ tx('General relativity relates the expansion rate to what the universe contains:') }}</p>
      <MathFormula display tex="H^2 = H_0^2\left(\Omega_r\,a^{-4} + \Omega_m\,a^{-3} + \Omega_k\,a^{-2} + \Omega_\Lambda\right)" />
      <MathFormula display :tex="friedmannExample" />
      <p>
        {{ tx('Radiation dilutes as') }} <MathFormula tex="a^{-4}" /> {{ tx('(fewer photons per volume, and each one stretched), matter as') }} <MathFormula tex="a^{-3}" />, {{ tx('and dark energy not at all. Each on its own gives') }}
        <MathFormula tex="a \propto t^{1/2}" />, <MathFormula tex="a \propto t^{2/3}" /> {{ tx('and') }} <MathFormula tex="a \propto e^{Ht}" />.
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>{{ tx('The FLRW metric: space evolving in time') }}</h3>
      <MathFormula display tex="ds^2 = -c^2 dt^2 + a(t)^2\,\gamma_{ij}^{(k)}\,dx^i dx^j" />
      <p>
        {{ tx('Here') }} <MathFormula tex="\gamma_{ij}^{(k)}" /> {{ tx('is a time-independent, maximally symmetric 3-dimensional spatial metric with constant curvature. Its scalar curvature on a constant-time slice is') }} <MathFormula tex="{}^{(3)}R = 6k/a(t)^2" />. {{ tx('The flat special case') }} <MathFormula tex="k = 0" /> {{ tx('has') }} <MathFormula tex="\gamma_{ij}^{(0)} = \delta_{ij}" />, {{ tx('giving the simpler metric') }}
        <MathFormula tex="ds^2 = -c^2 dt^2 + a(t)^2\,\delta_{ij}\,dx^i dx^j" />.
      </p>
      <p>
        {{ tx('In the ADM 3 + 1 language of “Space and time versus spacetime” and “Gravity and clock rates”: the lapse is') }} <MathFormula tex="N = 1" />, {{ tx('the shift is zero, and the spatial metric is') }} <MathFormula tex="g_{ij} = a(t)^2\,\gamma_{ij}^{(k)}" />. {{ tx('Clocks of all comoving galaxies tick at the same rate; the spatial geometry may be flat, positively curved, or negatively curved.') }}
      </p>

      <h3>{{ tx('The age of the universe') }}</h3>
      <MathFormula display tex="t_0 = \int_0^1 \frac{da}{a\,H(a)}" />
      <p v-if="age !== null">
        {{ tx('For this model,') }} <MathFormula :tex="`t_0 = ${f(age)}\\ \\text{Gyr}`" />, {{ tx('compared with the Hubble time') }}
        <MathFormula :tex="`1/H_0 = ${f(hubbleTime)}\\ \\text{Gyr}`" />.
      </p>
      <p v-else>{{ tx('This model has no Big Bang: going backwards,') }} <MathFormula tex="a" /> {{ tx('shrinks exponentially but never reaches zero.') }}</p>

      <h3>{{ tx('Slowing down or speeding up') }}</h3>
      <MathFormula display tex="q = -\frac{a\,\ddot a}{\dot a^2} = \frac{\Omega_r a^{-4} + \tfrac12\Omega_m a^{-3} - \Omega_\Lambda}{H^2/H_0^2}" />
      <p>
        <MathFormula tex="q > 0" /> {{ tx('means the expansion is slowing;') }} <MathFormula tex="q < 0" />, {{ tx('speeding up. The transition is found by solving') }}
        <MathFormula tex="\Omega_r + \tfrac12\Omega_m a - \Omega_\Lambda a^4 = 0" /> {{ tx('for its positive root. If radiation is negligible, this reduces to') }} <MathFormula tex="a = (\Omega_m / 2\Omega_\Lambda)^{1/3}" />.
      </p>

      <h3>{{ tx('Where the model ends') }}</h3>
      <p>
        {{ tx('As') }} <MathFormula tex="a \to 0" /> {{ tx('the density grows as') }} <MathFormula tex="a^{-3}" /> {{ tx('or faster and becomes infinite. The singularity theorems of Penrose and Hawking show that, given classical general relativity and ordinary matter, this cannot be avoided. Most physicists read it as the point where classical general relativity stops applying, not as a physical event. In canonical quantum gravity, the Wheeler–DeWitt equation') }} <MathFormula tex="\hat H\,\Psi = 0" /> {{ tx('contains no time variable at all: this is the') }} <strong>{{ tx('problem of time') }}</strong>. {{ tx('One proposal is that time emerges, for example with the scale factor itself acting as a clock.') }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}
</style>
