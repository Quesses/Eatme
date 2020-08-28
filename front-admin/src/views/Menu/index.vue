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
    <ConfirmDialog v-model="showConfirmRemoveDialog" :loading="loadingConfirmRemoveDialog" :enableSubmit="confirmText === menuItemToRemove.name" @confirm="removeItem()">
      <template v-slot:header>
        <p>Are you sure to delete dish <span style="color: red">{{ menuItemToRemove.name | capitalizeFirstLetter }}</span>?</p>
      </template>
      <template v-slot:content>
          <br/>
          <h3 style="margin-left: 15px">This dish is in the menu card on website page!</h3>
          <br/>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="8">
              <h3>Type "{{menuItemToRemove.name}}" to confirm removing.</h3>
              <v-text-field
                autocomplete="off"
                solo
                v-model="confirmText"
              ></v-text-field>
            </v-col>
          </v-row>
      </template>
    </ConfirmDialog>
    <v-card-title>
      <v-row>
        <v-col :sm="6" :md="8" :lg="8">Menu</v-col>
        <v-col :sm="2" :md="1" :lg="1" style="padding-top: 26px;padding-bottom: 0px">
          <router-link :to="{ name: 'AddMenuItem' }" v-if="menu.length > 0" :disabled="loading">
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
      loading-text="Fetching dishes... Please wait"
      :headers="headers"
      :items="menu"
      :search="searchText"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:no-data>
        <div class="table-info-card my-2">
          <h2>Create your first Menu Item</h2>
          <p>After creating the Menu item, it will be seen in the menu card.</p>
          <router-link :to="{ name: 'AddMenuItem' }" :disabled="loading">
            <v-btn color="primary" dark>Create new Menu Item</v-btn>
          </router-link>
        </div>
      </template>

      <template v-slot:no-results>
        <div class="table-info-card my-2">
          <h2>No Menu Item found</h2>
          <p>No Menu Item found for this '{{searchText}}' query. <br> Try a different search term or create new Menu Item.</p>
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        <span>{{item.type | capitalizeFirstLetter}} {{item.name | capitalizeFirstLetter}}</span>
      </template>

      <template v-slot:item.ingredients="{ item }">
        <template>
          {{item.ingredients | listRender}}
        </template>
        <template v-if="item.ingredients.length === 0">
          <p style="margin: 0" class="text--disabled">No ingredients</p>
        </template>
      </template>

      <template v-slot:item.variants="{ item }">
        <template v-for="(variant, index) in item.variants">
          &nbsp;<v-chip :key="index" color="orange" small dark>{{ item.calories }}{{variant.price}}zł/{{variant.size.value}}{{variant.size.unit}}</v-chip>
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(item.id.toString())">
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
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import { mapActions, mapGetters } from 'vuex'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  data () {
    return {
      showConfirmRemoveDialog: false,
      loadingConfirmRemoveDialog: false,
      confirmText: '',
      menuItemToRemove: {},
      showSnackbar: false,
      snackbarText: '',
      searchText: '',
      loading: true,
      headers: [
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Ingredients', value: 'ingredients' },
        { text: 'Variants', align: 'center', value: 'variants' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  components: {
    ConfirmDialog
  },
  mixins: [stringFormatMixin],
  props: {
    snackbar: String
  },
  created: async function () {
    await this.fetchMenu()
    this.loading = false
  },
  computed: {
    ...mapGetters({
      menu: 'menuService/menu'
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
      fetchMenu: 'menuService/fetchMenu',
      removeMenuItemById: 'menuService/removeMenuItemById'
    }),
    capitalizeFirstLetter: (str) => {
      str = str.trim()
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    },
    editItem (menuItemId) {
      this.$router.push({ name: 'EditMenuItem', params: { menuItemId: menuItemId } })
    },
    async confirmRemoveItem (item) {
      this.menuItemToRemove = item
      this.showConfirmRemoveDialog = true
    },
    async removeItem () {
      this.loading = true
      const removeMenuItemResponse = await this.removeMenuItemById(this.menuItemToRemove.id)

      if (removeMenuItemResponse.removeSucceeded) {
        this.fetchMenu()
        this.snackbarInfo(`${this.capitalizeFirstLetter(this.menuItemToRemove.name)} Removed!`)
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
