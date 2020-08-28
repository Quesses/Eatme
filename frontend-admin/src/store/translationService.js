
import axios from 'axios'

export default ({
  namespaced: true,
  state: {
    missingTranslationsCount: 0,
    translations: []
  },
  getters: {
    missingTranslationsCount (state) {
      return state.missingTranslationsCount
    },
    translations (state) {
      return state.translations
    }
  },
  mutations: {
    SET_MISSING_TRANSLATION_COUNT (state, data) {
      state.missingTranslationsCount = data
    },
    SET_TRANSLATIONS (state, data) {
      state.translations = data
    }
  },
  actions: {
    async fetchMissingTranslationsCount ({ commit, rootState }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/translations/count`)
        commit('SET_MISSING_TRANSLATION_COUNT', response.data.countOfMissingTranslations)
        return 1
      } catch (err) {
        console.log(`Fetching count of missing translations error: ${err}`)
        return 0
      }
    },
    async fetchTranslations ({ commit, rootState }) {
      const origin = rootState.origin
      try {
        const response = await axios.get(`${origin}/translations`)
        commit('SET_TRANSLATIONS', response.data.translations)
        return 1
      } catch (err) {
        console.log(`Fetching translations error: ${err}`)
      }
    },
    getTranslation ({ state }, translationId) {
      return state.translations.find(translation => { return translation.id === parseInt(translationId, 10) })
    },
    async update ({ rootState, dispatch }, phrase) {
      const origin = rootState.origin
      try {
        await axios.post(`${origin}/translations/update`, { phrase: phrase })
        dispatch('translationService/fetchMissingTranslationsCount', {}, { root: true })
        return { updateSucceeded: true }
      } catch (err) {
        console.log(err)
        return { updateSucceeded: false, error: err.response.data }
      }
    }
  }
})
