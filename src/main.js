import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import './style.css';

const app = createApp(App);

// Функция для регистрации пользователя
async function registerUser(user) {
  try {
    const response = await axios.post('https://529d5a96.zigmuskcoin.pages.dev', {
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || '',
    });
    console.log('User registered:', response.data);
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
  }
}

// Миксин для работы с Telegram WebApp
app.mixin({
  async mounted() {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand(); // Развернуть приложение на весь экран

        const user = tg.initDataUnsafe?.user;
        if (user) {
          await registerUser(user); // Регистрация пользователя
        } else {
          console.error('Telegram user data not found');
        }
      } else {
        console.error('Telegram WebApp not found');
      }
    } catch (error) {
      console.error('Error in Telegram WebApp integration:', error.message);
    }
  }
});

app.mount('#app');
