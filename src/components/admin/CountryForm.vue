<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier le pays' : 'Nouveau pays' }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6" style="max-width:600px">
        <v-text-field v-model="form.name" label="Nom du pays *" variant="outlined" density="compact" autofocus class="mb-3" />
        <v-select
          v-model="form.region"
          :items="regionOptions"
          item-title="label"
          item-value="value"
          label="Région *"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import countryService from '../../services/countryService.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const regionOptions = [
  { value: 'europe', label: 'Europe' },
  { value: 'afrique', label: 'Afrique' },
  { value: 'autre', label: 'Autre' },
]

const form = ref({ name: '', region: 'europe' })
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => router.push({ name: 'AdminCountries' })

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await countryService.getAll()
      const item = res.data.find(x => x.id == route.params.id)
      if (item) form.value = { name: item.name, region: item.region }
    } catch {
      showSnack('Erreur lors du chargement', 'error')
    }
  }
})

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await countryService.update(route.params.id, form.value)
      showSnack('Pays mis à jour')
    } else {
      await countryService.create(form.value)
      showSnack('Pays créé')
    }
    setTimeout(goBack, 800)
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}
</script>
