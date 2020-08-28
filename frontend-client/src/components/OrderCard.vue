<template>
  <div class="order-card">
    <header>
      <h2 class="card-title">{{ $t('ordering_order_card_header') }}</h2>
    </header>
    <ul class="order-list"></ul>
    <button class="order-submit"></button>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass">
.order-card
  text-align: center
  width: 30%
  height: 300px
  position: sticky
  top: 50px
  .card-title
    border-bottom: 1px dotted #aaa
    margin: 0
    padding: 10px
</style>
