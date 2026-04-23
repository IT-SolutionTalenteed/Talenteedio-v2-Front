import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import CKEditor from '@ckeditor/ckeditor5-vue'
import VueApexCharts from 'vue3-apexcharts'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Import custom styles (après Vuetify pour priorité CSS)
import './assets/scss/main.scss'
import './assets/admin-custom.css'
import './assets/section-headers.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
    },
  },
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(CKEditor)
app.use(vuetify)
app.component('apexchart', VueApexCharts)

app.mount('#app')
