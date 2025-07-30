import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import AuthenticatedLayout from '../layout/AuthenticatedLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import ContactDetailView from '../views/ContactDetailView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup', 
    component: SignupView,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: AuthenticatedLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'contact/:id',
        name: 'ContactDetail',
        component: ContactDetailView,
        props: true
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router