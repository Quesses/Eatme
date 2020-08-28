<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="typeForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">{{ originalTranslation.source | capitalizeFirstLetter }} {{ originalTranslation.phrase | capitalizeFirstLetter }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="centerRow" v-for="trans in translationForm.translations" :key="trans.lang">
              <v-col cols="12" sm="8" md="9">
                <v-text-field
                  style="margin-left: 30px"
                  :disabled="loading"
                  v-model="trans.translation"
                  autocomplete="off"
                  :label="`${capitalizeFirstLetter(trans.language.label)} translation`">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link  :to="{ name: 'Translations' }" >
            <v-btn color="blue darken-1" text >Close</v-btn>
          </router-link>
          <v-btn color="blue darken-1" text @click="formSubmit" :disabled="!formValidate || !isFormEdited || loading" >save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
export default {
  name: 'FormEditIngredient',
  props: {
    translationId: String
  },
  mixins: [stringFormatMixin],
  data: () => ({
    loading: false,
    formValidate: null,
    isFormEdited: false,
    originalTranslation: {
      phrase: 'Phrase',
      source: ''
    },
    translationForm: {
      id: null,
      translations: []
    }
  }),
  created: async function () {
    this.loading = true
    await this.fetchTranslations()
    this.originalTranslation = await this.getTranslation(this.translationId)
    this.translationForm.id = this.originalTranslation.id
    this.translationForm.translations = JSON.parse(JSON.stringify(this.originalTranslation.translations))
    this.loading = false
  },
  watch: {
    'translationForm.translations': {
      handler: function () {
        /** @type {{translation: string, lang: string}[]} translations */
        const translations1 = this.originalTranslation.translations
        const translations2 = this.translationForm.translations
        this.isFormEdited = false

        for (const tIndex in translations1) {
          const translation1 = translations1[tIndex].translation
          const translation2 = translations2[tIndex].translation
          const translationsAreDifferent = translation1 !== translation2 && (!!translation1 || !!translation2)
          if (translationsAreDifferent) {
            this.isFormEdited = true
            return 1
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      fetchTranslations: 'translationService/fetchTranslations',
      getTranslation: 'translationService/getTranslation',
      updateTranslation: 'translationService/update'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true
      this.translationForm.translations.forEach(trans => {
        trans.translation = this.toLowerCaseAndTrim(trans.translation)
      })
      const editTranslation = await this.updateTranslation(this.translationForm)
      if (editTranslation.updateSucceeded) {
        this.fetchTranslations()
        this.$router.push({ name: 'Translations', params: { snackbar: `${this.capitalizeFirstLetter(this.originalTranslation.phrase)} Edited!` } })
      } else {
        console.log(editTranslation.error)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="sass">
.centerRow
  margin-left: 30px
</style>
