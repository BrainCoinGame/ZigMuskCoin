<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <h3>Купить NFT растения</h3>
      <p>Цена: {{ price }}</p>
      <button @click="handlePurchase">Подтвердить</button>
      <button @click="$emit('close')">Отмена</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { Address, beginCell, TonClient, toNano } from '@ton/core'; // Обновленный импорт

export default {
  props: {
    show: Boolean,
    price: String,
    plantId: Number,
    buyerAddress: String,
  },
  data() {
    return {
      error: null,
    };
  },
  methods: {
    async handlePurchase() {
      try {
        if (!this.buyerAddress) {
          throw new Error('Кошелек не подключен');
        }
        await this.purchaseNFT(this.plantId, this.buyerAddress);
        this.$emit('success');
      } catch (err) {
        this.error = err.message;
      }
    },

    async purchaseNFT(plantId, buyerAddress) {
      const CONTRACT_ADDRESS = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM';
      const OPCODE_PURCHASE = 0x12345678;

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      });

      const body = beginCell()
        .storeUint(OPCODE_PURCHASE, 32)
        .storeUint(plantId, 64)
        .endCell();

      await client.sendExternalMessage({
        address: Address.parse(CONTRACT_ADDRESS),
        body: body,
        amount: toNano(this.price.replace(' TON', '')),
      });
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>