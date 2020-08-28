<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="typeForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">{{ editedDish.type | capitalizeFirstLetter }} {{ editedDish.name | capitalizeFirstLetter }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <IngredientsInput
              v-model="dishForm.ingredients"
              :ingredientsPropositions="editedDishType.ingredients"
              :disabled="loading">
              <template v-slot:header>Select dish ingredients</template>
            </IngredientsInput>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link  :to="{ name: 'Dishes' }" >
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
import IngredientsInput from '@/components/IngredientsInput.vue'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'FormEditDish',
  mixins: [stringFormatMixin],
  props: {
    dishId: [String, Number]
  },
  components: {
    IngredientsInput
  },
  data: () => ({
    loading: false,
    formValidate: null,
    formEdited: {
      ingredients: false
    },
    editedDish: {
      name: 'Dish',
      ingredients: []
    },
    editedDishType: {
      ingredients: []
    },
    dishForm: {
      ingredients: { all: [], extra: [] }
    }
  }),
  created: async function () {
    this.loading = true
    await this.fetchDishes()
    this.editedDish = await this.getDish(this.dishId)
    this.editedDishType = await this.getTypeByName(this.editedDish.type)
    this.dishForm.ingredients.all = JSON.parse(JSON.stringify(this.editedDish.ingredients))
    this.dishForm.ingredients.all.forEach(ingr => {
      if (this.editedDishType.ingredients.indexOf(ingr) === -1) {
        this.dishForm.ingredients.extra.push(ingr)
      }
    })
    this.loading = false
  },
  computed: {
    isFormEdited () {
      return this.formEdited.ingredients || this.formEdited.sizes
    }
  },
  watch: {
    'dishForm.ingredients': {
      handler: function () {
        this.isAnyIngredientChanged()
      }
    }
  },
  beforeRouteLeave: function (to, from, next) {
    console.log('asd')
    next()
  },
  methods: {
    ...mapActions({
      getTypeByName: 'typeService/getTypeByName',
      getDish: 'dishService/getDish',
      fetchTypes: 'typeService/fetchTypes',
      fetchDishes: 'dishService/fetchDishes',
      fetchIngredients: 'ingredientService/fetchIngredients',
      updateDish: 'dishService/update'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const editDishResponse = await this.updateDish({
        id: this.editedDish.id,
        dishName: this.editedDish.name,
        typeName: this.editedDishType.name,
        ingredients: this.dishForm.ingredients.all,
        extraIngredients: this.dishForm.ingredients.extra
      })
      if (editDishResponse.updateSucceeded) {
        this.$router.push({ name: 'Dishes', params: { snackbar: `${this.capitalizeFirstLetter(this.editedDish.name)} Edited!` } })
      } else {
        console.log(editDishResponse.error)
        this.loading = false
      }
    },
    isAnyIngredientChanged () {
      this.formEdited.ingredients = false
      if (!this.compareArrays(this.editedDish.ingredients, this.dishForm.ingredients.all)) {
        this.formEdited.ingredients = true
      }
    },
    compareArrays (arrayA, arrayB) {
      if (!arrayA && !arrayB) return true
      if (arrayA.length !== arrayB.length) return false
      for (const item in arrayA) {
        if (arrayB.indexOf(arrayA[item]) === -1) return false
      }
      return true
    }
  }
}
</script>

<style lang="sass">

</style>
