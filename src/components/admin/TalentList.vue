<template>
  <div>
    <h2>Gestion des Talents & Consultants</h2>

    <!-- Formulaire édition profil -->
    <div v-if="editingTalent" style="border:1px solid #ccc;padding:16px;margin-bottom:16px;">
      <h3>Modifier le profil — {{ editingTalent.name }}</h3>
      <form @submit.prevent="saveProfil">

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <label>Civilité</label>
            <select v-model="profilForm.civilite">
              <option value="">—</option>
              <option value="M.">M.</option>
              <option value="Mme.">Mme.</option>
            </select>
          </div>
          <div>
            <label>Titre / Poste</label>
            <input type="text" v-model="profilForm.titre_poste" style="width:100%;" />
          </div>
          <div>
            <label>Téléphone</label>
            <input type="text" v-model="profilForm.telephone" style="width:100%;" />
          </div>
          <div>
            <label>Date de naissance</label>
            <input type="date" v-model="profilForm.date_naissance" style="width:100%;" />
          </div>
          <div>
            <label>Nationalité</label>
            <input type="text" v-model="profilForm.nationalite" style="width:100%;" />
          </div>
          <div>
            <label>Ville</label>
            <input type="text" v-model="profilForm.ville" style="width:100%;" />
          </div>
          <div>
            <label>Pays</label>
            <input type="text" v-model="profilForm.pays" style="width:100%;" />
          </div>
          <div>
            <label>Disponibilité</label>
            <input type="text" v-model="profilForm.disponibilite" style="width:100%;" />
          </div>
          <div>
            <label>Mobilité</label>
            <input type="text" v-model="profilForm.mobilite" style="width:100%;" />
          </div>
          <div>
            <label>Situation familiale</label>
            <select v-model="profilForm.situation_familiale" style="width:100%;">
              <option value="">—</option>
              <option value="celibataire">Célibataire</option>
              <option value="marie">Marié(e)</option>
              <option value="pacse">Pacsé(e)</option>
              <option value="divorce">Divorcé(e)</option>
              <option value="veuf">Veuf / Veuve</option>
            </select>
          </div>
          <div>
            <label>Source / Provenance</label>
            <input type="text" v-model="profilForm.source_provenance" style="width:100%;" />
          </div>
          <div>
            <label>Niveau d'étude</label>
            <select v-model="profilForm.study_level_id" style="width:100%;">
              <option value="">—</option>
              <option v-for="sl in referentiels.studyLevels" :key="sl.id" :value="sl.id">{{ sl.name }}</option>
            </select>
          </div>
          <div>
            <label>Expérience</label>
            <select v-model="profilForm.experience_id" style="width:100%;">
              <option value="">—</option>
              <option v-for="ex in referentiels.experiences" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
            </select>
          </div>
        </div>

        <!-- Secteurs d'activité -->
        <div style="margin-top:8px;">
          <label>Secteurs d'activité</label>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
            <label v-for="sec in referentiels.activitySectors" :key="sec.id" style="display:flex;align-items:center;gap:4px;margin-right:8px;">
              <input type="checkbox" :value="sec.id" v-model="profilForm.activity_sector_ids" />
              {{ sec.name }}
            </label>
          </div>
        </div>

        <!-- Langues -->
        <div style="margin-top:8px;">
          <label>Langues</label>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
            <label v-for="lang in referentiels.languages" :key="lang.id" style="display:flex;align-items:center;gap:4px;margin-right:8px;">
              <input type="checkbox" :value="lang.id" v-model="profilForm.language_ids" />
              {{ lang.name }}
            </label>
          </div>
        </div>

        <!-- Skills -->
        <div style="margin-top:8px;">
          <label>Compétences</label>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
            <label v-for="skill in referentiels.skills" :key="skill.id" style="display:flex;align-items:center;gap:4px;margin-right:8px;">
              <input type="checkbox" :value="skill.id" v-model="profilForm.skill_ids" />
              {{ skill.name }}
            </label>
          </div>
        </div>

        <div style="margin-top:12px;">
          <button type="submit" :disabled="savingProfil">{{ savingProfil ? 'Enregistrement...' : 'Enregistrer' }}</button>
          <button type="button" @click="editingTalent = null" style="margin-left:8px;">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Tableau -->
    <div v-if="talents.length > 0">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Ville / Pays</th>
            <th>Provenance</th>
            <th>Statut CRM</th>
            <th>Suspendu</th>
            <th>Banni</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="talent in talents" :key="talent.id">
            <td>
              <div>{{ talent.name }}</div>
              <small v-if="talent.titre_poste" style="color:#666;">{{ talent.titre_poste }}</small>
            </td>
            <td>{{ talent.email }}</td>
            <td>{{ talent.role === 'consultant_externe' ? 'Consultant' : 'Talent' }}</td>
            <td>{{ [talent.ville, talent.pays].filter(Boolean).join(', ') || '—' }}</td>
            <td>{{ talent.source_provenance || '—' }}</td>
            <td>
              <select @change="updateStatutCrm(talent, $event.target.value)" :value="talent.statut_crm || ''">
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
            <td>{{ talent.is_suspended ? 'Oui' : 'Non' }}</td>
            <td>{{ talent.is_banned ? 'Oui' : 'Non' }}</td>
            <td>
              <button @click="openEdit(talent)">Modifier profil</button>
              <button @click="toggleSuspend(talent)">
                {{ talent.is_suspended ? 'Réactiver' : 'Suspendre' }}
              </button>
              <button @click="toggleBan(talent)">
                {{ talent.is_banned ? 'Débannir' : 'Bannir' }}
              </button>
              <button @click="deleteItem(talent.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination.last_page > 1">
        <button :disabled="pagination.current_page <= 1" @click="loadPage(pagination.current_page - 1)">Précédent</button>
        <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page >= pagination.last_page" @click="loadPage(pagination.current_page + 1)">Suivant</button>
      </div>
    </div>
    <div v-else-if="!loading"><p>Aucun talent trouvé.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
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
