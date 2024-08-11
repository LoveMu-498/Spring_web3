<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import moment from 'moment';

  const $router = useRouter();

  const time = ref<string>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const timer = ref(0);

  onMounted(() => {
    timer.value = setInterval(() => {
      time.value = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });

  const goHome = () => {
    $router.push('/');
  };
</script>

<template>
  <div class="top">
    <div class="left"><span class="l_btn btn" @click="goHome">首页</span></div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="r_btn btn">统计报告</span>
      <div class="time">当前时间:{{ time }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .top {
    width: 100%;
    height: 40px;
    display: flex;

    .left,
    .right {
      flex: 1.5;
      .btn {
        height: 40px;
        width: 150px;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
        color: #29fcff;
        cursor: pointer;
      }
    }
    .left {
      background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
      background-size: cover;
      .l_btn {
        float: right;
        background-size: 100% 100%;
        background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      }
    }
    .right {
      background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .r_btn {
        float: left;
        background-size: 100% 100%;
        background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      }
      .time {
        color: #29fcff;
        font-size: 15px;
      }
    }
    .center {
      flex: 3;
      .title {
        width: 100%;
        height: 74px;
        background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 74px;
        color: #29fcff;
        font-size: 30px;
      }
    }
  }
</style>
