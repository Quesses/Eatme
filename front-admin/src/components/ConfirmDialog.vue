<template>
<div>
  <v-dialog v-model="value" @click:outside="closeDialog()" @keydown.esc="closeDialog()" max-width="650">
    <v-card :loading="loading">
      <v-card-title class="headline">
        <slot name="header"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-text>
        <small>
          <slot name="footer"></slot>
        </small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog()">cancel</v-btn>
        <v-btn color="green darken-1" text @click="refreshDialog()" v-if="refresh">
          <v-icon :class="customRefresh ? 'customRefresh' : ''">refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn color="red darken-1" text @click="confirm()" :disabled="!enableSubmit">Remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    enableSubmit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: false
    },
    customRefresh: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
    },
    refreshDialog () {
      this.$emit('refresh')
    },
    confirm () {
      this.$emit('input', false)
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
