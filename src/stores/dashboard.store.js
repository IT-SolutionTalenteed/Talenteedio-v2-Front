import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
  const activeTab = ref('overview');

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  return {
    activeTab,
    setActiveTab
  };
});
