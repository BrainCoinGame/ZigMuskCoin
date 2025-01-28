import { createApp, onMounted } from 'vue';
import axios from 'axios';
import App from './App.vue';
import './style.css';

const app = createApp(App);

app.mixin({
  mounted() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Развернуть приложение на весь экран

      const user = tg.initDataUnsafe?.user;
      if (user) {
        this.$root.user.name = user.first_name || 'User';
        axios.post('https://ba88773b.zigmuskcoin.pages.dev', {
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          photo_url: user.photo_url || '',
        })
        .then(response => {
          console.log('User registered:', response.data);
        })
        .catch(error => {
          console.error('Error registering user:', error);
        });
      } else {
        console.error('MUSSSSSKKKK data not found');
      }
    }
  }
});

app.mount('#app');
