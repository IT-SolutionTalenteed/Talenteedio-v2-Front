<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? t('admin.referential.studyLevels.editTitle') : t('admin.referential.studyLevels.newTitle') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6" style="max-width:600px">
        <v-text-field v-model="form.name" :label="t('admin.referential.nameRequired')" variant="outlined" density="compact" autofocus />
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ t('admin.referential.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import studyLevelService from '../../services/studyLevelService.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({ name: '' })
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => router.push({ name: 'AdminStudyLevels' })

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await studyLevelService.getAll()
      const item = res.data.find(x => x.id == route.params.id)
      if (item) form.value = { name: item.name }
    } catch {
      showSnack(t('admin.referential.errorLoading'), 'error')
    }
  }
})

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await studyLevelService.update(route.params.id, form.value)
      showSnack(t('admin.referential.studyLevels.updated'))
    } else {
      await studyLevelService.create(form.value)
      showSnack(t('admin.referential.studyLevels.created'))
    }
    setTimeout(goBack, 800)
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.referential.errorSave'), 'error')
  } finally {
    saving.value = false
  }
}
</script>
