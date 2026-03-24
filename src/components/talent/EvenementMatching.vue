<template>
  <div>
    <h2>Événements & Matching</h2>

    <!-- Formulaire de matching -->
    <div v-if="selectedEvenement && !resultats">
      <h3>Matching pour : {{ selectedEvenement.titre }}</h3>
      <p>{{ selectedEvenement.date_debut }} → {{ selectedEvenement.date_fin }}</p>

      <form @submit.prevent="lancerMatching">
        <div>
          <label>Poste recherché *</label>
          <input type="text" v-model="form.poste_recherche" required
            placeholder="Ex: Développeur Full Stack, Data Analyst..." />
        </div>

        <div>
          <label>Compétences clés</label>
          <textarea v-model="form.competences" rows="3"
            placeholder="Ex: Vue.js, Laravel, Python, gestion de projet..."></textarea>
        </div>

        <div>
          <label>CV (PDF, DOC, DOCX — optionnel)</label>
          <input type="file" accept=".pdf,.doc,.docx" @change="e => cvFile = e.target.files[0]" />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Analyse en cours...' : 'Lancer le matching IA' }}
        </button>
        <button type="button" @click="selectedEvenement = null">Annuler</button>
      </form>
    </div>

    <!-- Résultats du matching -->
    <div v-if="resultats">
      <h3>Résultats du matching — {{ resultats.evenement?.titre }}</h3>
      <button @click="resultats = null; selectedEvenement = null">← Retour aux événements</button>

      <div v-if="resultats.resultats?.length > 0">
        <div v-for="(r, i) in resultats.resultats" :key="r.entreprise_id"
          style="border:1px solid #ccc; margin:8px; padding:12px;">
          <strong>#{{ i + 1 }} — {{ r.nom }}</strong>
          <span style="margin-left:12px; font-weight:bold; color:green;">Score : {{ r.score }}/100</span>
          <p v-if="r.ville">📍 {{ r.ville }}</p>
          <p v-if="r.description">{{ r.description }}</p>
          <p><em>{{ r.raison }}</em></p>
          <button @click="$emit('demanderRdv', r.entreprise_id, r.nom, resultats.evenement)">
            Prendre rendez-vous
          </button>
        </div>
      </div>
      <div v-else><p>Aucun résultat de matching.</p></div>
    </div>

    <!-- Liste des événements -->
    <div v-if="!selectedEvenement && !resultats">
      <div v-if="evenements.length > 0">
        <div v-for="ev in evenements" :key="ev.id"
          style="border:1px solid #ccc; margin:8px; padding:12px;">
          <h3>{{ ev.titre }}</h3>
          <p>{{ ev.date_debut }} → {{ ev.date_fin }}</p>
          <p v-if="ev.ville">📍 {{ ev.ville }}, {{ ev.pays }}</p>
          <button @click="ouvrirMatching(ev)">Lancer le matching IA</button>
        </div>
      </div>
      <div v-else-if="!loading"><p>Aucun événement disponible.</p></div>
    </div>

    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/talent/evenementService.js'

defineEmits(['demanderRdv'])

const evenements = ref([])
const selectedEvenement = ref(null)
const resultats = ref(null)
const loading = ref(false)
const error = ref('')
const cvFile = ref(null)

const form = ref({ poste_recherche: '', competences: '' })

const load = async () => {
  loading.value = true
  try {
    const res = await evenementService.getAll()
    evenements.value = res.data
  } catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const ouvrirMatching = (ev) => {
  selectedEvenement.value = ev
  resultats.value = null
  form.value = { poste_recherche: '', competences: '' }
  cvFile.value = null
  error.value = ''
}

const lancerMatching = async () => {
  loading.value = true; error.value = ''
  try {
    const fd = new FormData()
    fd.append('poste_recherche', form.value.poste_recherche)
    if (form.value.competences) fd.append('competences', form.value.competences)
    if (cvFile.value) fd.append('cv', cvFile.value)

    const res = await evenementService.matching(selectedEvenement.value.id, fd)
    resultats.value = res.data
    selectedEvenement.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du matching. Vérifiez la clé OpenAI.'
  } finally { loading.value = false }
}

onMounted(load)
</script>
