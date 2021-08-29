import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueEllipseProgress from 'vue-ellipse-progress'
import vuetify from './plugins/vuetify'
import vueSmoothScroll from 'vue-smoothscroll'
import Axios from 'axios'
import VueCollapse from "vue2-collapse";
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css';


Vue.config.productionTip = false
Vue.use(VueEllipseProgress);
Vue.use(vueSmoothScroll)
Vue.use(Vuetify)
Vue.use(VueCollapse)

Axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
