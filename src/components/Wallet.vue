<template>
    <div class="wallet-container">
      <div v-if="!currentWallet">
        <h2>Привязка TON-кошелька</h2>
        <input 
          v-model="walletAddress"
          placeholder="Введите адрес кошелька (например: EQ...)"
          class="wallet-input"
        />
        <button 
          @click="validateAndSubmit"
          :disabled="!isFormValid"
          class="submit-btn"
        >
          Привязать
        </button>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
  
      <div v-else class="wallet-info">
        <h3>Привязанный кошелек:</h3>
        <p class="wallet-address">{{ currentWallet }}</p>
        <button @click="removeWallet" class="remove-btn">
          Отвязать кошелек
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const walletAddress = ref('')
  const errorMessage = ref('')
  const currentWallet = ref(null)
  const userId = ref(null) // Получаем из Telegram Web App
  
  // Регулярка для валидации TON-кошелька
  const validateTonAddress = (address) => /^EQ[0-9a-zA-Z]{48}$/.test(address)
  
  // Получение данных при монтировании
  onMounted(async () => {
    try {
      const response = await axios.get('/api/wallet', {
        params: { userId: userId.value }
      })
      currentWallet.value = response.data.wallet
    } catch (error) {
      console.error('Ошибка загрузки кошелька:', error)
    }
  })
  
  const isFormValid = computed(() => validateTonAddress(walletAddress.value))
  
  const validateAndSubmit = async () => {
    if (!isFormValid.value) {
      errorMessage.value = 'Неверный формат адреса кошелька'
      return
    }
  
    try {
      const response = await axios.post('/api/wallet', {
        userId: userId.value,
        wallet: walletAddress.value
      })
      
      if (response.data.success) {
        currentWallet.value = walletAddress.value
        walletAddress.value = ''
        errorMessage.value = ''
        // Отправка события в Telegram
        Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      }
    } catch (error) {
      errorMessage.value = 'Ошибка при сохранении: ' + error.response?.data?.message
      Telegram.WebApp.HapticFeedback.notificationOccurred('error')
    }
  }
  
  const removeWallet = async () => {
    try {
      await axios.delete('/api/wallet', { data: { userId: userId.value } })
      currentWallet.value = null
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }
  </script>
  
  <style scoped>
  .wallet-container {
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .wallet-input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #0088cc;
    border-radius: 8px;
  }
  
  .submit-btn {
    background: #0088cc;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .error-message {
    color: #ff4444;
    margin-top: 10px;
  }
  
  .wallet-info {
    text-align: center;
  }
  
  .wallet-address {
    word-break: break-all;
    margin: 15px 0;
  }
  </style>