<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier une entreprise' : 'Nouvelle entreprise' }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nom"
              label="Nom *"
              variant="outlined"
              density="compact"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              label="Email *"
              type="email"
              variant="outlined"
              density="compact"
              required
              :hint="!isEdit ? 'Un email avec les identifiants sera envoyé à cette adresse.' : 'Email de connexion de l\'entreprise'"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-body-2 mb-1">Logo</div>
            <input type="file" accept="image/*" @change="e => logoFile = e.target.files[0]" style="display:block;margin-bottom:8px" />
            <v-avatar v-if="existingLogoUrl" size="48" class="mt-1">
              <img :src="existingLogoUrl" style="width:100%;height:100%;object-fit:cover" />
            </v-avatar>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.activity_sector_id"
              :items="activitySectors"
              item-title="name"
              item-value="id"
              label="Secteur d'activité"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.plan_id"
              :items="plans"
              item-title="name"
              item-value="id"
              label="Plan"
              variant="outlined"
              density="compact"
              clearable
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon color="primary">mdi-crown-outline</v-icon>
                  </template>
                  <template #append>
                    <v-chip size="small" color="success" variant="tonal">
                      {{ formatPrice(item.raw.price) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
              <template #selection="{ item }">
                <span>{{ item.title }} - {{ formatPrice(item.raw.price) }}</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description"
              variant="outlined"
              density="compact"
              rows="4"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.site_web"
              label="Site web"
              variant="outlined"
              density="compact"
              placeholder="https://..."
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.telephone"
              label="Téléphone"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.adresse"
              label="Adresse"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.ville"
              label="Ville"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.pays"
              label="Pays"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
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
import entrepriseService from '../../services/entrepriseService.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  nom: '', email: '', description: '', site_web: '',
  telephone: '', adresse: '', ville: '', pays: '', activity_sector_id: '', plan_id: ''
})
const logoFile = ref(null)
const existingLogoUrl = ref(null)
const activitySectors = ref([])
const plans = ref([])
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
  router.push({ name: 'AdminEntreprises' })
}

const loadReferentiels = async () => {
  try {
    const res = await entrepriseService.getReferentiels()
    activitySectors.value = res.data.activity_sectors || []
    plans.value = res.data.plans || []
  } catch (err) {
    console.error(err)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const loadEntreprise = async () => {
  try {
    const res = await entrepriseService.getById(route.params.id)
    const item = res.data
    form.value = {
      nom: item.nom || '',
      email: item.user?.email || '',
      description: item.description || '',
      site_web: item.site_web || '',
      telephone: item.telephone || '',
      adresse: item.adresse || '',
      ville: item.ville || '',
      pays: item.pays || '',
      activity_sector_id: item.activity_sector_id || '',
      plan_id: item.plan_id || ''
    }
    existingLogoUrl.value = item.logo_url || null
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
  }
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('nom', form.value.nom)
  fd.append('email', form.value.email)
  const textFields = ['description', 'site_web', 'telephone', 'adresse', 'ville', 'pays']
  textFields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.activity_sector_id) fd.append('activity_sector_id', form.value.activity_sector_id)
  if (form.value.plan_id) fd.append('plan_id', form.value.plan_id)
  if (logoFile.value) fd.append('logo', logoFile.value)
  return fd
}

const save = async () => {
  saving.value = true
  try {
    const fd = buildFormData()
    if (isEdit.value) {
      fd.append('_method', 'PUT')
      await entrepriseService.updateFormData(route.params.id, fd)
      showSnack('Entreprise modifiée avec succès')
    } else {
      await entrepriseService.create(fd)
      showSnack('Entreprise créée — identifiants envoyés par email')
    }
    setTimeout(() => goBack(), 1200)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadReferentiels()
  if (isEdit.value) await loadEntreprise()
})
</script>
