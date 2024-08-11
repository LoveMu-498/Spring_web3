import pinia from '@/store/index.ts';
import useUserStore from '@/store/modules/user.ts';

const userStore = useUserStore();

// eslint-disable-next-line import/prefer-default-export
export function hasButton(app: any) {
  app.directive('has', {
    mounted: (el: any, binding: any) => {
      console.log(binding.value);
      console.log(userStore.buttons);
      console.log(userStore.buttons.includes(binding.value));
      if (!userStore.buttons.includes(binding.value)) {
        el.parentNode.removeChild(el);
      }
    },
  });
}
