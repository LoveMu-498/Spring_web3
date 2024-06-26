import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from '@/App.vue';
import 'element-plus/dist/index.css';
// @ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
// eslint-disable-next-line import/extensions
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';
// eslint-disable-next-line import/extensions
import components from '@/components';
import '@/styles/index.scss';
import router from '@/router/index.ts';
import pinia from '@/store/index.ts';
import '@/permisstion.ts';
// 引入路由鉴权文件

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

// console.log('env', import.meta.env);
// 引入自定义插件对象:注册整个项目全局组件
// console.log('global', gloalComponent);
app.use(components);
// app.component('SvgIcon', SvgIcon);
// 注册模版路由
app.use(router);
app.use(pinia);
app.mount('#app');
