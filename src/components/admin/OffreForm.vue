<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? 'Modifier une offre' : 'Nouvelle offre' }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.titre" label="Titre *" variant="outlined" density="compact" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.client" label="Client" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.localisation" label="Localisation" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.fourchette_salariale" label="Fourchette salariale" placeholder="ex: 35k€ - 45k€" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.date_mise_en_ligne" label="Date de mise en ligne" type="date" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.date_limite" label="Date limite" type="date" variant="outlined" density="compact" />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">Mission</div>
            <WysiwygEditor v-model="form.mission" />
          </v-col>
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">Profil recherché</div>
            <WysiwygEditor v-model="form.profil_recherche" />
          </v-col>
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">À propos</div>
            <WysiwygEditor v-model="form.a_propos" />
          </v-col>
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">Description</div>
            <WysiwygEditor v-model="form.description" />
          </v-col>

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

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.skill_ids"
              label="Compétences requises"
              :items="referentiels.skills"
            />
          </v-col>

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.study_level_ids"
              label="Formations requises"
              :items="referentiels.study_levels"
            />
          </v-col>

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.experience_ids"
              label="Expériences requises"
              :items="referentiels.experiences"
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
import WysiwygEditor from '../WysiwygEditor.vue'
import ComboboxMultiple from '../shared/ComboboxMultiple.vue'
import offreService from '../../services/offreService.js'
import api from '../../services/api.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const emptyForm = () => ({
  titre: '', client: '', localisation: '', salaire: '', fourchette_salariale: '',
  date_mise_en_ligne: '', date_limite: '', mission: '', profil_recherche: '',
  a_propos: '', liste_offre: '', description: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})

const form = ref(emptyForm())

const goBack = () => router.push({ name: 'AdminOffres' })

const loadReferentiels = async () => {
  try {
    const res = await api.get('/public/referentiels')
    referentiels.value = res.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
}

const loadOffre = async () => {
  try {
    const res = await offreService.getAll({ page: 1, per_page: 1000 })
    const offres = res.data.data || res.data
    const offre = offres.find(o => o.id == route.params.id)
    if (offre) {
      form.value = {
        titre: offre.titre,
        client: offre.client || '',
        localisation: offre.localisation || '',
        salaire: offre.salaire || '',
        fourchette_salariale: offre.fourchette_salariale || '',
        date_mise_en_ligne: offre.date_mise_en_ligne ? offre.date_mise_en_ligne.substring(0, 10) : '',
        date_limite: offre.date_limite ? offre.date_limite.substring(0, 10) : '',
        mission: offre.mission || '',
        profil_recherche: offre.profil_recherche || '',
        a_propos: offre.a_propos || '',
        liste_offre: offre.liste_offre || '',
        description: offre.description || '',
        job_contract_ids: offre.job_contracts?.map(c => c.id) || [],
        job_mode_ids: offre.job_modes?.map(c => c.id) || [],
        skill_ids: offre.skills?.map(c => c.id) || [],
        study_level_ids: offre.study_levels?.map(c => c.id) || [],
        experience_ids: offre.experiences?.map(c => c.id) || [],
      }
    }
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
    console.error(err)
  }
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await offreService.update(route.params.id, form.value)
      showSnack('Offre modifiée avec succès')
    } else {
      await offreService.create(form.value)
      showSnack('Offre créée avec succès')
    }
    setTimeout(() => goBack(), 1000)
  } catch (err) {
    const errs = err.response?.data?.errors
    const msg = errs ? Object.values(errs).flat().join(' | ') : err.response?.data?.message || "Erreur lors de l'enregistrement"
    showSnack(msg, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadReferentiels()
  if (isEdit.value) {
    await loadOffre()
  }
})
</script>
