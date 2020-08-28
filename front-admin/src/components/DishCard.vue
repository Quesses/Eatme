<template>
  <v-card outlined class="mx-auto" min-width="344">

    <template v-if="dish">
      <v-card-text>
        <p class="display-1 text--primary">
          {{dish.type | capitalizeFirstLetter}} {{dish.name | capitalizeFirstLetter}}
        </p>
        <p>ingredeints</p>
        <div class="text--primary">
          <template v-for="ingredient in dish.ingredients" >
            <v-chip
              :key="ingredient"
              class="ingredientChip"
              outlined>
                {{ingredient | capitalizeFirstLetter}}
            </v-chip>
          </template>
        </div>
      </v-card-text>
    </template>

    <template v-else>
      <v-card-text>
        <div>Example dish</div>
        <p class="display-1 text--primary">
          Ma•gh•r•itta
        </p>
        <p>ingredeints</p>
        <div class="text--primary">
          <v-chip outlined> Cheesee </v-chip>
          <v-chip outlined> Ham </v-chip>
          <v-chip outlined> Mushrooms </v-chip>
        </div>
      </v-card-text>
    </template>

  </v-card>
</template>

<script>
import stringFormatMixin from '@/mixins/stringFormatMixin.js'
export default {
  props: {
    dish: Object
  },
  mixins: [stringFormatMixin]
}
</script>

<style lang="sass" scoped>

</style>
