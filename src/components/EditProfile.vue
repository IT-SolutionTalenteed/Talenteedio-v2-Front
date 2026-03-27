<template>
  <v-card rounded="xl" border elevation="0" class="pa-4" style="max-width:680px;margin:0 auto">
    <v-card-title class="text-h5 mb-1">Mon profil</v-card-title>
    <v-card-subtitle class="mb-4">Informations personnelles et sécurité du compte</v-card-subtitle>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-form @submit.prevent="save">

      <!-- Identité -->
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3 mt-2">
        <v-icon size="16" class="mr-1">mdi-account-outline</v-icon> Identité
      </div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.first_name"
            label="Prénom"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.last_name"
            label="Nom de famille"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.titre_poste"
            label="Titre / Poste"
            variant="outlined"
            density="comfortable"
            placeholder="ex: Développeur Full Stack"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.telephone"
            label="Téléphone"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-phone-outline"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.ville"
            label="Ville"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-map-marker-outline"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.pays"
            label="Pays"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-earth"
          />
        </v-col>
      </v-row>

      <!-- Compte -->
      <v-divider class="my-4" />
      <div class="text-body-2 font-weight-medium text-medium-emphasis mb-3">
        <v-icon size="16" class="mr-1">mdi-email-outline</v-icon> Compte
      </div>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="form.email"
            label="Adresse e-mail"
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
        <v-icon size="16" class="mr-1">mdi-lock-outline</v-icon> Changer le mot de passe
        <span class="text-caption ml-1">(laisser vide pour ne pas modifier)</span>
      </div>
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.current_password"
            label="Mot de passe actuel"
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
            label="Nouveau mot de passe"
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
            label="Confirmer"
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
          Enregistrer
        </v-btn>
      </div>

    </v-form>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const loading = ref(false)
const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = ref({
  first_name: '', last_name: '', titre_poste: '',
  telephone: '', ville: '', pays: '',
  email: '',
  current_password: '', password: '', password_confirmation: '',
})

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

onMounted(async () => {
  try {
    const res = await api.get('/user')
    const u = res.data
    const nameParts = (u.name || '').trim().split(' ')
    form.value.first_name  = u.first_name  || nameParts[0] || ''
    form.value.last_name   = u.last_name   || nameParts.slice(1).join(' ') || ''
    form.value.email       = u.email       || ''
    form.value.telephone   = u.telephone   || ''
    form.value.ville       = u.ville       || ''
    form.value.pays        = u.pays        || ''
    form.value.titre_poste = u.titre_poste || ''
  } catch {
    showSnack('Erreur chargement profil', 'error')
  }
})

const save = async () => {
  loading.value = true
  try {
    const payload = {
      first_name:  form.value.first_name,
      last_name:   form.value.last_name,
      email:       form.value.email,
      telephone:   form.value.telephone,
      ville:       form.value.ville,
      pays:        form.value.pays,
      titre_poste: form.value.titre_poste,
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
    showSnack('Profil mis à jour')
  } catch (err) {
    const errors = err.response?.data?.errors
    const msg = errors
      ? Object.values(errors)[0]?.[0]
      : (err.response?.data?.message || 'Erreur')
    showSnack(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>
