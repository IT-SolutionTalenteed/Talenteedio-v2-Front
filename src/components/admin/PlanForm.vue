<template>
  <v-card rounded="xl" border elevation="0" max-width="900" class="mx-auto">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
      <v-icon class="mr-2" color="primary">mdi-crown-outline</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">
        {{ isEdit ? 'Modifier le plan' : 'Créer un plan' }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submit">
        <v-row>
          <!-- Nom du plan -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              label="Nom du plan *"
              placeholder="Ex: Gold, Silver, Premium"
              :rules="[v => !!v || 'Le nom est requis']"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-crown"
            />
          </v-col>

          <!-- Prix -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.price"
              label="Prix (€) *"
              type="number"
              step="0.01"
              min="0"
              :rules="[v => v >= 0 || 'Le prix doit être positif']"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-currency-eur"
            />
          </v-col>

          <!-- Durée -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.duration_days"
              label="Durée (jours) *"
              type="number"
              min="1"
              :rules="[v => v > 0 || 'La durée doit être positive']"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-clock"
            />
          </v-col>

          <!-- Statut -->
          <v-col cols="12" md="6">
            <v-switch
              v-model="form.is_active"
              label="Plan actif"
              color="success"
              hide-details
            />
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description"
              placeholder="Décrivez les avantages de ce plan..."
              variant="outlined"
              rows="3"
              prepend-inner-icon="mdi-text"
            />
          </v-col>

          <!-- Limites -->
          <v-col cols="12">
            <v-divider class="mb-4" />
            <div class="text-subtitle-2 mb-3">Limites du plan</div>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_offres"
              label="Nombre max d'offres"
              type="number"
              min="0"
              placeholder="Laisser vide pour illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-briefcase"
              hint="Laisser vide pour illimité"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_articles"
              label="Nombre max d'articles"
              type="number"
              min="0"
              placeholder="Laisser vide pour illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-document"
              hint="Laisser vide pour illimité"
              persistent-hint
            />
          </v-col>

          <!-- Fonctionnalités -->
          <v-col cols="12">
            <v-divider class="mb-4" />
            <div class="text-subtitle-2 mb-3">Fonctionnalités incluses</div>
          </v-col>

          <v-col cols="12" md="4">
            <v-switch
              v-model="form.featured_events"
              label="Événements premium"
              color="primary"
              hide-details
            >
              <template #prepend>
                <v-icon color="primary">mdi-calendar-star</v-icon>
              </template>
            </v-switch>
          </v-col>

          <v-col cols="12" md="4">
            <v-switch
              v-model="form.priority_support"
              label="Support prioritaire"
              color="warning"
              hide-details
            >
              <template #prepend>
                <v-icon color="warning">mdi-headset</v-icon>
              </template>
            </v-switch>
          </v-col>

          <v-col cols="12" md="4">
            <v-switch
              v-model="form.analytics"
              label="Analytics avancés"
              color="info"
              hide-details
            >
              <template #prepend>
                <v-icon color="info">mdi-chart-line</v-icon>
              </template>
            </v-switch>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="d-flex ga-3">
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-content-save"
          >
            {{ isEdit ? 'Mettre à jour' : 'Créer' }}
          </v-btn>
          <v-btn variant="outlined" @click="router.back()">
            Annuler
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import planService from '../../services/planService.js'

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const loading = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  description: '',
  price: 0,
  max_offres: null,
  max_articles: null,
  featured_events: false,
  priority_support: false,
  analytics: false,
  is_active: true,
  duration_days: 30,
})

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const load = async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const res = await planService.getById(route.params.id)
    form.value = { ...res.data }
  } catch {
    showSnack('Erreur lors du chargement', 'error')
    router.back()
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = { ...form.value }
    
    // Convertir les valeurs vides en null pour les champs optionnels
    if (!payload.max_offres) payload.max_offres = null
    if (!payload.max_articles) payload.max_articles = null
    if (!payload.description) payload.description = null

    if (isEdit.value) {
      await planService.update(route.params.id, payload)
      showSnack('Plan mis à jour avec succès')
    } else {
      await planService.create(payload)
      showSnack('Plan créé avec succès')
    }
    
    setTimeout(() => router.push({ name: 'AdminPlans' }), 1000)
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la sauvegarde', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
