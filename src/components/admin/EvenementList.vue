<template>
  <div>
    <h2>Gestion des Événements</h2>

    <p v-if="referentiels.categories?.length === 0" style="color:orange;">
      ⚠ Aucune catégorie d'événement disponible. Créez-en une d'abord dans "Catégories d'événement".
    </p>
    <button @click="openCreate">Ajouter un événement</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} un événement</h3>

      <form @submit.prevent="save" enctype="multipart/form-data">

        <div>
          <label>Titre *</label>
          <input type="text" v-model="form.titre" required />
        </div>

        <div>
          <label>Image mise en avant</label>
          <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
          <img v-if="imagePreview" :src="imagePreview" style="max-width:150px;max-height:150px;" />
          <img v-else-if="editingItem?.image_mise_en_avant_url" :src="editingItem.image_mise_en_avant_url" style="max-width:150px;max-height:150px;" />
        </div>

        <div>
          <label>Catégorie d'événement</label>
          <select v-model="form.categorie_evenement_id">
            <option value="">-- Aucune --</option>
            <option v-for="cat in referentiels.categories" :key="cat.id" :value="cat.id">{{ cat.titre }}</option>
          </select>
        </div>

        <div>
          <label>Date début *</label>
          <input type="date" v-model="form.date_debut" required />
        </div>

        <div>
          <label>Date fin *</label>
          <input type="date" v-model="form.date_fin" required />
        </div>

        <div>
          <label>Heure début journée * (HH:MM)</label>
          <input type="time" v-model="form.heure_debut_journee" required />
        </div>

        <div>
          <label>Heure fin journée * (HH:MM)</label>
          <input type="time" v-model="form.heure_fin_journee" required />
        </div>

        <div>
          <label>Pays</label>
          <input type="text" v-model="form.pays" />
        </div>

        <div>
          <label>Ville</label>
          <input type="text" v-model="form.ville" />
        </div>

        <div>
          <label>Adresse</label>
          <input type="text" v-model="form.adresse" />
        </div>

        <div>
          <label>Description</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <div>
          <label>Détails supplémentaires</label>
          <textarea v-model="form.details_supplementaires" rows="4"></textarea>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="form.is_featured" />
            Mise en avant
          </label>
        </div>

        <div>
          <label>Entreprises participantes</label>
          <select v-model="form.entreprise_ids" multiple>
            <option v-for="e in referentiels.entreprises" :key="e.id" :value="e.id">{{ e.nom }}</option>
          </select>
          <small>Ctrl/Cmd pour sélectionner plusieurs</small>
        </div>

        <div>
          <button type="submit" :disabled="loading">{{ loading ? 'Enregistrement...' : 'Enregistrer' }}</button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste -->
    <div v-if="evenements.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Image</th><th>Titre</th><th>Dates</th>
            <th>Ville</th><th>Mis en avant</th><th>Entreprises</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ev in evenements" :key="ev.id">
            <td>{{ ev.id }}</td>
            <td>
              <img v-if="ev.image_mise_en_avant_url" :src="ev.image_mise_en_avant_url" style="max-width:60px;max-height:60px;" />
              <span v-else>-</span>
            </td>
            <td>{{ ev.titre }}</td>
            <td>{{ formatDate(ev.date_debut) }} → {{ formatDate(ev.date_fin) }}</td>
            <td>{{ ev.ville || '-' }}</td>
            <td>
              <button @click="toggleFeatured(ev)">{{ ev.is_featured ? '⭐ Oui' : 'Non' }}</button>
            </td>
            <td>{{ ev.entreprises?.length || 0 }}</td>
            <td>
              <button @click="editItem(ev)">Modifier</button>
              <button @click="deleteItem(ev.id)">Supprimer</button>
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
    <div v-else-if="!loading"><p>Aucun événement trouvé.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/evenementService.js'

const evenements = ref([])
const referentiels = ref({ categories: [], entreprises: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })

const emptyForm = () => ({
  titre: '', description: '', details_supplementaires: '',
  date_debut: '', date_fin: '',
  heure_debut_journee: '09:00', heure_fin_journee: '18:00',
  categorie_evenement_id: '', pays: '', ville: '', adresse: '',
  is_featured: false, entreprise_ids: []
})
const form = ref(emptyForm())

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await evenementService.getAll(page)
    evenements.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await evenementService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  const fields = ['titre', 'description', 'details_supplementaires', 'date_debut', 'date_fin',
    'heure_debut_journee', 'heure_fin_journee', 'pays', 'ville', 'adresse']
  fields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.categorie_evenement_id) fd.append('categorie_evenement_id', form.value.categorie_evenement_id)
  fd.append('is_featured', form.value.is_featured ? '1' : '0')
  form.value.entreprise_ids.forEach(id => fd.append('entreprise_ids[]', id))
  if (imageFile.value) fd.append('image_mise_en_avant', imageFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  imageFile.value = null
  imagePreview.value = null
  showForm.value = true
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      await evenementService.update(editingItem.value.id, fd)
      success.value = 'Événement modifié avec succès'
    } else {
      await evenementService.create(fd)
      success.value = 'Événement créé avec succès'
    }
    await loadPage(pagination.value.current_page)
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const editItem = (ev) => {
  editingItem.value = { ...ev }
  form.value = {
    titre: ev.titre,
    description: ev.description || '',
    details_supplementaires: ev.details_supplementaires || '',
    date_debut: ev.date_debut ? ev.date_debut.substring(0, 10) : '',
    date_fin: ev.date_fin ? ev.date_fin.substring(0, 10) : '',
    heure_debut_journee: ev.heure_debut_journee || '09:00',
    heure_fin_journee: ev.heure_fin_journee || '18:00',
    categorie_evenement_id: ev.categorie_evenement_id || '',
    pays: ev.pays || '',
    ville: ev.ville || '',
    adresse: ev.adresse || '',
    is_featured: ev.is_featured,
    entreprise_ids: ev.entreprises?.map(e => e.id) || []
  }
  imageFile.value = null
  imagePreview.value = null
  showForm.value = false
}

const toggleFeatured = async (ev) => {
  try {
    await evenementService.toggleFeatured(ev.id)
    await loadPage(pagination.value.current_page)
  } catch {
    error.value = 'Erreur lors de la mise à jour'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cet événement ?')) return
  loading.value = true
  error.value = ''
  try {
    await evenementService.delete(id)
    success.value = 'Événement supprimé avec succès'
    await loadPage(pagination.value.current_page)
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
  imageFile.value = null
  imagePreview.value = null
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '-'

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
