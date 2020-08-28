<template>
  <v-app>
    <header>
      <v-tabs
      background-color="deep-purple accent-4"
      centered
      dark
      icons-and-text
      >
        <v-tab to="/menu">
          Menu
        </v-tab>

        <v-tab to="/dishes">
          Dishes
        </v-tab>

        <v-tab to="/types">
          Types
        </v-tab>

        <v-tab to="/ingredients">
          Ingredients
        </v-tab>

        <v-tab to="/translations">
          <v-badge
          :value="missingTranslationsCount"
          :content="missingTranslationsCount"
          color="orange"
          style="margin-top: 7px"
          >
            Translations
          </v-badge>
        </v-tab>

      </v-tabs>
    </header>
    <v-main>
      <div class="main-page">
        <router-view ></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
  },
  methods: {
    ...mapActions({
      fetchMissingTranslationsCount: 'translationService/fetchMissingTranslationsCount'
    })
  },
  computed: {
    ...mapGetters({
      missingTranslationsCount: 'translationService/missingTranslationsCount'
    })
  },
  created: function () {
    this.fetchMissingTranslationsCount()
  }
}
</script>

<style lang="sass" >
.main-page
  max-width: 1330px
  margin: 0 auto
</style>
