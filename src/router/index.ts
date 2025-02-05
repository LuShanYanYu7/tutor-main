import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/books',
      children: [
        {
          path: 'books',
          component: () => import('@/views/book/BookList.vue'),
          name: 'BookList',
          meta: { title: '书籍管理' }
        },
        {
          path: 'users',
          component: () => import('@/views/user/UserList.vue'),
          name: 'UserList',
          meta: { title: '用户管理' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from) => {
  console.log('路由跳转:', {
    从: from.path,
    到: to.path
  })
})

export default router 