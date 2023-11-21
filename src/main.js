import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import mmToast from '@/base/mm-toast';
import store from '@/store/index.js'
import Icon from '@/base/mm-icon/mm-icon.vue'
import VueLazyload from 'vue-lazyload'
import '@/styles/index.scss'
import defaultImg from '@/assets/images/default.png'
import fastclick from 'fastclick';
const app = createApp(App);

app.component('mmIcon',Icon);

app.use(VueLazyload, {
    preload: 1.3,
    loading: defaultImg
})

// 优化移动端300ms点击延迟
fastclick(document.body);

app.use(router).use(store).use(mmToast).mount('#mmPlayer');

