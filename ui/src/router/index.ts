import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
export const routes = [
  {
    path: '/',
    name: 'home',
    pageTitle: 'Home',
    component: HomeView,
    showInMenu: true,
  },
  {
    path: '/my-pets',
    name: 'my-pets',
    pageTitle: 'My Pets',
    showInMenu: true,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MyPetsView.vue'),
  },
  {
    path: '/my-pets/:id',
    name: 'pet-details',
    pageTitle: 'My Pet Details',
    showInMenu: false,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/PetDetails.vue'),
  },
  {
    path: '/my-pets/add',
    name: 'add-pet',
    pageTitle: 'Add New Pet',
    showInMenu: true,
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

export default router;
