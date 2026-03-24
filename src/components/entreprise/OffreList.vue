<template>
  <div>
    <h2>Mes Offres d'emploi</h2>

    <button @click="openCreate">Publier une offre</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Nouvelle' }} offre</h3>
      <form @submit.prevent="save">
        <div><label>Titre *</label><input type="text" v-model="form.titre" required /></div>
        <div><label>Mission</label><textarea v-model="form.mission" rows="3"></textarea></div>
        <div><label>Profil recherché</label><textarea v-model="form.profil_recherche" rows="3"></textarea></div>
        <div><label>Description</label><textarea v-model="form.description" rows="3"></textarea></div>
        <div><label>Localisation</label><input type="text" v-model="form.localisation" /></div>
        <div><label>Fourchette salariale</label><input type="text" v-model="form.fourchette_salariale" /></div>
        <div><label>Date limite</label><input type="date" v-model="form.date_limite" /></div>

        <div>
          <label>Contrats de travail</label>
          <div v-for="c in referentiels.job_contracts" :key="c.id">
            <input type="checkbox" :id="'jc'+c.id" :value="c.id" v-model="form.job_contract_ids" />
            <label :for="'jc'+c.id">{{ c.name }}</label>
          </div>
        </div>

        <div>
          <label>Modes de travail</label>
          <div v-for="m in referentiels.job_modes" :key="m.id">
            <input type="checkbox" :id="'jm'+m.id" :value="m.id" v-model="form.job_mode_ids" />
            <label :for="'jm'+m.id">{{ m.name }}</label>
          </div>
        </div>

        <div>
          <label>Compétences</label>
          <div v-for="s in referentiels.skills" :key="s.id">
            <input type="checkbox" :id="'sk'+s.id" :value="s.id" v-model="form.skill_ids" />
            <label :for="'sk'+s.id">{{ s.name }}</label>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading">{{ loading ? 'Enregistrement...' : 'Enregistrer' }}</button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <div v-if="items.length > 0">
      <table>
        <thead><tr><th>Titre</th><th>Localisation</th><th>Date limite</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.titre }}</td>
            <td>{{ item.localisation || '-' }}</td>
            <td>{{ item.date_limite || '-' }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune offre publiée.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/entreprise/offreService.js'

const items = ref([])
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)

const emptyForm = () => ({
  titre: '', mission: '', profil_recherche: '', description: '',
  localisation: '', fourchette_salariale: '', date_limite: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  try {
    const res = await offreService.getAll()
    items.value = res.data
  } catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const loadRef = async () => {
  try {
    const res = await offreService.getReferentiels()
    referentiels.value = res.data
  } catch {}
}

const openCreate = () => { editingItem.value = null; form.value = emptyForm(); showForm.value = true }

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    titre: item.titre, mission: item.mission || '', profil_recherche: item.profil_recherche || '',
    description: item.description || '', localisation: item.localisation || '',
    fourchette_salariale: item.fourchette_salariale || '', date_limite: item.date_limite || '',
    job_contract_ids: item.job_contracts?.map(c => c.id) || [],
    job_mode_ids: item.job_modes?.map(m => m.id) || [],
    skill_ids: item.skills?.map(s => s.id) || [],
    study_level_ids: item.study_levels?.map(s => s.id) || [],
    experience_ids: item.experiences?.map(e => e.id) || [],
  }
  showForm.value = false
}

const save = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    if (editingItem.value) {
      await offreService.update(editingItem.value.id, form.value)
      success.value = 'Offre modifiée'
    } else {
      await offreService.create(form.value)
      success.value = 'Offre publiée'
    }
    await load(); cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur enregistrement"
  } finally { loading.value = false }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette offre ?')) return
  loading.value = true
  try {
    await offreService.delete(id); success.value = 'Offre supprimée'; await load()
  } catch { error.value = 'Erreur suppression' }
  finally { loading.value = false }
}

const cancelForm = () => { showForm.value = false; editingItem.value = null; form.value = emptyForm() }

onMounted(() => { load(); loadRef() })
</script>
