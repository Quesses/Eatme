<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="dishForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">Menu Item</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="12" sm="7" md="8">
              <v-select
                :items="dishPropositions"
                v-model="menuItemForm.dish"
                :rules="[v => !!v || 'Dish is required']"
                :disabled="loading"
                label="Dish*"
              ></v-select>
            </v-col>
            <v-row>
              <DishCard :dish="selectedDish" />
            </v-row>
            <PriceInput v-model="menuItemForm.variants" :sizes="typeOfSelectedDish.sizes" :disabled="!menuItemForm.dish || loading" />
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'Menu' }" >
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

import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import DishCard from '@/components/DishCard.vue'
import PriceInput from '@/components/PriceInput.vue'

export default {
  name: 'FormNewDish',
  mixins: [stringFormatMixin],
  components: {
    DishCard,
    PriceInput
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
    menuItemForm: {
      dish: null,
      variants: [{ prize: 0, sizeId: null }]
    },
    typeOfSelectedDish: {
      sizes: null
    }
  }),
  created: async function () {
    this.loading = true
    await this.fetchDishes()
    await this.fetchMenu()
    this.loading = false
  },
  computed: {
    dishPropositions () {
      var propositions = []
      this.dishes.forEach(dish => {
        const doesMenuItemExist = this.menu.find(menuItem => {
          return menuItem.id === dish.id
        })
        if (doesMenuItemExist) {
          propositions.push({
            text: `${this.capitalizeFirstLetter(dish.type)} ${this.capitalizeFirstLetter(dish.name)}`,
            value: dish.name,
            disabled: true
          })
        } else {
          propositions.push({
            text: `${this.capitalizeFirstLetter(dish.type)} ${this.capitalizeFirstLetter(dish.name)}`,
            value: dish.name
          })
        }
      })
      return propositions
    },
    selectedDish () {
      const dish = this.dishes.find(dish => { return dish.name === this.menuItemForm.dish })
      return dish
    },
    ...mapGetters({
      dishes: 'dishService/dishes',
      menu: 'menuService/menu'
    })
  },
  watch: {
    'menuItemForm.dish': async function () {
      if (this.menuItemForm.dish) {
        this.typeOfSelectedDish = await this.getType(this.selectedDish.type)
      }
    }
  },
  methods: {
    ...mapActions({
      fetchDishes: 'dishService/fetchDishes',
      fetchMenu: 'menuService/fetchMenu',
      createMenuItem: 'menuService/create',
      getType: 'typeService/getTypeByName'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const newMenuItem = await this.createMenuItem({
        dishId: this.selectedDish.id,
        prices: this.menuItemForm.variants
      })

      if (newMenuItem.creationSucceeded) {
        this.fetchMenu()
        this.$router.push({ name: 'Menu', params: { snackbar: `${this.capitalizeFirstLetter(this.menuItemForm.dish)} Created!` } })
      } else {
        if (newMenuItem.error.menuItemExist) {
          this.errors.menuItemExist = newMenuItem.error.dishExist
          this.$refs.menuItemForm.validate()
        }
        this.loading = false
      }
    },
    formReset () {
      this.$refs.dishForm.reset()
      this.menuItemForm.variants = [{ price: 0, sizeId: null }]
    }
  }
}
</script>

<style lang="sass">
.ingredientChip
  &:hover
    cursor: default
</style>
