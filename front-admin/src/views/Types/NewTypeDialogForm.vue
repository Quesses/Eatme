<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="typeForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">Type</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="7" md="8">
                <v-text-field
                  :disabled="loading"
                  label="Type name*"
                  autocomplete="off"
                  v-model="typeForm.name"
                  required
                  :error-messages="errors.type"
                  :rules="[v => !!v || 'Type is required', v => (v && toLowerCaseAndTrim(v) !== errors.typeExist) || `Type ${capitalizeFirstLetter(errors.typeExist)} already exist!`]"
                  hint="For example Salad">
                </v-text-field>
              </v-col>
            </v-row>
              <SizesInput v-model="typeForm.sizes" :disabled="loading" />
              <!-- <IngredientsInput
                v-model="typeForm.ingredients"
                :ingredientsPropositions="ingredientsConnectedToType"
                :disabled="loading">
                <template v-slot:header>Select ingredients connected to type</template>
              </IngredientsInput> -->
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'Types' }" >
            <v-btn color="blue darken-1" text :disabled="loading" >Close</v-btn>
          </router-link>
          <v-btn color="blue darken-1" text @click="formReset" :disabled="loading" >Reset</v-btn>
          <v-btn color="blue darken-1" text @click="formSubmit" :disabled="!formValidate || loading" >Create type</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SizesInput from '@/components/SizesInput.vue'
// import IngredientsInput from '@/components/IngredientsInput.vue'

import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'FormNewDish',
  mixins: [stringFormatMixin],
  props: {
  },
  components: {
    SizesInput
    // IngredientsInput
  },
  data: () => ({
    loading: false,
    formValidate: null,
    errors: {
      typeExist: ''
    },
    typeForm: {
      name: '',
      ingredients: { all: [], extra: [] },
      sizes: [{ id: 0, value: '', unit: '', dishes: [] }]
    }
  }),
  created: function () {
    this.fetchIngredients()
  },
  computed: {
    ...mapGetters({
      ingredientsConnectedToType: 'ingredientService/ingredients'
    })
  },
  methods: {
    ...mapActions({
      createType: 'typeService/create',
      fetchTypes: 'typeService/fetchTypes',
      fetchIngredients: 'ingredientService/fetchIngredients'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const sizes = []
      this.typeForm.sizes.map(size => {
        if (!!size.value && !!size.unit) {
          sizes.push({
            value: size.value,
            unit: this.toLowerCaseAndTrim(size.unit),
            dishes: size.dishes
          })
        }
      })
      if (sizes.length === 0) sizes.push({ value: '', unit: '', dishes: [] })

      const newType = await this.createType({
        name: this.toLowerCaseAndTrim(this.typeForm.name),
        ingredients: this.typeForm.ingredients.all,
        extraIngredients: this.typeForm.ingredients.extra,
        sizes: sizes

      })
      if (newType.creationSucceeded) {
        this.fetchTypes()
        this.$router.push({ name: 'Types', params: { snackbar: `${this.capitalizeFirstLetter(this.typeForm.name)} Created!` } })
      } else {
        if (newType.error.typeExist) {
          this.errors.typeExist = newType.error.typeExist
          this.$refs.typeForm.validate()
        }
        this.loading = false
      }
    },
    formReset () {
      this.$refs.typeForm.reset()
      this.typeForm.ingredients = { all: [], extra: [] }
      this.typeForm.sizes = [{ id: 0, value: '', unit: '' }]
    }
  }
}
</script>

<style lang="sass">
.md-progress-bar
  position: absolute
  top: 0
  right: 0
  left: 0

.addDishCard
  min-width: 600px
  padding: 25px
  .input-group
    & > *
      margin: 15px 15px 45px 15px

.title-field
  padding-top: 20px
  padding-left: 10px
.search-field
  margin: 0 25px 20px 0
.md-menu-content
  z-index: 14

</style>
