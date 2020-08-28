<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="dishForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">Dish</span>
        </v-card-title>
        <v-card-text>
          <v-container>
              <v-col cols="12" sm="7" md="8">
                <v-select
                  :items="typePropositions"
                  v-model="dishForm.type"
                  :rules="[v => !!v || 'Type is required']"
                  label="Type*"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="7" md="8">
                <v-text-field
                  :disabled="loading"
                  label="Name*"
                  autocomplete="off"
                  v-model="dishForm.name"
                  :error-messages="errors.type"
                  :rules="[v => !!v || 'Name is required', v => (v && toLowerCaseAndTrim(v) !== errors.dishExist) || `Type ${capitalizeFirstLetter(errors.dishExist)} already exist!`]"
                  hint="For Margheritta">
                </v-text-field>
              </v-col>
              <IngredientsInput
                v-model="dishForm.ingredients"
                :ingredientsPropositions="ingredientsConnectedToType"
                :disabled="loading || !dishForm.type">
                <template v-slot:header>Select dish ingredients</template>
              </IngredientsInput>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'Dishes' }" >
            <v-btn color="blue darken-1" text :disabled="loading" >Close</v-btn>
          </router-link>
          <v-btn color="blue darken-1" text @click="formReset" :disabled="loading" >Reset</v-btn>
          <v-btn color="blue darken-1" text @click="formSubmit" :disabled="!formValidate || loading" >Create dish</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IngredientsInput from '@/components/IngredientsInput.vue'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'FormNewDish',
  mixins: [stringFormatMixin],
  components: {
    IngredientsInput
  },
  props: {
  },
  data: () => ({
    loading: false,
    formValidate: null,
    searchText: '',
    errors: {
      dishExist: ''
    },
    dishForm: {
      name: '',
      type: '',
      ingredients: { all: [], extra: [] }
    }
  }),
  created: async function () {
    this.fetchTypes()
    this.fetchDishes()
  },
  computed: {
    ingredientsConnectedToType () {
      const type = this.types.find(type => { return type.name === this.dishForm.type })
      if (type) return type.ingredients
      return []
    },
    typePropositions () {
      var propositions = []
      this.types.forEach(type => {
        propositions.push({ value: type.name, text: this.capitalizeFirstLetter(type.name) })
      })
      return propositions
    },
    ...mapGetters({
      types: 'typeService/types'
    })
  },
  methods: {
    ...mapActions({
      fetchDishes: 'typeService/fetchTypes',
      fetchTypes: 'dishService/fetchDishes',
      createDish: 'dishService/create'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const newDish = await this.createDish({
        name: this.toLowerCaseAndTrim(this.dishForm.name),
        type: this.toLowerCaseAndTrim(this.dishForm.type),
        ingredients: this.dishForm.ingredients.all,
        extraIngredients: this.dishForm.ingredients.extra
      })

      if (newDish.creationSucceeded) {
        this.fetchDishes()
        this.fetchTypes()
        this.$router.push({ name: 'Dishes', params: { snackbar: `${this.capitalizeFirstLetter(this.dishForm.name)} Created!` } })
      } else {
        if (newDish.error.dishExist) {
          this.errors.dishExist = newDish.error.dishExist
          this.$refs.dishForm.validate()
        }
        this.loading = false
      }
    },
    formReset () {
      this.$refs.dishForm.reset()
      this.dishForm.ingredients = { all: [], extra: [] }
    }
  }
}
</script>

<style lang="sass">

</style>
