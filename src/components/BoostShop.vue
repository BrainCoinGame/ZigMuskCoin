<template>
  <div>
    <BoostItem
      v-for="(boost, index) in boosts"
      :key="index"
      :boost="boost"
      @buy="handleBuy"
    />
  </div>
</template>

<script>
import BoostItem from '@/components/BoostItem.vue';

export default {
  components: {
    BoostItem,
  },
  data() {
    return {
      boosts: [
        {
          type: 'Ускорение',
          effect: 'Увеличивает скорость на 20%',
          duration: '1 час',
          priceTemporary: 50,
          pricePermanent: 200,
        },
        // Добавьте другие бусты
      ],
    };
  },
  methods: {
    handleBuy(boost, isPermanent) {
      // Обрабатываем покупку буста
      if (isPermanent) {
        console.log('Куплен постоянный буст:', boost);
      } else {
        console.log('Куплен временный буст:', boost);
      }
    },
  },
};
</script>
