<script setup lang="ts">
  import useUserStore from '@/store/modules/user.ts';
  import { getTime } from '@/utils/time.ts';

  const userStore = useUserStore();
</script>

<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" class="avatar" alt="用户图片" />
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好呀,{{ userStore.username }}</h3>
          <p class="subTitle">WMS后台管理系统</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .box {
    display: flex;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .bottom {
      margin-left: 20px;

      .title {
        font-size: 30px;
        font-weight: 900;
        margin-bottom: 30px;
      }

      .subTitle {
        font-style: italic;
        color: skyblue;
      }
    }
  }

  .bottoms {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
</style>
