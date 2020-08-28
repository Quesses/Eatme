import Vue from 'vue'
import Vuex from 'vuex'
import dishService from './dishService'
import ingredientService from './ingredientService'
import translationService from './translationService'
import typeService from './typeService'
import menuService from './menuService'

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
    dishService,
    ingredientService,
    translationService,
    typeService,
    menuService
  }
})
