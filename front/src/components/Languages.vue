<template>
  <div class="nav">
    <button class="link" v-for="entry in languages" @click="changeLocale(entry.language)" :key="entry.title">
      <flag :iso="entry.flag" :squared=false />
      {{entry.title}}
    </button>
  </div>
</template>

<script>
import i18n from '@/plugins/i18n'
export default {
  data () {
    return {
      languages: [
        { flag: 'pl', language: 'pl', title: 'Polski' },
        { flag: 'us', language: 'en', title: 'English' }
      ]
    }
  },
  props: {
    lang: {
      type: String
    }
  },
  watch: {
    '$route.params.lang': function () {
      i18n.locale = this.$route.params.lang
    }
  },
  methods: {
    changeLocale (language) {
      var params = this.$route.params
      if (params.lang !== language) {
        params.lang = language
        this.$router.push({ name: this.$route.name, params: params })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.nav
  margin: 10px
  display: flex
  justify-content: center
.link
  padding: 10px
  border: 1px solid green
  font-size: 14px
  margin: 10px
  cursor: pointer
  text-decoration: none
</style>
