// 路由鉴权
import router from '@/router/index.ts';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useUserStore from '@/store/modules/user.ts';
import pinia from '@/store/index.ts';
import setting from '@/setting.ts';

const userStore = useUserStore(pinia);
nProgress.configure({ showSpinner: false });
// 全局首位: 项目当中任意路由切换都会触发的枸杞
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // console.log('before', to, from);
  nProgress.start();
  const { token, username, avatar } = userStore;
  if (token) {
    if (to.path === '/login') {
      next({ path: from.path });
    } else if (!username || !avatar) {
      try {
        await userStore.userInfo();
        next();
      } catch (e) {
        await userStore.userLogout();
        next({ path: '/login', query: { redirect: to.path } });
      }
    } else {
      next();
    }
  } else if (to.path === '/login') {
    next();
  } else {
    next({ path: '/login', query: { redirect: to.path } });
  }
});

// 全局后置守卫
router.afterEach((to: any) => {
  // console.log('after', to, from);
  document.title = `${setting.title}-${to.meta.title}`;
  nProgress.done();
});
