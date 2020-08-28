<template>
  <v-card class="mx-auto">

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
    <ConfirmDialog v-model="showConfirmRemoveDialog" :loading="loadingConfirmRemoveDialog" :enableSubmit="dishToRemove.menuItems.length === 0 || confirmText === dishToRemove.name" @confirm="removeItem()" @refresh="refreshItem()">
      <template v-slot:header>
        <p>Are you sure to delete dish <span style="color: red">{{ dishToRemove.name | capitalizeFirstLetter }}</span>?</p>
      </template>
      <template v-slot:content>
        <p v-if="dishToRemove.menuItems.length === 0">
          This dish is not in the Menu.
        </p>
        <template v-else>
          <br/>
          <h3 style="margin-left: 15px">This dish is in the menu!</h3>
          <br/>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="8">
              <h3>Type "{{dishToRemove.name}}" to confirm.</h3>
              <v-text-field
                solo
                autocomplete="off"
                v-model="confirmText"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
      </template>
    </ConfirmDialog>
    <v-card-title>
      <v-row>
        <v-col :sm="6" :md="8" :lg="8">Dishes</v-col>
        <v-col :sm="2" :md="1" :lg="1" style="padding-top: 26px;padding-bottom: 0px">
          <router-link :to="{ name: 'AddDish' }" v-if="dishes.length > 0" :disabled="loading">
            <v-btn color="primary" dark>new</v-btn>
          </router-link>
        </v-col>
        <v-col :sm="4" :md="3" :lg="3">
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
      :loading="loading"
      loading-text="Fetching types... Please wait"
      :headers="headers"
      :items="dishes"
      :search="searchText"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:no-data>
        <div class="table-info-card my-2">
          <h2>Create your first dish</h2>
          <p>Creating dish, you'll be able to add it to your Menu.</p>
          <router-link :to="{ name: 'AddDish' }" :disabled="loading">
            <v-btn color="primary" dark>Create new dish</v-btn>
          </router-link>
        </div>
      </template>

      <template v-slot:no-results>
        <div class="table-info-card my-2">
          <h2>No dishes found</h2>
          <p>No dish found for this '{{searchText}}' query. <br> Try a different search term or create new dish.</p>
        </div>
      </template>

      <template v-slot:item.type="{ item }">
        {{item.type | capitalizeFirstLetter}}
      </template>

      <template v-slot:item.name="{ item }">
        {{item.name | capitalizeFirstLetter}}
      </template>

      <template v-slot:item.ingredients="{ item }">
        <template>
          {{ item.ingredients | listRender }}
        </template>
        <template v-if="item.ingredients.length === 0">
          <p style="margin: 0" class="text--disabled">No ingredients</p>
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(item.id)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
          <v-btn icon class="mx-0" @click="confirmRemoveItem(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
export default {
  data () {
    return {
      confirmText: '',
      showConfirmRemoveDialog: false,
      loadingConfirmRemoveDialog: false,
      dishToRemove: {
        menuItems: []
      },
      showSnackbar: false,
      snackbarText: '',
      searchText: '',
      loading: true,
      headers: [
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Ingredients', value: 'ingredients' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  mixins: [stringFormatMixin],
  components: {
    ConfirmDialog
  },
  props: {
    snackbar: String
  },
  created: async function () {
    await this.fetchDishes()
    this.loading = false
  },
  computed: {
    ...mapGetters({
      types: 'typeService/types',
      dishes: 'dishService/dishes'
    })
  },
  watch: {
    snackbar: function () {
      if (this.snackbar) {
        this.snackbarInfo(this.snackbar)
      }
    }
  },
  methods: {
    ...mapActions({
      fetchTypes: 'typeService/fetchTypes',
      fetchDishes: 'dishService/fetchDishes',
      removeDishById: 'dishService/removeDishById',
      getDishById: 'dishService/getDishById'
    }),
    editItem (dishId) {
      this.$router.push({ name: 'EditDish', params: { dishId: dishId } })
    },
    async confirmRemoveItem (item) {
      const dish = await this.getDishById(item.id)
      this.dishToRemove = dish
      this.showConfirmRemoveDialog = true
    },
    async refreshItem () {
      this.loadingConfirmRemoveDialog = true
      await this.confirmRemoveItem(this.dishToRemove.id)
      this.loadingConfirmRemoveDialog = false
    },
    async removeItem () {
      this.loading = true
      const removeDishResponse = await this.removeDishById(this.dishToRemove.id)

      if (removeDishResponse.removeSucceeded) {
        this.fetchDishes()
        this.snackbarInfo(`${this.capitalizeFirstLetter(this.dishToRemove.name)} Removed!`)
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
.table-info-card
  padding: 25px
  & > *
    margin: 15px
</style>
