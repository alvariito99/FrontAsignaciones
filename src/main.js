import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.css'

createApp(App).use(store).use(router).mount('#app')


import 'bootstrap/dist/js/bootstrap.js'