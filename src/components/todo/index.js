import index from './index.vue';

export default {
  install(Vue) {
    Vue.component('Todo', index);
  }
};
