import { createApp } from 'vue'
import './style.css'
import router from '@/router/index'
import App from './App.vue'
import '@/assets/styles/common.scss'
createApp(App).use(router).mount('#app')
