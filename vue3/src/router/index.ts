// 通过 vue-router 插件实现模版路由配置
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from '@/router/routes.ts';
// 创建路由器
const router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;
