<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-calendar-check me-2"></i>
          Entretiens par stand
        </h3>
      </div>

      <div class="card-body">
        <div class="mb-4">
          <label class="form-label">Sélectionner un événement</label>
          <select class="form-select" v-model="selectedEvenementId" @change="load">
            <option value="">-- Choisir un événement --</option>
            <option v-for="ev in evenements" :key="ev.id" :value="ev.id">
              {{ ev.titre }} ({{ ev.date_debut }})
            </option>
          </select>
        </div>

        <div v-if="stands.length > 0">
          <div v-for="stand in stands" :key="stand.entreprise.id" class="card mb-3">
            <div class="card-header">
              <h4 class="card-title">
                <i class="bi bi-building me-2"></i>
                Stand : {{ stand.entreprise.nom }}
              </h4>
            </div>
            <div class="table-responsive">
              <table class="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Talent</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="e in stand.entretiens" :key="e.id">
                    <td>
                      <div class="fw-bold">{{ e.talent?.name }}</div>
                      <div class="text-muted small">{{ e.talent?.email }}</div>
                    </td>
                    <td>{{ e.date }}</td>
                    <td class="text-muted">{{ e.heure_debut }} – {{ e.heure_fin }}</td>
                    <td>
                      <span v-if="e.statut === 'en_attente'" class="badge bg-secondary">En attente</span>
                      <span v-else-if="e.statut === 'confirme'" class="badge bg-success">Confirmé</span>
                      <span v-else-if="e.statut === 'refuse'" class="badge bg-danger">Refusé</span>
                      <span v-else-if="e.statut === 'annule'" class="badge">Annulé</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="selectedEvenementId && !loading" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Aucun entretien pour cet événement.
        </div>
        <div v-else-if="!selectedEvenementId" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Sélectionnez un événement pour voir les entretiens.
        </div>
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

const evenements = ref([])
const stands = ref([])
const selectedEvenementId = ref('')
const loading = ref(false)
const error = ref('')

const loadEvenements = async () => {
  try {
    const res = await api.get('/admin/entretiens-evenements')
    evenements.value = res.data
  } catch { error.value = 'Erreur chargement événements' }
}

const load = async () => {
  if (!selectedEvenementId.value) return
  loading.value = true; error.value = ''
  try {
    const res = await api.get('/admin/entretiens', { params: { evenement_id: selectedEvenementId.value } })
    stands.value = res.data
  } catch { error.value = 'Erreur chargement entretiens' }
  finally { loading.value = false }
}

onMounted(loadEvenements)
</script>
