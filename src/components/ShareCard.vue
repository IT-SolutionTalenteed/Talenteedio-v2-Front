<template>
  <div class="share-card">
    <h3 class="share-title">
      <i class="fa-solid fa-share-nodes"></i> {{ t('share.title') }}
    </h3>
    <div class="share-btns">
      <a :href="facebookUrl" target="_blank" rel="noopener" class="share-btn share-btn--facebook" :title="t('share.facebook')">
        <i class="fa-brands fa-facebook-f"></i>
        <span>Facebook</span>
      </a>
      <a :href="twitterUrl" target="_blank" rel="noopener" class="share-btn share-btn--twitter" :title="t('share.twitter')">
        <i class="fa-brands fa-x-twitter"></i>
        <span>Twitter</span>
      </a>
      <a :href="linkedinUrl" target="_blank" rel="noopener" class="share-btn share-btn--linkedin" :title="t('share.linkedin')">
        <i class="fa-brands fa-linkedin-in"></i>
        <span>LinkedIn</span>
      </a>
      <button class="share-btn share-btn--copy" @click="copyLink" :title="t('share.copyLink')">
        <i :class="copied ? 'fa-solid fa-check' : 'fa-solid fa-link'"></i>
        <span>{{ copied ? t('share.copied') : t('share.copy') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  text: { type: String, default: '' }
})

const { t } = useI18n()
const copied = ref(false)

const pageUrl = computed(() => encodeURIComponent(window.location.href))
const pageText = computed(() => encodeURIComponent(props.text || document.title))

const facebookUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${pageUrl.value}`)
const twitterUrl  = computed(() => `https://twitter.com/intent/tweet?url=${pageUrl.value}&text=${pageText.value}`)
const linkedinUrl = computed(() => `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl.value}`)

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    // fallback
  }
}
</script>

<style scoped>
.share-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.share-title {
  font-size: 14px; font-weight: 700; color: var(--navy);
  margin: 0 0 14px; display: flex; align-items: center; gap: 8px;
}
.share-title i { color: var(--blue); }
.share-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.share-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 9px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600;
  text-decoration: none; border: none; cursor: pointer;
  transition: opacity .15s, transform .15s;
}
.share-btn:hover { opacity: .88; transform: translateY(-1px); }
.share-btn span { font-size: 12px; }

.share-btn--facebook { background: #1877f2; color: #fff; }
.share-btn--twitter  { background: #000; color: #fff; }
.share-btn--linkedin { background: #0a66c2; color: #fff; }
.share-btn--copy     { background: var(--light-bg, #f5f7fa); color: var(--navy); border: 1.5px solid var(--border, #e2e8f0); }
.share-btn--copy:hover { background: #e8f0fe; border-color: var(--blue); color: var(--blue); }
</style>
