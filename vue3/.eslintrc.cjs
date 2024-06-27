module.exports = {
  settings: {
    'import/resolver': {
      'node': {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      alias: {
        map: [
          ['@', "./src"]
        ],
        // 告诉resolver-alias有哪些后缀的文件要解析
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },

  // 继承某些已有的规则
  extends: [

    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'airbnb-base',
    'plugin:prettier/recommended',
    // './.eslintrc-auto-import.json',
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    // @typescript-eslint/parser 和 eslint-import-resolver-typescript
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    'vue',
    '@typescript-eslint',
    // @typescript-eslint/parser 和 eslint-import-resolver-typescript
    'eslint-plugin-import',
  ],
  /**
   * "off" 或 0  ==>  关闭规则
   * "warn" 或 1 ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2 ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': true,
    }],
    // eslint (https://eslint.bootcss.com/docs/rules/)
    'no-var': 'error',  // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['warn', { max: 1 }],    //  不允许多个空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'off',   // 禁止不必要的转义字符

    // typeScript (https://typescript-eslint.io/rules
    '@typescript-eslint/no-unused-vars': 'error',   // 禁止定义未使用的变量
    '@typescript-eslint/prefer-ts-expect-error': 'error',   // 禁止使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off',   // 禁止使用 any 类型
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off',   // 禁止使用自定义 TypeScript 模块的命名空间.
    '@typescript-eslint/semi': 'warn',

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    'vue/multi-word-component-names': 'off',    // 要求组件名始终为 "-" 链接的单词
    'vue/script-setup-uses-vars': 'error',  // 防止 <script setup>使用的变量 <template>被标记为未使用
    'vue/no-mutating-props': 'off', // 不允许组建 prop 的改变
    'vue/attribute-hyphenation': 'off', // 对模版中的自定义组件强制执行属性命名样式
  }
};

