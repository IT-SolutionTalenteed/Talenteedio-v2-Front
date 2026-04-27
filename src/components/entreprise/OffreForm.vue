<template>
  <div>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier une offre' : 'Publier une offre' }}</span>
      </div>
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
              v-model="form.date_limite"
              label="Date limite"
              type="date"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.salaire_min"
              label="Salaire minimum"
              type="number"
              placeholder="ex: 35000"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.salaire_max"
              label="Salaire maximum"
              type="number"
              placeholder="ex: 45000"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-1">Client</div>
          <WysiwygEditor v-model="form.client" />
        </div>

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
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.job_contract_ids"
              label="Contrats de travail"
              :items="referentiels.job_contracts"
            />
          </v-col>
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.job_mode_ids"
              label="Modes de travail"
              :items="referentiels.job_modes"
            />
          </v-col>
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.skill_ids"
              label="Compétences"
              :items="referentiels.skills"
            />
          </v-col>
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.experience_ids"
              label="Expériences requises"
              :items="referentiels.experiences"
            />
          </v-col>
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.study_level_ids"
              label="Formations requises"
              :items="referentiels.study_levels"
            />
          </v-col>
          <v-col cols="12" md="6">
            <ComboboxMultiple
              v-model="form.language_ids"
              label="Langues"
              :items="referentiels.languages"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WysiwygEditor from '../WysiwygEditor.vue'
import ComboboxMultiple from '../shared/ComboboxMultiple.vue'
import offreService from '../../services/entreprise/offreService.js'
import { useDashboardStore } from '@/stores/dashboard.store'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [], languages: [] })

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const emptyForm = () => ({
  titre: '', client: '', mission: '', profil_recherche: '', description: '',
  localisation: '', salaire_min: '', salaire_max: '', fourchette_salariale: '', date_limite: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: [], language_ids: []
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
      client: item.client || '',
      mission: item.mission || '',
      profil_recherche: item.profil_recherche || '',
      description: item.description || '',
      localisation: item.localisation || '',
      salaire_min: item.salaire_min || '',
      salaire_max: item.salaire_max || '',
      fourchette_salariale: item.fourchette_salariale || '',
      date_limite: item.date_limite || '',
      job_contract_ids: item.job_contracts?.map(c => c.id) || [],
      job_mode_ids: item.job_modes?.map(m => m.id) || [],
      skill_ids: item.skills?.map(s => s.id) || [],
      study_level_ids: item.study_levels?.map(s => s.id) || [],
      experience_ids: item.experiences?.map(e => e.id) || [],
      language_ids: item.languages?.map(l => l.id) || [],
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
