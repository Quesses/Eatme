import Translations from '@/views/Translations'

import Edit from '@/views/Translations/EditTranslationDialogForm.vue'

const routes = [
  {
    path: 'translations',
    name: 'Translations',
    component: Translations,
    props: true,
    children: [
      {
        path: 'edit/:translationId',
        component: Edit,
        name: 'EditTranslation',
        props: true
      }
    ]
  }
]

export default routes
