<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-building me-2"></i>
          Gestion des Entreprises
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="openCreate">
            <i class="bi bi-plus"></i>
            Ajouter une entreprise
          </button>
        </div>
      </div>

    <!-- Formulaire -->
    <div v-if="showForm || editingItem" class="card-body border-bottom">
      <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }} une entreprise</h4>

      <form @submit.prevent="save">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label required">Nom</label>
            <input type="text" class="form-control" v-model="form.nom" required />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label required">Email</label>
            <input type="email" class="form-control" v-model="form.email" required :disabled="!!editingItem" />
            <small v-if="!editingItem" class="form-hint">Un email avec les identifiants sera envoyé à cette adresse.</small>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Logo</label>
            <input type="file" class="form-control" accept="image/*" @change="e => logoFile = e.target.files[0]" />
            <img v-if="editingItem?.logo_url" :src="editingItem.logo_url" class="mt-2 avatar avatar-lg" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Secteur d'activité</label>
            <select class="form-select" v-model="form.activity_sector_id">
              <option value="">-- Aucun --</option>
              <option v-for="s in referentiels.activity_sectors" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div class="col-md-12 mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="form.description" rows="4"></textarea>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Site web</label>
            <input type="text" class="form-control" v-model="form.site_web" placeholder="https://..." />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Téléphone</label>
            <input type="text" class="form-control" v-model="form.telephone" />
          </div>

          <div class="col-md-12 mb-3">
            <label class="form-label">Adresse</label>
            <input type="text" class="form-control" v-model="form.adresse" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Ville</label>
            <input type="text" class="form-control" v-model="form.ville" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Pays</label>
            <input type="text" class="form-control" v-model="form.pays" />
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste -->

    <div class="table-responsive">
      <table class="table table-vcenter card-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Logo</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Ville</th>
            <th>Secteur</th>
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
          <tr v-else-if="items.length === 0">
            <td colspan="7" class="text-center text-muted">Aucune entreprise trouvée.</td>
          </tr>
          <tr v-else v-for="item in items" :key="item.id">
            <td class="text-muted">{{ item.id }}</td>
            <td>
              <img v-if="item.logo_url" :src="item.logo_url" class="avatar avatar-sm" />
              <span v-else class="avatar avatar-sm">{{ item.nom?.charAt(0) }}</span>
            </td>
            <td>
              <div class="fw-bold">{{ item.nom }}</div>
              <div class="text-muted" v-if="item.ville">{{ item.ville }}</div>
            </td>
            <td class="text-muted">{{ item.user?.email || '-' }}</td>
            <td>{{ item.ville || '-' }}</td>
            <td>
              <span v-if="item.activity_sector" class="badge bg-azure">{{ item.activity_sector.name }}</span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <div class="btn-list">
                <button class="btn btn-sm btn-primary" @click="editItem(item)">
                  <i class="bi bi-pencil"></i>
                  Modifier
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">
                  <i class="bi bi-trash"></i>
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
import entrepriseService from '../../services/entrepriseService.js'

const items = ref([])
const referentiels = ref({ activity_sectors: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const logoFile = ref(null)

const emptyForm = () => ({
  nom: '', email: '', description: '', site_web: '',
  telephone: '', adresse: '', ville: '', pays: '', activity_sector_id: ''
})
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await entrepriseService.getAll()
    items.value = res.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await entrepriseService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('nom', form.value.nom)
  fd.append('email', form.value.email)
  const textFields = ['description', 'site_web', 'telephone', 'adresse', 'ville', 'pays']
  textFields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.activity_sector_id) fd.append('activity_sector_id', form.value.activity_sector_id)
  if (logoFile.value) fd.append('logo', logoFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  logoFile.value = null
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    nom: item.nom,
    email: item.user?.email || '',
    description: item.description || '',
    site_web: item.site_web || '',
    telephone: item.telephone || '',
    adresse: item.adresse || '',
    ville: item.ville || '',
    pays: item.pays || '',
    activity_sector_id: item.activity_sector_id || '',
  }
  logoFile.value = null
  showForm.value = false
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      fd.append('_method', 'PUT')
      await entrepriseService.updateFormData(editingItem.value.id, fd)
      success.value = 'Entreprise modifiée avec succès'
    } else {
      await entrepriseService.create(fd)
      success.value = 'Entreprise créée — identifiants envoyés par email'
    }
    await load()
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette entreprise et son compte utilisateur ?')) return
  loading.value = true
  error.value = ''
  try {
    await entrepriseService.delete(id)
    success.value = 'Entreprise supprimée avec succès'
    await load()
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
  logoFile.value = null
}

onMounted(() => {
  load()
  loadReferentiels()
})
</script>

<style scoped>
.avatar {
  object-fit: cover;
}
</style>
