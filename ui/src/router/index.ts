import { TOKEN_KEY, useAuthStore } from '@/stores/auth.store';
import { createRouter, createWebHistory } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import HomeView from '../views/HomeView.vue';
export const routes = [
  {
    path: '/',
    name: 'home',
    pageTitle: 'Home',
    component: HomeView,
    meta:{
      authRequired: false,
      showInMenu: true,
    },

  },
  {
   path: '/register',
   name: 'register',
   pageTitle: 'Register',
   meta:{
      authRequired: false,
      showInMenu: true,
    },
   // route level code-splitting
   // this generates a separate chunk (About.[hash].js) for this route
   // which is lazy-loaded when the route is visited.
   component: () => import('../views/NewUserRegView.vue'),
 },
 {
   path: '/login',
   name: 'login',
   pageTitle: 'Login',
   meta:{
      authRequired: false,
      showInMenu: true,
    },
   // route level code-splitting
   // this generates a separate chunk (About.[hash].js) for this route
   // which is lazy-loaded when the route is visited.
   component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/my-pets',
    name: 'my-pets',
    pageTitle: 'My Pets',
    meta:{
      authRequired: true,
      showInMenu: true,
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MyPetsView.vue'),
  },
  {
    path: '/my-pets/details',
    name: 'pet-details',
    pageTitle: 'My Pet Details',
    meta:{
      authRequired: true,
      showInMenu: false,
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/PetDetails.vue'),
  },
  {
    path: '/my-pets/add',
    name: 'add-pet',
    pageTitle: 'Add New Pet',
    meta:{
      authRequired: true,
      showInMenu: true,
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AddPetView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
   // redirect to login page if not logged in and trying to access a restricted page
   const { authRequired } = to.meta;
   const auth = useAuthStore();
   const authToken = useCookies().cookies.get(TOKEN_KEY)
   if (authRequired && !authToken) {
       auth.returnUrl = to.fullPath;
       return '/login';
   }
});

export default router;
