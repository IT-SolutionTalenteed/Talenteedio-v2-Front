<template>
  <div>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? $t('admin.articles.editArticle') : $t('company.articles.writeArticle') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6" style="min-height:100vh">
        <v-text-field v-model="form.title" :label="$t('admin.articles.titleRequired')" variant="outlined" density="compact" required class="mb-4" />

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">{{ $t('admin.articles.content') }} *</div>
          <WysiwygEditor v-model="form.content" />
        </div>

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">{{ $t('admin.articles.image') }}</div>
          <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
          <div v-if="existingImageUrl" class="mt-2">
            <img v-lazy="existingImageUrl" style="max-width:120px; border-radius:8px;" />
          </div>
        </div>

        <v-checkbox v-model="form.is_published" :label="$t('common.publish')" density="compact" hide-details class="mb-4" />

        <div class="mb-4">
          <ComboboxMultiple
            v-model="form.category_ids"
            :label="$t('admin.articles.categories')"
            :items="referentiels.media_categories"
          />
        </div>
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import WysiwygEditor from '../WysiwygEditor.vue'
import ComboboxMultiple from '../shared/ComboboxMultiple.vue'
import articleService from '../../services/entreprise/articleService.js'

const { t: $t } = useI18n()

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({ title: '', content: '', is_published: false, category_ids: [] })
const referentiels = ref({ media_categories: [] })
const imageFile = ref(null)
const existingImageUrl = ref(null)
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => {
  router.push({ name: 'EntrepriseArticles' })
}

onMounted(async () => {
  try {
    const refRes = await articleService.getReferentiels()
    referentiels.value = refRes.data
  } catch {}

  if (isEdit.value) {
    try {
      const res = await articleService.getAll()
      const item = (res.data.data || res.data).find(x => x.id == route.params.id)
      if (item) {
        form.value = {
          title: item.title,
          content: item.content,
          is_published: item.is_published,
          category_ids: item.media_categories?.map(c => c.id) || [],
        }
        existingImageUrl.value = item.image_url || null
      }
    } catch {
      showSnack($t('company.articles.errorLoading'), 'error')
    }
  }
})

const buildFormData = () => {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('is_published', form.value.is_published ? '1' : '0')
  form.value.category_ids.forEach(id => fd.append('category_ids[]', id))
  if (imageFile.value) fd.append('image', imageFile.value)
  return fd
}

const save = async () => {
  saving.value = true
  try {
    const fd = buildFormData()
    if (isEdit.value) {
      fd.append('_method', 'PUT')
      await articleService.update(route.params.id, fd)
      showSnack($t('admin.articles.articleUpdated'))
    } else {
      await articleService.create(fd)
      showSnack($t('admin.articles.articleCreated'))
    }
    setTimeout(goBack, 800)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : $t('admin.articles.errorSave'), 'error')
  } finally {
    saving.value = false
  }
}
</script>
