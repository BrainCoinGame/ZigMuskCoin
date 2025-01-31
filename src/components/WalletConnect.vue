<template>
    <div class="wallet-connect">
      <div id="connect-button"></div>
      <div v-if="connected" class="wallet-info">
        <span>{{ shortAddress }}</span>
        <button @click="disconnect">Disconnect</button>
      </div>
    </div>
  </template>
  
  <script>
  import { TonConnectUI } from '@tonconnect/ui'
  
  export default {
    data() {
      return {
        connected: false,
        address: '',
        tonConnectUI: null
      }
    },
    computed: {
      shortAddress() {
        return this.address ? `${this.address.slice(0, 4)}...${this.address.slice(-4)}` : ''
      }
    },
    async mounted() {
      this.tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://your-domain.com/tonconnect-manifest.json',
        buttonRootId: 'connect-button'
      })
  
      this.tonConnectUI.onStatusChange(wallet => {
        this.connected = !!wallet
        this.address = wallet?.account?.address || ''
      })
    },
    methods: {
      async disconnect() {
        await this.tonConnectUI.disconnect()
      }
    }
  }
  </script>