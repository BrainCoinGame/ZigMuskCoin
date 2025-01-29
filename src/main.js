import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import './style.css';

const app = createApp(App);

async function registerUser(user) {
  try {
    const response = await axios.post('https://479d4bd7.zigmuskcoin.pages.dev/', {
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

app.mixin({
  async mounted() {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      
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

app.mount('#app');