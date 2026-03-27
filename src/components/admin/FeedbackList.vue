<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-chat-square-text me-2"></i>
          Feedbacks post-entretien
        </h3>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Talent</th>
              <th>Entreprise</th>
              <th>Événement</th>
              <th>Date entretien</th>
              <th>Note</th>
              <th>Commentaire</th>
              <th>Soumis le</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="text-center text-muted">Aucun feedback soumis pour l'instant.</td>
            </tr>
            <tr v-else v-for="fb in items" :key="fb.id">
              <td>{{ fb.talent?.name }}</td>
              <td>{{ fb.entretien?.entreprise?.nom }}</td>
              <td>{{ fb.entretien?.evenement?.titre }}</td>
              <td>{{ fb.entretien?.date }}</td>
              <td>
                <span class="badge">{{ fb.note }} / 5</span>
              </td>
              <td>{{ fb.commentaire || '—' }}</td>
              <td class="text-muted">{{ formatDate(fb.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="card-footer">
        <div class="alert alert-danger mb-0">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

const formatDate = (str) => str ? new Date(str).toLocaleDateString('fr-FR') : '—'

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/feedbacks')
    items.value = res.data
  } catch {
    error.value = 'Erreur chargement des feedbacks'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
