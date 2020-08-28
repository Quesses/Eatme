<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="typeForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">{{ capitalizeFirstLetter(editedType.name) }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="12" sm="7" md="8">
              <v-text-field
                :disabled="loading"
                label="Link value"
                autocomplete="off"
                v-model="typeForm.linkValue"
                hint="Value seen in link">
              </v-text-field>
            </v-col>
            <SizesInput v-model="typeForm.sizes" :disabled="loading" />
            <IngredientsInput
              v-model="typeForm.ingredients"
              :ingredientsPropositions="ingredients.map(ingr => ingr.name)"
              :disabled="loading">
              <template v-slot:header>Select ingredients connected to type</template>
            </IngredientsInput>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link  :to="{ name: 'Types' }" >
            <v-btn color="blue darken-1" text >Close</v-btn>
          </router-link>
          <v-btn color="blue darken-1" text @click="formSubmit" :disabled="!formValidate || !isFormEdited || loading" >save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SizesInput from '@/components/SizesInput.vue'
import IngredientsInput from '@/components/IngredientsInput.vue'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'FormEditDish',
  mixins: [stringFormatMixin],
  props: {
    typeId: String
  },
  components: {
    SizesInput,
    IngredientsInput
  },
  data: () => ({
    loading: false,
    formValidate: null,
    fetchedType: null,
    formEdited: {
      sizes: false,
      ingredients: false
    },
    editedType: {
      name: 'Type',
      ingredients: [],
      linkValue: ''
    },
    typeForm: {
      ingredients: { all: [], extra: [] },
      sizes: [{ id: 0, value: '', unit: '', dishes: [] }],
      linkValue: ''
    }
  }),
  created: async function () {
    this.loading = true
    this.fetchIngredients()
    await this.fetchTypes()
    this.editedType = await this.getType(this.typeId)
    this.typeForm.ingredients.all = JSON.parse(JSON.stringify(this.editedType.ingredients))
    this.typeForm.sizes = JSON.parse(JSON.stringify(this.editedType.sizes))
    this.typeForm.linkValue = JSON.parse(JSON.stringify(this.editedType.linkValue))
    this.loading = false
  },
  computed: {
    isFormEdited () {
      return this.formEdited.ingredients || this.formEdited.sizes || (this.typeForm.linkValue !== this.editedType.linkValue)
    },
    ...mapGetters({
      ingredients: 'ingredientService/ingredients'
    }),
    computedSizes () {
      const sizes = []
      this.typeForm.sizes.map(size => {
        if (!!size.value && !!size.unit) {
          sizes.push({
            value: size.value,
            unit: this.toLowerCaseAndTrim(size.unit)
          })
        }
      })
      if (sizes.length === 0) sizes.push({ value: '', unit: '' })
      return sizes
    }
  },
  watch: {
    typeForm: {
      handler: function () {
        this.isIngredientChanged()
        if (!this.formEdited.ingredients) {
          this.isSizeChanged()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      updateType: 'typeService/update',
      getType: 'typeService/getType',
      fetchTypes: 'typeService/fetchTypes',
      fetchIngredients: 'ingredientService/fetchIngredients'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const editType = await this.updateType({
        id: this.editedType.id,
        name: this.editedType.name,
        linkValue: this.typeForm.linkValue,
        ingredients: this.typeForm.ingredients.all,
        extraIngredients: this.typeForm.ingredients.extra,
        sizes: this.typeForm.sizes
      })
      if (editType.updateSucceeded) {
        this.fetchTypes()
        this.$router.push({ name: 'Types', params: { snackbar: `${this.capitalizeFirstLetter(this.editedType.name)} Edited!` } })
      } else {
        console.log(editType.error)
        this.loading = false
      }
    },
    isIngredientChanged () {
      this.formEdited.ingredients = false
      if (!this.compareArrays(this.editedType.ingredients, this.typeForm.ingredients.all)) {
        this.formEdited.ingredients = true
      }
    },
    isSizeChanged () {
      this.formEdited.sizes = false
      if (!this.compareSizeArrays(this.editedType.sizes, this.computedSizes)) {
        this.formEdited.sizes = true
      }
    },
    compareSizeArrays (arrayA, arrayB) {
      if (!!arrayA === false) {
        return false
      }
      if (arrayA.length !== arrayB.length) return false
      for (const sizeA in arrayA) {
        const doesObjectExist = arrayB.find(sizeB => {
          const val1 = parseInt(arrayA[sizeA].value, 10)
          const val2 = parseInt(sizeB.value, 10)
          const valuesAreDifferent = val1 !== val2 && (!!val1 || !!val2)
          return !valuesAreDifferent && arrayA[sizeA].unit === sizeB.unit
        })
        if (!doesObjectExist) {
          return false
        }
      }
      return true
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
