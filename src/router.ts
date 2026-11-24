import { watch } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { locale } from '@/i18n'
import { getForceLabDocumentTitle } from '@/experiments/force-lab/copy'
import { getLengthContractionDocumentTitle } from '@/experiments/length-contraction/copy'
import { getMomentumCollisionsDocumentTitle } from '@/experiments/momentum-collisions/copy'
import { getGeodesicMotionDocumentTitle } from '@/experiments/geodesic-motion/copy'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Physica' } },
    {
      path: '/teachers',
      name: 'teachers',
      component: () => import('@/views/TeacherGuideView.vue'),
      meta: { title: 'Teacher guide · Physica' },
    },
    {
      path: '/assessment-pilot',
      name: 'assessment-pilot',
      component: () => import('@/assessment/AssessmentPilotView.vue'),
      meta: { title: 'Learning assessment pilot · Physica' },
    },
    {
      path: '/mechanics/newtonian',
      name: 'newtonian',
      component: () => import('@/experiments/newtonian/NewtonianView.vue'),
      meta: { title: 'Force, mass and acceleration · Physica' },
    },
    {
      path: '/mechanics/momentum-collisions',
      name: 'momentum-collisions',
      component: () => import('@/experiments/momentum-collisions/MomentumCollisionsView.vue'),
      meta: { title: 'Momentum and collisions · Physica' },
    },
    {
      path: '/mechanics/force-lab',
      name: 'force-lab',
      component: () => import('@/experiments/force-lab/ForceLabView.vue'),
      meta: { title: 'Force Lab · Physica' },
    },
    {
      path: '/space/space-vs-time',
      name: 'space-vs-time',
      component: () => import('@/experiments/space-vs-time/SpaceVsTimeView.vue'),
      meta: { title: 'Space versus time · Physica' },
    },
    {
      path: '/relativity/moving-clocks',
      name: 'moving-clocks',
      component: () => import('@/experiments/moving-clocks/MovingClocksView.vue'),
      meta: { title: 'Different clocks, different elapsed times · Physica' },
    },
    {
      path: '/relativity/length-contraction',
      name: 'length-contraction',
      component: () => import('@/experiments/length-contraction/LengthContractionView.vue'),
      meta: { title: 'Length Contraction Lab · Physica' },
    },
    {
      path: '/relativity/two-perspectives',
      name: 'two-perspectives',
      component: () => import('@/experiments/two-perspectives/TwoPerspectivesView.vue'),
      meta: { title: 'Space and time versus spacetime · Physica' },
    },
    {
      path: '/gravity/geodesic-motion',
      name: 'geodesic-motion',
      component: () => import('@/experiments/geodesic-motion/GeodesicMotionView.vue'),
      meta: { title: 'Geodesic Motion Lab · Physica' },
    },
    {
      path: '/gravity/clock-rates',
      name: 'gravity-clocks',
      component: () => import('@/experiments/gravity-clocks/GravityClocksView.vue'),
      meta: { title: 'Gravity and clock rates · Physica' },
    },
    {
      path: '/cosmology/evolving-space',
      name: 'evolving-space',
      component: () => import('@/experiments/evolving-space/EvolvingSpaceView.vue'),
      meta: { title: 'Evolving space · Physica' },
    },
    {
      path: '/mechanics/projectile',
      name: 'projectile',
      component: () => import('@/experiments/projectile/ProjectileView.vue'),
      meta: { title: 'Projectile launcher · Physica' },
    },
    {
      path: '/time/pendulum',
      name: 'pendulum',
      component: () => import('@/experiments/pendulum/PendulumClocksView.vue'),
      meta: { title: 'Pendulum clocks · Physica' },
    },
    {
      path: '/space/displacement-3d',
      name: 'displacement-3d',
      component: () => import('@/experiments/displacement3d/Displacement3DView.vue'),
      meta: { title: 'Displacement in 3D · Physica' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: (to, from) => {
    if (to.hash) return { el: to.hash, top: 24 }
    return to.path === from.path ? false : { top: 0 }
  },
})

function updateDocumentTitle(): void {
  const currentRoute = router.currentRoute.value
  if (currentRoute.name === 'force-lab') {
    document.title = getForceLabDocumentTitle(locale.value)
  } else if (currentRoute.name === 'length-contraction') {
    document.title = getLengthContractionDocumentTitle(locale.value)
  } else if (currentRoute.name === 'momentum-collisions') {
    document.title = getMomentumCollisionsDocumentTitle(locale.value)
  } else if (currentRoute.name === 'geodesic-motion') {
    document.title = getGeodesicMotionDocumentTitle(locale.value)
  } else if (typeof currentRoute.meta.title === 'string') {
    document.title = currentRoute.meta.title
  }
}

router.afterEach(updateDocumentTitle)

// Keep the Force Lab title in sync when the language changes without navigation.
watch(locale, () => {
  if (['force-lab', 'length-contraction', 'momentum-collisions', 'geodesic-motion'].includes(String(router.currentRoute.value.name))) updateDocumentTitle()
})
