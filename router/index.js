import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import './style.css';
import router from './router'; // Импортируем роутер

const app = createApp(App);

// Метод для обработки кликов по меню
app.config.globalProperties.handleMenuClick = async function(button) {
  const router = useRouter(); // Получаем роутер в методе компонента

  if (button.route) {
    router.push(button.route); // Переход на страницу, если указан route
  } else if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(`Opening ${button.name || 'this button'}...`);
  }
};

// Функция для регистрации пользователя
async function registerUser(user) {
  try {
    const response = await axios.post('https://a59a2b57.zigmuskcoin.pages.dev/', {
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || '',
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Глобальный миксин для регистрации пользователя
app.mixin({
  async mounted() {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Разворачиваем WebApp

      const user = tg.initDataUnsafe?.user;
      if (user) {
        try {
          const registeredUser = await registerUser(user);
          this.telegramUser = { ...user, ...registeredUser };
          this.points = registeredUser.initialPoints || 0;
          this.level = registeredUser.initialLevel || 1;
        } catch (error) {
          console.error('Registration error:', error);
        }
      }
    }
  }
});

app.use(router); // Используем роутер
app.mount('#app');
