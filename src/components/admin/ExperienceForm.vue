<template>
  <VerticalLayout>
    <v-card rounded="xl" border elevation="0">
      <v-toolbar color="primary" density="compact">
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack" />
        <v-toolbar-title class="text-body-1 font-weight-medium">
          {{ isEdit ? "Modifier l'expérience" : 'Nouvelle expérience' }}
        </v-toolbar-title>
        <template #append>
          <v-btn variant="flat" color="white" class="text-primary" :loading="saving" @click="save">
            <v-icon start>mdi-content-save-outline</v-icon>
            Enregistrer
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text class="pa-6" style="max-width:600px">
        <v-text-field v-model="form.name" label="Nom *" variant="outlined" density="compact" autofocus />
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  </VerticalLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VerticalLayout from '../layout/VerticalLayout.vue'
import experienceService from '../../services/experienceService.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({ name: '' })
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => router.push({ name: 'AdminExperiences' })

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await experienceService.getAll()
      const item = res.data.find(x => x.id == route.params.id)
      if (item) form.value = { name: item.name }
    } catch {
      showSnack('Erreur lors du chargement', 'error')
    }
  }
})

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await experienceService.update(route.params.id, form.value)
      showSnack('Expérience modifiée avec succès')
    } else {
      await experienceService.create(form.value)
      showSnack('Expérience créée avec succès')
    }
    setTimeout(goBack, 800)
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}
</script>
