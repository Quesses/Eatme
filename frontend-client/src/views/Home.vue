<template>
    <div>
      <header>
        <Languages />
      </header>
      <main>
        <div id="ordering">
          <MenuCard :availableTypes="availableTypes" />
          <OrderCard />
        </div>
      </main>
      <footer></footer>
    </div>
</template>

<script>
import MenuCard from '@/components/MenuCard.vue'
import OrderCard from '@/components/OrderCard.vue'
import Languages from '@/components/Languages.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',
  props: {

  },
  components: {
    MenuCard,
    OrderCard,
    Languages
  },
  created: function () {
    this.fetchAvailableTypes()
  },
  computed: {
    ...mapGetters({
      availableTypes: 'ordering/availableTypes'
    })
  },
  methods: {
    ...mapActions({
      fetchAvailableTypes: 'ordering/fetchAvailableTypes'
    })
  }
}
</script>

<style lang="sass" scoped>
header
  width: 100%
  height: 150px

#ordering
  position: relative
  width: 80%
  min-width: 700px
  margin: 0 auto
  justify-content: space-evenly
  display: flex

  .card-title
    border-bottom: 1px dotted #aaa
    margin: 0
    padding: 10px

  & > *
    background: #eee
    border: 1px solid #aaa

</style>
