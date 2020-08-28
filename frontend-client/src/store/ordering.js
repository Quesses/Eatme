import axios from 'axios'

export default ({
  namespaced: true,
  state: {
    availableTypes: [],
    menu: null
  },
  getters: {
    availableTypes (state) {
      return state.availableTypes
    },
    menu (state) {
      return state.menu
    }
  },
  mutations: {
    SET_TYPES (state, data) {
      state.availableTypes = data
    },
    SET_MENU (state, data) {
      state.menu = data
    }
  },
  actions: {
    async fetchMenuItemsOfType ({ rootState, commit }, type) {
      const origin = rootState.origin
      const response = await axios.get(`${origin}/restaurant/menu/${type}`)
      commit('SET_MENU', response.data.menu)
    },
    async fetchAvailableTypes ({ rootState, commit }) {
      const origin = rootState.origin
      const response = await axios.get(`${origin}/restaurant/types`)
      commit('SET_TYPES', response.data.types)
    }
  }
})
