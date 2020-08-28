import axios from 'axios'
export default ({
  namespaced: true,
  state: {
    dishes: []
  },
  getters: {
    dishes (state) {
      return state.dishes
    }
  },
  mutations: {
    SET_DISHES (state, data) {
      state.dishes = data
    }
  },
  actions: {
    async create ({ rootState, dispatch }, newDish) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/dishes`, { dish: newDish })
        dispatch('translationService/fetchMissingTranslationsCount', {}, { root: true })
        return { creationSucceeded: true }
      } catch (err) {
        console.log(err.response.data)
        return { creationSucceeded: false, error: err.response.data }
      }
    },
    async update ({ rootState, dispatch, commit }, dish) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/dishes/update`, { dish: dish })
        dispatch('translationService/fetchMissingTranslationsCount', {}, { root: true })
        dispatch('fetchDishes')
        return { updateSucceeded: true }
      } catch (err) {
        return { updateSucceeded: false, error: err.response.data }
      }
    },
    async getDish ({ state }, dishId) {
      return await state.dishes.find(dish => dish.id === parseInt(dishId, 10))
    },
    async fetchDishes ({ rootState, commit }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/dishes`)
        commit('SET_DISHES', response.data.dishes)
        return 1
      } catch (err) {
        console.log(`Fetching dishes error: ${err}`)
        return 0
      }
    },
    async getDishById ({ rootState }, id) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/dishes/${id}`)
        return response.data.dish
      } catch (err) {
        console.log(`Getting dish by id error: ${err}`)
      }
    },
    async removeDishById ({ rootState }, id) {
      const origin = rootState.origin
      try {
        await axios.delete(`${origin}/dishes/${id}`)
        return { removeSucceeded: true }
      } catch (err) {
        return { removeSucceeded: false, error: err.response.data }
      }
    },
    async subscribe ({ rootState }) {
      const origin = rootState.origin
      const response = await axios.get(`${origin}/dishes/subscribe`)
      if (response.status === 502) {
        this.subscribe()
        return 0
      } else if (response.status !== 200) {
        console.log(response.statusText)
        this.subscribe()
        return 0
      } else {
        return 1
      }
    }
  }
})
