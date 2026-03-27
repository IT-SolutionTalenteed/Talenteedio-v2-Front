<template>
  <VerticalLayout>
    <v-card rounded="xl" border elevation="0">
      <v-toolbar color="primary" density="compact">
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack" />
        <v-toolbar-title class="text-body-1 font-weight-medium">
          {{ isEdit ? 'Modifier un article' : 'Rédiger un article' }}
        </v-toolbar-title>
        <template #append>
          <v-btn variant="flat" color="white" class="text-primary" :loading="saving" @click="save">
            <v-icon start>mdi-content-save-outline</v-icon>
            Enregistrer
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text class="pa-6" style="min-height:100vh">
        <v-text-field v-model="form.title" label="Titre *" variant="outlined" density="compact" required class="mb-4" />

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Contenu *</div>
          <WysiwygEditor v-model="form.content" />
        </div>

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Image</div>
          <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
          <div v-if="existingImageUrl" class="mt-2">
            <img :src="existingImageUrl" style="max-width:120px; border-radius:8px;" />
          </div>
        </div>

        <v-checkbox v-model="form.is_published" label="Publier" density="compact" hide-details class="mb-4" />

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-2">Catégories</div>
          <v-row>
            <v-col v-for="c in referentiels.media_categories" :key="c.id" cols="12" sm="6" md="4">
              <v-checkbox
                :label="c.name"
                :value="c.id"
                v-model="form.category_ids"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  </VerticalLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VerticalLayout from '../layout/VerticalLayout.vue'
import WysiwygEditor from '../WysiwygEditor.vue'
import articleService from '../../services/entreprise/articleService.js'
import { useDashboardStore } from '@/stores/dashboard.store'

const route = useRoute()
const router = useRouter()
const dashboardStore = useDashboardStore()
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
  dashboardStore.setActiveTab('articles')
  router.push('/entreprise')
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
      showSnack('Erreur lors du chargement', 'error')
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
      showSnack('Article modifié')
    } else {
      await articleService.create(fd)
      showSnack('Article créé')
    }
    setTimeout(goBack, 800)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}
</script>
