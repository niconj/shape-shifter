import Vue from 'vue';
import App from './App.vue';
import store from './store';
import VueKonva from 'vue-konva';

Vue.config.productionTip = false;
Vue.use(VueKonva);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
