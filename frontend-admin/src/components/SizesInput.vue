<template>
  <v-row style="padding-left: 14px;">
    <strong class="title-field" style="margin-left: -12px;">Add size connected to type</strong>
    <v-row style="margin-bottom:-25px" v-for="(size, index) in value" :key="size.id">
      <v-col cols="12" sm="3">
        <v-text-field
          :rules="[v => !!v || 'Required', v=> v > 0 || 'Only positive value']"
          :disabled="disabled || size.dishes.length !== 0"
          type="number"
          min="0"
          v-model="size.value"
          label="Size"
          solo-inverted
          autocomplete="off"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="2">
        <v-text-field
          :rules="[v => !!v || 'Required']"
          :disabled="disabled || size.dishes.length !== 0"
          v-model="size.unit"
          label="Unit"
          hint="cm / g"
          solo-inverted
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="1">
        <v-btn :disabled="disabled ||  value.length === 1 || size.dishes.length !== 0" icon style="margin-top: 6px" @click="removeSize(size)">
          <v-icon
            size="30"
            color="error"
          >remove_circle_outline
          </v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="index === value.length - 1 && value.length !== 3" cols="12" sm="1">
        <v-btn :disabled="disabled" style="margin-top: 6px" icon @click="addSize()">
          <v-icon
            size="30"
            color="primary"
          >add_circle_outline
          </v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="size.dishes.length > 0" cols="12" sm="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              style="margin-top: 9px"
              color="brown darken-3"
              size="29"
              dark
              v-bind="attrs"
              v-on="on"
            >lock
            </v-icon>
          </template>
          <span>
            Some dishes use this size: <br>
            <template>{{size.dishes.map(dish => dish.name) | listRender(30)}}</template>
          </span>
      </v-tooltip>
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
      default: () => {
        return { id: 0, value: '', unit: '', dishes: [] }
      }
    }
  },
  watch: {
    value: {
      handler: function () {
        this.$emit('input', this.value)
      }
    }
  },
  methods: {
    addSize () {
      var i = 0
      while (this.value.filter(size => { return size.id === i }).length !== 0) i++
      this.value.push({ id: i, value: '', unit: '', dishes: [] })
    },
    removeSize (size) {
      this.value.splice(this.value.indexOf(size), 1)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
