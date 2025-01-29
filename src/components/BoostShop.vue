<template>
  <div class="boost-shop">
    <h1>Boost Shop</h1>
    <button @click="goBack">Back to Game</button>
    <!-- Добавьте сюда содержимое BoostShop -->
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/'); // Возврат на главную страницу
    }
  }
};
</script>

<style scoped>
.boost-shop {
  padding: 20px;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #ffcc00;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
</style>