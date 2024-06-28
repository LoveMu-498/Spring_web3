// 对外暴露配置路由(常量路由)

// eslint-disable-next-line import/prefer-default-export
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    // 命名路由
    name: 'login',
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    // 命名路由
    name: 'layout',
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    // 命名路由
    name: '404',
  },
  {
    // 任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
  },
];
