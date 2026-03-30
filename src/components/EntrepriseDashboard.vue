<template>
  <OffreList        v-if="activeTab === 'offres'" />
  <CandidatureList  v-if="activeTab === 'candidatures'" />
  <EvenementList    v-if="activeTab === 'evenements'" />
  <ArticleList      v-if="activeTab === 'articles'" />
  <EntretienList    v-if="activeTab === 'entretiens'" />
  <EditProfile      v-if="activeTab === 'profile'" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import OffreList from './entreprise/OffreList.vue'
import CandidatureList from './entreprise/CandidatureList.vue'
import EvenementList from './entreprise/EvenementList.vue'
import ArticleList from './entreprise/ArticleList.vue'
import EntretienList from './entreprise/EntretienList.vue'
import EditProfile from './EditProfile.vue'

const route = useRoute()
const activeTab = computed(() => route.path.split('/').pop() || 'offres')
</script>
