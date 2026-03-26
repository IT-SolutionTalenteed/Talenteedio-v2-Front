<template>
  <div>
    <h2>Gestion des Offres d'emploi</h2>

    <button @click="openCreate">Ajouter une offre</button>

    <!-- Formulaire création/édition -->
    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} une offre</h3>

      <form @submit.prevent="save">
        <div>
          <label>Titre *</label>
          <input type="text" v-model="form.titre" required />
        </div>

        <div>
          <label>Client</label>
          <input type="text" v-model="form.client" />
        </div>

        <div>
          <label>Localisation</label>
          <input type="text" v-model="form.localisation" />
        </div>

        <div>
          <label>Salaire</label>
          <input type="number" step="0.01" v-model="form.salaire" />
        </div>

        <div>
          <label>Fourchette salariale</label>
          <input type="text" v-model="form.fourchette_salariale" placeholder="ex: 35k€ - 45k€" />
        </div>

        <div>
          <label>Date de mise en ligne</label>
          <input type="date" v-model="form.date_mise_en_ligne" />
        </div>

        <div>
          <label>Date limite</label>
          <input type="date" v-model="form.date_limite" />
        </div>

        <div>
          <label>Mission</label>
          <WysiwygEditor v-model="form.mission" />
        </div>

        <div>
          <label>Profil recherché</label>
          <WysiwygEditor v-model="form.profil_recherche" />
        </div>

        <div>
          <label>À propos</label>
          <WysiwygEditor v-model="form.a_propos" />
        </div>

        <div>
          <label>Liste offre</label>
          <WysiwygEditor v-model="form.liste_offre" />
        </div>

        <div>
          <label>Description</label>
          <WysiwygEditor v-model="form.description" />
        </div>

        <!-- Relations -->
        <div>
          <label>Contrats de travail</label>
          <select v-model="form.job_contract_ids" multiple>
            <option v-for="item in referentiels.job_contracts" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Modes de travail</label>
          <select v-model="form.job_mode_ids" multiple>
            <option v-for="item in referentiels.job_modes" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Compétences requises</label>
          <select v-model="form.skill_ids" multiple>
            <option v-for="item in referentiels.skills" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Formations requises</label>
          <select v-model="form.study_level_ids" multiple>
            <option v-for="item in referentiels.study_levels" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Expériences requises</label>
          <select v-model="form.experience_ids" multiple>
            <option v-for="item in referentiels.experiences" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <small>Maintenez Ctrl/Cmd pour sélectionner plusieurs éléments</small>

        <div>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste -->
    <div v-if="offres.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Client</th>
            <th>Localisation</th>
            <th>Date limite</th>
            <th>Contrats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="offre in offres" :key="offre.id">
            <td>{{ offre.id }}</td>
            <td>{{ offre.titre }}</td>
            <td>{{ offre.client || '-' }}</td>
            <td>{{ offre.localisation || '-' }}</td>
            <td>{{ offre.date_limite ? formatDate(offre.date_limite) : '-' }}</td>
            <td>{{ offre.job_contracts?.map(c => c.name).join(', ') || '-' }}</td>
            <td>
              <button @click="editItem(offre)">Modifier</button>
              <button @click="deleteItem(offre.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1">
        <button :disabled="pagination.current_page <= 1" @click="loadPage(pagination.current_page - 1)">Précédent</button>
        <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page >= pagination.last_page" @click="loadPage(pagination.current_page + 1)">Suivant</button>
      </div>
    </div>

    <div v-else-if="!loading"><p>Aucune offre trouvée.</p></div>

    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="success" style="color: green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/offreService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const offres = ref([])
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })

const emptyForm = () => ({
  titre: '', client: '', localisation: '', salaire: '', fourchette_salariale: '',
  date_mise_en_ligne: '', date_limite: '', mission: '', profil_recherche: '',
  a_propos: '', liste_offre: '', description: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})

const form = ref(emptyForm())

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const response = await offreService.getAll(page)
    offres.value = response.data.data
    pagination.value = { current_page: response.data.current_page, last_page: response.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const response = await offreService.getReferentiels()
    referentiels.value = response.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  showForm.value = true
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    if (editingItem.value) {
      await offreService.update(editingItem.value.id, form.value)
      success.value = 'Offre modifiée avec succès'
    } else {
      await offreService.create(form.value)
      success.value = 'Offre créée avec succès'
    }
    await loadPage(pagination.value.current_page)
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement"
    if (err.response?.data?.errors) {
      const msgs = Object.values(err.response.data.errors).flat()
      error.value = msgs.join(' | ')
    }
  } finally {
    loading.value = false
  }
}

const editItem = (offre) => {
  editingItem.value = offre
  form.value = {
    titre: offre.titre,
    client: offre.client || '',
    localisation: offre.localisation || '',
    salaire: offre.salaire || '',
    fourchette_salariale: offre.fourchette_salariale || '',
    date_mise_en_ligne: offre.date_mise_en_ligne ? offre.date_mise_en_ligne.substring(0, 10) : '',
    date_limite: offre.date_limite ? offre.date_limite.substring(0, 10) : '',
    mission: offre.mission || '',
    profil_recherche: offre.profil_recherche || '',
    a_propos: offre.a_propos || '',
    liste_offre: offre.liste_offre || '',
    description: offre.description || '',
    job_contract_ids: offre.job_contracts?.map(c => c.id) || [],
    job_mode_ids: offre.job_modes?.map(c => c.id) || [],
    skill_ids: offre.skills?.map(c => c.id) || [],
    study_level_ids: offre.study_levels?.map(c => c.id) || [],
    experience_ids: offre.experiences?.map(c => c.id) || [],
  }
  showForm.value = false
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette offre ?')) return
  loading.value = true
  error.value = ''
  try {
    await offreService.delete(id)
    success.value = 'Offre supprimée avec succès'
    await loadPage(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  editingItem.value = null
  form.value = emptyForm()
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR')

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
