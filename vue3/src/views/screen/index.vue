<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import Top from './components/top/index.vue';
  import Age from './components/age/index.vue';
  import Sex from './components/sex/index.vue';
  import Tourist from './components/tourist/index.vue';

  const screenRef = ref<HTMLDivElement | null>(null);

  function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w;
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh;
  }

  onMounted(() => {
    screenRef.value!.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
  });

  window.onresize = () => {
    screenRef.value!.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
  };
</script>

<template>
  <div class="container">
    <div ref="screenRef" class="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    background: url('./images/bg.png') no-repeat;
    background-size: cover;

    .screen {
      position: fixed;
      width: 1920px;
      height: 1080px;
      transform-origin: left top;
      left: 50%;
      top: 50%;

      .top {
        width: 100%;
        height: 40px;
      }

      .bottom {
        display: flex;
        .right,
        .left {
          flex: 1;
          height: 1040px;
        }
        .left {
          display: flex;
          flex-direction: column;

          .tourist {
            flex: 1.5;
          }
          .sex {
            flex: 1;
          }
          .age {
            flex: 1;
          }
        }
        .center {
          flex: 2;
        }
      }
    }
  }
</style>
