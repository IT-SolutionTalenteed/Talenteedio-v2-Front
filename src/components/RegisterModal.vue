<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <button class="modal-close" @click="$emit('close')" aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-header">
            <h2>{{ t('auth.register.title') }}</h2>
            <p>{{ t('auth.register.subtitle') }}</p>
          </div>

          <div class="modal-body">
            <p class="register-info">
              {{ t('auth.register.step1') }}
            </p>

            <div class="profile-selection">
              <button 
                type="button"
                class="profile-option"
                :class="{ 'profile-option--active': selectedProfile === 'talent' }"
                @click="selectedProfile = 'talent'"
              >
                <i class="fa-solid fa-user"></i>
                <span>{{ t('auth.register.talentOption') }}</span>
              </button>
              <button 
                type="button"
                class="profile-option"
                :class="{ 'profile-option--active': selectedProfile === 'entreprise' }"
                @click="selectedProfile = 'entreprise'"
              >
                <i class="fa-solid fa-building"></i>
                <span>{{ t('auth.register.companyOption') }}</span>
              </button>
            </div>

            <div class="register-actions">
              <button 
                v-if="selectedProfile === 'talent'"
                @click="goToTalentRegister"
                class="btn-submit"
              >
                {{ t('auth.register.submit') }} <i class="fa-solid fa-arrow-right"></i>
              </button>
              <button 
                v-else-if="selectedProfile === 'entreprise'"
                @click="goToCompanyRegister"
                class="btn-submit"
              >
                {{ t('auth.register.submit') }} <i class="fa-solid fa-arrow-right"></i>
              </button>
              <button 
                v-else
                class="btn-submit"
                disabled
              >
                {{ t('auth.register.selectProfile') }}
              </button>
            </div>

            <p class="auth-switch">
              {{ t('auth.register.hasAccount') }}
              <a href="#" @click.prevent="$emit('switch-to-login')">{{ t('auth.register.login') }}</a>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: Boolean,
  defaultProfile: {
    type: String,
    default: null // 'talent' ou 'entreprise'
  }
})

const emit = defineEmits(['close', 'switch-to-login'])

const { t } = useI18n()
const router = useRouter()

const selectedProfile = ref(props.defaultProfile || '')

// Si defaultProfile est 'talent', rediriger directement
watch(() => props.show, (newVal) => {
  if (newVal && props.defaultProfile === 'talent') {
    goToTalentRegister()
  } else if (newVal && props.defaultProfile) {
    selectedProfile.value = props.defaultProfile
  }
})

const goToTalentRegister = () => {
  emit('close')
  router.push('/talent-register')
}

const goToCompanyRegister = () => {
  emit('close')
  router.push('/corporate-register')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f2f8;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: #e0e4ef;
  color: #00235a;
}

.modal-header {
  padding: 40px 40px 24px;
  text-align: center;
}

.modal-header h2 {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #041a57;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.modal-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.modal-body {
  padding: 0 40px 40px;
}

.register-info {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.6;
}

.profile-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.profile-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border: 2px solid #e0e4ef;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Open Sans', sans-serif;
}

.profile-option i {
  font-size: 32px;
  color: #9ca3af;
  transition: color 0.2s;
}

.profile-option span {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.4;
}

.profile-option:hover {
  border-color: #3a9bff;
  background: #f7f9ff;
}

.profile-option:hover i {
  color: #3a9bff;
}

.profile-option--active {
  border-color: #3a9bff;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
}

.profile-option--active i {
  color: #3a9bff;
}

.profile-option--active span {
  color: #041a57;
}

.register-actions {
  margin-bottom: 24px;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #041a57 0%, #00235a 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.3px;
  font-family: 'Open Sans', sans-serif;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #0a3472 0%, #1a4a8a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(4, 26, 87, 0.3);
}

.btn-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-switch {
  text-align: center;
  font-size: 13.5px;
  color: #6b7280;
}

.auth-switch a {
  color: #041a57;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1.5px solid #f29f1f;
  padding-bottom: 1px;
  transition: color 0.2s;
  cursor: pointer;
}

.auth-switch a:hover {
  color: #3a9bff;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .modal-header {
    padding: 32px 24px 20px;
  }

  .modal-body {
    padding: 0 24px 32px;
  }

  .modal-header h2 {
    font-size: 24px;
  }

  .profile-selection {
    grid-template-columns: 1fr;
  }
}
</style>
