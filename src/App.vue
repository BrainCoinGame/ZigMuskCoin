<template>
  <div class="game-container">
    <!-- Stats Card -->
    <div class="stats-card">
      <div class="stats-header">
        <div class="score-container">
          <img :src="currentCoinIcon" alt="Coin" class="coin-icon" />
          <span class="score-text">{{ formatNumber(points) }}</span>
        </div>
        <button class="wallet-btn" @click="connectWallet">
          Connect Wallet
        </button>
      </div>

      <div class="level-text">Level: {{ level }}</div>
      
      <div class="progress-container">
        <div class="progress-item">
          <span class="progress-label">Energy</span>
          <div class="progress-track">
            <div 
              class="progress-bar energy"
              :style="{ width: `${energy}%` }"
            >
              {{ energy.toFixed(1) }}%
            </div>
          </div>
        </div>

        <div class="progress-item">
          <span class="progress-label">Level Progress</span>
          <div class="progress-track">
            <div 
              class="progress-bar level"
              :style="{ width: `${nextLevelProgress}%` }"
            >
              {{ nextLevelProgress.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div class="game-area">
      <div 
        class="click-area"
        :class="{ 'pressed': isPressed }"
        @mousedown="handlePress"
        @mouseup="handleRelease"
        @mouseleave="handleRelease"
        @touchstart.prevent="handlePress"
        @touchend.prevent="handleRelease"
        @touchcancel.prevent="handleRelease"
      >
        <img :src="currentCoinIcon" alt="Game Coin" class="game-coin" />
      </div>

      <!-- Bonus Popup -->
      <div v-if="showBonus" class="bonus-popup">
        <img :src="bonusIcon" alt="Bonus" class="bonus-icon" />
        <span class="bonus-text">+{{ bonusAmount }}</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="nav-menu">
      <button
        v-for="(button, index) in menuButtons"
        :key="index"
        class="nav-button"
        @click="handleMenuClick(button)"
      >
        <img :src="button.icon" :alt="button.name" class="nav-icon" />
        <span class="nav-label">{{ button.name }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import coinIcon from '@/assets/coin.png';
import coinPushIcon from '@/assets/coin-push.png';
import shopIcon from '@/assets/icons/shop.png';
import settingsIcon from '@/assets/icons/settings.png';
import trophyIcon from '@/assets/icons/trophy.png';
import rankingIcon from '@/assets/icons/ranking.png';
import helpIcon from '@/assets/icons/help.png';
import bonusIcon from '@/assets/bonus.png';

export default {
  name: 'ZigMuskGame',
  data() {
    return {
      telegramUser: null,
      points: 41000,
      level: 42,
      energy: 100,
      nextLevelProgress: 0,
      isPressed: false,
      energyRestoreInterval: null,
      coinIcon,
      coinPushIcon,
      bonusIcon,
      showBonus: false,
      bonusAmount: 0,
      currentCoinIcon: coinIcon,
      menuButtons: [
        { icon: shopIcon, name: 'Shop' },
        { icon: settingsIcon, name: 'Settings' },
        { icon: trophyIcon, name: 'Trophy' },
        { icon: rankingIcon, name: 'Ranking' },
        { icon: helpIcon, name: 'Help' }
      ],
      gameState: {
        baseClicks: 1000,
        additionalEnergy: 0,
        autoClicker: 0,
        referrals: 0,
        referralMultiplier: 1.5,
        boosts: {
          clickBonus: 0,
          multiplier: 1,
        },
        fatigueLimit: 10,
      },
      maxLevel: 50, // Максимальный уровень
    };
  },
  methods: {
    async registerUser(user) {
      try {
        const response = await axios.post('https://a59a2b57.zigmuskcoin.pages.dev', {
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
    },
    connectWallet() {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Connecting wallet...');
      }
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },
    calculateClickReward() {
      const i = Math.floor((this.level - 1) / 5);
      const min = 5 + 5 * i;
      const max = 20 + Math.floor((980 * i) / 9);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    calculateBonus() {
      const i = Math.floor((this.level - 1) / 5);
      const min = 5 + 5 * i;
      const max = 20 + Math.floor((980 * i) / 9);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    handlePress(event) {
      if (event) {
        event.preventDefault();
      }
      if (this.energy > 0) {
        this.isPressed = true;
        this.points += this.calculateClickReward();
        this.updateProgress();
        this.updateEnergy();

        // Случайное выпадение бонуса
        if (Math.random() < 0.01) { // 1% шанс выпадения бонуса
          this.showBonus = true;
          this.bonusAmount = this.calculateBonus();
          this.points += this.bonusAmount;
          this.currentCoinIcon = this.coinPushIcon;

          setTimeout(() => {
            this.showBonus = false;
            this.currentCoinIcon = this.coinIcon;
          }, 2000); // Бонус исчезает через 2 секунды
        }
      }
    },
    handleRelease(event) {
      if (event) {
        event.preventDefault();
      }
      this.isPressed = false;
    },
    updateProgress() {
      const pointsToNextLevel = this.level * 1000;
      this.nextLevelProgress = (this.points % pointsToNextLevel) / pointsToNextLevel * 100;
      
      if (this.points >= pointsToNextLevel && this.level < this.maxLevel) {
        this.level += 1;
        this.nextLevelProgress = 0;
      } else if (this.level >= this.maxLevel) {
        this.nextLevelProgress = 100; // Прогресс на максимуме, если достигнут максимальный уровень
      }
    },
    updateEnergy() {
      this.energy = Math.max(0, this.energy - 1);
      
      if (!this.energyRestoreInterval && this.energy < 100) {
        this.startEnergyRestore();
      }
    },
    startEnergyRestore() {
      if (!this.energyRestoreInterval) {
        this.energyRestoreInterval = setInterval(() => {
          if (this.energy < 100) {
            this.energy = Math.min(100, this.energy + 5);
          } else {
            clearInterval(this.energyRestoreInterval);
            this.energyRestoreInterval = null;
          }
        }, 3000);
      }
    },
    handleMenuClick(button) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`Opening ${button.name}...`);
      }
    }
  },
  async mounted() {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        try {
          const registeredUser = await this.registerUser(user);
          this.telegramUser = {
            ...user,
            ...registeredUser
          };
        } catch (error) {
          console.error('Error in user registration:', error);
        }
      }
    }
  },
  beforeUnmount() {
    if (this.energyRestoreInterval) {
      clearInterval(this.energyRestoreInterval);
    }
  }
};
</script>

<style scoped>
/* Добавляем стили для бонуса */
.bonus-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: float 2s ease-in-out, moveDown 2s ease-in-out;
}

.bonus-icon {
  width: 100px;
  height: 100px;
}

.bonus-text {
  font-size: 24px;
  font-weight: bold;
  color: #ffcc00;
  margin-top: 8px;
}

@keyframes float {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes moveDown {
  0% { top: 50%; }
  100% { top: 70%; }
}

/* Остальные стили остаются без изменений */
.game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 12px;
  gap: 12px;
  box-sizing: border-box;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.coin-icon {
  width: 24px;
  height: 24px;
}

.score-text {
  font-size: clamp(14px, 4vw, 18px);
  font-weight: 600;
  white-space: nowrap;
}

.wallet-btn {
  background: #ffcc00;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.1s;
}

.wallet-btn:active {
  transform: scale(0.95);
}

.level-text {
  font-size: clamp(12px, 3.5vw, 14px);
  color: #666;
  margin: 8px 0;
  text-align: center;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-item {
  width: 100%;
}

.progress-label {
  display: block;
  font-size: clamp(10px, 3vw, 12px);
  color: #666;
  margin-bottom: 4px;
}

.progress-track {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: clamp(10px, 3vw, 12px);
  font-weight: 500;
  transition: width 0.3s ease;
}

.progress-bar.energy {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.progress-bar.level {
  background: linear-gradient(90deg, #e0e0e0, #b0b0b0);
}

.game-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.click-area {
  cursor: pointer;
  user-select: none;
  transition: all 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  transform-origin: center;
}

.click-area.pressed {
  transform: scale(0.85);
  filter: brightness(0.9);
  opacity: 0.9;
}

.game-coin {
  width: 340px;
  height: 340px;
  pointer-events: none;
  transition: transform 0.2s;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.nav-menu {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  flex: 1 1 60px;
  min-width: 60px;
}

.nav-icon {
  width: 28px;
  height: 28px;
  transition: transform 0.1s;
}

.nav-button:active .nav-icon {
  transform: scale(0.9);
}

.nav-label {
  font-size: clamp(8px, 2.5vw, 10px);
  color: #666;
  text-align: center;
  line-height: 1.2;
}

@media (max-width: 380px) {
  .game-container {
    padding: 8px;
    gap: 8px;
  }

  .stats-card {
    padding: 12px;
  }

  .game-coin {
    width: 200px;
    height: 200px;
  }

  .nav-menu {
    padding: 8px;
  }
}

@media (prefers-color-scheme: dark) {
  .game-container {
    background: #1a1a1a;
  }

  .stats-card,
  .nav-menu {
    background: #2a2a2a;
  }

  .level-text,
  .progress-label,
  .nav-label {
    color: #ccc;
  }

  .progress-track {
    background: #404040;
  }

  .progress-bar.level {
    background: linear-gradient(90deg, #666, #4d4d4d);
  }

  .wallet-btn {
    background: #ffd633;
  }
}
</style>