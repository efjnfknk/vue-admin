import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/user/User.vue'
import Right from '@/views/right/Right.vue'
import Role from '@/views/right/Role.vue'
import Categories from '@/views/goods/Categories.vue'
import Goods from '@/views/goods/Goods.vue'
import List from '@/views/goods/List.vue'
import Add from '@/views/goods/Add.vue'
import Reports from '@/views/report/Reports.vue'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/home',
    name: 'defaults',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [{
      path: 'users',
      name: 'User',
      component: User
    },
    {
      path: 'rights',
      name: 'Right',
      component: Right
    },
    {
      path: 'reports',
      name: 'Reports',
      component: Reports
    },
    {
      path: 'roles',
      name: 'Role',
      component: Role
    },
    {
      path: 'categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: 'goods',
      name: 'Goods',
      component: Goods,
      redirect: {
        path: 'goods/list'
      },
      children: [{
        path: 'list',
        name: 'List',
        component: List
      },
      {
        path: 'add',
        name: 'Add',
        component: Add
      }
      ]
    }
    ]
  }
  ]
})
