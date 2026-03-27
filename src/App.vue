<template>
  <GlobalLoader v-if="isLoading" />

  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import GlobalLoader from '@/components/layout/GlobalLoader.vue';
import { useGlobalStore } from '@/stores/global.store';

const globalStore = useGlobalStore();
const { isLoading } = storeToRefs(globalStore);
</script>

<style>
/* Les styles globaux sont maintenant dans assets/scss/main.scss */
</style>
