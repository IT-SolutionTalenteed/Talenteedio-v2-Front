import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import CKEditor from '@ckeditor/ckeditor5-vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Import custom styles
import './assets/scss/main.scss'
import './assets/admin-custom.css'

const app = createApp(App)

// Setup Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(CKEditor)

app.mount('#app')
