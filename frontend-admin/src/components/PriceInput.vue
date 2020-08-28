<template>
  <v-row style="padding-left: 14px;">
    <strong class="title-field" style="margin-left: -12px;">Add variants of dish</strong>
    <v-row style="margin-bottom:-25px" v-for="(valueItem, index) in value" :key="index">
      <v-col cols="12" sm="3">
        <v-text-field
          :disabled="disabled"
          type="number"
          min="0"
          v-model="valueItem.price"
          label="Price*"
          :rules="[v => !!v || 'Price is required', v=> v >= 0 || 'Only positive value']"
          solo-inverted
          append-outer-icon="monetization_on"
          autocomplete="off"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-select
          :items="sizePropositions"
          :disabled="disabled"
          v-model="valueItem.sizeId"
          solo-inverted
          :rules="[v => !!v || 'Required field']"
          label="Size*"
        >
          <template v-slot:selection="{ item }">
            {{item.text}}
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-btn :disabled="disabled || value.length === 1" icon style="margin-top: 6px" @click="removeSize(valueItem)">
          <v-icon
            size="30"
            color="error"
          >remove_circle_outline
          </v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="index === 0" cols="12" sm="1">
        <v-btn :disabled="disabled || value.length === 3" style="margin-top: 6px" icon @click="addSize()">
          <v-icon
            size="30"
            color="primary"
          >add_circle_outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import stringFormatMixin from '@/mixins/stringFormatMixin.js'

export default {
  name: 'SizesInput',
  mixins: [stringFormatMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => [{ price: 0, sizeId: null }]
    },
    sizes: {
      type: Array,
      default: null
    }
  },
  watch: {
    value: {
      handler: function () {
        this.$emit('input', this.value)
      },
      deep: true
    }
  },
  computed: {
    sizePropositions () {
      var sizes = []
      if (!this.sizes) return []
      this.sizes.forEach(size => {
        const doesSizeExist = this.value.find(val => {
          return val.sizeId === size.id
        })
        if (!doesSizeExist) {
          sizes.push({ text: `${size.value} ${size.unit}`, value: size.id })
        } else {
          sizes.push({ text: `${size.value} ${size.unit}`, value: size.id, disabled: true })
        }
      })
      return sizes
    }
  },
  methods: {
    addSize () {
      this.value.push({ price: 0, sizeId: null })
    },
    removeSize (priceItem) {
      this.value.splice(this.value.indexOf(priceItem), 1)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
