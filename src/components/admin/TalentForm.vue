<template>
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ talent?.name || 'Modifier le profil' }}</span>
      </div>
      <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline">
        Enregistrer
      </v-btn>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.first_name" label="Prénom" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.last_name" label="Nom de famille" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.email" label="Email" type="email" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="form.civilite"
              label="Civilité"
              variant="outlined"
              density="compact"
              :items="[{title:'—',value:''},{title:'M.',value:'M.'},{title:'Mme.',value:'Mme.'}]"
              item-title="title"
              item-value="value"
            />
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field v-model="form.titre_poste" label="Titre / Poste" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.telephone" label="Téléphone" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.date_naissance" label="Date de naissance" type="date" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.nationalite" label="Nationalité" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.ville" label="Ville" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="form.pays" label="Pays" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.disponibilite" label="Disponibilité" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.mobilite" label="Mobilité" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.situation_familiale"
              label="Situation familiale"
              variant="outlined"
              density="compact"
              :items="[
                {title:'—',value:''},
                {title:'Célibataire',value:'celibataire'},
                {title:'Marié(e)',value:'marie'},
                {title:'Pacsé(e)',value:'pacse'},
                {title:'Divorcé(e)',value:'divorce'},
                {title:'Veuf / Veuve',value:'veuf'},
              ]"
              item-title="title"
              item-value="value"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.source_provenance" label="Source / Provenance" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.study_level_id"
              label="Niveau d'étude"
              variant="outlined"
              density="compact"
              :items="[{name:'—',id:''},...referentiels.studyLevels]"
              item-title="name"
              item-value="id"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.experience_id"
              label="Expérience"
              variant="outlined"
              density="compact"
              :items="[{name:'—',id:''},...referentiels.experiences]"
              item-title="name"
              item-value="id"
            />
          </v-col>

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.activity_sector_ids"
              label="Secteurs d'activité"
              :items="referentiels.activitySectors"
            />
          </v-col>

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.language_ids"
              label="Langues"
              :items="referentiels.languages"
            />
          </v-col>

          <v-col cols="12" md="4">
            <ComboboxMultiple
              v-model="form.skill_ids"
              label="Compétences"
              :items="referentiels.skills"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import talentService from '../../services/talentService.js'
import api from '../../services/api.js'
import ComboboxMultiple from '../shared/ComboboxMultiple.vue'

const route = useRoute()
const router = useRouter()

const talent = ref(null)
const form = ref({
  first_name: '', last_name: '', email: '',
  civilite: '', titre_poste: '', telephone: '', date_naissance: '',
  nationalite: '', ville: '', pays: '', disponibilite: '', mobilite: '',
  situation_familiale: '', source_provenance: '', study_level_id: '',
  experience_id: '', activity_sector_ids: [], language_ids: [], skill_ids: [],
})
const referentiels = ref({ studyLevels: [], experiences: [], activitySectors: [], languages: [], skills: [] })
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => router.push({ name: 'AdminTalents' })

onMounted(async () => {
  try {
    const [talentRes, sl, ex, as_, la, sk] = await Promise.all([
      talentService.getOne(route.params.id),
      api.get('/admin/study-levels'),
      api.get('/admin/experiences'),
      api.get('/admin/activity-sectors'),
      api.get('/admin/languages'),
      api.get('/admin/skills'),
    ])
    referentiels.value = {
      studyLevels: sl.data,
      experiences: ex.data,
      activitySectors: as_.data,
      languages: la.data,
      skills: sk.data,
    }
    const t = talentRes.data
    talent.value = t

    // Fallback: split name si first_name/last_name pas encore remplis
    const nameParts = (t.name || '').trim().split(' ')
    const fallbackFirst = nameParts[0] || ''
    const fallbackLast  = nameParts.slice(1).join(' ') || ''

    form.value = {
      first_name: t.first_name || fallbackFirst,
      last_name: t.last_name || fallbackLast,
      email: t.email || '',
      civilite: t.civilite || '',
      titre_poste: t.titre_poste || '',
      telephone: t.telephone || '',
      date_naissance: t.date_naissance || '',
      nationalite: t.nationalite || '',
      ville: t.ville || '',
      pays: t.pays || '',
      disponibilite: t.disponibilite || '',
      mobilite: t.mobilite || '',
      situation_familiale: t.situation_familiale || '',
      source_provenance: t.source_provenance || '',
      study_level_id: t.study_level_id || '',
      experience_id: t.experience_id || '',
      activity_sector_ids: (t.activity_sectors || []).map(s => s.id),
      language_ids: (t.languages || []).map(l => l.id),
      skill_ids: (t.skills || []).map(s => s.id),
    }
  } catch {
    showSnack('Erreur lors du chargement du profil', 'error')
  }
})

const save = async () => {
  saving.value = true
  try {
    await talentService.updateProfil(route.params.id, form.value)
    showSnack('Profil mis à jour')
    setTimeout(goBack, 800)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : 'Erreur lors de la sauvegarde', 'error')
  } finally {
    saving.value = false
  }
}
</script>
