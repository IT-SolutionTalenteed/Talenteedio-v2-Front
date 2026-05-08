<template>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ isEdit ? $t('admin.mediaCategories.editCategory') : $t('admin.mediaCategories.newCategory') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              :label="$t('admin.mediaCategories.nameRequired')"
              variant="outlined"
              density="compact"
              required
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-checkbox
              v-model="form.is_active"
              :label="$t('admin.mediaCategories.active')"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              :label="$t('admin.mediaCategories.description')"
              variant="outlined"
              density="compact"
              rows="3"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import mediaCategoryService from '../../services/mediaCategoryService.js'

const { t: $t } = useI18n()

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  description: '',
  is_active: true
})
const saving = ref(false)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const goBack = () => {
  router.push({ name: 'AdminMediaCategories' })
}

const loadCategory = async () => {
  try {
    const res = await mediaCategoryService.getAll()
    const all = res.data.data || res.data
    const item = all.find(x => x.id == route.params.id)
    if (item) {
      form.value = {
        name: item.name || '',
        description: item.description || '',
        is_active: item.is_active
      }
    }
  } catch (err) {
    showSnack($t('admin.mediaCategories.errorLoading'), 'error')
  }
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await mediaCategoryService.update(route.params.id, form.value)
      showSnack($t('admin.mediaCategories.categoryUpdated'))
    } else {
      await mediaCategoryService.create(form.value)
      showSnack($t('admin.mediaCategories.categoryCreated'))
    }
    setTimeout(() => goBack(), 1200)
  } catch (err) {
    showSnack(err.response?.data?.message || $t('admin.mediaCategories.errorSave'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) await loadCategory()
})
</script>
