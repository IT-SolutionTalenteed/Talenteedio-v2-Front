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
        <v-btn variant="tonal" class="flex-1-1" @click="cancel">{{ t('commonDashboard.confirm.cancel') }}</v-btn>
        <v-btn color="error" variant="flat" class="flex-1-1" @click="confirmAction">
          <v-icon start>mdi-delete-outline</v-icon>
          {{ t('commonDashboard.confirm.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const visible = ref(false)
const title   = ref('')
const message = ref('')
let resolvePromise = null

const open = (opts = {}) => {
  title.value   = opts.title   || t('commonDashboard.confirm.deleteTitle')
  message.value = opts.message || t('commonDashboard.confirm.deleteMessage')
  visible.value = true
  return new Promise((resolve) => { resolvePromise = resolve })
}

const confirmAction = () => { visible.value = false; resolvePromise?.(true)  }
const cancel        = () => { visible.value = false; resolvePromise?.(false) }

defineExpose({ open })
</script>
