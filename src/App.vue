<template>
  <div class="game-container">
    <div class="top-bar">
      <div class="user-info">
        <span class="user-name">{{ user.name }}</span>
      </div>
      <div class="game-stats">
        <div class="score">
          <img :src="coinIconSrc" alt="Coin" class="coin-icon" />
          <span class="score-value">{{ formatNumber(points) }}</span>
        </div>
        <div class="level">Lvl: {{ level }}</div>
        <div class="progress-bars">
          <div class="energy-container">
            <div class="energy-label">Energy</div>
            <div class="energy-bar">
              <div 
                class="energy-progress" 
                :style="{ width: energy + '%', background: energyGradient }"
              >
                <span class="energy-percent">{{ energy.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
          <div class="level-container">
            <div class="level-label">Progress</div>
            <div class="level-bar">
              <div 
                class="level-progress" 
                :style="{ width: nextLevelProgress + '%', background: levelGradient }"
              >
                <span class="level-percent">{{ nextLevelProgress.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="coin-container">
      <div 
        class="coin" 
        @mousedown="handlePress"
        @mouseup="handleRelease"
        @mouseleave="handleRelease"
        @touchstart="handlePress"
        @touchend="handleRelease"
        @touchcancel="handleRelease"
      >
        <img :src="currentCoinImage" alt="Coin" class="coin-image" />
      </div>
      <div v-if="clickEffect" class="click-effect" :class="{ 'effect-active': clickEffect }">
        +{{ formatNumber(calculateClickReward()) }}
      </div>
    </div>

    <div class="menu">
      <button
        v-for="(button, index) in menuButtons"
        :key="index"
        @click="handleMenuClick(button)"
        class="menu-button"
      >
        <img :src="button.icon" :alt="button.name" class="button-icon" />
      </button>
    </div>
  </div>
</template>

<script>
import coinImage from '@/assets/coin.png';
import coinPushImage from '@/assets/coin-push.png';
import shopIcon from '@/assets/icons/shop.png';
import settingsIcon from '@/assets/icons/settings.png';
import trophyIcon from '@/assets/icons/trophy.png';
import rankingIcon from '@/assets/icons/ranking.png';
import helpIcon from '@/assets/icons/help.png';

export default {
  name: 'ClickerGame',
  data() {
    return {
      user: {
        name: 'User',
      },
      points: 0,
      level: 1,
      energy: 100,
      nextLevelProgress: 0,
      coinIconSrc: coinImage,
      menuButtons: [
        { icon: shopIcon, name: 'Shop' },
        { icon: settingsIcon, name: 'Settings' },
        { icon: trophyIcon, name: 'Trophy' },
        { icon: rankingIcon, name: 'Ranking' },
        { icon: helpIcon, name: 'Help' },
      ],
      currentCoinImage: coinImage,
      clickEffect: null,
      energyGradient: 'linear-gradient(to right, #ff0000, #ffcc00)',
      levelGradient: 'linear-gradient(to right, #00cc00, #009900)',
      restoreInterval: null,
      lastClickTime: 0,
      restoreDelay: 3000,
      isPressed: false,
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
      }
    };
  },
  computed: {
    totalClicksAvailable() {
      return this.gameState.baseClicks + this.gameState.additionalEnergy;
    },
    fatigueCoefficient() {
      if (this.level <= 10) return 0;
      return Math.min((this.level - 10) / this.gameState.fatigueLimit, 1);
    },
  },
  methods: {
    formatNumber(num) {
      if (!num) return '0';
      return new Intl.NumberFormat().format(Math.floor(num));
    },
    handlePress(event) {
      if (this.energy <= 0) return;
      this.isPressed = true;
      this.currentCoinImage = coinPushImage;
      this.processClick();
      this.startAutoClick();
    },
    handleRelease() {
      this.isPressed = false;
      this.currentCoinImage = coinImage;
      this.stopAutoClick();
    },
    calculateClickReward() {
      let baseReward = this.level;
      if (this.level > 10) {
        baseReward *= (1 - this.fatigueCoefficient);
      }
      baseReward += this.gameState.boosts.clickBonus;
      baseReward *= this.gameState.boosts.multiplier;
      return Math.floor(baseReward);
    },
    processClick() {
      if (this.energy <= 0) return;
      
      const reward = this.calculateClickReward();
      this.points += reward;
      
      this.energy = Math.max(0, this.energy - 0.5);
      this.lastClickTime = Date.now();

      if (this.restoreInterval) {
        clearInterval(this.restoreInterval);
        this.restoreInterval = null;
      }

      setTimeout(() => {
        if (Date.now() - this.lastClickTime >= this.restoreDelay) {
          this.startEnergyRestore();
        }
      }, this.restoreDelay);

      this.showClickEffect();
      this.updateLevelProgress();
      this.updateEnergyGradient();
    },
    showClickEffect() {
      this.clickEffect = true;
      setTimeout(() => {
        this.clickEffect = null;
      }, 1000);
    },
    updateEnergyGradient() {
      const red = Math.round((this.energy / 100) * 255);
      const gold = 255 - red;
      this.energyGradient = `linear-gradient(to right, rgb(255, 0, 0), rgb(255, ${gold}, 0))`;
    },
    updateLevelGradient() {
      const hue = (this.level * 30) % 360;
      this.levelGradient = `linear-gradient(to right, hsl(${hue}, 100%, 50%), hsl(${hue - 20}, 100%, 40%))`;
    },
    calculateRequiredPoints(level) {
      if (level <= 10) {
        return 100 + 50 * (level - 1);
      }
      const prevRequired = this.calculateRequiredPoints(level - 1);
      return Math.round(prevRequired * 1.5);
    },
    updateLevelProgress() {
      const requiredPoints = this.calculateRequiredPoints(this.level);
      if (this.points >= requiredPoints) {
        this.level += 1;
        this.nextLevelProgress = 0;
        this.updateLevelGradient();
      } else {
        this.nextLevelProgress = (this.points / requiredPoints) * 100;
      }
    },
    startEnergyRestore() {
      if (this.restoreInterval) return;

      this.restoreInterval = setInterval(() => {
        if (Date.now() - this.lastClickTime >= this.restoreDelay) {
          if (this.energy < 100) {
            this.energy = Math.min(100, this.energy + 0.25);
            this.updateEnergyGradient();
          } else if (this.energy >= 100) {
            clearInterval(this.restoreInterval);
            this.restoreInterval = null;
          }
        }
      }, 1000);
    },
    startAutoClick() {
      if (this.autoClickInterval) return;

      this.autoClickInterval = setInterval(() => {
        if (this.isPressed) {
          this.processClick();
        }
      }, 100);
    },
    stopAutoClick() {
      if (this.autoClickInterval) {
        clearInterval(this.autoClickInterval);
        this.autoClickInterval = null;
      }
    },
    handleMenuClick(button) {
      console.log('Menu button clicked:', button);
    },
  },
  mounted() {
    this.updateEnergyGradient();
    this.updateLevelGradient();
    this.updateLevelProgress();
    this.startEnergyRestore();
  },
  beforeDestroy() {
    if (this.restoreInterval) {
      clearInterval(this.restoreInterval);
    }
    if (this.autoClickInterval) {
      clearInterval(this.autoClickInterval);
    }
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  color: #000000;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.top-bar {
  position: absolute;
  width: 95%;
  max-width: 450px;
  margin: 10px auto;
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.game-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.score {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
  font-weight: bold;
}

.coin-icon {
  width: 24px;
  height: 24px;
}

.coin-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 160px;
}

.coin {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.coin-image {
  width: 300px;
  height: 300px;
  /* Убрать transition для мгновенной смены изображения */
}

.menu {
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.menu-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border: none;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-button:active {
  transform: scale(0.95);
  background: #e0e0e0;
}

.button-icon {
  width: 32px;
  height: 32px;
}

.click-effect {
  position: absolute;
  font-size: 32px;
  font-weight: bold;
  color: #ffcc00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
}

.effect-active {
  animation: float-up 1s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1);
  }
}

.energy-bar, .level-bar {
  width: 100px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.energy-progress, .level-progress {
  height: 100%;
  transition: width 0.3s ease;
}

.energy-percent, .level-percent {
  font-size: 10px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
