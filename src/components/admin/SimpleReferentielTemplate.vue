<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i :class="icon || 'bi bi-list-ul'" class="me-2"></i>
          {{ title }}
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="showForm = true">
            <i class="bi bi-plus"></i>
            Ajouter
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm || editingItem" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }}</h4>
        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label required">Nom</label>
            <input type="text" class="form-control" v-model="form.name" required />
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelForm">Annuler</button>
          </div>
        </form>
      </div>

      <!-- Liste -->
      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="3" class="text-center text-muted">Aucun élément trouvé.</td>
            </tr>
            <tr v-else v-for="item in items" :key="item.id">
              <td class="text-muted">{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editItem(item)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
// Template générique pour les référentiels simples (JobContract, JobMode, Skill, etc.)
// À adapter pour chaque composant en changeant le service, le titre et l'icône
// Props: title (string), icon (string, optionnel)
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'bi bi-list-ul' }
})
</script>
