<template>
  <v-card rounded="xl" border elevation="0">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Header -->
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      <v-toolbar-title>Gestion des Talents &amp; Consultants</v-toolbar-title>
    </v-toolbar>

    <!-- Fullscreen dialog édition profil -->
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="editingTalent = null; dialog = false" />
          <v-toolbar-title class="text-body-1 font-weight-medium">
            {{ editingTalent?.name }}
          </v-toolbar-title>
          <template #append>
            <v-btn variant="flat" color="white" class="text-primary" :loading="savingProfil" @click="saveProfil">
              <v-icon start>mdi-content-save-outline</v-icon>
              Enregistrer
            </v-btn>
          </template>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="profilForm.civilite"
                label="Civilité"
                variant="outlined"
                density="compact"
                :items="[{title:'—',value:''},{title:'M.',value:'M.'},{title:'Mme.',value:'Mme.'}]"
                item-title="title"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field v-model="profilForm.titre_poste" label="Titre / Poste" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profilForm.telephone" label="Téléphone" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profilForm.date_naissance" label="Date de naissance" type="date" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profilForm.nationalite" label="Nationalité" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="profilForm.ville" label="Ville" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="profilForm.pays" label="Pays" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profilForm.disponibilite" label="Disponibilité" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profilForm.mobilite" label="Mobilité" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="profilForm.situation_familiale"
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
              <v-text-field v-model="profilForm.source_provenance" label="Source / Provenance" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="profilForm.study_level_id"
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
                v-model="profilForm.experience_id"
                label="Expérience"
                variant="outlined"
                density="compact"
                :items="[{name:'—',id:''},...referentiels.experiences]"
                item-title="name"
                item-value="id"
              />
            </v-col>

            <!-- Secteurs d'activité -->
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Secteurs d'activité</div>
              <div class="d-flex flex-wrap gap-1">
                <v-checkbox
                  v-for="sec in referentiels.activitySectors"
                  :key="sec.id"
                  :label="sec.name"
                  :value="sec.id"
                  v-model="profilForm.activity_sector_ids"
                  density="compact"
                  hide-details
                  class="mr-2"
                />
              </div>
            </v-col>

            <!-- Langues -->
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Langues</div>
              <div class="d-flex flex-wrap gap-1">
                <v-checkbox
                  v-for="lang in referentiels.languages"
                  :key="lang.id"
                  :label="lang.name"
                  :value="lang.id"
                  v-model="profilForm.language_ids"
                  density="compact"
                  hide-details
                  class="mr-2"
                />
              </div>
            </v-col>

            <!-- Skills -->
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Compétences</div>
              <div class="d-flex flex-wrap gap-1">
                <v-checkbox
                  v-for="skill in referentiels.skills"
                  :key="skill.id"
                  :label="skill.name"
                  :value="skill.id"
                  v-model="profilForm.skill_ids"
                  density="compact"
                  hide-details
                  class="mr-2"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Tableau -->
    <v-data-table
      :headers="headers"
      :items="talents"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.name="{ item }">
        <div class="font-weight-bold">{{ item.name }}</div>
        <div v-if="item.titre_poste" class="text-caption text-medium-emphasis">{{ item.titre_poste }}</div>
      </template>

      <template #item.role="{ item }">
        <v-chip size="small" :color="item.role === 'consultant_externe' ? 'purple' : 'primary'">
          {{ item.role === 'consultant_externe' ? 'Consultant' : 'Talent' }}
        </v-chip>
      </template>

      <template #item.localisation="{ item }">
        <span class="text-medium-emphasis">{{ [item.ville, item.pays].filter(Boolean).join(', ') || '—' }}</span>
      </template>

      <template #item.source_provenance="{ item }">
        <span class="text-medium-emphasis">{{ item.source_provenance || '—' }}</span>
      </template>

      <template #item.statut_crm="{ item }">
        <v-select
          variant="outlined"
          density="compact"
          style="min-width:160px"
          :items="statutOptions"
          item-title="label"
          item-value="value"
          :model-value="item.statut_crm || ''"
          @update:model-value="v => updateStatutCrm(item, v)"
          hide-details
        />
      </template>

      <template #item.etat="{ item }">
        <v-chip size="small" :color="item.is_suspended ? 'warning' : item.is_banned ? 'error' : 'success'">
          {{ item.is_suspended ? 'Suspendu' : item.is_banned ? 'Banni' : 'Actif' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="openEdit(item)" title="Modifier profil" />
          <v-btn
            :icon="item.is_suspended ? 'mdi-check-circle' : 'mdi-pause-circle'"
            size="small"
            :color="item.is_suspended ? 'success' : 'warning'"
            variant="tonal"
            @click="toggleSuspend(item)"
            :title="item.is_suspended ? 'Réactiver' : 'Suspendre'"
          />
          <v-btn
            :icon="item.is_banned ? 'mdi-lock-open' : 'mdi-lock'"
            size="small"
            :color="item.is_banned ? 'info' : 'error'"
            variant="tonal"
            @click="toggleBan(item)"
            :title="item.is_banned ? 'Débannir' : 'Bannir'"
          />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" title="Supprimer" />
        </div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <v-pagination
      v-if="pagination.last_page > 1"
      v-model="pagination.current_page"
      :length="pagination.last_page"
      @update:model-value="loadPage"
      class="mt-2"
    />

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import talentService from '../../services/talentService.js'
import api from '../../services/api.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const talents      = ref([])
const loading      = ref(false)
const savingProfil = ref(false)
const error        = ref('')
const success      = ref('')
const pagination   = ref({ current_page: 1, last_page: 1 })
const editingTalent = ref(null)
const profilForm   = ref({})
const dialog       = ref(false)
const confirmRef   = ref(null)

const snackbar  = ref(false)
const snackMsg  = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value   = msg
  snackColor.value = color
  snackbar.value   = true
}

const headers = [
  { title: 'Nom / Titre', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Localisation', key: 'localisation', sortable: false },
  { title: 'Provenance', key: 'source_provenance', sortable: false },
  { title: 'Statut CRM', key: 'statut_crm', sortable: false },
  { title: 'État', key: 'etat', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const statutOptions = [
  { value: '', label: '— Aucun —' },
  { value: 'a_traiter', label: 'A traiter' },
  { value: 'en_cours_qualif', label: 'En cours de qualif.' },
  { value: 'vivier', label: 'Vivier' },
  { value: 'top_profil', label: 'Top profil' },
  { value: 'converti_ressource', label: 'Converti en ressource' },
  { value: 'recrute_client', label: 'Recruté par client' },
  { value: 'ne_plus_contacter', label: 'Ne plus contacter' },
]

const referentiels = ref({
  studyLevels: [], experiences: [], activitySectors: [], languages: [], skills: []
})

const loadReferentiels = async () => {
  try {
    const [sl, ex, as_, la, sk] = await Promise.all([
      api.get('/admin/study-levels'),
      api.get('/admin/experiences'),
      api.get('/admin/activity-sectors'),
      api.get('/admin/languages'),
      api.get('/admin/skills'),
    ])
    referentiels.value = {
      studyLevels:     sl.data,
      experiences:     ex.data,
      activitySectors: as_.data,
      languages:       la.data,
      skills:          sk.data,
    }
  } catch { /* silencieux */ }
}

const loadPage = async (page = 1) => {
  loading.value = true
  error.value   = ''
  try {
    const res = await talentService.getAll(page)
    talents.value    = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch {
    error.value = 'Erreur lors du chargement'
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const openEdit = async (talent) => {
  try {
    const res = await talentService.getOne(talent.id)
    const t   = res.data
    editingTalent.value = t
    dialog.value = true
    profilForm.value = {
      civilite:            t.civilite         || '',
      titre_poste:         t.titre_poste      || '',
      telephone:           t.telephone        || '',
      date_naissance:      t.date_naissance   || '',
      nationalite:         t.nationalite      || '',
      ville:               t.ville            || '',
      pays:                t.pays             || '',
      disponibilite:       t.disponibilite    || '',
      mobilite:            t.mobilite         || '',
      situation_familiale: t.situation_familiale || '',
      source_provenance:   t.source_provenance || '',
      study_level_id:      t.study_level_id   || '',
      experience_id:       t.experience_id    || '',
      activity_sector_ids: (t.activity_sectors || []).map(s => s.id),
      language_ids:        (t.languages        || []).map(l => l.id),
      skill_ids:           (t.skills           || []).map(s => s.id),
    }
  } catch {
    error.value = 'Erreur lors du chargement du profil'
    showSnack('Erreur lors du chargement du profil', 'error')
  }
}

const saveProfil = async () => {
  savingProfil.value = true
  error.value = ''
  try {
    await talentService.updateProfil(editingTalent.value.id, profilForm.value)
    success.value = 'Profil mis à jour'
    showSnack('Profil mis à jour')
    editingTalent.value = null
    dialog.value = false
    await loadPage(pagination.value.current_page)
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : 'Erreur lors de la sauvegarde'
    showSnack(error.value, 'error')
  } finally {
    savingProfil.value = false
  }
}

const toggleSuspend = async (talent) => {
  try {
    const res = await talentService.toggleSuspend(talent.id)
    talent.is_suspended = res.data.is_suspended
    success.value = talent.is_suspended ? 'Talent suspendu' : 'Talent réactivé'
    showSnack(success.value)
  } catch {
    error.value = 'Erreur lors de la suspension'
    showSnack('Erreur lors de la suspension', 'error')
  }
}

const toggleBan = async (talent) => {
  try {
    const res = await talentService.toggleBan(talent.id)
    talent.is_banned = res.data.is_banned
    success.value = talent.is_banned ? 'Talent banni' : 'Talent débanni'
    showSnack(success.value)
  } catch {
    error.value = 'Erreur lors du bannissement'
    showSnack('Erreur lors du bannissement', 'error')
  }
}

const updateStatutCrm = async (talent, statut) => {
  try {
    const res = await talentService.updateStatutCrm(talent.id, statut || null)
    talent.statut_crm = res.data.statut_crm
    talent.is_banned  = res.data.is_banned
    success.value = 'Statut CRM mis à jour'
    showSnack('Statut CRM mis à jour')
  } catch {
    error.value = 'Erreur lors de la mise à jour du statut'
    showSnack('Erreur lors de la mise à jour du statut', 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer définitivement ce talent ?' })
  if (!ok) return
  loading.value = true
  error.value   = ''
  try {
    await talentService.delete(id)
    success.value = 'Talent supprimé'
    showSnack('Talent supprimé')
    await loadPage(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
