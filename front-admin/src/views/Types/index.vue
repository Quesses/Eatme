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
    <ConfirmDialog v-model="showConfirmRemoveDialog" :loading="loadingConfirmRemoveDialog" :enableSubmit="typeToRemove.dishes.length === 0" @confirm="removeItem()" @refresh="refreshItem()">
      <template v-slot:header>
        <p>Are you sure to delete type <span style="color: red">{{ typeToRemove.name | capitalizeFirstLetter }}</span>?</p>
      </template>
      <template v-slot:content>
        <p v-if="typeToRemove.dishes.length === 0">
          There is no dish of this type.
        </p>
        <template v-else>
          <h3>The type that is in use cannot be deleted.</h3>
          <div class="chip-group">
            <v-chip color="red darken-2" v-for="(dish, index) in typeToRemove.dishes" :key="index" dark small>
              {{dish.name | capitalizeFirstLetter}}
            </v-chip>
          </div>
        </template>
      </template>
    </ConfirmDialog>
    <v-card-title>
      <v-row>
        <v-col :sm="6" :md="8" :lg="8">Types</v-col>
        <v-col :sm="2" :md="1" :lg="1" style="padding-top: 26px;padding-bottom: 0px">
          <router-link :to="{ name: 'AddType' }" v-if="types.length > 0" :disabled="loading">
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
      :items="types"
      :search="searchText"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:no-data>
        <div class="table-info-card my-2">
          <h2>Create your first dish type</h2>
          <p>Creating dish type, you'll be able to create a dish.</p>
          <router-link :to="{ name: 'AddType' }" :disabled="loading">
            <v-btn color="primary" dark>Create new type</v-btn>
          </router-link>
        </div>
      </template>

      <template v-slot:no-results>
        <div class="table-info-card my-2">
          <h2>No types found</h2>
          <p>No type found for this '{{searchText}}' query. <br> Try a different search term or create new type.</p>
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        {{capitalizeFirstLetter(item.name)}}
      </template>

      <template v-slot:item.ingredients="{ item }">
        <template >
          {{ item.ingredients | listRender }}
        </template>
        <template v-if="item.ingredients.length === 0">
          <p style="margin: 0" class="text--disabled">No ingredients</p>
        </template>
      </template>

      <template v-slot:item.sizes="{ item }">
        <template v-if="item.sizes.length === 1 && item.sizes[0].value === 0 && item.sizes[0].unit === ''">
          <p style="margin: 0" class="text--disabled">No sizes</p>
        </template>
        <template v-else v-for="size in item.sizes">
          {{size.value}}{{size.unit}}<template v-if="item.sizes.indexOf(size)<item.sizes.length-1">,</template>
        </template>
      </template>

      <template v-slot:item.dishes="{ item }">
        <template v-if="item.dishes.length === 0">
          <p style="margin: 0" class="text--disabled">No dishes</p>
        </template>
        <template v-else>
          {{item.dishes.map(dish => dish.name) | listRender}}
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
import { mapActions, mapGetters } from 'vuex'
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
export default {
  data () {
    return {
      showConfirmRemoveDialog: false,
      loadingConfirmRemoveDialog: false,
      showSnackbar: false,
      snackbarText: '',
      searchText: '',
      loading: true,
      headers: [
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Allow Ingredients', value: 'ingredients' },
        { text: 'Allow Sizes', value: 'sizes' },
        { text: 'Dishes Of Type', value: 'dishes' },
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
    await this.fetchTypes()
    this.loading = false
  },
  computed: {
    ...mapGetters({
      types: 'typeService/types',
      typeToRemove: 'typeService/typeToRemove'
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
      getTypeById: 'typeService/getTypeById',
      removeTypeById: 'typeService/removeTypeById'
    }),
    editItem (typeId) {
      this.$router.push({ name: 'EditType', params: { typeId: typeId } })
    },
    async confirmRemoveItem (item) {
      this.getTypeById(item.id)
      this.showConfirmRemoveDialog = true
    },
    async refreshItem (ingr) {
      this.loadingConfirmRemoveDialog = true
      await this.confirmRemoveItem(this.typeToRemove.id)
      this.loadingConfirmRemoveDialog = false
    },
    async removeItem () {
      this.loading = true
      const removeTypeResponse = await this.removeTypeById(this.typeToRemove.id)

      if (removeTypeResponse.removeSucceeded) {
        this.fetchTypes()
        this.snackbarInfo(`${this.capitalizeFirstLetter(this.typeToRemove.name)} Removed!`)
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

.chip-group
  display: flex
  flex-direction: row
  padding: 1px
  flex-wrap: wrap
  max-width: 450px
  margin-top: 5px
  & > *
    margin: 5px
</style>
