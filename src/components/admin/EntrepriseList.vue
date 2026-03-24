<template>
  <div>
    <h2>Gestion des Entreprises</h2>

    <button @click="openCreate">Ajouter une entreprise</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} une entreprise</h3>

      <form @submit.prevent="save" enctype="multipart/form-data">
        <div>
          <label>Nom *</label>
          <input type="text" v-model="form.nom" required />
        </div>

        <div>
          <label>Email *</label>
          <input type="email" v-model="form.email" required :disabled="!!editingItem" />
          <small v-if="!editingItem">Un email avec les identifiants sera envoyé à cette adresse.</small>
        </div>

        <div>
          <label>Logo</label>
          <input type="file" accept="image/*" @change="e => logoFile = e.target.files[0]" />
          <img v-if="editingItem?.logo_url" :src="editingItem.logo_url" style="max-width:100px;max-height:100px;" />
        </div>

        <div>
          <label>Description</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <div>
          <label>Site web</label>
          <input type="text" v-model="form.site_web" />
        </div>

        <div>
          <label>Téléphone</label>
          <input type="text" v-model="form.telephone" />
        </div>

        <div>
          <label>Adresse</label>
          <input type="text" v-model="form.adresse" />
        </div>

        <div>
          <label>Ville</label>
          <input type="text" v-model="form.ville" />
        </div>

        <div>
          <label>Pays</label>
          <input type="text" v-model="form.pays" />
        </div>

        <div>
          <label>Secteur d'activité</label>
          <select v-model="form.activity_sector_id">
            <option value="">-- Aucun --</option>
            <option v-for="s in referentiels.activity_sectors" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div>
          <button type="submit" :disabled="loading">{{ loading ? 'Enregistrement...' : 'Enregistrer' }}</button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste -->
    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Logo</th><th>Nom</th><th>Email</th><th>Ville</th><th>Secteur</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <img v-if="item.logo_url" :src="item.logo_url" style="max-width:50px;max-height:50px;" />
              <span v-else>-</span>
            </td>
            <td>{{ item.nom }}</td>
            <td>{{ item.user?.email || '-' }}</td>
            <td>{{ item.ville || '-' }}</td>
            <td>{{ item.activity_sector?.name || '-' }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune entreprise trouvée.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import entrepriseService from '../../services/entrepriseService.js'

const items = ref([])
const referentiels = ref({ activity_sectors: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const logoFile = ref(null)

const emptyForm = () => ({
  nom: '', email: '', description: '', site_web: '',
  telephone: '', adresse: '', ville: '', pays: '', activity_sector_id: ''
})
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await entrepriseService.getAll()
    items.value = res.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await entrepriseService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('nom', form.value.nom)
  fd.append('email', form.value.email)
  const textFields = ['description', 'site_web', 'telephone', 'adresse', 'ville', 'pays']
  textFields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.activity_sector_id) fd.append('activity_sector_id', form.value.activity_sector_id)
  if (logoFile.value) fd.append('logo', logoFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  logoFile.value = null
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    nom: item.nom,
    email: item.user?.email || '',
    description: item.description || '',
    site_web: item.site_web || '',
    telephone: item.telephone || '',
    adresse: item.adresse || '',
    ville: item.ville || '',
    pays: item.pays || '',
    activity_sector_id: item.activity_sector_id || '',
  }
  logoFile.value = null
  showForm.value = false
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      fd.append('_method', 'PUT')
      await entrepriseService.updateFormData(editingItem.value.id, fd)
      success.value = 'Entreprise modifiée avec succès'
    } else {
      await entrepriseService.create(fd)
      success.value = 'Entreprise créée — identifiants envoyés par email'
    }
    await load()
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette entreprise et son compte utilisateur ?')) return
  loading.value = true
  error.value = ''
  try {
    await entrepriseService.delete(id)
    success.value = 'Entreprise supprimée avec succès'
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  editingItem.value = null
  form.value = emptyForm()
  logoFile.value = null
}

onMounted(() => {
  load()
  loadReferentiels()
})
</script>
