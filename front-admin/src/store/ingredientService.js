import axios from 'axios'
import sharedMutations from 'vuex-shared-mutations'

export default ({
  namespaced: true,
  state: {
    ingredients: [],
    ingredientToRemove: {
      id: null,
      dishes: [],
      types: []
    }
  },
  getters: {
    ingredients (state) {
      return state.ingredients
    },
    ingredientToRemove (state) {
      return state.ingredientToRemove
    }
  },
  mutations: {
    SET_INGREDIENTS (state, data) {
      state.ingredients = data
    },
    SET_INGREDIENT_TO_REMOVE (state, data) {
      state.ingredientToRemove = data
    }
  },
  actions: {
    async fetchIngredients ({ rootState, commit }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/ingredients`)
        commit('SET_INGREDIENTS', response.data.ingredients)
        return 1
      } catch (err) {
        console.log(`Fetching ingredients error: ${err}`)
        return 0
      }
    },
    async getIngredientById ({ rootState, commit }, id) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/ingredients/${id}`)
        commit('SET_INGREDIENT_TO_REMOVE', response.data.ingredient)
      } catch (err) {
        console.log(`Getting ingredient by id error: ${err}`)
      }
    },
    async removeIngredientById ({ rootState }, id) {
      const origin = rootState.origin
      try {
        await axios.delete(`${origin}/ingredients/${id}`)
        return { removeSucceeded: true }
      } catch (err) {
        return { removeSucceeded: false, error: err.response.data }
      }
    }
  },
  plugins: [
    sharedMutations({
      predicate: ['SET_INGREDIENT_TO_REMOVE', 'CLEAR_INGREDIENT_TO_REMOVE']
    })
  ]
})
