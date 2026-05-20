<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? t('admin.events.editEvent') : t('admin.events.newEvent') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-alert
          v-if="referentiels.categories?.length === 0"
          type="warning"
          variant="tonal"
          class="mb-4"
          prepend-icon="mdi-alert-triangle"
        >
          {{ t('admin.events.noCategoryWarning') }}
        </v-alert>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field v-model="form.titre" :label="t('admin.events.titleRequired')" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.categorie_evenement_id"
              :label="t('admin.events.category')"
              variant="outlined"
              density="compact"
              :items="[{titre: t('admin.events.noCategory'),id:''},...referentiels.categories]"
              item-title="titre"
              item-value="id"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">{{ t('admin.events.featuredImage') }}</div>
            <input type="file" accept="image/*" @change="onImageChange" style="display:block;width:100%;" />
            <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
              <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
            <v-avatar v-else-if="existingImageUrl" size="80" rounded="lg" class="mt-2">
              <img :src="existingImageUrl" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field v-model="form.date_debut" :label="t('admin.events.startDate')" type="date" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.date_fin" :label="t('admin.events.endDate')" type="date" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.heure_debut_journee" :label="t('admin.events.startTime')" type="time" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.heure_fin_journee" :label="t('admin.events.endTime')" type="time" variant="outlined" density="compact" required />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="form.pays" :label="t('admin.events.country')" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="form.ville" :label="t('admin.events.city')" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="form.adresse" :label="t('admin.events.address')" variant="outlined" density="compact" />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">{{ t('admin.events.description') }}</div>
            <WysiwygEditor v-model="form.description" />
          </v-col>
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">{{ t('admin.events.additionalDetails') }}</div>
            <WysiwygEditor v-model="form.details_supplementaires" />
          </v-col>

          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.entreprise_ids"
              :label="t('admin.events.participatingCompanies')"
              :items="referentiels.entreprises"
              item-title="nom"
            />
          </v-col>

          <v-col cols="12" md="6" class="d-flex align-center">
            <v-checkbox v-model="form.is_featured" :label="t('admin.events.featuredCheckbox')" density="compact" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ t('admin.events.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import WysiwygEditor from '../WysiwygEditor.vue'
import ComboboxMultiple from '../shared/ComboboxMultiple.vue'
import evenementService from '../../services/evenementService.js'
import { useImageCompression } from '../../composables/useImageCompression.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { compressImage, validateFileSize, validateFileType, compressionError } = useImageCompression()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const referentiels = ref({ categories: [], entreprises: [] })
const imageFile = ref(null)
const imagePreview = ref(null)
const existingImageUrl = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const emptyForm = () => ({
  titre: '', description: '', details_supplementaires: '',
  date_debut: '', date_fin: '',
  heure_debut_journee: '09:00', heure_fin_journee: '18:00',
  categorie_evenement_id: '', pays: '', ville: '', adresse: '',
  is_featured: false, entreprise_ids: []
})

const form = ref(emptyForm())

const goBack = () => router.push({ name: 'AdminEvenements' })

const onImageChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!validateFileType(file)) {
    showSnack(compressionError.value, 'error')
    return
  }
  
  if (!validateFileSize(file, 5)) {
    showSnack(compressionError.value, 'error')
    return
  }
  
  const compressedFile = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    outputFormat: 'auto'
  })
  
  imageFile.value = compressedFile
  imagePreview.value = URL.createObjectURL(compressedFile)
}

const loadReferentiels = async () => {
  try {
    const res = await evenementService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const loadEvenement = async () => {
  try {
    const res = await evenementService.getAll(1)
    const list = res.data.data || res.data
    const ev = list.find(e => e.id == route.params.id)
    if (ev) {
      existingImageUrl.value = ev.image_mise_en_avant_url || null
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
    }
  } catch (err) {
    showSnack(t('admin.events.errorLoading'), 'error')
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
  
  // N'ajouter l'image que si un nouveau fichier a été sélectionné
  if (imageFile.value && imageFile.value instanceof File) {
    fd.append('image_mise_en_avant', imageFile.value)
  }
  
  return fd
}

const save = async () => {
  saving.value = true
  try {
    const fd = buildFormData()
    if (isEdit.value) {
      await evenementService.update(route.params.id, fd)
      showSnack(t('admin.events.eventUpdated'))
    } else {
      await evenementService.create(fd)
      showSnack(t('admin.events.eventCreated'))
    }
    setTimeout(() => goBack(), 1000)
  } catch (err) {
    const errs = err.response?.data?.errors
    const msg = errs ? Object.values(errs).flat().join(' | ') : err.response?.data?.message || t('admin.events.errorSave')
    showSnack(msg, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadReferentiels()
  if (isEdit.value) {
    await loadEvenement()
  }
})
</script>
