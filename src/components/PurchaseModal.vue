<template>
  <div class="purchase-modal-overlay" v-if="show">
    <div class="purchase-modal">
      <!-- Ваш контент модального окна -->
      <slot></slot>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.purchase-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.purchase-modal {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 400px;
  text-align: center;
}
</style>