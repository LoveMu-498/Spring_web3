<script setup lang="ts" name="Menu">
  // import Menu from '@/layout/menu/index.vue';
  // 获取父组件传递过来全部路由数组
  defineProps(['menuList']);
</script>

<template>
  <el-menu-item v-if="menuList === undefined || menuList.length == 0" :key="-1">
    <template #title>这里空空如也</template>
  </el-menu-item>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item v-if="!item.meta.hidden" :key="item.path" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon" />
          </el-icon>
          <span> {{ item.meta.title }} </span>
        </template>
      </el-menu-item>
    </template>
    <template v-else-if="item.children.length == 1">
      <!-- 有且只有一个 子路由 -->
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :key="item.children[0].path"
        :index="item.children[0].path"
      >
        <template #title>
          <el-icon>
            <component :is="item.children[0].meta.icon" />
          </el-icon>
          <span> {{ item.children[0].meta.title }} </span>
        </template>
      </el-menu-item>
    </template>
    <template v-else>
      <!-- 多个子路由 -->
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon" />
          </el-icon>
          <span> {{ item.meta.title }} </span>
        </template>
        <Menu :menuList="item.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<style scoped></style>
