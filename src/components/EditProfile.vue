<template>
  <v-card rounded="xl" border elevation="0" class="pa-4" style="max-width:560px;margin:0 auto">
    <v-card-title class="text-h5 mb-4">Mon profil</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-form @submit.prevent="save">
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="form.name"
            label="Nom complet"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
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

        <v-col cols="12">
          <v-divider class="my-2" />
          <div class="text-body-2 text-medium-emphasis mb-3">Changer le mot de passe (optionnel)</div>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.current_password"
            label="Mot de passe actuel"
            :type="showCurrent ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showCurrent = !showCurrent"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.password"
            label="Nouveau mot de passe"
            :type="showNew ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-reset"
            :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showNew = !showNew"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.password_confirmation"
            label="Confirmer le nouveau mot de passe"
            :type="showConfirm ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirm = !showConfirm"
          />
        </v-col>

        <v-col cols="12" class="d-flex justify-end mt-2">
          <v-btn
            color="primary"
            variant="tonal"
            type="submit"
            :loading="loading"
            prepend-icon="mdi-content-save-outline"
          >
            Enregistrer
          </v-btn>
        </v-col>
      </v-row>
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

const form = ref({ name: '', email: '', current_password: '', password: '', password_confirmation: '' })

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

onMounted(async () => {
  try {
    const res = await api.get('/user')
    form.value.name = res.data.name
    form.value.email = res.data.email
  } catch {
    showSnack('Erreur chargement profil', 'error')
  }
})

const save = async () => {
  loading.value = true
  try {
    const payload = { name: form.value.name, email: form.value.email }
    if (form.value.password) {
      payload.current_password = form.value.current_password
      payload.password = form.value.password
      payload.password_confirmation = form.value.password_confirmation
    }
    const res = await api.patch('/user/profile', payload)
    localStorage.setItem('userName', res.data.name)
    localStorage.setItem('userEmail', res.data.email)
    form.value.current_password = ''
    form.value.password = ''
    form.value.password_confirmation = ''
    showSnack('Profil mis à jour')
  } catch (err) {
    const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || 'Erreur'
    showSnack(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>
