// 小仓库: layout 组件相关配置
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useLayoutSettingStore = defineStore('SettingStore', () => {
  const fold = ref(false);
  const refresh = ref(false);

  function changeFold() {
    fold.value = !fold.value;
  }

  function updateRefresh() {
    refresh.value = !refresh.value;
  }

  return { fold, changeFold, refresh, updateRefresh };
});

export default useLayoutSettingStore;
