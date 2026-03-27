<template>
  <VerticalLayout>
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier une offre' : 'Publier une offre' }}</span>
      </div>
      <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline">
        Enregistrer
      </v-btn>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.titre"
              label="Titre *"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.localisation"
              label="Localisation"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.fourchette_salariale"
              label="Fourchette salariale"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.date_limite"
              label="Date limite"
              type="date"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Mission</div>
          <WysiwygEditor v-model="form.mission" />
        </div>
        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Profil recherché</div>
          <WysiwygEditor v-model="form.profil_recherche" />
        </div>
        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Description</div>
          <WysiwygEditor v-model="form.description" />
        </div>

        <v-row>
          <v-col cols="12" md="4">
            <div class="text-body-2 font-weight-medium mb-2">Contrats de travail</div>
            <v-checkbox
              v-for="c in referentiels.job_contracts"
              :key="c.id"
              :label="c.name"
              :value="c.id"
              v-model="form.job_contract_ids"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-body-2 font-weight-medium mb-2">Modes de travail</div>
            <v-checkbox
              v-for="m in referentiels.job_modes"
              :key="m.id"
              :label="m.name"
              :value="m.id"
              v-model="form.job_mode_ids"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-body-2 font-weight-medium mb-2">Compétences</div>
            <v-checkbox
              v-for="s in referentiels.skills"
              :key="s.id"
              :label="s.name"
              :value="s.id"
              v-model="form.skill_ids"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  </VerticalLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VerticalLayout from '../layout/VerticalLayout.vue'
import WysiwygEditor from '../WysiwygEditor.vue'
import offreService from '../../services/entreprise/offreService.js'
import { useDashboardStore } from '@/stores/dashboard.store'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const emptyForm = () => ({
  titre: '', mission: '', profil_recherche: '', description: '',
  localisation: '', fourchette_salariale: '', date_limite: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})
const form = ref(emptyForm())

const loadRef = async () => {
  try {
    const res = await offreService.getReferentiels()
    referentiels.value = res.data
  } catch {}
}

const loadOffre = async () => {
  try {
    const res = await offreService.getOne(route.params.id)
    const item = res.data
    form.value = {
      titre: item.titre,
      mission: item.mission || '',
      profil_recherche: item.profil_recherche || '',
      description: item.description || '',
      localisation: item.localisation || '',
      fourchette_salariale: item.fourchette_salariale || '',
      date_limite: item.date_limite || '',
      job_contract_ids: item.job_contracts?.map(c => c.id) || [],
      job_mode_ids: item.job_modes?.map(m => m.id) || [],
      skill_ids: item.skills?.map(s => s.id) || [],
      study_level_ids: item.study_levels?.map(s => s.id) || [],
      experience_ids: item.experiences?.map(e => e.id) || [],
    }
  } catch {
    showSnack('Erreur lors du chargement de l\'offre', 'error')
  }
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await offreService.update(route.params.id, form.value)
      showSnack('Offre modifiée')
    } else {
      await offreService.create(form.value)
      showSnack('Offre publiée')
    }
    setTimeout(goBack, 1000)
  } catch (err) {
    const errs = err.response?.data?.errors
    const msg = errs ? Object.values(errs).flat().join(' | ') : 'Erreur enregistrement'
    showSnack(msg, 'error')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  useDashboardStore().setActiveTab('offres')
  router.push('/entreprise')
}

onMounted(async () => {
  await loadRef()
  if (isEdit.value) await loadOffre()
})
</script>
