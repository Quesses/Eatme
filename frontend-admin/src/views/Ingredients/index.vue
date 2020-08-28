<template>
  <v-card>
    <router-view></router-view>
    <v-snackbar
      v-model="showSnackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <ConfirmDialog v-model="showConfirmRemoveDialog" :loading="loadingConfirmRemoveDialog" refresh :enableSubmit="ingredientToRemove.dishes.length === 0" @confirm="removeItem()" @refresh="refreshItem()">
      <template v-slot:header>
        <p>Are you sure that you want to delete <span style="color: red">{{ ingredientToRemove.name | capitalizeFirstLetter }}</span>?</p>
      </template>
      <template v-slot:content>
        <p v-if="ingredientToRemove.types.length === 0 && ingredientToRemove.dishes.length === 0">
          None of dishes and types uses this ingredient.
        </p>
        <p v-else>
          <template v-if="ingredientToRemove.dishes.length > 0">

            <h4>Edit following dishes whitch use this ingredient before delete.</h4>
            <div class="chip-group">
              <v-chip color="red darken-2" target="_blank" :to="{ name: 'EditDish', params: { dishId: dish.id }}" dark small link v-for="(dish, index) in ingredientToRemove.dishes" :key="index">
                {{dish.type | capitalizeFirstLetter}} {{dish.name | capitalizeFirstLetter}}
                <v-icon size="19" style="margin-left: 3px">north_east</v-icon>
              </v-chip>
            </div>

            <template v-if="ingredientToRemove.types.length > 0">
              <br/>
              <h4>Additionaly this ingredient is connected with following types:</h4>
              <div class="chip-group">
                <v-chip :to="{ name: 'EditType', params: { typeId: type.id }}" target="_blank" color="orange darken-2" v-for="(type, index) in ingredientToRemove.types" :key="index" dark small>
                  {{type.name | capitalizeFirstLetter}}
                  <v-icon size="19" style="margin-left: 3px">north_east</v-icon>
                </v-chip>
              </div>
            </template>

          </template>
          <template v-else>
            <h4>None of dishes uses this ingredient.</h4>
            <template v-if="ingredientToRemove.types.length > 0">
              <br/>
              <h4>But this ingredient is connected with following types:</h4>
              <div class="chip-group">
                <v-chip :to="{ name: 'EditType', params: { typeId: type.id }}" target="_blank" color="orange darken-2" v-for="(type, index) in ingredientToRemove.types" :key="index" dark small>
                  {{type.name | capitalizeFirstLetter}}
                  <v-icon size="19" style="margin-left: 3px">north_east</v-icon>
                </v-chip>
              </div>
            </template>
            <template v-else>
              <h4>None of types uses this ingredient.</h4>
            </template>
          </template>
        </p>
      </template>
      <template v-slot:footer>
        *Ingredient will dissapear from all types in whitch it appears
      </template>
    </ConfirmDialog>
    <v-card-title>
      <v-row>
        <v-col :sm="8" :md="8" :lg="8">Ingredients</v-col>
        <v-col :sm="4" :md="4" :lg="4">
          <v-text-field
            style="min-width: 220px"
            v-model="searchText"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      dense
      :headers="headers"
      :items="ingredients"
      :search="searchText"
      :items-per-page="10"
      :loading="loading"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:item.ingredient="{ item }">
        {{item.name | capitalizeFirstLetter}}
      </template>
      <template v-slot:item.actions="{ item }">
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="confirmRemoveItem(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template v-slot:no-data>
        <div class="table-info-card my-2">
          <h2>You have no ingredients</h2>
          <p>It will create automatically while create dish or type</p>
        </div>
      </template>
      <template v-slot:no-results>
        <div class="table-info-card my-2">
          <h2>No ingredients found</h2>
          <p>No ingredient found for this '{{searchText}}' query. <br> Try a different search term.</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  name: 'Ingredients',
  mixins: [stringFormatMixin],
  components: {
    ConfirmDialog
  },
  data () {
    return {
      showConfirmRemoveDialog: false,
      loadingConfirmRemoveDialog: false,
      showSnackbar: false,
      snackbarText: '',
      headers: [
        { text: 'Ingredient', value: 'ingredient' },
        { text: 'Actions', align: 'center', value: 'actions', sortable: false }
      ],
      searchText: null,
      loading: false
    }
  },
  props: {
    snackbar: String
  },
  watch: {
    snackbar: function () {
      if (this.snackbar) {
        this.snackbarInfo(this.snackbar)
      }
    }
  },
  created: async function () {
    await this.fetchIngredients()
  },
  computed: {
    ...mapGetters({
      ingredients: 'ingredientService/ingredients',
      ingredientToRemove: 'ingredientService/ingredientToRemove'
    })
  },
  methods: {
    ...mapActions({
      fetchIngredients: 'ingredientService/fetchIngredients',
      getIngredientById: 'ingredientService/getIngredientById',
      removeIngredientById: 'ingredientService/removeIngredientById',
      fetchMissingTranslationsCount: 'translationService/fetchMissingTranslationsCount',
      subscribeDishes: 'dishService/subscribe'
    }),
    async confirmRemoveItem (ingr) {
      await this.getIngredientById(ingr.id)
      this.showConfirmRemoveDialog = true
      this.longPolling()
    },
    async longPolling () {
      const isDishUpdated = await this.subscribeDishes()
      if (isDishUpdated) {
        await this.getIngredientById(this.ingredientToRemove.id)
      }
      if (this.showConfirmRemoveDialog) {
        this.longPolling()
      }
    },
    async refreshItem (ingr) {
      this.loadingConfirmRemoveDialog = true
      await this.getIngredientById(this.ingredientToRemove.id)
      this.loadingConfirmRemoveDialog = false
    },
    async removeItem () {
      this.loading = true
      const removeIngredientResponse = await this.removeIngredientById(this.ingredientToRemove.id)

      if (removeIngredientResponse.removeSucceeded) {
        this.fetchIngredients()
        this.fetchMissingTranslationsCount()
        this.snackbarInfo(`${this.capitalizeFirstLetter(this.ingredientToRemove.name)} Removed!`)
        this.loading = false
      } else {
        console.log('error')
        this.loading = false
      }
    },
    snackbarInfo (text) {
      this.snackbarText = text
      this.showSnackbar = true
    }
  }
}
</script>
<style lang="sass" scoped>
.chip-group
  display: flex
  flex-direction: row
  padding: 1px
  flex-wrap: wrap
  max-width: 450px
  & > *
    margin: 5px
</style>
