import { createRouter, createWebHistory } from 'vue-router';
import Wallet from '@/components/Wallet.vue'; // Импортируйте ваш компонент Wallet.vue
import Shop from '@/components/Shop.vue';

const routes = [
  {
    path: '/wallet',
  name: 'Wallet',
  component: () => import('../components/Wallet.vue')
  },
  {
    path: '/boost-shop',
    component: () => import('@/components/BoostShop.vue')
  }
  // Другие маршруты...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;