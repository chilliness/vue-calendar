import Vue from 'vue';
import App from './App';
import router from './router';
import CalendarComponent from './components/calendar';

import './common/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(CalendarComponent);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
