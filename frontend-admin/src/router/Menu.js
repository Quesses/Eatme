import Menu from '@/views/Menu'

import New from '@/views/Menu/NewMenuItemDialogForm.vue'
import Edit from '@/views/Menu/EditMenuItemDialogForm.vue'

const routes = [
  {
    path: 'menu',
    name: 'Menu',
    component: Menu,
    props: true,
    children: [
      {
        path: 'new',
        component: New,
        name: 'AddMenuItem'
      },
      {
        path: 'edit/:menuItemId',
        component: Edit,
        name: 'EditMenuItem',
        props: true
      }
    ]
  }
]

export default routes
