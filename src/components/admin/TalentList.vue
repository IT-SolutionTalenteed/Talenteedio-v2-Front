<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-people me-2"></i>
          Gestion des Talents & Consultants
        </h3>
      </div>

    <!-- Formulaire édition profil -->
    <div v-if="editingTalent" class="card-body border-bottom">
      <h4 class="mb-3">Modifier le profil — {{ editingTalent.name }}</h4>
      <form @submit.prevent="saveProfil">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label">Civilité</label>
            <select class="form-select" v-model="profilForm.civilite">
              <option value="">—</option>
              <option value="M.">M.</option>
              <option value="Mme.">Mme.</option>
            </select>
          </div>
          <div class="col-md-9 mb-3">
            <label class="form-label">Titre / Poste</label>
            <input type="text" class="form-control" v-model="profilForm.titre_poste" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Téléphone</label>
            <input type="text" class="form-control" v-model="profilForm.telephone" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Date de naissance</label>
            <input type="date" class="form-control" v-model="profilForm.date_naissance" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Nationalité</label>
            <input type="text" class="form-control" v-model="profilForm.nationalite" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Ville</label>
            <input type="text" class="form-control" v-model="profilForm.ville" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Pays</label>
            <input type="text" class="form-control" v-model="profilForm.pays" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Disponibilité</label>
            <input type="text" class="form-control" v-model="profilForm.disponibilite" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Mobilité</label>
            <input type="text" class="form-control" v-model="profilForm.mobilite" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Situation familiale</label>
            <select class="form-select" v-model="profilForm.situation_familiale">
              <option value="">—</option>
              <option value="celibataire">Célibataire</option>
              <option value="marie">Marié(e)</option>
              <option value="pacse">Pacsé(e)</option>
              <option value="divorce">Divorcé(e)</option>
              <option value="veuf">Veuf / Veuve</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Source / Provenance</label>
            <input type="text" class="form-control" v-model="profilForm.source_provenance" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Niveau d'étude</label>
            <select class="form-select" v-model="profilForm.study_level_id">
              <option value="">—</option>
              <option v-for="sl in referentiels.studyLevels" :key="sl.id" :value="sl.id">{{ sl.name }}</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Expérience</label>
            <select class="form-select" v-model="profilForm.experience_id">
              <option value="">—</option>
              <option v-for="ex in referentiels.experiences" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
            </select>
          </div>
        </div>

        <!-- Secteurs d'activité -->
        <div class="mb-3">
          <label class="form-label">Secteurs d'activité</label>
          <div class="d-flex flex-wrap gap-2">
            <label v-for="sec in referentiels.activitySectors" :key="sec.id" class="form-check">
              <input type="checkbox" class="form-check-input" :value="sec.id" v-model="profilForm.activity_sector_ids" />
              <span class="form-check-label">{{ sec.name }}</span>
            </label>
          </div>
        </div>

        <!-- Langues -->
        <div class="mb-3">
          <label class="form-label">Langues</label>
          <div class="d-flex flex-wrap gap-2">
            <label v-for="lang in referentiels.languages" :key="lang.id" class="form-check">
              <input type="checkbox" class="form-check-input" :value="lang.id" v-model="profilForm.language_ids" />
              <span class="form-check-label">{{ lang.name }}</span>
            </label>
          </div>
        </div>

        <!-- Skills -->
        <div class="mb-3">
          <label class="form-label">Compétences</label>
          <div class="d-flex flex-wrap gap-2">
            <label v-for="skill in referentiels.skills" :key="skill.id" class="form-check">
              <input type="checkbox" class="form-check-input" :value="skill.id" v-model="profilForm.skill_ids" />
              <span class="form-check-label">{{ skill.name }}</span>
            </label>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="savingProfil">
            <span v-if="savingProfil" class="spinner-border spinner-border-sm me-2"></span>
            {{ savingProfil ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="editingTalent = null">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Tableau -->

    <div class="table-responsive">
      <table class="table table-vcenter card-table table-sm">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Localisation</th>
            <th>Provenance</th>
            <th>Statut CRM</th>
            <th>État</th>
            <th class="w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="talents.length === 0">
            <td colspan="8" class="text-center text-muted">Aucun talent trouvé.</td>
          </tr>
          <tr v-else v-for="talent in talents" :key="talent.id">
            <td>
              <div class="fw-bold">{{ talent.name }}</div>
              <div v-if="talent.titre_poste" class="text-muted small">{{ talent.titre_poste }}</div>
            </td>
            <td class="text-muted">{{ talent.email }}</td>
            <td>
              <span class="badge" :class="talent.role === 'consultant_externe' ? 'bg-purple' : 'bg-blue'">
                {{ talent.role === 'consultant_externe' ? 'Consultant' : 'Talent' }}
              </span>
            </td>
            <td class="text-muted">{{ [talent.ville, talent.pays].filter(Boolean).join(', ') || '—' }}</td>
            <td class="text-muted">{{ talent.source_provenance || '—' }}</td>
            <td>
              <select class="form-select form-select-sm" @change="updateStatutCrm(talent, $event.target.value)" :value="talent.statut_crm || ''">
                <option value="">— Aucun —</option>
                <option value="a_traiter">A traiter</option>
                <option value="en_cours_qualif">En cours de qualif.</option>
                <option value="vivier">Vivier</option>
                <option value="top_profil">Top profil</option>
                <option value="converti_ressource">Converti en ressource</option>
                <option value="recrute_client">Recruté par client</option>
                <option value="ne_plus_contacter">Ne plus contacter</option>
              </select>
            </td>
            <td>
              <span v-if="talent.is_suspended" class="badge bg-warning">Suspendu</span>
              <span v-else-if="talent.is_banned" class="badge bg-danger">Banni</span>
              <span v-else class="badge bg-success">Actif</span>
            </td>
            <td>
              <div class="btn-list">
                <button class="btn btn-sm btn-primary" @click="openEdit(talent)" title="Modifier profil">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm" :class="talent.is_suspended ? 'btn-success' : 'btn-warning'" @click="toggleSuspend(talent)" :title="talent.is_suspended ? 'Réactiver' : 'Suspendre'">
                  <i :class="talent.is_suspended ? 'bi bi-check-circle' : 'bi bi-pause-circle'"></i>
                </button>
                <button class="btn btn-sm" :class="talent.is_banned ? 'btn-info' : 'btn-danger'" @click="toggleBan(talent)" :title="talent.is_banned ? 'Débannir' : 'Bannir'">
                  <i :class="talent.is_banned ? 'bi bi-unlock' : 'bi bi-lock'"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteItem(talent.id)" title="Supprimer">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="card-footer d-flex align-items-center">
      <p class="m-0 text-muted">
        Page {{ pagination.current_page }} sur {{ pagination.last_page }}
      </p>
      <ul class="pagination m-0 ms-auto">
        <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
          <a class="page-link" href="#" @click.prevent="loadPage(pagination.current_page - 1)">
            <i class="bi bi-chevron-left"></i>
            Précédent
          </a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
          <a class="page-link" href="#" @click.prevent="loadPage(pagination.current_page + 1)">
            Suivant
            <i class="bi bi-chevron-right"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Messages -->
    <div v-if="error || success" class="card-footer">
      <div v-if="error" class="alert alert-danger mb-0">{{ error }}</div>
      <div v-if="success" class="alert alert-success mb-0">{{ success }}</div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import talentService from '../../services/talentService.js'
import api from '../../services/api.js'

const talents      = ref([])
const loading      = ref(false)
const savingProfil = ref(false)
const error        = ref('')
const success      = ref('')
const pagination   = ref({ current_page: 1, last_page: 1 })
const editingTalent = ref(null)
const profilForm   = ref({})

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
  } finally {
    loading.value = false
  }
}

const openEdit = async (talent) => {
  try {
    const res = await talentService.getOne(talent.id)
    const t   = res.data
    editingTalent.value = t
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
  }
}

const saveProfil = async () => {
  savingProfil.value = true
  error.value = ''
  try {
    await talentService.updateProfil(editingTalent.value.id, profilForm.value)
    success.value = 'Profil mis à jour'
    editingTalent.value = null
    await loadPage(pagination.value.current_page)
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : 'Erreur lors de la sauvegarde'
  } finally {
    savingProfil.value = false
  }
}

const toggleSuspend = async (talent) => {
  try {
    const res = await talentService.toggleSuspend(talent.id)
    talent.is_suspended = res.data.is_suspended
    success.value = talent.is_suspended ? 'Talent suspendu' : 'Talent réactivé'
  } catch {
    error.value = 'Erreur lors de la suspension'
  }
}

const toggleBan = async (talent) => {
  try {
    const res = await talentService.toggleBan(talent.id)
    talent.is_banned = res.data.is_banned
    success.value = talent.is_banned ? 'Talent banni' : 'Talent débanni'
  } catch {
    error.value = 'Erreur lors du bannissement'
  }
}

const updateStatutCrm = async (talent, statut) => {
  try {
    const res = await talentService.updateStatutCrm(talent.id, statut || null)
    talent.statut_crm = res.data.statut_crm
    talent.is_banned  = res.data.is_banned
    success.value = 'Statut CRM mis à jour'
  } catch {
    error.value = 'Erreur lors de la mise à jour du statut'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer définitivement ce talent ?')) return
  loading.value = true
  error.value   = ''
  try {
    await talentService.delete(id)
    success.value = 'Talent supprimé'
    await loadPage(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
