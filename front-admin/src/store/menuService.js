import axios from 'axios'
export default ({
  namespaced: true,
  state: {
    menu: []
  },
  getters: {
    menu (state) {
      return state.menu
    }
  },
  mutations: {
    SET_MENU (state, data) {
      state.menu = data
    }
  },
  actions: {
    async create ({ rootState, dispatch }, newMenuItem) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/menu`, { menuItem: newMenuItem })
        return { creationSucceeded: true }
      } catch (err) {
        console.log(err.response.data)
        return { creationSucceeded: false, error: err.response.data }
      }
    },
    async update ({ rootState, dispatch }, menuItem) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/menu/update`, { menuItem: menuItem })
        return { updateSucceeded: true }
      } catch (err) {
        return { updateSucceeded: false, error: err.response.data }
      }
    },
    async getMenuItem ({ state, dispatch }, menuItemId) {
      if (!state.menu.length) {
        await dispatch('fetchMenu')
      }
      return await state.menu.find(menuItem => { return menuItem.id === parseInt(menuItemId, 10) })
    },
    async fetchMenu ({ rootState, commit }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/menu`)
        commit('SET_MENU', response.data.menu)
        return 1
      } catch (err) {
        console.log(`Fetching menu error: ${err}`)
        return 0
      }
    },
    async removeMenuItemById ({ rootState }, id) {
      const origin = rootState.origin
      try {
        await axios.delete(`${origin}/menu/${id}`)
        return { removeSucceeded: true }
      } catch (err) {
        return { removeSucceeded: false, error: err.response.data }
      }
    }
  }
})
