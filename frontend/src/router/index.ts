import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to login for now
    {
      path: '/',
      redirect: '/auth/login'
    },
    // Simple auth routes for testing
    {
      path: '/auth/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/auth/register', 
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Register' }
    },
    // Dashboard route
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Dashboard', requiresAuth: true }
    },
    // 404 page
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/views/NotFoundView.vue'),
    //   meta: { title: '404 - Page Not Found' }
    // }
  ]
});

// Simple navigation guard
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Contact Management`;
  }
  next();
});

export default router;