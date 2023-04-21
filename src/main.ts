import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import pinia from './store';

import './permission';

import 'virtual:svg-icons-register';

import '~/styles/index.scss';
import 'uno.css';

// If you want to use ElMessage, import it.
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'
import 'element-plus/es/components/loading/style/index'

const app = createApp(App);
app.use(router);
app.use(pinia);

// app.use(ElementPlus);
app.mount('#app');
