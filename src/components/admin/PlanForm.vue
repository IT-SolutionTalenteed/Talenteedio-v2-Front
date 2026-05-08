<template>
  <v-card rounded="xl" border elevation="0" max-width="900" class="mx-auto">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
      <v-icon class="mr-2" color="primary">mdi-crown-outline</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">
        {{ isEdit ? $t('admin.plans.editPlan') : $t('admin.plans.createPlan') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submit">
        <v-row>
          <!-- Nom du plan -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              :label="$t('admin.plans.nameRequired')"
              :placeholder="$t('admin.plans.namePlaceholder')"
              :rules="[v => !!v || $t('admin.plans.nameError')]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-crown"
            />
          </v-col>

          <!-- Prix -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.price"
              :label="$t('admin.plans.price')"
              type="number"
              step="0.01"
              min="0"
              :rules="[v => v >= 0 || $t('admin.plans.priceError')]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-currency-eur"
            />
          </v-col>

          <!-- Statut -->
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch
              v-model="form.is_active"
              :label="$t('admin.plans.planActive')"
              color="success"
              hide-details
            />
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              :label="$t('admin.plans.description')"
              :placeholder="$t('admin.plans.descriptionPlaceholder')"
              variant="outlined"
              rows="3"
              prepend-inner-icon="mdi-text"
            />
          </v-col>

          <!-- Limites -->
          <v-col cols="12">
            <v-divider class="mb-4" />
            <div class="text-subtitle-2 font-weight-semibold mb-1">{{ $t('admin.plans.restrictions') }}</div>
            <div class="text-caption text-medium-emphasis mb-4">{{ $t('admin.plans.restrictionsHint') }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_offres"
              :label="$t('admin.plans.maxOffers')"
              type="number"
              min="0"
              :placeholder="$t('admin.plans.unlimited')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-briefcase-outline"
              :hint="$t('admin.plans.maxOffersHint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_articles"
              :label="$t('admin.plans.maxArticles')"
              type="number"
              min="0"
              :placeholder="$t('admin.plans.unlimited')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-document-outline"
              :hint="$t('admin.plans.maxArticlesHint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_evenements"
              :label="$t('admin.plans.maxEvents')"
              type="number"
              min="0"
              :placeholder="$t('admin.plans.unlimited')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-check-outline"
              :hint="$t('admin.plans.maxEventsHint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_entretiens_par_evenement"
              :label="$t('admin.plans.maxInterviewsPerEvent')"
              type="number"
              min="0"
              :placeholder="$t('admin.plans.unlimited')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-multiple-outline"
              :hint="$t('admin.plans.maxInterviewsPerEventHint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.max_candidatures_par_offre"
              :label="$t('admin.plans.maxApplicationsPerOffer')"
              type="number"
              min="0"
              :placeholder="$t('admin.plans.unlimited')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-inbox-arrow-down-outline"
              :hint="$t('admin.plans.maxApplicationsPerOfferHint')"
              persistent-hint
            />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="d-flex ga-3">
          <v-btn type="submit" color="primary" :loading="loading" prepend-icon="mdi-content-save">
            {{ isEdit ? $t('admin.plans.update') : $t('admin.plans.create') }}
          </v-btn>
          <v-btn variant="outlined" @click="router.back()">{{ $t('admin.plans.cancel') }}</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import planService from '../../services/planService.js'

const { t: $t } = useI18n()

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
    showSnack($t('admin.plans.errorLoading'), 'error')
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
      showSnack($t('admin.plans.planUpdated'))
    } else {
      await planService.create(payload)
      showSnack($t('admin.plans.planCreated'))
    }

    setTimeout(() => router.push({ name: 'AdminPlans' }), 1000)
  } catch (err) {
    showSnack(err.response?.data?.message || $t('admin.plans.errorSave'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
