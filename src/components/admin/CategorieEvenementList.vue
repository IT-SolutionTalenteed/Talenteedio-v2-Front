<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-tags me-2"></i>
          Gestion des Catégories d'événement
        </h3>
      <div class="card-actions">
        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus"></i>
          Ajouter une catégorie
        </button>
      </div>
    </div>

    <!-- Formulaire de création/édition -->
    <div v-if="showForm || editingItem" class="card-body border-bottom">
      <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }} une catégorie</h4>

      <form @submit.prevent="save">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label required">Titre</label>
            <input type="text" class="form-control" v-model="form.titre" required />
          </div>

          <div class="col-md-12 mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="form.description" rows="4"></textarea>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Image</label>
            <input type="file" class="form-control" accept="image/*" @change="e => imageFile = e.target.files[0]" />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2" style="max-width:150px;max-height:150px;" />
            <img v-else-if="editingItem?.image_url" :src="editingItem.image_url" class="mt-2" style="max-width:150px;max-height:150px;" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Vidéo principale</label>
            <input type="file" class="form-control" accept="video/*" @change="e => videoFile = e.target.files[0]" />
            <p v-if="editingItem?.video_url" class="text-muted mt-1">
              Vidéo actuelle : <a :href="editingItem.video_url" target="_blank">voir</a>
            </p>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Galerie (images / vidéos)</label>
          <input type="file" class="form-control" accept="image/*,video/*" multiple @change="e => galerieFiles = Array.from(e.target.files)" />
          <div v-if="editingItem?.galerie?.length" class="mt-2">
            <p class="text-muted">Galerie actuelle :</p>
            <div class="d-flex flex-wrap gap-2">
              <div v-for="(path, i) in editingItem.galerie" :key="i" class="position-relative">
                <img v-if="isImage(path)" :src="storageUrl(path)" class="rounded" style="max-width:80px;max-height:80px;" />
                <span v-else class="badge bg-secondary">🎬 {{ path.split('/').pop() }}</span>
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0" @click="removeGalerieItem(path)">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
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

    <!-- Liste des catégories -->

    <div class="table-responsive">
      <table class="table table-vcenter card-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Titre</th>
            <th>Galerie</th>
            <th>Témoignages</th>
            <th class="w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="6" class="text-center text-muted">Aucune catégorie trouvée.</td>
          </tr>
          <tr v-else v-for="item in items" :key="item.id">
            <td class="text-muted">{{ item.id }}</td>
            <td>
              <img v-if="item.image_url" :src="item.image_url" class="avatar avatar-sm" />
              <span v-else class="text-muted">-</span>
            </td>
            <td>{{ item.titre }}</td>
            <td>
              <span class="badge bg-azure">{{ item.galerie?.length || 0 }} fichier(s)</span>
            </td>
            <td>
              <span class="badge bg-purple">{{ item.temoignages?.length || 0 }}</span>
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
import categorieEvenementService from '../../services/categorieEvenementService.js'
import temoignageService from '../../services/temoignageService.js'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

const items          = ref([])
const allTemoignages = ref([])
const loading        = ref(false)
const error          = ref('')
const success        = ref('')
const showForm       = ref(false)
const editingItem    = ref(null)
const imageFile      = ref(null)
const imagePreview   = ref(null)
const videoFile      = ref(null)
const galerieFiles   = ref([])

const emptyForm = () => ({
  titre: '', description: '',
  liste_details: [], liste_faqs: [], liste_temoignages: []
})
const form = ref(emptyForm())

const storageUrl = (path) => `${API_BASE}/storage/${path}`
const isImage    = (path) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path)

const load = async () => {
  loading.value = true
  error.value   = ''
  try {
    const [catRes, temRes] = await Promise.all([
      categorieEvenementService.getAll(),
      temoignageService.getAll(),
    ])
    items.value          = catRes.data
    allTemoignages.value = temRes.data
  } catch {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}


const buildFormData = () => {
  const fd = new FormData()
  fd.append('titre', form.value.titre)
  if (form.value.description) fd.append('description', form.value.description)
  if (imageFile.value) fd.append('image', imageFile.value)
  if (videoFile.value) fd.append('video', videoFile.value)
  galerieFiles.value.forEach(f => fd.append('galerie[]', f))
  form.value.liste_details.filter(Boolean).forEach((v, i) => fd.append(`liste_details[${i}]`, v))
  form.value.liste_faqs.forEach((faq, i) => {
    fd.append(`liste_faqs[${i}][question]`, faq.question)
    fd.append(`liste_faqs[${i}][reponse]`, faq.reponse)
  })
  form.value.liste_temoignages.forEach((tem, i) => {
    if (!tem.auteur || !tem.contenu) return
    fd.append(`temoignages[${i}][auteur]`, tem.auteur)
    fd.append(`temoignages[${i}][poste]`, tem.poste || '')
    fd.append(`temoignages[${i}][contenu]`, tem.contenu)
    if (tem.id) fd.append(`temoignages[${i}][id]`, tem.id)
    if (tem.avatarFile) fd.append(`temoignages_avatars[${i}]`, tem.avatarFile)
  })
  return fd
}

const save = async () => {
  loading.value = true
  error.value   = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      await categorieEvenementService.update(editingItem.value.id, fd)
      success.value = 'Catégorie modifiée avec succès'
    } else {
      await categorieEvenementService.create(fd)
      success.value = 'Catégorie créée avec succès'
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

const openCreate = () => {
  editingItem.value = null
  form.value        = emptyForm()
  imageFile.value   = null
  imagePreview.value = null
  videoFile.value   = null
  galerieFiles.value = []
  showForm.value    = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    titre:       item.titre,
    description: item.description || '',
    liste_details: item.liste_details ? [...item.liste_details] : [],
    liste_faqs:    item.liste_faqs    ? item.liste_faqs.map(f => ({ ...f })) : [],
    liste_temoignages: (item.temoignages || []).map(t => ({
      id:               t.id,
      auteur:           t.auteur,
      poste:            t.poste || '',
      contenu:          t.contenu,
      avatarFile:       null,
      avatarPreview:    null,
      existingAvatarUrl: t.avatar_url || null,
    })),
  }
  imageFile.value    = null
  imagePreview.value = null
  videoFile.value    = null
  galerieFiles.value = []
  showForm.value     = false
}

const removeGalerieItem = async (path) => {
  if (!confirm('Supprimer ce fichier de la galerie ?')) return
  try {
    const res = await categorieEvenementService.removeGalerieItem(editingItem.value.id, path)
    editingItem.value = { ...res.data, temoignages: editingItem.value.temoignages }
    await load()
  } catch {
    error.value = 'Erreur lors de la suppression'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette catégorie ?')) return
  loading.value = true
  error.value   = ''
  try {
    await categorieEvenementService.delete(id)
    success.value = 'Catégorie supprimée avec succès'
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value     = false
  editingItem.value  = null
  form.value         = emptyForm()
  imageFile.value    = null
  imagePreview.value = null
  videoFile.value    = null
  galerieFiles.value = []
}

onMounted(load)
</script>

<style scoped>
.avatar {
  object-fit: cover;
}
</style>
