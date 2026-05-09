<template>
  <v-card rounded="xl" border elevation="0" class="pa-4" style="max-width:680px;margin:0 auto">
    <v-card-title class="text-h5 mb-1">{{ t('profile.title') }}</v-card-title>
    <v-card-subtitle class="mb-4">{{ t('profile.subtitle') }}</v-card-subtitle>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-form @submit.prevent="save">

      <!-- Identité -->
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3 mt-2">
        <v-icon size="16" class="mr-1">mdi-account-outline</v-icon> {{ t('profile.identity.title') }}
      </div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.first_name"
            :label="t('profile.identity.firstName')"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.last_name"
            :label="t('profile.identity.lastName')"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.titre_poste"
            :label="t('profile.identity.position')"
            variant="outlined"
            density="comfortable"
            :placeholder="t('profile.identity.positionPlaceholder')"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.telephone"
            :label="t('profile.identity.phone')"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-phone-outline"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.ville"
            :label="t('profile.identity.city')"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-map-marker-outline"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.pays"
            :label="t('profile.identity.country')"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-earth"
          />
        </v-col>
      </v-row>

      <!-- Préférences de mobilité (matching) -->
      <v-divider class="my-4" />
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3">
        <v-icon size="16" class="mr-1">mdi-map-search-outline</v-icon>
        {{ t('profile.mobility.title') }}
        <span class="text-caption ml-1">{{ t('profile.mobility.subtitle') }}</span>
      </div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-combobox
            v-model="form.pays_souhaites"
            :label="t('profile.mobility.desiredCountries')"
            variant="outlined"
            density="comfortable"
            multiple
            chips
            closable-chips
            prepend-inner-icon="mdi-earth"
            :hint="t('profile.mobility.flexibleHint')"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-combobox
            v-model="form.villes_souhaitees"
            :label="t('profile.mobility.desiredCities')"
            variant="outlined"
            density="comfortable"
            multiple
            chips
            closable-chips
            prepend-inner-icon="mdi-city-variant-outline"
            :hint="t('profile.mobility.flexibleHint')"
            persistent-hint
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="form.secteur_souhaite_id"
            :items="activitySectors"
            item-title="name"
            item-value="id"
            :label="t('profile.mobility.desiredSector')"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-briefcase-outline"
            clearable
            :hint="t('profile.mobility.anySectorHint')"
            persistent-hint
          />
        </v-col>
      </v-row>

      <!-- Compte -->
      <v-divider class="my-4" />
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3">
        <v-icon size="16" class="mr-1">mdi-email-outline</v-icon> {{ t('profile.account.title') }}
      </div>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="form.email"
            :label="t('profile.account.email')"
            type="email"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-email-outline"
          />
        </v-col>
      </v-row>

      <!-- Mot de passe -->
      <v-divider class="my-4" />
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3">
        <v-icon size="16" class="mr-1">mdi-lock-outline</v-icon> {{ t('profile.password.title') }}
        <span class="text-caption ml-1">{{ t('profile.password.subtitle') }}</span>
      </div>
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.current_password"
            :label="t('profile.password.current')"
            :type="showCurrent ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showCurrent = !showCurrent"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.password"
            :label="t('profile.password.new')"
            :type="showNew ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showNew = !showNew"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.password_confirmation"
            :label="t('profile.password.confirm')"
            :type="showConfirm ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirm = !showConfirm"
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-4">
        <v-btn
          color="primary"
          variant="tonal"
          type="submit"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
        >
          {{ t('profile.save') }}
        </v-btn>
      </div>

    </v-form>

    <!-- Zone danger -->
    <v-divider class="my-6" />
    <div>
      <div class="text-body-2 font-weight-medium text-error mb-3">
        <v-icon size="16" color="error" class="mr-1">mdi-alert-circle-outline</v-icon>
        Zone de danger
      </div>
      <p class="text-body-2 text-medium-emphasis mb-4">
        La suppression de votre compte est définitive. Toutes vos données (candidatures, entretiens, matchings, favoris) seront supprimées.
      </p>
      <v-btn color="error" variant="tonal" prepend-icon="mdi-delete-forever-outline" @click="deleteDialog = true">
        Supprimer mon compte
      </v-btn>
    </div>

    <!-- Dialog confirmation suppression -->
    <v-dialog v-model="deleteDialog" max-width="440">
      <v-card rounded="xl">
        <v-card-title class="text-h6 pt-5 px-5">Supprimer mon compte</v-card-title>
        <v-card-text class="px-5 pb-2">
          <p class="text-body-2 mb-4">
            Cette action est <strong>irréversible</strong>. Confirmez en saisissant votre mot de passe.
          </p>
          <v-text-field
            v-model="deletePassword"
            label="Mot de passe"
            type="password"
            variant="outlined"
            density="comfortable"
            :error-messages="deleteError"
            autocomplete="current-password"
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false; deletePassword = ''; deleteError = ''">Annuler</v-btn>
          <v-btn color="error" variant="tonal" :loading="deleteLoading" @click="confirmDelete">Supprimer définitivement</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()

const { t } = useI18n()

const loading = ref(false)
const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const activitySectors = ref([])

const deleteDialog   = ref(false)
const deletePassword = ref('')
const deleteError    = ref('')
const deleteLoading  = ref(false)

const form = ref({
  first_name: '', last_name: '', titre_poste: '',
  telephone: '', ville: '', pays: '',
  pays_souhaites: [],
  villes_souhaitees: [],
  secteur_souhaite_id: null,
  email: '',
  current_password: '', password: '', password_confirmation: '',
})

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

onMounted(async () => {
  try {
    const [userRes, sectorsRes] = await Promise.all([
      api.get('/user'),
      api.get('/activity-sectors'),
    ])
    const u = userRes.data
    const nameParts = (u.name || '').trim().split(' ')
    form.value.first_name         = u.first_name  || nameParts[0] || ''
    form.value.last_name          = u.last_name   || nameParts.slice(1).join(' ') || ''
    form.value.email              = u.email       || ''
    form.value.telephone          = u.telephone   || ''
    form.value.ville              = u.ville       || ''
    form.value.pays               = u.pays        || ''
    form.value.titre_poste        = u.titre_poste || ''
    form.value.pays_souhaites     = u.pays_souhaites    || []
    form.value.villes_souhaitees  = u.villes_souhaitees || []
    form.value.secteur_souhaite_id = u.secteur_souhaite_id || null

    activitySectors.value = sectorsRes.data
  } catch {
    showSnack(t('profile.errorLoading'), 'error')
  }
})

const confirmDelete = async () => {
  deleteError.value   = ''
  deleteLoading.value = true
  try {
    await api.delete('/talent/account', { data: { password: deletePassword.value } })
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    router.push('/login')
  } catch (e) {
    deleteError.value = e.response?.status === 422 ? 'Mot de passe incorrect.' : 'Une erreur est survenue.'
  } finally {
    deleteLoading.value = false
  }
}

const save = async () => {
  loading.value = true
  try {
    const payload = {
      first_name:          form.value.first_name,
      last_name:           form.value.last_name,
      email:               form.value.email,
      telephone:           form.value.telephone,
      ville:               form.value.ville,
      pays:                form.value.pays,
      titre_poste:         form.value.titre_poste,
      pays_souhaites:      form.value.pays_souhaites,
      villes_souhaitees:   form.value.villes_souhaitees,
      secteur_souhaite_id: form.value.secteur_souhaite_id || null,
    }
    if (form.value.password) {
      payload.current_password      = form.value.current_password
      payload.password              = form.value.password
      payload.password_confirmation = form.value.password_confirmation
    }
    const res = await api.patch('/user/profile', payload)
    const u = res.data
    localStorage.setItem('userName', `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name)
    localStorage.setItem('userEmail', u.email)
    form.value.current_password = ''
    form.value.password = ''
    form.value.password_confirmation = ''
    showSnack(t('profile.profileUpdated'))
  } catch (err) {
    const errors = err.response?.data?.errors
    const msg = errors
      ? Object.values(errors)[0]?.[0]
      : (err.response?.data?.message || t('profile.errorSaving'))
    showSnack(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>
