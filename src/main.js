import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import mmToast from '@/base/mm-toast';
import store from '@/store/index.js'
import Icon from '@/base/mm-icon/mm-icon.vue'

import '@/styles/index.scss'
const app = createApp(App);

app.component('mmIcon',Icon)

app.use(router).use(store).use(mmToast).mount('#mmPlayer')

