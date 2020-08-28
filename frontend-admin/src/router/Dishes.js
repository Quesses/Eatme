import Dishes from '@/views/Dishes'

import New from '@/views/Dishes/NewDishDialogForm.vue'
import Edit from '@/views/Dishes/EditDishDialogForm.vue'

const routes = [
  {
    path: 'dishes',
    name: 'Dishes',
    component: Dishes,
    props: true,
    children: [
      {
        path: 'new',
        component: New,
        name: 'AddDish'
      },
      {
        path: 'edit/:dishId',
        component: Edit,
        name: 'EditDish',
        props: true
      }
    ]
  }
]

export default routes
