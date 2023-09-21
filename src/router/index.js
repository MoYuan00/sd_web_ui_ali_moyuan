import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sd-home',
      component: () => import('../views/Main.vue')
    },
    {
      path: '/view',
      name: 'sd-view',
      component: () => import('../views/ImgViewAndEdit.vue')
    },
    {
      path: '/history',
      name: 'sd-history',
      component: () => import('../views/HistoryView.vue')
    }
    ,
    {
      path: '/3D',
      name: '3D',
      component: () => import('../views/3D.vue')
    }
    ,
    {
      path: '/flex',
      name: 'flex',
      component: () => import('../views/flex.vue')
    }
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

window.router = router