// router.js
import { createRouter, createWebHistory } from 'vue-router';
import BoostShop from '@/components/BoostShop.vue'; // Убедитесь, что путь правильный

const routes = [
  {
    path: '/boost',
    name: 'BoostShop',
    component: BoostShop,
  },
  // Добавьте другие маршруты по необходимости
];

const router = createRouter({
  history: createWebHistory(), // Или createWebHashHistory(), если нужно
  routes,
});

export default router;
