import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sd-home',
      component: () => import('../views/Main.vue')
      // component: HomeView
    },
    // {
    //   path: '/',
    //   name: 'sd-home',
    //   component: () => import('../views/SD.vue')
    //   // component: HomeView
    // },
    // {
    //   path: '/sd',
    //   name: 'sd',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/SD.vue')
    // }
  ]
})

export default router
