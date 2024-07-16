import { App, Component } from 'vue';
// 引入 element-plus提供的所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import Category from './Category/index.vue';

const components: { [name: string]: Component } = { SvgIcon, Pagination, Category };
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
    // 将 element-plus 提供的图标注册为全局组件
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
