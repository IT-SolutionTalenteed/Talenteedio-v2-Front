<template>
  <v-dialog v-model="visible" max-width="420" persistent>
    <v-card rounded="xl" elevation="8">
      <v-card-text class="pa-6 text-center">
        <v-avatar color="error" variant="tonal" size="64" class="mb-4">
          <v-icon size="32" color="error">mdi-delete-alert-outline</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-semibold mb-2">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ message }}</div>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0 d-flex ga-2">
        <v-btn variant="tonal" class="flex-1-1" @click="cancel">Annuler</v-btn>
        <v-btn color="error" variant="flat" class="flex-1-1" @click="confirmAction">
          <v-icon start>mdi-delete-outline</v-icon>
          Supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title   = ref('Confirmer la suppression')
const message = ref('Cette action est irréversible. Voulez-vous continuer ?')
let resolvePromise = null

const open = (opts = {}) => {
  title.value   = opts.title   || 'Confirmer la suppression'
  message.value = opts.message || 'Cette action est irréversible. Voulez-vous continuer ?'
  visible.value = true
  return new Promise((resolve) => { resolvePromise = resolve })
}

const confirmAction = () => { visible.value = false; resolvePromise?.(true)  }
const cancel        = () => { visible.value = false; resolvePromise?.(false) }

defineExpose({ open })
</script>
