<template>
  <v-card rounded="xl" border elevation="0">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Header -->
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-tag-multiple</v-icon>
      <v-toolbar-title>Gestion des Catégories d'événement</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Ajouter une catégorie</v-btn>
      </template>
    </v-toolbar>

    <!-- Fullscreen dialog formulaire catégorie -->
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="cancelForm" />
          <v-toolbar-title class="text-body-1 font-weight-medium">
            {{ editingItem ? 'Modifier' : 'Créer' }} une catégorie
          </v-toolbar-title>
          <template #append>
            <v-btn variant="flat" color="white" class="text-primary" :loading="loading" @click="save">
              <v-icon start>mdi-content-save-outline</v-icon>
              Enregistrer
            </v-btn>
          </template>
        </v-toolbar>
        <v-card-text class="pa-6">
          <!-- Infos de base -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.titre" label="Titre *" variant="outlined" density="compact" required />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.description" label="Description" variant="outlined" density="compact" rows="4" />
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Image</div>
              <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" style="display:block;width:100%;" />
              <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
                <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
              </v-avatar>
              <v-avatar v-else-if="editingItem?.image_url" size="80" rounded="lg" class="mt-2">
                <img :src="editingItem.image_url" style="object-fit:cover;width:100%;height:100%" />
              </v-avatar>
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Vidéo principale</div>
              <input type="file" accept="video/*" @change="e => videoFile = e.target.files[0]" style="display:block;width:100%;" />
              <p v-if="editingItem?.video_url" class="text-caption text-medium-emphasis mt-1">
                Vidéo actuelle : <a :href="editingItem.video_url" target="_blank">voir</a>
              </p>
            </v-col>

            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Galerie (images / vidéos)</div>
              <input type="file" accept="image/*,video/*" multiple @change="e => galerieFiles = Array.from(e.target.files)" style="display:block;width:100%;" />
              <div v-if="editingItem?.galerie?.length" class="mt-2">
                <div class="text-caption text-medium-emphasis mb-1">Galerie actuelle :</div>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="(path, i) in editingItem.galerie" :key="i" class="position-relative">
                    <v-avatar v-if="isImage(path)" size="80" rounded="lg">
                      <img :src="storageUrl(path)" style="object-fit:cover;width:100%;height:100%" />
                    </v-avatar>
                    <v-chip v-else size="small" prepend-icon="mdi-video">{{ path.split('/').pop() }}</v-chip>
                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      color="error"
                      variant="elevated"
                      class="position-absolute"
                      style="top:-8px;right:-8px;"
                      @click="removeGalerieItem(path)"
                    />
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Liste Détails -->
          <v-card variant="tonal" class="mt-4 mb-4">
            <v-card-title class="text-subtitle-2 pa-3 pb-1">
              Points clés / Détails
              <v-btn size="x-small" color="primary" variant="tonal" class="ml-2" @click="form.liste_details.push('')" type="button">
                <v-icon size="small">mdi-plus</v-icon> Ajouter
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-3 pt-2">
              <div v-for="(detail, i) in form.liste_details" :key="i" class="d-flex align-center gap-2 mb-2">
                <v-text-field
                  :model-value="detail"
                  @update:model-value="v => form.liste_details[i] = v"
                  :label="`Point ${i + 1}`"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="flex-grow-1"
                />
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="form.liste_details.splice(i, 1)" type="button" />
              </div>
              <div v-if="form.liste_details.length === 0" class="text-caption text-medium-emphasis">Aucun point clé</div>
            </v-card-text>
          </v-card>

          <!-- FAQs -->
          <v-card variant="tonal" class="mb-4">
            <v-card-title class="text-subtitle-2 pa-3 pb-1">
              FAQs
              <v-btn size="x-small" color="primary" variant="tonal" class="ml-2" @click="form.liste_faqs.push({ question: '', reponse: '' })" type="button">
                <v-icon size="small">mdi-plus</v-icon> Ajouter
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-3 pt-2">
              <v-card v-for="(faq, i) in form.liste_faqs" :key="i" variant="outlined" class="mb-3 pa-3">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-caption font-weight-bold">FAQ {{ i + 1 }}</span>
                  <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="form.liste_faqs.splice(i, 1)" type="button" />
                </div>
                <v-text-field
                  v-model="faq.question"
                  label="Question"
                  variant="outlined"
                  density="compact"
                  class="mb-2"
                />
                <v-textarea
                  v-model="faq.reponse"
                  label="Réponse"
                  variant="outlined"
                  density="compact"
                  rows="3"
                />
              </v-card>
              <div v-if="form.liste_faqs.length === 0" class="text-caption text-medium-emphasis">Aucune FAQ</div>
            </v-card-text>
          </v-card>

          <!-- Témoignages -->
          <v-card variant="tonal" class="mb-4">
            <v-card-title class="text-subtitle-2 pa-3 pb-1">
              Témoignages
              <v-btn
                size="x-small" color="primary" variant="tonal" class="ml-2"
                @click="form.liste_temoignages.push({ auteur: '', poste: '', contenu: '', avatarFile: null, avatarPreview: null, existingAvatarUrl: null })"
                type="button"
              >
                <v-icon size="small">mdi-plus</v-icon> Ajouter
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-3 pt-2">
              <v-card v-for="(tem, i) in form.liste_temoignages" :key="i" variant="outlined" class="mb-3 pa-3">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex align-center gap-2">
                    <v-avatar v-if="tem.avatarPreview || tem.existingAvatarUrl" size="36" rounded="lg">
                      <img :src="tem.avatarPreview || tem.existingAvatarUrl" style="object-fit:cover;width:100%;height:100%" />
                    </v-avatar>
                    <span class="text-caption font-weight-bold">Témoignage {{ i + 1 }}</span>
                  </div>
                  <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="form.liste_temoignages.splice(i, 1)" type="button" />
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="tem.auteur" label="Auteur" variant="outlined" density="compact" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="tem.poste" label="Poste" variant="outlined" density="compact" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="tem.contenu" label="Contenu" variant="outlined" density="compact" rows="3" />
                  </v-col>
                  <v-col cols="12">
                    <div class="text-caption text-medium-emphasis mb-1">Avatar</div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="e => { tem.avatarFile = e.target.files[0]; tem.avatarPreview = e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null }"
                      style="display:block;width:100%;"
                    />
                  </v-col>
                </v-row>
              </v-card>
              <div v-if="form.liste_temoignages.length === 0" class="text-caption text-medium-emphasis">Aucun témoignage</div>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Tableau -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.image="{ item }">
        <v-avatar v-if="item.image_url" size="36" rounded="lg">
          <img :src="item.image_url" style="object-fit:cover;width:100%;height:100%" />
        </v-avatar>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.galerie="{ item }">
        <v-chip size="small" color="blue">{{ item.galerie?.length || 0 }} fichier(s)</v-chip>
      </template>

      <template #item.temoignages="{ item }">
        <v-chip size="small" color="purple">{{ item.temoignages?.length || 0 }}</v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="editItem(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import categorieEvenementService from '../../services/categorieEvenementService.js'
import temoignageService from '../../services/temoignageService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

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
const dialog         = ref(false)
const confirmRef     = ref(null)

const snackbar  = ref(false)
const snackMsg  = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value   = msg
  snackColor.value = color
  snackbar.value   = true
}

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Image', key: 'image', sortable: false, width: '60px' },
  { title: 'Titre', key: 'titre', sortable: true },
  { title: 'Galerie', key: 'galerie', sortable: false },
  { title: 'Témoignages', key: 'temoignages', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

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
    showSnack('Erreur lors du chargement', 'error')
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
    showSnack(success.value)
    await load()
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
    showSnack(error.value, 'error')
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
  dialog.value      = true
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
  dialog.value       = true
}

const removeGalerieItem = async (path) => {
  const ok = await confirmRef.value?.open({ title: 'Supprimer ce fichier', message: 'Voulez-vous supprimer ce fichier de la galerie ?' })
  if (!ok) return
  try {
    const res = await categorieEvenementService.removeGalerieItem(editingItem.value.id, path)
    editingItem.value = { ...res.data, temoignages: editingItem.value.temoignages }
    await load()
  } catch {
    error.value = 'Erreur lors de la suppression'
    showSnack('Erreur lors de la suppression', 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value?.open({ title: 'Supprimer la catégorie', message: 'Cette action est irréversible. Voulez-vous continuer ?' })
  if (!ok) return
  loading.value = true
  error.value   = ''
  try {
    await categorieEvenementService.delete(id)
    success.value = 'Catégorie supprimée avec succès'
    showSnack(success.value)
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value     = false
  dialog.value       = false
  editingItem.value  = null
  form.value         = emptyForm()
  imageFile.value    = null
  imagePreview.value = null
  videoFile.value    = null
  galerieFiles.value = []
}

onMounted(load)
</script>
