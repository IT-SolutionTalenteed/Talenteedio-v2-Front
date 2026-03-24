<template>
  <div>
    <h2>Offres d'emploi</h2>

    <!-- Formulaire de candidature -->
    <div v-if="showCandidature && selectedOffre">
      <h3>Postuler — {{ selectedOffre.titre }}</h3>
      <form @submit.prevent="postuler">
        <div>
          <label>CV (PDF, DOC, DOCX) *</label>
          <input type="file" accept=".pdf,.doc,.docx" @change="e => cvFile = e.target.files[0]" required />
        </div>
        <div>
          <label>Message de motivation</label>
          <textarea v-model="candidatureMessage" rows="5" placeholder="Présentez-vous brièvement..."></textarea>
        </div>
        <button type="submit" :disabled="loading || !cvFile">
          {{ loading ? 'Envoi...' : 'Envoyer ma candidature' }}
        </button>
        <button type="button" @click="showCandidature = false">Annuler</button>
      </form>
    </div>

    <!-- Liste des offres -->
    <div v-if="offres.length > 0">
      <div v-for="offre in offres" :key="offre.id" style="border:1px solid #ccc; margin:8px; padding:12px;">
        <h3>{{ offre.titre }}</h3>
        <p v-if="offre.entreprise"><strong>Entreprise :</strong> {{ offre.entreprise.nom }}</p>
        <p v-if="offre.localisation"><strong>Lieu :</strong> {{ offre.localisation }}</p>
        <p v-if="offre.fourchette_salariale"><strong>Salaire :</strong> {{ offre.fourchette_salariale }}</p>
        <p v-if="offre.date_limite"><strong>Date limite :</strong> {{ offre.date_limite }}</p>

        <div v-if="offre.job_contracts?.length">
          <strong>Contrats :</strong> {{ offre.job_contracts.map(c => c.name).join(', ') }}
        </div>
        <div v-if="offre.job_modes?.length">
          <strong>Modes :</strong> {{ offre.job_modes.map(m => m.name).join(', ') }}
        </div>
        <div v-if="offre.skills?.length">
          <strong>Compétences :</strong> {{ offre.skills.map(s => s.name).join(', ') }}
        </div>

        <p v-if="offre.description">{{ offre.description }}</p>

        <button @click="openCandidature(offre)">Postuler</button>
      </div>

      <div v-if="pagination.last_page > 1">
        <button :disabled="pagination.current_page <= 1" @click="loadPage(pagination.current_page - 1)">Précédent</button>
        <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page >= pagination.last_page" @click="loadPage(pagination.current_page + 1)">Suivant</button>
      </div>
    </div>
    <div v-else-if="!loading"><p>Aucune offre disponible.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/talent/offreService.js'

const offres = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })
const showCandidature = ref(false)
const selectedOffre = ref(null)
const cvFile = ref(null)
const candidatureMessage = ref('')

const loadPage = async (page = 1) => {
  loading.value = true; error.value = ''
  try {
    const res = await offreService.getAll(page)
    offres.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch { error.value = 'Erreur chargement des offres' }
  finally { loading.value = false }
}

const openCandidature = (offre) => {
  selectedOffre.value = offre
  cvFile.value = null
  candidatureMessage.value = ''
  showCandidature.value = true
  success.value = ''
  error.value = ''
}

const postuler = async () => {
  if (!cvFile.value) return
  loading.value = true; error.value = ''; success.value = ''
  try {
    const fd = new FormData()
    fd.append('cv', cvFile.value)
    if (candidatureMessage.value) fd.append('message', candidatureMessage.value)
    await offreService.postuler(selectedOffre.value.id, fd)
    success.value = 'Candidature envoyée avec succès !'
    showCandidature.value = false
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la candidature'
  } finally { loading.value = false }
}

onMounted(() => loadPage())
</script>
