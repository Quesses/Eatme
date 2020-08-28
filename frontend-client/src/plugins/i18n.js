import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  pl: {
    ordering_menu_card_header: 'Oferta',
    ordering_order_card_header: 'Zamówienia',
    pizzas: 'Pizza',
    burgers: 'Burgery'
  },
  en: {
    ordering_menu_card_header: 'Menu',
    ordering_order_card_header: 'Orders',
    pizzas: 'Pizzas',
    burgers: 'Burgers'
  }
}

const i18n = new VueI18n({
  locale: 'pl', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages // set locale messages
})

export default i18n
