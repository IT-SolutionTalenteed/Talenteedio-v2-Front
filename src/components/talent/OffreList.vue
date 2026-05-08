<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('talentDashboard.offers.title') }}</v-card-title>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Dialog candidature -->
    <v-dialog v-model="showCandidature" max-width="560" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          {{ t('talentDashboard.offers.apply') }}{{ selectedOffre?.titre }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="postuler">
            <div class="mb-4">
              <label class="text-body-2 font-weight-medium mb-1 d-block">{{ t('talentDashboard.offers.cvRequired') }}</label>
              <input type="file" accept=".pdf,.doc,.docx" @change="e => cvFile = e.target.files[0]" required />
            </div>
            <v-textarea
              v-model="candidatureMessage"
              :label="t('talentDashboard.offers.motivationMessage')"
              rows="5"
              :placeholder="t('talentDashboard.offers.motivationPlaceholder')"
              variant="outlined"
              density="comfortable"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showCandidature = false">{{ t('commonDashboard.actions.cancel') }}</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="loading || !cvFile" :loading="loading" @click="postuler">
            {{ t('talentDashboard.offers.sendApplication') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Table des offres -->
    <v-data-table
      :headers="headers"
      :items="offres"
      :loading="loading"
      hover
      density="comfortable"
      hide-default-footer
    >
      <template #item.job_contracts="{ item }">
        <span v-if="item.job_contracts?.length">
          <v-chip
            v-for="c in item.job_contracts"
            :key="c.id"
            size="small"
            class="mr-1"
            color="primary"
            variant="tonal"
          >{{ c.name }}</v-chip>
        </span>
        <span v-else>-</span>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          :icon="favorisIds.has(item.id) ? 'mdi-star' : 'mdi-star-outline'"
          :color="favorisIds.has(item.id) ? 'warning' : 'default'"
          size="small"
          variant="text"
          @click="toggleFavori(item)"
        />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('talentDashboard.offers.noOffers') }}</div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="d-flex justify-center mt-4">
      <v-pagination
        v-model="pagination.current_page"
        :length="pagination.last_page"
        @update:model-value="loadPage"
      />
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import offreService from '../../services/talent/offreService.js'

const { t } = useI18n()

const offres = ref([])
const favorisIds = ref(new Set())
const loading = ref(false)
const error = ref('')
const success = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })
const showCandidature = ref(false)
const selectedOffre = ref(null)
const cvFile = ref(null)
const candidatureMessage = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: t('talentDashboard.offers.title_field'), key: 'titre' },
  { title: t('talentDashboard.offers.company'), key: 'entreprise.nom' },
  { title: t('talentDashboard.offers.location'), key: 'localisation' },
  { title: t('talentDashboard.offers.salary'), key: 'fourchette_salariale' },
  { title: t('talentDashboard.offers.deadline'), key: 'date_limite' },
  { title: t('talentDashboard.offers.contracts'), key: 'job_contracts', sortable: false },
  { title: t('talentDashboard.offers.actions'), key: 'actions', sortable: false, align: 'end' },
]

const loadPage = async (page = 1) => {
  loading.value = true; error.value = ''
  try {
    const res = await offreService.getAll(page)
    offres.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch { error.value = t('talentDashboard.offers.errorLoading'); showSnack(t('talentDashboard.offers.errorLoading'), 'error') }
  finally { loading.value = false }
}

const openCandidature = (offre) => {
  selectedOffre.value = offre
  cvFile.value = null
  candidatureMessage.value = ''
  showCandidature.value = true
  success.value = ''
  error.value = ''
}

const postuler = async () => {
  if (!cvFile.value) return
  loading.value = true; error.value = ''; success.value = ''
  try {
    const fd = new FormData()
    fd.append('cv', cvFile.value)
    if (candidatureMessage.value) fd.append('message', candidatureMessage.value)
    await offreService.postuler(selectedOffre.value.id, fd)
    success.value = t('talentDashboard.offers.applicationSent')
    showCandidature.value = false
    showSnack(t('talentDashboard.offers.applicationSent'))
  } catch (err) {
    error.value = err.response?.data?.message || t('talentDashboard.offers.errorApplication')
    showSnack(error.value, 'error')
  } finally { loading.value = false }
}

const loadFavoris = async () => {
  try {
    const res = await offreService.getFavoris()
    favorisIds.value = new Set(res.data.map(o => o.id))
  } catch {}
}

const toggleFavori = async (offre) => {
  try {
    const res = await offreService.toggleFavori(offre.id)
    if (res.data.favori) {
      favorisIds.value.add(offre.id)
    } else {
      favorisIds.value.delete(offre.id)
    }
    // Trigger reactivity
    favorisIds.value = new Set(favorisIds.value)
  } catch { error.value = t('talentDashboard.offers.errorFavorites'); showSnack(t('talentDashboard.offers.errorFavorites'), 'error') }
}

onMounted(() => { loadPage(); loadFavoris() })
</script>
