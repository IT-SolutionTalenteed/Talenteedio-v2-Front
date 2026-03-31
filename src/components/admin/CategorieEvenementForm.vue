<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.titre" label="Titre *" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="form.description" label="Description" variant="outlined" density="compact" rows="4" />
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">Image</div>
            <input type="file" accept="image/*" @change="e => { imageFile = e.target.files[0]; imagePreview = URL.createObjectURL(e.target.files[0]) }" style="display:block;width:100%;" />
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
              <v-text-field v-model="faq.question" label="Question" variant="outlined" density="compact" class="mb-2" />
              <v-textarea v-model="faq.reponse" label="Réponse" variant="outlined" density="compact" rows="3" />
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
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import categorieEvenementService from '../../services/categorieEvenementService.js'
import temoignageService from '../../services/temoignageService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

const editingItem = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const videoFile = ref(null)
const galerieFiles = ref([])
const saving = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const emptyForm = () => ({ titre: '', description: '', liste_details: [], liste_faqs: [], liste_temoignages: [] })
const form = ref(emptyForm())

const goBack = () => router.push({ name: 'AdminCategorieEvenements' })

const storageUrl = (path) => `${API_BASE}/storage/${path}`
const isImage = (path) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path)

onMounted(async () => {
  if (isEdit.value) {
    try {
      const [catRes, temRes] = await Promise.all([
        categorieEvenementService.getAll(),
        temoignageService.getAll(),
      ])
      const item = catRes.data.find(x => x.id == route.params.id)
      if (item) {
        editingItem.value = item
        form.value = {
          titre: item.titre,
          description: item.description || '',
          liste_details: Array.isArray(item.liste_details) ? [...item.liste_details] : [],
          liste_faqs: Array.isArray(item.liste_faqs) ? item.liste_faqs.map(f => ({ ...f })) : [],
          liste_temoignages: (item.temoignages || []).map(t => ({
            id: t.id,
            auteur: t.auteur || '',
            poste: t.poste || '',
            contenu: t.contenu,
            avatarFile: null,
            avatarPreview: null,
            existingAvatarUrl: t.avatar_url || null,
          })),
        }
      }
    } catch {
      showSnack('Erreur lors du chargement', 'error')
    }
  }
})

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
    if (tem.avatarFile) fd.append(`temoignages[${i}][avatar]`, tem.avatarFile)
  })
  return fd
}

const save = async () => {
  saving.value = true
  try {
    const fd = buildFormData()
    if (isEdit.value) {
      await categorieEvenementService.update(route.params.id, fd)
      showSnack('Catégorie modifiée avec succès')
    } else {
      await categorieEvenementService.create(fd)
      showSnack('Catégorie créée avec succès')
    }
    setTimeout(goBack, 800)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}

const removeGalerieItem = async (path) => {
  const ok = await confirmRef.value?.open({ title: 'Supprimer ce fichier', message: 'Voulez-vous supprimer ce fichier de la galerie ?' })
  if (!ok) return
  try {
    const res = await categorieEvenementService.removeGalerieItem(editingItem.value.id, path)
    editingItem.value = { ...res.data, temoignages: editingItem.value.temoignages }
  } catch {
    showSnack('Erreur lors de la suppression', 'error')
  }
}
</script>
