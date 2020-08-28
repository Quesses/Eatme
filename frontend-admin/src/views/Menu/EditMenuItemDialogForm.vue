<template>
  <v-dialog value="true" persistent max-width="600px">
    <v-card :loading="loading">
      <v-form v-on:submit.prevent ref="dishForm" v-model="formValidate">
        <v-card-title>
          <span class="headline">{{dishName}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <PriceInput v-model="currentVariants" :sizes="possibleSizes" :disabled="loading" />
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'Menu' }" >
            <v-btn color="blue darken-1" text :disabled="loading" >Close</v-btn>
          </router-link>
          <v-btn color="blue darken-1" text @click="formSubmit" :disabled="!isMenuItemEdited || !formValidate || loading" >Submit changes</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import PriceInput from '@/components/PriceInput.vue'

export default {
  name: 'FormNewDish',
  mixins: [stringFormatMixin],
  components: {
    PriceInput
  },
  props: {
    menuItemId: [String, Number]
  },
  data: () => ({
    loading: false,
    dishName: '',
    formValidate: null,
    oldVariants: [],
    currentVariants: [],
    possibleSizes: null,
    isMenuItemEdited: false
  }),
  created: async function () {
    this.loading = true
    const menuItem = await this.getMenuItem(this.menuItemId)
    this.dishName = `${this.capitalizeFirstLetter(menuItem.type)} ${this.capitalizeFirstLetter(menuItem.name)}`
    const type = await this.getTypeByName(menuItem.type)
    this.possibleSizes = type.sizes

    menuItem.variants.forEach(obj => {
      this.oldVariants.push({ price: obj.price, sizeId: obj.size.id })
    })
    this.currentVariants = JSON.parse(JSON.stringify(this.oldVariants))
    this.loading = false
  },
  watch: {
    currentVariants: {
      handler: function () {
        this.isMenuItemEdited = false
        if (this.oldVariants.length !== this.currentVariants.length) {
          this.isMenuItemEdited = true
          return
        }
        for (const oldIndex in this.oldVariants) {
          const old = this.oldVariants[oldIndex]
          const doesSameExist = this.currentVariants.find(current => {
            return (parseInt(current.price) === old.price && current.sizeId === old.sizeId)
          })
          if (!doesSameExist) {
            this.isMenuItemEdited = true
            return
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      fetchMenu: 'menuService/fetchMenu',
      getMenuItem: 'menuService/getMenuItem',
      getTypeByName: 'typeService/getTypeByName',
      updateMenuItem: 'menuService/update'
    }),
    async formSubmit (ev) {
      ev.preventDefault()
      this.loading = true

      const updateMenuItemStatus = await this.updateMenuItem({
        dishId: this.menuItemId,
        prices: this.currentVariants
      })

      if (updateMenuItemStatus.updateSucceeded) {
        this.fetchMenu()
        this.$router.push({ name: 'Menu', params: { snackbar: `${this.capitalizeFirstLetter(this.dishName)} Updated!` } })
      } else {
        console.log(updateMenuItemStatus.error)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="sass">
.ingredientChip
  &:hover
    cursor: default
</style>
