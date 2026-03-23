<template>
  <div>
    <h1>Dashboard Administrateur</h1>
    
    <nav>
      <button @click="activeTab = 'overview'">Vue d'ensemble</button>
      <button @click="activeTab = 'media-categories'">Catégories Média</button>
      <button @click="activeTab = 'articles'">Articles</button>
      <button @click="logout" style="background-color: #dc3545;">Déconnexion</button>
    </nav>
    
    <!-- Vue d'ensemble -->
    <div v-if="activeTab === 'overview'">
      <h2>Bienvenue dans l'espace administrateur</h2>
      <p>Vous avez accès à toutes les fonctionnalités d'administration.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 4px;">
          <h3>Catégories Média</h3>
          <p>{{ stats.mediaCategories }} catégories</p>
          <button @click="activeTab = 'media-categories'">Gérer</button>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 4px;">
          <h3>Articles</h3>
          <p>{{ stats.articles }} articles</p>
          <button @click="activeTab = 'articles'">Gérer</button>
        </div>
      </div>
    </div>
    
    <!-- Gestion des catégories média -->
    <MediaCategoryList v-if="activeTab === 'media-categories'" />
    
    <!-- Gestion des articles -->
    <ArticleList v-if="activeTab === 'articles'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'
import mediaCategoryService from '../services/mediaCategoryService.js'
import articleService from '../services/articleService.js'
import MediaCategoryList from './admin/MediaCategoryList.vue'
import ArticleList from './admin/ArticleList.vue'

const router = useRouter()
const activeTab = ref('overview')
const stats = ref({
  mediaCategories: 0,
  articles: 0
})

const loadStats = async () => {
  try {
    const [categoriesResponse, articlesResponse] = await Promise.all([
      mediaCategoryService.getAll(),
      articleService.getAll()
    ])
    
    stats.value.mediaCategories = (categoriesResponse.data.data || categoriesResponse.data).length
    stats.value.articles = (articlesResponse.data.data || articlesResponse.data).length
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const logout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}

onMounted(() => {
  loadStats()
})
</script>