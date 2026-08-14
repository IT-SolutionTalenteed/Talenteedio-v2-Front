<template>
  <div class="share-card">
    <h3 class="share-title">
      <i class="fa-solid fa-share-nodes"></i> {{ t('share.title') }}
    </h3>
    <!-- Aperçu de ce qui sera partagé (titre, image, domaine) -->
    <div v-if="shareTitle" class="share-preview">
      <img v-if="image && !imageFailed" :src="image" :alt="shareTitle" class="share-preview__img" @error="imageFailed = true">
      <div class="share-preview__body">
        <span class="share-preview__domain">{{ domain }}</span>
        <span class="share-preview__title">{{ shareTitle }}</span>
        <span v-if="description" class="share-preview__desc">{{ description }}</span>
      </div>
    </div>

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
  // Titre du contenu partagé : sert de texte de partage et d'aperçu
  text: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' }
})

const { t } = useI18n()
const copied = ref(false)
const imageFailed = ref(false)

const shareTitle = computed(() => props.text || document.title)
const domain = computed(() => window.location.hostname)

const pageUrl = computed(() => encodeURIComponent(window.location.href))
const pageText = computed(() => encodeURIComponent(shareTitle.value))

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

.share-preview {
  display: flex; gap: 10px; align-items: stretch;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 10px; overflow: hidden;
  margin-bottom: 14px;
  background: var(--light-bg, #f5f7fa);
}
.share-preview__img {
  width: 72px; min-height: 72px; object-fit: cover; flex-shrink: 0;
  background: #e8edf3;
}
.share-preview__body {
  display: flex; flex-direction: column; gap: 3px;
  padding: 9px 10px; min-width: 0;
}
.share-preview__domain {
  font-size: 10.5px; text-transform: uppercase; letter-spacing: .4px;
  color: var(--muted-text, #7a869a);
}
.share-preview__title {
  font-size: 13px; font-weight: 700; color: var(--navy); line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.share-preview__desc {
  font-size: 11.5px; color: var(--muted-text, #7a869a); line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.share-preview__img + .share-preview__body { padding-left: 0; }
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
