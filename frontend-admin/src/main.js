import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas)

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <svg>.'
Vue.config.warnHandler = function (msg, vm, trace) {
  if (msg !== ignoreWarnMessage) {
    console.error('[Vue warn]: ' + msg + trace)
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
