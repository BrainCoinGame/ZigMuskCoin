<template>
  <div class="game-container">
    <!-- Stats Card -->
    <div class="stats-card">
      <div class="stats-header">
        <div class="score-container">
          <img :src="currentCoinIcon" alt="Coin" class="coin-icon" />
          <span class="score-text">{{ formatNumber(points) }}</span>
        </div>
        <!-- Кнопка Connect Wallet в левом верхнем углу -->
        <button 
          class="connect-button"
          @click="toggleWalletModal"
        >
          Connect Wallet
        </button>
      </div>

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
          <span class="progress-label">Lvl</span>
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
        <!-- Отображение значения за клик -->
        <div v-if="showClickValue" class="click-value">
          +{{ clickValue }}
        </div>
      </div>

      <!-- Bonus Popup -->
      <div v-if="showBonus" class="bonus-popup">
        <img :src="bonusIcon" alt="Bonus" class="bonus-icon" />
        <span class="bonus-text">+{{ bonusAmount }}</span>
      </div>
    </div>

    <!-- Boost Menu -->
    <div class="boost-menu">
      <button @click="activateBoost('clickBonus', 60000, 10)">Activate Click Boost</button>
      <button @click="activateBoost('energyRestore', 60000, 5)">Activate Energy Boost</button>
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

    <!-- Wallet Modal -->
    <WalletConnect v-if="showWalletModal" @close="toggleWalletModal" />
    <PurchaseModal v-if="showPurchaseModal" :show="showPurchaseModal" @close="togglePurchaseModal" />
  </div>
</template>

<script>
import axios from 'axios';
import coinIcon from '@/assets/coin.png';
import coinPushIcon from '@/assets/coin-push.png';
import shopIcon from '@/assets/icons/shop.gif';
import settingsIcon from '@/assets/icons/settings.png';
import trophyIcon from '@/assets/icons/trophy.png';
import rankingIcon from '@/assets/icons/ranking.png';
import helpIcon from '@/assets/icons/help.png';
import bonusIcon from '@/assets/bonus.png';
import WalletConnect from '@/components/WalletConnect.vue';
import Wallet from '@/components/Wallet.vue';
import PurchaseModal from '@/components/PurchaseModal.vue';

export default {
  name: 'ZigMuskGame',
  components: {
    WalletConnect,
    Wallet,
    PurchaseModal
  },
  data() {
    return {
      telegramUser: null,
      points: 0,
      level: 1,
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
        { icon: shopIcon, name: 'Boost', route: '/boostshop' },
        { icon: settingsIcon, name: 'Settings' },
        { icon: trophyIcon, name: 'Trophy' },
        { icon: rankingIcon, name: 'Ranking' },
        { icon: helpIcon, name: 'Help' }
      ],
      boosts: {
        clickBonus: 0,
        energyRestore: 0,
        multiplier: 1,
      },
      activeBoosts: [],
      maxLevel: 50,
      showWalletModal: false,
      showPurchaseModal: false,
      showClickValue: false,
      clickValue: 0
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
    toggleWalletModal() {
      this.showWalletModal = !this.showWalletModal;
    },
    togglePurchaseModal() {
      this.showPurchaseModal = !this.showPurchaseModal;
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },
    calculateClickReward() {
      return this.level;
    },
    calculateBonus() {
      if (this.level >= 1 && this.level <= 10) {
        return Math.floor(Math.random() * 6) + 5;
      } else if (this.level >= 11 && this.level <= 20) {
        return Math.floor(Math.random() * 16) + 10;
      } else if (this.level >= 21 && this.level <= 30) {
        return Math.floor(Math.random() * 76) + 25;
      } else if (this.level >= 31 && this.level <= 40) {
        return Math.floor(Math.random() * 401) + 100;
      } else if (this.level >= 41 && this.level <= 50) {
        return Math.floor(Math.random() * 9501) + 500;
      }
      return 0;
    },
    handlePress(event) {
      if (event) {
        event.preventDefault();
      }
      if (this.energy > 0) {
        this.isPressed = true;
        const baseReward = this.calculateClickReward();
        const boostedReward = baseReward * this.boosts.multiplier + this.boosts.clickBonus;
        this.points += boostedReward;
        this.clickValue = boostedReward;
        this.showClickValue = true;
        this.updateProgress();
        this.updateEnergy();

        if (Math.random() < 0.01) {
          this.showBonus = true;
          this.bonusAmount = this.calculateBonus();
          this.points += this.bonusAmount;
          this.currentCoinIcon = this.coinPushIcon;

          setTimeout(() => {
            this.showBonus = false;
            this.currentCoinIcon = this.coinIcon;
          }, 2000);
        }

        setTimeout(() => {
          this.showClickValue = false;
        }, 1000);
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
        this.nextLevelProgress = 100;
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
            const restoreAmount = 5 + this.boosts.energyRestore;
            this.energy = Math.min(100, this.energy + restoreAmount);
          } else {
            clearInterval(this.energyRestoreInterval);
            this.energyRestoreInterval = null;
          }
        }, 3000);
      }
    },
    activateBoost(boostType, duration, value) {
      this.boosts[boostType] += value;
      this.activeBoosts.push({ type: boostType, duration, value });

      setTimeout(() => {
        this.deactivateBoost(boostType, value);
      }, duration);
    },
    deactivateBoost(boostType, value) {
      this.boosts[boostType] -= value;
      this.activeBoosts = this.activeBoosts.filter(boost => boost.type !== boostType);
    },
    handleMenuClick(button) {
      if (!button) {
        console.error('Button is not defined');
        return;
      }

      if (button.name === 'Boost') {
        window.open('/boost', '_blank');
      } else if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`Opening ${button.name || 'unknown button'}...`);
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
.game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 5px;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  gap: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: calc(100% - 16px);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.coin-icon {
  width: 20px;
  height: 20px;
}

.score-text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.connect-button {
  background: #4CAF50;
  border: none;
  border-radius: 20px;
  padding: 4px 15px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.1s;
}

.connect-button:active {
  transform: scale(0.95);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
}

.progress-item {
  width: 40%;
}

.progress-label {
  display: block;
  font-size: 10px;
  color: #666;
  margin-bottom: 2px;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0px;
  font-weight: 500;
  transition: width 0.3s ease;
}

.progress-bar.energy {
  background: linear-gradient(90deg, #ff0000, #e5ff00);
}

.progress-bar.level {
  background: linear-gradient(90deg, #1300b9, #0c9200);
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
  position: relative;
}

.click-area.pressed {
  transform: scale(0.85);
  filter: brightness(0.9);
  opacity: 0.9;
}

.game-coin {
  width: 400px;
  height: 400px;
  pointer-events: none;
  transition: transform 0.2s;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.bonus-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: float 1.5s ease-in-out;
}

.bonus-icon {
  width: 96px; /* Увеличен на 60% */
  height: 96px;
  animation: bounce 0.5s ease-in-out;
}

.bonus-text {
  font-size: 24px; /* Увеличенный шрифт */
  font-weight: bold;
  color: #4CAF50;
  margin-top: 8px;
}

.click-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  animation: float 1s ease-in-out;
}

@keyframes float {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.nav-menu {
  background: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 4px;
  width: calc(100% - 16px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  flex: 1 1 60px;
  min-width: 60px;
}

.nav-icon {
  width: 34px;
  height: 34px;
  transition: transform 0.1s;
}

.nav-button:active .nav-icon {
  transform: scale(0.9);
}

.nav-label {
  font-size: 10px;
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
    padding: 6px;
  }

  .game-coin {
    width: 350px;
    height: 350px;
  }

  .nav-menu {
    padding: 6px;
  }

  .bonus-icon {
    width: 76px; /* Увеличен на 60% */
    height: 76px;
  }

  .bonus-text {
    font-size: 20px; /* Увеличенный шрифт */
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

  .connect-button {
    background: #4CAF50;
  }
}
</style>