<template>
  <v-card>
    <router-view></router-view>
    <v-snackbar
      v-model="showSnackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-card-title>
      <v-row>
        <v-col :sm="8" :md="8" :lg="8">Translations</v-col>
        <v-col :sm="4" :md="4" :lg="4">
          <v-text-field
            style="min-width: 220px"
            v-model="searchText"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      dense
      :headers="headers"
      :items="translations"
      :search="searchText"
      :items-per-page="10"
      :loading="loading"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:item.phrase="{ item }">
        {{item.phrase | capitalizeFirstLetter}}
      </template>
      <template v-slot:item.source="{ item }">
        {{item.source | capitalizeFirstLetter}}
      </template>
      <template v-slot:item.pl="{ item }">
        <template v-if="!!item.translations[0].translation">
          {{item.translations[0].translation | capitalizeFirstLetter}}
        </template>
        <template v-else>
          <p style="margin: 0" class="text--disabled">
            <v-icon color="red">subtitles_off</v-icon>
            Missing translation
          </p>
        </template>
      </template>
      <template v-slot:item.en="{ item }">
        <template v-if="!!item.translations[1].translation">
          {{item.translations[1].translation | capitalizeFirstLetter}}
        </template>
        <template v-else>
          <p style="margin: 0" class="text--disabled">
            <v-icon color="red">subtitles_off</v-icon>
            Missing translation
          </p>
        </template>
      </template>
      <template v-slot:item.actions="{ item }">
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(item.id.toString())">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
        </td>
      </template>
      <template v-slot:no-data>
        <div class="table-info-card my-2">
          <h2>You have no translations</h2>
          <p>It will create automatically while create ingredient</p>
        </div>
      </template>
      <template v-slot:no-results>
        <div class="table-info-card my-2">
          <h2>No translations found</h2>
          <p>No translations found for this '{{searchText}}' query. <br> Try a different search term.</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'Ingredients',
  mixins: [stringFormatMixin],
  data () {
    return {
      showSnackbar: false,
      snackbarText: '',
      headers: [
        { text: 'Phrase', value: 'phrase' },
        { text: 'Source', value: 'source' },
        { text: 'Polish', value: 'pl', sortable: false },
        { text: 'English', value: 'en', sortable: false },
        { text: 'Actions', align: 'center', value: 'actions', sortable: false }
      ],
      searchText: null,
      loading: false
    }
  },
  props: {
    snackbar: String
  },
  watch: {
    snackbar: function () {
      if (this.snackbar) {
        this.snackbarInfo(this.snackbar)
      }
    }
  },
  created: async function () {
    await this.fetchTranslations()
  },
  computed: {
    ...mapGetters({
      translations: 'translationService/translations'
    })
  },
  methods: {
    ...mapActions({
      fetchTranslations: 'translationService/fetchTranslations',
      fetchMissingTranslationsCount: 'translationService/fetchMissingTranslationsCount'
    }),
    editItem (translationId) {
      this.$router.push({ name: 'EditTranslation', params: { translationId: translationId } })
    },
    snackbarInfo (text) {
      this.snackbarText = text
      this.showSnackbar = true
    }
  }
}
</script>
<style lang="sass" scoped>
.chip-group
  display: flex
  flex-direction: row
  padding: 1px
  flex-wrap: wrap
  max-width: 450px
  & > *
    margin: 5px
</style>
