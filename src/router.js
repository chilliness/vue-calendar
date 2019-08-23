import Vue from 'vue';
import Router from 'vue-router';
import Calendar from '@/components/calendar/index.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import('@/components/todo/index.vue')
    },
    {
      path: '*',
      redirect: '/calendar'
    }
  ]
});
