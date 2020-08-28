import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/plugins/i18n'
import FlagIcon from 'vue-flag-icon'
import vuetify from './plugins/vuetify'

Vue.use(FlagIcon)

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
