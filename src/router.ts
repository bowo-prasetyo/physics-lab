import { watch } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { locale } from '@/i18n'
import { documentTitle } from '@/documentTitle'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/learning', name: 'learning', component: () => import('@/learning/LearningPathView.vue') },
    // The Problem-Solving Lab's problems now sit in the learning path's "Apply it" steps.
    { path: '/problem-solving', redirect: '/learning' },
    {
      path: '/teachers',
      name: 'teachers',
      component: () => import('@/views/TeacherGuideView.vue'),
    },
    {
      path: '/assessment-pilot',
      name: 'assessment-pilot',
      component: () => import('@/assessment/AssessmentPilotView.vue'),
    },
    {
      path: '/mechanics/newtonian',
      name: 'newtonian',
      component: () => import('@/experiments/newtonian/NewtonianView.vue'),
    },
    {
      path: '/mechanics/momentum-collisions',
      name: 'momentum-collisions',
      component: () => import('@/experiments/momentum-collisions/MomentumCollisionsView.vue'),
    },
    {
      path: '/mechanics/force-lab',
      name: 'force-lab',
      component: () => import('@/experiments/force-lab/ForceLabView.vue'),
    },
    {
      path: '/space/space-vs-time',
      name: 'space-vs-time',
      component: () => import('@/experiments/space-vs-time/SpaceVsTimeView.vue'),
    },
    {
      path: '/relativity/moving-clocks',
      name: 'moving-clocks',
      component: () => import('@/experiments/moving-clocks/MovingClocksView.vue'),
    },
    {
      path: '/relativity/length-contraction',
      name: 'length-contraction',
      component: () => import('@/experiments/length-contraction/LengthContractionView.vue'),
    },
    {
      path: '/relativity/two-perspectives',
      name: 'two-perspectives',
      component: () => import('@/experiments/two-perspectives/TwoPerspectivesView.vue'),
    },
    {
      path: '/gravity/geodesic-motion',
      name: 'geodesic-motion',
      component: () => import('@/experiments/geodesic-motion/GeodesicMotionView.vue'),
    },
    {
      path: '/gravity/clock-rates',
      name: 'gravity-clocks',
      component: () => import('@/experiments/gravity-clocks/GravityClocksView.vue'),
    },
    {
      path: '/cosmology/evolving-space',
      name: 'evolving-space',
      component: () => import('@/experiments/evolving-space/EvolvingSpaceView.vue'),
    },
    {
      path: '/mechanics/circular-orbits',
      name: 'circular-orbits',
      component: () => import('@/experiments/circular-orbits/CircularOrbitsView.vue'),
    },
    {
      path: '/mechanics/projectile',
      name: 'projectile',
      component: () => import('@/experiments/projectile/ProjectileView.vue'),
    },
    {
      path: '/time/pendulum',
      name: 'pendulum',
      component: () => import('@/experiments/pendulum/PendulumClocksView.vue'),
    },
    {
      path: '/space/displacement-3d',
      name: 'displacement-3d',
      component: () => import('@/experiments/displacement3d/Displacement3DView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: (to, from) => {
    if (to.hash) return { el: to.hash, top: 24 }
    return to.path === from.path ? false : { top: 0 }
  },
})

function updateDocumentTitle(): void {
  const { path, name } = router.currentRoute.value
  document.title = documentTitle(path, name, locale.value)
}

router.afterEach(updateDocumentTitle)
// Keep the title in the selected language when it changes without navigation.
watch(locale, updateDocumentTitle)
