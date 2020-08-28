import axios from 'axios'
export default ({
  namespaced: true,
  state: {
    types: [],
    typeToRemove: {
      id: null,
      dishes: []
    }
  },
  getters: {
    types (state) {
      return state.types
    },
    typeToRemove (state) {
      return state.typeToRemove
    }
  },
  mutations: {
    SET_TYPES (state, data) {
      state.types = data
    },
    SET_TYPE_TO_REMOVE (state, data) {
      state.typeToRemove = data
    }
  },
  actions: {
    async create ({ rootState, dispatch }, newType) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/types`, { type: newType })
        dispatch('translationService/fetchMissingTranslationsCount', {}, { root: true })
        return { creationSucceeded: true }
      } catch (err) {
        console.log(err.response.data)
        return { creationSucceeded: false, error: err.response.data }
      }
    },
    async update ({ rootState, dispatch }, type) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/types/update`, { type: type })
        dispatch('translationService/fetchMissingTranslationsCount', {}, { root: true })
        return { updateSucceeded: true }
      } catch (err) {
        return { updateSucceeded: false, error: err.response.data }
      }
    },
    async getType ({ state, dispatch }, typeId) {
      if (!state.types.length) {
        await dispatch('fetchTypes')
      }
      return await state.types.find(type => { return type.id === parseInt(typeId, 10) })
    },
    async getTypeByName ({ state, dispatch }, typeName) {
      if (!state.types.length) {
        await dispatch('fetchTypes')
      }
      typeName = typeName.toString()
      return await state.types.find(type => { return type.name === typeName })
    },
    async fetchTypes ({ rootState, commit }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/types`)
        commit('SET_TYPES', response.data.types)
        return 1
      } catch (err) {
        console.log(`Fetching types error: ${err}`)
        return 0
      }
    },
    async getTypeById ({ rootState, commit }, id) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/types/${id}`)
        commit('SET_TYPE_TO_REMOVE', response.data.type)
      } catch (err) {
        console.log(`Getting type by id error: ${err}`)
      }
    },
    async removeTypeById ({ rootState }, id) {
      const origin = rootState.origin
      try {
        await axios.delete(`${origin}/types/${id}`)
        return { removeSucceeded: true }
      } catch (err) {
        return { removeSucceeded: false, error: err.response.data }
      }
    }
  }
})
