import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css' // <-- บรรทัดนี้สำคัญมาก ต้องมีนะครับ

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')