<template>
  <div>
    <h2>Mes Articles</h2>

    <button @click="openCreate">Rédiger un article</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Nouvel' }} article</h3>
      <form @submit.prevent="save">
        <div><label>Titre *</label><input type="text" v-model="form.title" required /></div>
        <div><label>Contenu *</label><textarea v-model="form.content" rows="8" required></textarea></div>

        <div>
          <label>Image</label>
          <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
          <img v-if="editingItem?.image_url" :src="editingItem.image_url" style="max-width:120px;" />
        </div>

        <div>
          <label><input type="checkbox" v-model="form.is_published" /> Publier</label>
        </div>

        <div>
          <label>Catégories</label>
          <div v-for="c in referentiels.media_categories" :key="c.id">
            <input type="checkbox" :id="'cat'+c.id" :value="c.id" v-model="form.category_ids" />
            <label :for="'cat'+c.id">{{ c.name }}</label>
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
        <thead><tr><th>Image</th><th>Titre</th><th>Publié</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td><img v-if="item.image_url" :src="item.image_url" style="max-width:60px;" /></td>
            <td>{{ item.title }}</td>
            <td>{{ item.is_published ? 'Oui' : 'Non' }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun article.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import articleService from '../../services/entreprise/articleService.js'

const items = ref([])
const referentiels = ref({ media_categories: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)

const emptyForm = () => ({ title: '', content: '', is_published: false, category_ids: [] })
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  try { const res = await articleService.getAll(); items.value = res.data }
  catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const loadRef = async () => {
  try { const res = await articleService.getReferentiels(); referentiels.value = res.data }
  catch {}
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('is_published', form.value.is_published ? '1' : '0')
  form.value.category_ids.forEach(id => fd.append('category_ids[]', id))
  if (imageFile.value) fd.append('image', imageFile.value)
  return fd
}

const openCreate = () => { editingItem.value = null; form.value = emptyForm(); imageFile.value = null; showForm.value = true }

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    title: item.title, content: item.content,
    is_published: item.is_published,
    category_ids: item.media_categories?.map(c => c.id) || [],
  }
  imageFile.value = null; showForm.value = false
}

const save = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      fd.append('_method', 'PUT')
      await articleService.update(editingItem.value.id, fd)
      success.value = 'Article modifié'
    } else {
      await articleService.create(fd)
      success.value = 'Article créé'
    }
    await load(); cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur enregistrement"
  } finally { loading.value = false }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cet article ?')) return
  loading.value = true
  try { await articleService.delete(id); success.value = 'Article supprimé'; await load() }
  catch { error.value = 'Erreur suppression' }
  finally { loading.value = false }
}

const cancelForm = () => { showForm.value = false; editingItem.value = null; form.value = emptyForm(); imageFile.value = null }

onMounted(() => { load(); loadRef() })
</script>
