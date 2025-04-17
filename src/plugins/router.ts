import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/pages/home.vue'
import ConverterView from '@/pages/converter.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/converter', component: ConverterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
