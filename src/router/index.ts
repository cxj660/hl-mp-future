import { createRouter, createWebHashHistory } from 'vue-router'
import com from '@/views/com.vue'
import home from '@/views/home.vue'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/com', component: com },
    { path: '/home', component: home }
  ]
})
