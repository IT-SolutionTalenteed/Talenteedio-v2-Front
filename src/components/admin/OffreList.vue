<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-briefcase me-2"></i>
          Gestion des Offres d'emploi
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="openCreate">
            <i class="bi bi-plus"></i>
            Ajouter une offre
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm || editingItem" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }} une offre</h4>

        <form @submit.prevent="save">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label required">Titre</label>
              <input type="text" class="form-control" v-model="form.titre" required />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Client</label>
              <input type="text" class="form-control" v-model="form.client" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Localisation</label>
              <input type="text" class="form-control" v-model="form.localisation" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Fourchette salariale</label>
              <input type="text" class="form-control" v-model="form.fourchette_salariale" placeholder="ex: 35k€ - 45k€" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Date de mise en ligne</label>
              <input type="date" class="form-control" v-model="form.date_mise_en_ligne" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Date limite</label>
              <input type="date" class="form-control" v-model="form.date_limite" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Mission</label>
              <WysiwygEditor v-model="form.mission" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Profil recherché</label>
              <WysiwygEditor v-model="form.profil_recherche" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">À propos</label>
              <WysiwygEditor v-model="form.a_propos" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Description</label>
              <WysiwygEditor v-model="form.description" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Contrats de travail</label>
              <select class="form-select" v-model="form.job_contract_ids" multiple size="4">
                <option v-for="item in referentiels.job_contracts" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
              <small class="form-hint">Maintenez Ctrl/Cmd pour sélectionner plusieurs</small>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Modes de travail</label>
              <select class="form-select" v-model="form.job_mode_ids" multiple size="4">
                <option v-for="item in referentiels.job_modes" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Compétences requises</label>
              <select class="form-select" v-model="form.skill_ids" multiple size="4">
                <option v-for="item in referentiels.skills" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Formations requises</label>
              <select class="form-select" v-model="form.study_level_ids" multiple size="4">
                <option v-for="item in referentiels.study_levels" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Expériences requises</label>
              <select class="form-select" v-model="form.experience_ids" multiple size="4">
                <option v-for="item in referentiels.experiences" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn" @click="cancelForm">Annuler</button>
          </div>
        </form>
      </div>

      <!-- Liste -->
      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Client</th>
              <th>Localisation</th>
              <th>Date limite</th>
              <th>Contrats</th>
              <th class="w-1"></th>
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
            <tr v-else-if="offres.length === 0">
              <td colspan="7" class="text-center text-muted">Aucune offre trouvée.</td>
            </tr>
            <tr v-else v-for="offre in offres" :key="offre.id">
              <td class="text-muted">{{ offre.id }}</td>
              <td>
                <div class="fw-bold">{{ offre.titre }}</div>
                <div v-if="offre.fourchette_salariale" class="text-muted small">{{ offre.fourchette_salariale }}</div>
              </td>
              <td>{{ offre.client || '-' }}</td>
              <td>{{ offre.localisation || '-' }}</td>
              <td>{{ offre.date_limite ? formatDate(offre.date_limite) : '-' }}</td>
              <td>
                <span v-if="offre.job_contracts?.length" class="badge">
                  {{ offre.job_contracts.map(c => c.name).join(', ') }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editItem(offre)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(offre.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="card-footer d-flex align-items-center">
        <p class="m-0 text-muted">
          Page {{ pagination.current_page }} sur {{ pagination.last_page }}
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
            <a class="page-link" href="#" @click.prevent="loadPage(pagination.current_page - 1)">
              <i class="bi bi-chevron-left"></i>
              Précédent
            </a>
          </li>
          <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
            <a class="page-link" href="#" @click.prevent="loadPage(pagination.current_page + 1)">
              Suivant
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </div>

      <!-- Messages -->
      <div v-if="error || success" class="card-footer">
        <div v-if="error" class="alert alert-danger mb-0">{{ error }}</div>
        <div v-if="success" class="alert alert-success mb-0">{{ success }}</div>
      </div>
    </div>
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
