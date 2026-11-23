import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
      path: '/mechanics/newtonian',
      name: 'newtonian',
      component: () => import('@/experiments/newtonian/NewtonianView.vue'),
      meta: { title: 'Force, mass and acceleration · Physica' },
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
      path: '/relativity/two-perspectives',
      name: 'two-perspectives',
      component: () => import('@/experiments/two-perspectives/TwoPerspectivesView.vue'),
      meta: { title: 'Space and time versus spacetime · Physica' },
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
  scrollBehavior: (to, from) => (to.path === from.path ? false : { top: 0 }),
})

router.afterEach((to) => {
  if (typeof to.meta.title === 'string') document.title = to.meta.title
})
