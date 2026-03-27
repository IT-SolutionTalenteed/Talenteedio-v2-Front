<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-calendar-event me-2"></i>
          Gestion des Événements
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="openCreate">
            <i class="bi bi-plus"></i>
            Ajouter un événement
          </button>
        </div>
      </div>

      <div v-if="referentiels.categories?.length === 0" class="card-body">
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Aucune catégorie d'événement disponible. Créez-en une d'abord dans "Catégories d'événement".
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm || editingItem" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }} un événement</h4>

        <form @submit.prevent="save">
          <div class="row">
            <div class="col-md-8 mb-3">
              <label class="form-label required">Titre</label>
              <input type="text" class="form-control" v-model="form.titre" required />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Catégorie</label>
              <select class="form-select" v-model="form.categorie_evenement_id">
                <option value="">-- Aucune --</option>
                <option v-for="cat in referentiels.categories" :key="cat.id" :value="cat.id">{{ cat.titre }}</option>
              </select>
            </div>

            <div class="col-md-12 mb-3">
              <label class="form-label">Image mise en avant</label>
              <input type="file" class="form-control" accept="image/*" @change="e => imageFile = e.target.files[0]" />
              <img v-if="imagePreview" :src="imagePreview" class="mt-2 avatar avatar-xl" />
              <img v-else-if="editingItem?.image_mise_en_avant_url" :src="editingItem.image_mise_en_avant_url" class="mt-2 avatar avatar-xl" />
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label required">Date début</label>
              <input type="date" class="form-control" v-model="form.date_debut" required />
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label required">Date fin</label>
              <input type="date" class="form-control" v-model="form.date_fin" required />
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label required">Heure début</label>
              <input type="time" class="form-control" v-model="form.heure_debut_journee" required />
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label required">Heure fin</label>
              <input type="time" class="form-control" v-model="form.heure_fin_journee" required />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Pays</label>
              <input type="text" class="form-control" v-model="form.pays" />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Ville</label>
              <input type="text" class="form-control" v-model="form.ville" />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Adresse</label>
              <input type="text" class="form-control" v-model="form.adresse" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Description</label>
              <WysiwygEditor v-model="form.description" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Détails supplémentaires</label>
              <WysiwygEditor v-model="form.details_supplementaires" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Entreprises participantes</label>
              <select class="form-select" v-model="form.entreprise_ids" multiple size="5">
                <option v-for="e in referentiels.entreprises" :key="e.id" :value="e.id">{{ e.nom }}</option>
              </select>
              <small class="form-hint">Maintenez Ctrl/Cmd pour sélectionner plusieurs</small>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" v-model="form.is_featured" />
                <span class="form-check-label">Mise en avant</span>
              </label>
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
              <th>Image</th>
              <th>Titre</th>
              <th>Dates</th>
              <th>Ville</th>
              <th>Mis en avant</th>
              <th>Entreprises</th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="evenements.length === 0">
              <td colspan="8" class="text-center text-muted">Aucun événement trouvé.</td>
            </tr>
            <tr v-else v-for="ev in evenements" :key="ev.id">
              <td class="text-muted">{{ ev.id }}</td>
              <td>
                <img v-if="ev.image_mise_en_avant_url" :src="ev.image_mise_en_avant_url" class="avatar" />
                <span v-else class="avatar">?</span>
              </td>
              <td>
                <div class="fw-bold">{{ ev.titre }}</div>
                <div v-if="ev.ville" class="text-muted small">{{ ev.ville }}</div>
              </td>
              <td class="text-muted">
                {{ formatDate(ev.date_debut) }} → {{ formatDate(ev.date_fin) }}
              </td>
              <td>{{ ev.ville || '-' }}</td>
              <td>
                <button class="btn btn-sm" @click="toggleFeatured(ev)">
                  <i v-if="ev.is_featured" class="bi bi-star-fill text-warning"></i>
                  <i v-else class="bi bi-star"></i>
                </button>
              </td>
              <td>
                <span class="badge">{{ ev.entreprises?.length || 0 }}</span>
              </td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editItem(ev)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(ev.id)">
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
import evenementService from '../../services/evenementService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const evenements = ref([])
const referentiels = ref({ categories: [], entreprises: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })

const emptyForm = () => ({
  titre: '', description: '', details_supplementaires: '',
  date_debut: '', date_fin: '',
  heure_debut_journee: '09:00', heure_fin_journee: '18:00',
  categorie_evenement_id: '', pays: '', ville: '', adresse: '',
  is_featured: false, entreprise_ids: []
})
const form = ref(emptyForm())

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await evenementService.getAll(page)
    evenements.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await evenementService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  const fields = ['titre', 'description', 'details_supplementaires', 'date_debut', 'date_fin',
    'heure_debut_journee', 'heure_fin_journee', 'pays', 'ville', 'adresse']
  fields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.categorie_evenement_id) fd.append('categorie_evenement_id', form.value.categorie_evenement_id)
  fd.append('is_featured', form.value.is_featured ? '1' : '0')
  form.value.entreprise_ids.forEach(id => fd.append('entreprise_ids[]', id))
  if (imageFile.value) fd.append('image_mise_en_avant', imageFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  imageFile.value = null
  imagePreview.value = null
  showForm.value = true
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      await evenementService.update(editingItem.value.id, fd)
      success.value = 'Événement modifié avec succès'
    } else {
      await evenementService.create(fd)
      success.value = 'Événement créé avec succès'
    }
    await loadPage(pagination.value.current_page)
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const editItem = (ev) => {
  editingItem.value = { ...ev }
  form.value = {
    titre: ev.titre,
    description: ev.description || '',
    details_supplementaires: ev.details_supplementaires || '',
    date_debut: ev.date_debut ? ev.date_debut.substring(0, 10) : '',
    date_fin: ev.date_fin ? ev.date_fin.substring(0, 10) : '',
    heure_debut_journee: (ev.heure_debut_journee || '09:00').substring(0, 5),
    heure_fin_journee: (ev.heure_fin_journee || '18:00').substring(0, 5),
    categorie_evenement_id: ev.categorie_evenement_id || '',
    pays: ev.pays || '',
    ville: ev.ville || '',
    adresse: ev.adresse || '',
    is_featured: ev.is_featured,
    entreprise_ids: ev.entreprises?.map(e => e.id) || []
  }
  imageFile.value = null
  imagePreview.value = null
  showForm.value = false
}

const toggleFeatured = async (ev) => {
  try {
    await evenementService.toggleFeatured(ev.id)
    await loadPage(pagination.value.current_page)
  } catch {
    error.value = 'Erreur lors de la mise à jour'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cet événement ?')) return
  loading.value = true
  error.value = ''
  try {
    await evenementService.delete(id)
    success.value = 'Événement supprimé avec succès'
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
  imageFile.value = null
  imagePreview.value = null
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '-'

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
