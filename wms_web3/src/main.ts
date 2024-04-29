import '@/assets/css/global.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'



const app = createApp(App)

app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(createPinia())
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }


app.mount('#app')
