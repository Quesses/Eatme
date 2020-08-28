import Vue from 'vue'
import VueRouter from 'vue-router'

import Dishes from './Dishes'
import Types from './Types'
import Ingredients from './Ingredients'
import Menu from './Menu'
import Translations from './Translations'

import Home from '@/views'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      ...Dishes,
      ...Types,
      ...Ingredients,
      ...Menu,
      ...Translations
    ]
  }
]

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
