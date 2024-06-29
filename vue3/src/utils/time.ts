export const getTime = () => {
  let message = '';
  const hours = new Date().getHours();
  if (hours <= 9) {
    message = '上午';
  } else if (hours <= 18) {
    message = '下午';
  } else {
    message = '晚上';
  }
  return message;
};

export const uselessFunc = () => '无用方法';
