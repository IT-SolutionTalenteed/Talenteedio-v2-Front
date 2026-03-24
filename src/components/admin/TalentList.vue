<template>
  <div>
    <h2>Gestion des Talents</h2>

    <div v-if="talents.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Email</th><th>Suspendu</th><th>Banni</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="talent in talents" :key="talent.id">
            <td>{{ talent.id }}</td>
            <td>{{ talent.name }}</td>
            <td>{{ talent.email }}</td>
            <td>{{ talent.is_suspended ? 'Oui' : 'Non' }}</td>
            <td>{{ talent.is_banned ? 'Oui' : 'Non' }}</td>
            <td>
              <button @click="toggleSuspend(talent)">
                {{ talent.is_suspended ? 'Réactiver' : 'Suspendre' }}
              </button>
              <button @click="toggleBan(talent)">
                {{ talent.is_banned ? 'Débannir' : 'Bannir' }}
              </button>
              <button @click="deleteItem(talent.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination.last_page > 1">
        <button :disabled="pagination.current_page <= 1" @click="loadPage(pagination.current_page - 1)">Précédent</button>
        <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page >= pagination.last_page" @click="loadPage(pagination.current_page + 1)">Suivant</button>
      </div>
    </div>
    <div v-else-if="!loading"><p>Aucun talent trouvé.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import talentService from '../../services/talentService.js'

const talents = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await talentService.getAll(page)
    talents.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const toggleSuspend = async (talent) => {
  try {
    const res = await talentService.toggleSuspend(talent.id)
    talent.is_suspended = res.data.is_suspended
    success.value = talent.is_suspended ? 'Talent suspendu' : 'Talent réactivé'
  } catch {
    error.value = 'Erreur lors de la suspension'
  }
}

const toggleBan = async (talent) => {
  try {
    const res = await talentService.toggleBan(talent.id)
    talent.is_banned = res.data.is_banned
    success.value = talent.is_banned ? 'Talent banni' : 'Talent débanni'
  } catch {
    error.value = 'Erreur lors du bannissement'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer définitivement ce talent ?')) return
  loading.value = true
  error.value = ''
  try {
    await talentService.delete(id)
    success.value = 'Talent supprimé'
    await loadPage(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPage())
</script>
