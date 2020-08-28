<template>
  <div class="menu-card">
    <header>
      <h2 class="card-title">{{ $t('ordering_menu_card_header') }}</h2>
      <div class="controllNav">
        <v-btn class="link" @click="changeType(type)" v-for="type in availableTypes" :key="type.id">
          {{translate(type.translations) | capitalizeFirstLetter}}
        </v-btn>
      </div>
    </header>
    <ul class="menu-list">
      <li v-for="dish in menuItems" :key="dish.name">
        <h3>{{ dish.name }} {{ dish.type }}</h3>
        <p>{{ dish.integridients }}</p>
        <span>{{ dish.smallPrize }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'MenuCard',
  props: {
    availableTypes: {
      type: Array
    }
  },
  data: function () {
    return {

    }
  },
  mixins: [stringFormatMixin],
  mounted: function () {

  },
  computed: {
    ...mapGetters({
      menuItems: 'ordering/menu'
    }),
    language: function () {
      return this.$route.params.lang
    },
    type: function () {
      return this.$route.params.type
    }
  },
  watch: {
    availableTypes: function () {
      if (this.availableTypes.length === 0) {
        this.changeType({ linkValue: ' ', value: '' })
      }
      const doesTypeExist = this.availableTypes.find(type => type.linkValue === this.type)
      if (!doesTypeExist) {
        return this.changeType(this.availableTypes[0])
      }
      this.changeType(doesTypeExist)
    }
  },
  methods: {
    ...mapActions({
      fetchMenuItemsOfType: 'ordering/fetchMenuItemsOfType'
    }),
    translate (translations) {
      const lang = this.$route.params.lang
      const translation = translations.find(trans => trans.lang === lang)
      return translation.translation
    },
    changeType (newType) {
      var params = this.$route.params
      if (params.type !== newType.linkValue) {
        params.type = newType.linkValue
        this.$router.push({ name: this.$route.name, params: params })
      }
      if (params.type !== ' ') {
        this.fetchMenuItemsOfType(newType.name)
      }
    }
  }
}
</script>

<style lang="sass">
.menu-card
  width: 60%
  text-align: center
  .controllNav
    padding: 5px
    border-bottom: 1px dotted #aaa
    .link
      margin: 5px

  .menu-list
    list-style-type: none
    li
      padding: 30px

  .card-title
    border-bottom: 1px dotted #aaa
    margin: 0
    padding: 10px
</style>
