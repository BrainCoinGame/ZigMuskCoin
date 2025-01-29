<template>
  <div class="boost-item">
    <h3>{{ boost.type }}</h3>
    <p>Эффект: {{ boost.effect }}</p>
    <p>Длительность: {{ boost.duration }}</p>
    <p>Цена (временный): {{ boost.priceTemporary }} монет</p>
    <p>Цена (постоянный): {{ boost.pricePermanent }} монет</p>
    <button @click="buyTemporary">Купить временный</button>
    <button @click="buyPermanent">Купить постоянный</button>
  </div>
</template>

<script>
export default {
  props: {
    boost: {
      type: Object,
      required: true,
    },
  },
  methods: {
    buyTemporary() {
      this.$emit('buy', this.boost, false);
    },
    buyPermanent() {
      this.$emit('buy', this.boost, true);
    },
  },
};
</script>

<style>
.boost-item {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button {
  margin: 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>