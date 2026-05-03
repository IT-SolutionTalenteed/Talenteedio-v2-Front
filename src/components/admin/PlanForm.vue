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
              placeholder="Ex: Starter, Business, Premium"
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

          <!-- Statut -->
          <v-col cols="12" md="6" class="d-flex align-center">
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
            <div class="text-subtitle-2 font-weight-semibold mb-1">Restrictions du plan</div>
            <div class="text-caption text-medium-emphasis mb-4">Laisser vide = illimité</div>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_offres"
              label="Max d'offres publiables"
              type="number"
              min="0"
              placeholder="Illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-briefcase-outline"
              hint="Nb total d'offres que l'entreprise peut publier"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_articles"
              label="Max d'articles publiables"
              type="number"
              min="0"
              placeholder="Illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-document-outline"
              hint="Nb total d'articles que l'entreprise peut publier"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_evenements"
              label="Max d'événements participés"
              type="number"
              min="0"
              placeholder="Illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-check-outline"
              hint="Nb d'événements auxquels l'entreprise peut participer"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_entretiens_par_evenement"
              label="Max d'entretiens par événement"
              type="number"
              min="0"
              placeholder="Illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-multiple-outline"
              hint="Nb de créneaux d'entretien sur le stand de l'entreprise par événement"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_candidatures_par_offre"
              label="Max de candidatures par offre"
              type="number"
              min="0"
              placeholder="Illimité"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-inbox-arrow-down-outline"
              hint="Nb de candidatures que chaque offre peut recevoir"
              persistent-hint
            />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="d-flex ga-3">
          <v-btn type="submit" color="primary" :loading="loading" prepend-icon="mdi-content-save">
            {{ isEdit ? 'Mettre à jour' : 'Créer' }}
          </v-btn>
          <v-btn variant="outlined" @click="router.back()">Annuler</v-btn>
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
  max_evenements: null,
  max_entretiens_par_evenement: null,
  max_candidatures_par_offre: null,
  is_active: true,
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

const nullIfEmpty = (val) => (val === '' || val === 0 || val === undefined) ? null : val

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = {
      ...form.value,
      description:                  form.value.description || null,
      max_offres:                   nullIfEmpty(form.value.max_offres),
      max_articles:                 nullIfEmpty(form.value.max_articles),
      max_evenements:               nullIfEmpty(form.value.max_evenements),
      max_entretiens_par_evenement: nullIfEmpty(form.value.max_entretiens_par_evenement),
      max_candidatures_par_offre:   nullIfEmpty(form.value.max_candidatures_par_offre),
    }

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
