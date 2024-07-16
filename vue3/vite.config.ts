import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
// 引入 svg 需要用到的插件
// eslint-disable-next-line import/no-extraneous-dependencies
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';
// eslint-disable-next-line import/no-extraneous-dependencies
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下的对应变量
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        // 保证开发阶段可以使用 mock 接口
        enable: command === 'serve',
        watchFiles: true,
        // enable: true,
        logger: true,
      }),
      VueSetupExtend(),
    ],
    resolve: {
      alias: {
        // 相对路径别名配置, 使用 @ 代替 src
        '@': path.resolve('./src'),
      },
    },
    // scss 全局变量一个配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
