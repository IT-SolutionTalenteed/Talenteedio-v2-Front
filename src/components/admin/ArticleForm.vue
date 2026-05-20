<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? t('admin.articles.editArticle') : t('admin.articles.newArticle') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6" style="min-height:100vh">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="form.title" :label="t('admin.articles.titleRequired')" variant="outlined" density="compact" required />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">{{ t('admin.articles.content') }}</div>
            <WysiwygEditor v-model="form.content" />
          </v-col>

          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.media_category_ids"
              :label="t('admin.articles.mediaCategories')"
              :items="mediaCategories"
            />
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">{{ t('admin.articles.image') }}</div>
            <input type="file" accept="image/*" @change="onImageChange" style="display:block;width:100%;" />
            <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
              <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
            <v-avatar v-else-if="existingImageUrl" size="80" rounded="lg" class="mt-2">
              <img :src="existingImageUrl" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
          </v-col>

          <v-col cols="12">
            <v-checkbox v-model="form.is_published" :label="t('admin.articles.published')" density="compact" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ t('admin.articles.save') }}
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
import articleService from '../../services/articleService.js'
import mediaCategoryService from '../../services/mediaCategoryService.js'
import { useImageCompression } from '../../composables/useImageCompression.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { compressImage, validateFileSize, validateFileType, compressionError } = useImageCompression()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  content: '',
  is_published: false,
  media_category_ids: []
})
const imageFile = ref(null)
const imagePreview = ref(null)
const existingImageUrl = ref(null)
const mediaCategories = ref([])
const saving = ref(false)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const goBack = () => {
  router.push({ name: 'AdminArticles' })
}

const onImageChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validation
  if (!validateFileType(file)) {
    showSnack(compressionError.value, 'error')
    return
  }
  
  if (!validateFileSize(file, 5)) { // Max 5MB avant compression
    showSnack(compressionError.value, 'error')
    return
  }
  
  // Compression automatique
  const compressedFile = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    outputFormat: 'auto' // Utilise WebP si supporté
  })
  
  imageFile.value = compressedFile
  imagePreview.value = URL.createObjectURL(compressedFile)
}

const loadMediaCategories = async () => {
  try {
    const res = await mediaCategoryService.getAll()
    mediaCategories.value = res.data.data || res.data
  } catch (err) {
    console.error(err)
  }
}

const loadArticle = async () => {
  try {
    const res = await articleService.getAll()
    const all = res.data.data || res.data
    const item = all.find(x => x.id == route.params.id)
    if (item) {
      form.value = {
        title: item.title || '',
        content: item.content || '',
        is_published: item.is_published,
        media_category_ids: item.media_categories ? item.media_categories.map(cat => cat.id) : []
      }
      existingImageUrl.value = item.image_url || null
    }
  } catch (err) {
    showSnack(t('admin.articles.errorLoading'), 'error')
  }
}

const buildFormData = () => {
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('content', form.value.content)
  formData.append('is_published', form.value.is_published ? '1' : '0')
  form.value.media_category_ids.forEach(id => {
    formData.append('media_category_ids[]', id)
  })
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }
  return formData
}

const save = async () => {
  saving.value = true
  try {
    const formData = buildFormData()
    if (isEdit.value) {
      await articleService.update(route.params.id, formData)
      showSnack(t('admin.articles.articleUpdated'))
    } else {
      await articleService.create(formData)
      showSnack(t('admin.articles.articleCreated'))
    }
    setTimeout(() => goBack(), 1200)
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.articles.errorSave'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadMediaCategories()
  if (isEdit.value) await loadArticle()
})
</script>
