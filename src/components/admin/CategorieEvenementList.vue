<template>
  <div>
    <h2>Gestion des Catégories d'événement</h2>

    <button @click="openCreate">Ajouter une catégorie</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} une catégorie</h3>

      <form @submit.prevent="save" enctype="multipart/form-data">

        <div>
          <label>Titre *</label>
          <input type="text" v-model="form.titre" required />
        </div>

        <div>
          <label>Description</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <div>
          <label>Image</label>
          <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
          <img v-if="imagePreview" :src="imagePreview" style="max-width:150px;max-height:150px;" />
          <img v-else-if="editingItem?.image_url" :src="editingItem.image_url" style="max-width:150px;max-height:150px;" />
        </div>

        <div>
          <label>Vidéo principale</label>
          <input type="file" accept="video/*" @change="e => videoFile = e.target.files[0]" />
          <p v-if="editingItem?.video_url">Vidéo actuelle : <a :href="editingItem.video_url" target="_blank">voir</a></p>
        </div>

        <div>
          <label>Galerie (images / vidéos)</label>
          <input type="file" accept="image/*,video/*" multiple @change="e => galerieFiles = Array.from(e.target.files)" />
          <div v-if="editingItem?.galerie?.length">
            <p>Galerie actuelle :</p>
            <div v-for="(path, i) in editingItem.galerie" :key="i" style="display:inline-block;margin:4px;">
              <img v-if="isImage(path)" :src="storageUrl(path)" style="max-width:80px;max-height:80px;" />
              <span v-else>🎬 {{ path.split('/').pop() }}</span>
              <button type="button" @click="removeGalerieItem(path)">✕</button>
            </div>
          </div>
        </div>

        <!-- Liste détails -->
        <div>
          <label>Liste détails</label>
          <div v-for="(item, i) in form.liste_details" :key="i" style="margin:4px 0;">
            <input type="text" v-model="form.liste_details[i]" placeholder="Détail..." style="width:calc(100% - 44px);" />
            <button type="button" @click="form.liste_details.splice(i,1)" style="margin-left:4px;">✕</button>
          </div>
          <button type="button" @click="form.liste_details.push('')">+ Ajouter un détail</button>
        </div>

        <!-- Liste témoignages -->
        <div>
          <label>Liste témoignages</label>
          <div v-for="(item, i) in form.liste_temoignages" :key="i" style="margin:4px 0;">
            <input type="text" v-model="form.liste_temoignages[i]" placeholder="Témoignage..." style="width:calc(100% - 44px);" />
            <button type="button" @click="form.liste_temoignages.splice(i,1)" style="margin-left:4px;">✕</button>
          </div>
          <button type="button" @click="form.liste_temoignages.push('')">+ Ajouter un témoignage</button>
        </div>

        <!-- Liste FAQs -->
        <div>
          <label>Liste FAQs</label>
          <div v-for="(faq, i) in form.liste_faqs" :key="i" style="border:1px solid #ccc;padding:8px;margin:4px 0;">
            <input type="text" v-model="form.liste_faqs[i].question" placeholder="Question" style="width:100%;margin-bottom:4px;" />
            <textarea v-model="form.liste_faqs[i].reponse" placeholder="Réponse" rows="2" style="width:100%;"></textarea>
            <button type="button" @click="form.liste_faqs.splice(i,1)">✕ Supprimer</button>
          </div>
          <button type="button" @click="form.liste_faqs.push({question:'',reponse:''})">+ Ajouter une FAQ</button>
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
          <tr><th>ID</th><th>Image</th><th>Titre</th><th>Galerie</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <img v-if="item.image_url" :src="item.image_url" style="max-width:60px;max-height:60px;" />
              <span v-else>-</span>
            </td>
            <td>{{ item.titre }}</td>
            <td>{{ item.galerie?.length || 0 }} fichier(s)</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune catégorie trouvée.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import categorieEvenementService from '../../services/categorieEvenementService.js'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const videoFile = ref(null)
const galerieFiles = ref([])

const emptyForm = () => ({
  titre: '', description: '',
  liste_details: [], liste_temoignages: [], liste_faqs: []
})
const form = ref(emptyForm())

const storageUrl = (path) => `${API_BASE}/storage/${path}`
const isImage = (path) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await categorieEvenementService.getAll()
    items.value = res.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('titre', form.value.titre)
  if (form.value.description) fd.append('description', form.value.description)
  if (imageFile.value) fd.append('image', imageFile.value)
  if (videoFile.value) fd.append('video', videoFile.value)
  galerieFiles.value.forEach(f => fd.append('galerie[]', f))
  form.value.liste_details.filter(Boolean).forEach((v, i) => fd.append(`liste_details[${i}]`, v))
  form.value.liste_temoignages.filter(Boolean).forEach((v, i) => fd.append(`liste_temoignages[${i}]`, v))
  form.value.liste_faqs.forEach((faq, i) => {
    fd.append(`liste_faqs[${i}][question]`, faq.question)
    fd.append(`liste_faqs[${i}][reponse]`, faq.reponse)
  })
  return fd
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      const res = await categorieEvenementService.update(editingItem.value.id, fd)
      editingItem.value = res.data
      success.value = 'Catégorie modifiée avec succès'
    } else {
      await categorieEvenementService.create(fd)
      success.value = 'Catégorie créée avec succès'
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

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  imageFile.value = null
  imagePreview.value = null
  videoFile.value = null
  galerieFiles.value = []
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    titre: item.titre,
    description: item.description || '',
    liste_details: item.liste_details ? [...item.liste_details] : [],
    liste_temoignages: item.liste_temoignages ? [...item.liste_temoignages] : [],
    liste_faqs: item.liste_faqs ? item.liste_faqs.map(f => ({ ...f })) : [],
  }
  imageFile.value = null
  imagePreview.value = null
  videoFile.value = null
  galerieFiles.value = []
  showForm.value = false
}

const removeGalerieItem = async (path) => {
  if (!confirm('Supprimer ce fichier de la galerie ?')) return
  try {
    const res = await categorieEvenementService.removeGalerieItem(editingItem.value.id, path)
    editingItem.value = res.data
    await load()
  } catch {
    error.value = 'Erreur lors de la suppression'
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette catégorie ?')) return
  loading.value = true
  error.value = ''
  try {
    await categorieEvenementService.delete(id)
    success.value = 'Catégorie supprimée avec succès'
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
  imageFile.value = null
  imagePreview.value = null
  videoFile.value = null
  galerieFiles.value = []
}

onMounted(load)
</script>
