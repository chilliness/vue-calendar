import TodoComponent from './todo.component.vue';

export default {
  install(Vue) {
    Vue.component('app-todo', TodoComponent);
  }
};
