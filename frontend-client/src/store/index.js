import Vue from 'vue'
import Vuex from 'vuex'
import ordering from './ordering'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    origin: 'http://localhost:3000'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ordering
  }
})
