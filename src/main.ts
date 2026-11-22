import { createApp } from 'vue'
import 'katex/dist/katex.min.css'
import './styles/main.css'
import './styles/lesson.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
