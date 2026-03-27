<template>
    <v-card rounded="xl" border elevation="0">
      <v-toolbar color="primary" density="compact">
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack" />
        <v-toolbar-title class="text-body-1 font-weight-medium">
          {{ isEdit ? 'Modifier un article' : 'Nouvel article' }}
        </v-toolbar-title>
        <template #append>
          <v-btn variant="flat" color="white" class="text-primary" :loading="saving" @click="save">
            <v-icon start>mdi-content-save-outline</v-icon>
            Enregistrer
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text class="pa-6" style="min-height:100vh">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="form.title" label="Titre *" variant="outlined" density="compact" required />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">Contenu</div>
            <WysiwygEditor v-model="form.content" />
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">Catégories Média</div>
            <select v-model="form.media_category_ids" multiple size="5" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
              <option v-for="category in mediaCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <div class="text-caption text-medium-emphasis mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs</div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">Image</div>
            <input type="file" accept="image/*" @change="onImageChange" style="display:block;width:100%;" />
            <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
              <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
            <v-avatar v-else-if="existingImageUrl" size="80" rounded="lg" class="mt-2">
              <img :src="existingImageUrl" style="object-fit:cover;width:100%;height:100%" />
            </v-avatar>
          </v-col>

          <v-col cols="12">
            <v-checkbox v-model="form.is_published" label="Publié" density="compact" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WysiwygEditor from '../WysiwygEditor.vue'
import articleService from '../../services/articleService.js'
import mediaCategoryService from '../../services/mediaCategoryService.js'

const route = useRoute()
const router = useRouter()

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

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
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
    showSnack('Erreur lors du chargement', 'error')
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
      showSnack('Article modifié avec succès')
    } else {
      await articleService.create(formData)
      showSnack('Article créé avec succès')
    }
    setTimeout(() => goBack(), 1200)
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadMediaCategories()
  if (isEdit.value) await loadArticle()
})
</script>
