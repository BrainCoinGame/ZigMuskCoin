import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import './style.css';
import { Buffer } from 'buffer'; // Импортируем Buffer

// Добавляем Buffer в глобальный объект window
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Импортируем компоненты
import WalletConnect from '@/components/WalletConnect.vue';
import Wallet from '@/components/Wallet.vue';
import PurchaseModal from '@/components/PurchaseModal.vue';

const app = createApp(App);

// Регистрируем компоненты глобально
app.component('WalletConnect', WalletConnect);
app.component('Wallet', Wallet);
app.component('PurchaseModal', PurchaseModal);

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