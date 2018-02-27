import Vue from 'vue';
import Router from 'vue-router';
import CalendarComponent from '../components/calendar/calendar.component';
import TodoComponent from '../components/todo/todo.component';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/home',
      name: 'home',
      component: CalendarComponent
    },
    {
      path: '/todo',
      name: 'todo',
      component: TodoComponent
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});
