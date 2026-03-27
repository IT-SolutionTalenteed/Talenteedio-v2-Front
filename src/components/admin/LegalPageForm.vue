<template>
    <v-card rounded="xl" border elevation="0">
      <v-toolbar color="primary" density="compact">
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack" />
        <v-toolbar-title class="text-body-1 font-weight-medium">
          {{ isEdit ? 'Modifier une page légale' : 'Nouvelle page légale' }}
        </v-toolbar-title>
        <template #append>
          <v-btn variant="flat" color="white" class="text-primary" :loading="saving" @click="save">
            <v-icon start>mdi-content-save-outline</v-icon>
            Enregistrer
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text class="pa-6" style="min-height:100vh">
        <v-text-field
          v-model="form.title"
          label="Titre *"
          variant="outlined"
          density="compact"
          required
          class="mb-4"
        />
        <div class="mb-4">
          <div class="text-body-2 mb-1">Contenu</div>
          <WysiwygEditor v-model="form.description" />
        </div>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WysiwygEditor from '../WysiwygEditor.vue'
import legalPageService from '../../services/legalPageService.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({ title: '', description: '' })
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
  router.push({ name: 'AdminLegalPages' })
}

const loadPage = async () => {
  try {
    const res = await legalPageService.getAll()
    const all = res.data.data || res.data
    const item = Array.isArray(all) ? all.find(x => x.id == route.params.id) : all
    if (item) {
      form.value = { title: item.title || '', description: item.description || '' }
    }
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
  }
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await legalPageService.update(route.params.id, form.value)
      showSnack('Page légale modifiée avec succès')
    } else {
      await legalPageService.create(form.value)
      showSnack('Page légale créée avec succès')
    }
    setTimeout(() => goBack(), 1200)
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) await loadPage()
})
</script>
