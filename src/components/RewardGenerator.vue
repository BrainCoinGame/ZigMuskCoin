<template>
  <div class="reward-generator">
    <div class="animation-container">
      <transition name="bonus-fall">
        <div v-if="showBonus" class="bonus-container">
          <img 
            :src="bonusImage" 
            alt="Bonus" 
            class="bonus"
          >
          <transition name="text-fly">
            <span v-if="showText" class="reward-text">+{{ currentReward }}</span>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import bonusImg from '@/assets/bonus.png';

export default {
  props: {
    reward: {
      type: Number,
      default: null,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showBonus: false,
      showText: false,
      bonusImage: bonusImg,
      currentReward: null,
    };
  },
  computed: {
    i() {
      return Math.floor((this.level - 1) / 5);
    },
    maxReward() {
      return 20 + Math.floor((980 * this.i) / 9);
    },
    minReward() {
      return 5;
    },
  },
  watch: {
    reward(newVal) {
      if (newVal !== null) {
        this.triggerAnimation(newVal);
      }
    },
  },
  methods: {
    triggerAnimation(reward) {
      this.showBonus = false;
      this.showText = false;
      this.currentReward = null;

      setTimeout(() => {
        this.currentReward = reward;
        this.showBonus = true;

        setTimeout(() => {
          this.showText = true;
        }, 300);
      }, 300);
    },
  },
};
</script>

<style scoped>
.reward-generator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.animation-container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bonus-container {
  position: absolute;
  text-align: center;
}

.bonus {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.reward-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.bonus-fall-enter-active {
  animation: bonus-fall 0.5s ease-out;
}

@keyframes bonus-fall {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.text-fly-enter-active {
  animation: text-fly 1s ease-out forwards;
}

@keyframes text-fly {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.5);
  }
}
</style>