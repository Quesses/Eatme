<template>
  <v-col cols="12" sm="12">
    <v-row>
      <strong class="title-field">
        <slot name="header"></slot>
      </strong>
      <v-spacer></v-spacer>
      <v-text-field
        autocomplete="off"
        class="search-field"
        v-model="searchText"
        append-icon="mdi-magnify"
        label="Type ingredient"
        :disabled="disabled"
        single-line
        hide-details
        @keydown.enter="searchValue.length > 0 ? clickIngredient(searchValue) : ''"
      ></v-text-field>
    </v-row>
    <v-chip
      class="ma-2"
      v-if="filteredIngredients.length === 0">
        No suggestion
    </v-chip>
    <v-row>
      <v-chip-group
        column
        style="margin: 0 10px"
      >
        <template v-for="ingredient in filteredIngredients" >
          <v-chip
            :class="[value.all.indexOf(ingredient) === -1 ? '' : 'error--text', ingredient === searchValue ? 'primary--text' : '']"
            :key="ingredient"
            outlined
            :disabled="disabled"
            @keydown.enter="clickIngredient(ingredient)"
            @click="clickIngredient(ingredient)">
                {{ingredient | capitalizeFirstLetter}}
          </v-chip>
        </template>
      </v-chip-group>
    </v-row>
    <v-row>
      <strong class="title-field">Selected</strong>
    </v-row>
    <v-chip
      class="ma-2"
      v-if="value.all.length === 0">
        No ingredients
    </v-chip>
    <v-row>
      <v-chip-group
        column
        style="margin: 0 10px"
      >
        <template v-for="ingredient in value.all" >
          <v-chip
            :class="value.all.indexOf(ingredient) === -1 ? '' : 'primary--text'"
            :key="ingredient"
            outlined
            :disabled="disabled"
            @keydown.enter="clickIngredient(ingredient)"
            @click="clickIngredient(ingredient)">
              <template v-if="value.extra.indexOf(ingredient) > -1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ingredient | capitalizeFirstLetter}}
                      &nbsp;
                      <v-icon
                        color="orange"
                        style="margin-bottom: 4px"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        size="19"
                      >plus_one
                      </v-icon>
                      &nbsp;
                    </span>
                  </template>
                <span>This extra ingredient isnt connected with type yet</span>
              </v-tooltip>
              </template>
              <template v-else>
                {{ingredient | capitalizeFirstLetter}}
              </template>
          </v-chip>
        </template>
      </v-chip-group>
    </v-row>
  </v-col>
</template>

<script>
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
export default {
  name: 'IngredientsInput',
  mixins: [stringFormatMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => { return { extra: [], all: [] } }
    },
    ingredientsPropositions: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      searchText: ''
    }
  },
  computed: {
    filteredIngredients () {
      const ingrs = this.ingredientsPropositions
      const search = this.searchValue

      const result = ingrs.filter(item => {
        const text = item
        return (this.value.all.indexOf(item) === -1 && text.indexOf(search) > -1)
      })

      if (search && (ingrs.indexOf(search) === -1 || this.value.all.indexOf(search) > -1)) return result.concat([search])
      return result
    },
    searchValue () {
      return this.searchText ? this.toLowerCaseAndTrim(this.searchText) : ''
    }
  },
  methods: {
    clickIngredient (ingr) {
      ingr = this.toLowerCaseAndTrim(ingr)
      if (this.value.all.indexOf(ingr) === -1) {
        if (this.filteredIngredients.length === 1) {
          this.searchText = ''
        }
        this.value.all.push(ingr)
        if (this.ingredientsPropositions.indexOf(ingr) === -1) {
          this.value.extra.push(ingr)
        }
      } else {
        if (this.filteredIngredients.length === 1) {
          this.searchText = ''
        }
        this.value.all.splice(this.value.all.indexOf(ingr), 1)
        if (this.ingredientsPropositions.indexOf(ingr) === -1) {
          this.value.extra.splice(this.value.extra.indexOf(ingr), 1)
        }
      }
      this.$emit('input', { all: this.value.all, extra: this.value.extra })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
