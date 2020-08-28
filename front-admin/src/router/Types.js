import Types from '@/views/Types'

import New from '@/views/Types/NewTypeDialogForm.vue'
import Edit from '@/views/Types/EditTypeDialogForm.vue'

const routes = [
  {
    path: 'types',
    name: 'Types',
    component: Types,
    props: true,
    children: [
      {
        path: 'new',
        component: New,
        name: 'AddType'
      },
      {
        path: 'edit/:typeId',
        component: Edit,
        name: 'EditType',
        props: true
      }
    ]
  }
]

export default routes
