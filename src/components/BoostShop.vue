<template>
    <div class="boost-shop">
      <h2>Магазин бустов</h2>
      <div class="boost-list">
        <!-- Бусты энергии -->
        <div class="boost-item" v-for="boost in energyBoosts" :key="boost.id">
          <h3>{{ boost.name }}</h3>
          <p>Эффект: +{{ boost.effect }} энергии</p>
          <p>Время действия: {{ boost.duration }} часов</p>
          <p>Цена: {{ boost.price }} монет</p>
          <button @click="buyBoost(boost)">Купить</button>
        </div>
  
        <!-- Бусты автокликера -->
        <div class="boost-item" v-for="boost in autoClickerBoosts" :key="boost.id">
          <h3>{{ boost.name }}</h3>
          <p>Эффект: +{{ boost.effect }} кликов/сек</p>
          <p>Время действия: {{ boost.duration }} часов</p>
          <p>Цена: {{ boost.price }} монет</p>
          <button @click="buyBoost(boost)">Купить</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BoostShop',
    data() {
      return {
        energyBoosts: [
          { id: 1, name: 'Энергия +100', effect: 100, duration: 12, price: 10 },
          { id: 2, name: 'Энергия +500', effect: 500, duration: 6, price: 50 },
          { id: 3, name: 'Энергия +5000', effect: 5000, duration: 1, price: 500 },
        ],
        autoClickerBoosts: [
          { id: 4, name: 'Автоклик +2', effect: 2, duration: 24, price: 5 },
          { id: 5, name: 'Автоклик +50', effect: 50, duration: 1, price: 250 },
        ],
      };
    },
    methods: {
      buyBoost(boost) {
        // Отправляем событие в родительский компонент (App.vue) для покупки буста
        this.$emit('buy-boost', boost);
      },
    },
  };
  </script>
  
  <style scoped>
  .boost-shop {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
  }
  
  .boost-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .boost-item {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
  }
  
  button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>