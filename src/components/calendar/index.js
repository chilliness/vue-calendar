import CalendarComponent from './calendar.component.vue';

export default {
  install(Vue) {
    Vue.component('app-calendar', CalendarComponent);
  }
};
