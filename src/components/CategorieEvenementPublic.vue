<template>
  <div>
  <PublicNav />
  <div class="cat-event-page" v-if="categorie">

    <!-- ══ HERO ══ -->
    <section class="cat-hero" :style="heroStyle">
      <div class="cat-hero-overlay"></div>
      <div class="container">
        <div class="cat-hero-content fade-in">
          <span class="label-white">{{ t('evenements.label') }}</span>
          <h1>{{ categorie.titre }}</h1>
          <p v-if="categorie.description">{{ categorie.description }}</p>
        </div>
      </div>
    </section>

    <!-- ══ VIDÉO (si disponible) ══ -->
    <section v-if="categorie.video_url" class="cat-video">
      <div class="container">
        <video controls :src="categorie.video_url" class="cat-video-player" preload="metadata"></video>
      </div>
    </section>

    <!-- ══ DÉTAILS ══ -->
    <section v-if="categorie.liste_details && categorie.liste_details.length" class="cat-details">
      <div class="container">
        <div class="cat-section-header fade-in">
          <span class="label-blue">{{ t('evenements.details.label') }}</span>
          <h2>{{ t('evenements.details.about') }}</h2>
        </div>
        <div class="cat-details-grid fade-in">
          <div v-for="(detail, i) in categorie.liste_details" :key="i" class="cat-detail-item">
            <div class="cat-detail-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="cat-detail-text">{{ detail }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ ÉVÉNEMENTS DE CETTE CATÉGORIE ══ -->
    <section v-if="categorie.evenements && categorie.evenements.length" class="cat-events">
      <div class="container">
        <div class="cat-section-header fade-in">
          <span class="label-blue">{{ t('evenements.agenda.label') }}</span>
          <h2>{{ t('evenements.agenda.title') }}</h2>
          <p>{{ t('evenements.agenda.description') }}</p>
        </div>
        <div class="cat-events-grid fade-in">
          <div v-for="ev in categorie.evenements" :key="ev.id" class="cat-event-card">
            <div class="cat-event-img">
              <img v-if="ev.image_mise_en_avant_url" :src="ev.image_mise_en_avant_url" :alt="ev.titre" loading="lazy" />
              <div v-else class="cat-event-img-placeholder">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <span v-if="ev.is_featured" class="ev-badge-featured">⭐ {{ t('evenements.card.featured') }}</span>
            </div>
            <div class="cat-event-body">
              <h3>{{ ev.titre }}</h3>
              <div class="cat-event-meta">
                <span v-if="ev.date_debut">
                  <i class="fa-solid fa-calendar"></i> {{ formatDateRange(ev.date_debut, ev.date_fin) }}
                </span>
                <span v-if="ev.ville">
                  <i class="fa-solid fa-location-dot"></i> {{ ev.ville }}{{ ev.pays ? ', ' + ev.pays : '' }}
                </span>
                <span v-if="ev.heure_debut_journee">
                  <i class="fa-solid fa-clock"></i> {{ ev.heure_debut_journee?.substring(0,5) }} – {{ ev.heure_fin_journee?.substring(0,5) }}
                </span>
              </div>
              <p v-if="ev.description" class="cat-event-desc">{{ truncate(ev.description, 120) }}</p>
              <!-- Entreprises participantes -->
              <div v-if="ev.entreprises && ev.entreprises.length" class="cat-event-entreprises">
                <span class="cat-event-entreprises-label">{{ t('evenements.card.recruiters') }}</span>
                <div class="cat-event-logos">
                  <template v-for="ent in ev.entreprises.slice(0,5)" :key="ent.id">
                    <img v-if="ent.logo_url" :src="ent.logo_url" :alt="ent.nom" class="cat-ent-logo" :title="ent.nom" />
                    <span v-else class="cat-ent-initials" :title="ent.nom">{{ ent.nom.charAt(0) }}</span>
                  </template>
                  <span v-if="ev.entreprises.length > 5" class="cat-ent-more">+{{ ev.entreprises.length - 5 }}</span>
                </div>
              </div>
            </div>
            <div class="cat-event-footer">
              <router-link :to="`/evenements/${ev.id}`" class="btn btn--blue">
                {{ t('evenements.card.viewEvent') }} <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FAQs ══ -->
    <section v-if="categorie.liste_faqs && categorie.liste_faqs.length" class="cat-faqs">
      <div class="container">
        <div class="cat-section-header fade-in">
          <span class="label-blue">{{ t('evenements.faq.label') }}</span>
          <h2>{{ t('evenements.faq.title') }}</h2>
        </div>
        <div class="cat-faqs-list fade-in">
          <div
            v-for="(faq, i) in categorie.liste_faqs"
            :key="i"
            class="faq-item"
            :class="{ 'faq-item--open': openFaq === i }"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="faq-question">
              <span>{{ faq.question || faq }}</span>
              <i class="fa-solid fa-chevron-down faq-chevron"></i>
            </div>
            <div class="faq-answer" v-show="openFaq === i">
              {{ faq.reponse || faq.answer || '' }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ TÉMOIGNAGES ══ -->
    <section v-if="categorie.temoignages && categorie.temoignages.length" class="cat-temoignages">
      <div class="container">
        <div class="cat-section-header fade-in">
          <span class="label-blue">{{ t('evenements.testimonials.label') }}</span>
          <h2>{{ t('evenements.testimonials.title') }}</h2>
        </div>
        <div class="cat-temoignages-grid fade-in">
          <div v-for="t in categorie.temoignages" :key="t.id" class="temoignage-card">
            <div class="temoignage-quote"><i class="fa-solid fa-quote-left"></i></div>
            <p class="temoignage-contenu">{{ t.contenu }}</p>
            <div class="temoignage-author">
              <img v-if="t.avatar_url" :src="t.avatar_url" :alt="t.auteur" class="temoignage-avatar" />
              <div v-else class="temoignage-avatar-placeholder">{{ t.auteur?.charAt(0) }}</div>
              <div>
                <div class="temoignage-name">{{ t.auteur }}</div>
                <div class="temoignage-poste">{{ t.poste }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="cat-cta">
      <div class="container">
        <h2>{{ t('evenements.cta.title') }}</h2>
        <p>{{ t('evenements.cta.description') }}</p>
        <router-link to="/register" class="btn btn--blue btn--lg">
          {{ t('evenements.cta.action') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
        </router-link>
      </div>
    </section>

  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="cat-loading">
    <i class="fa-solid fa-spinner fa-spin"></i>
    <p>{{ t('evenements.loading') }}</p>
  </div>

  <!-- Erreur -->
  <div v-else class="cat-loading">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <p>{{ t('evenements.notFound') }}</p>
    <router-link to="/" class="btn btn--blue" style="margin-top:16px;">{{ t('evenements.backHome') }}</router-link>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'

const { t, locale } = useI18n()
const apiBase   = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route     = useRoute()
const categorie = ref(null)
const loading   = ref(true)
const openFaq   = ref(null)

const heroStyle = computed(() => {
  if (categorie.value?.image_url) {
    return { '--cat-bg': `url('${categorie.value.image_url}')` }
  }
  return {}
})

const setupObserver = () => {
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'))
  }
}

const load = async (id) => {
  loading.value   = true
  categorie.value = null
  openFaq.value   = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
  try {
    const res = await axios.get(`${apiBase}/public/categories-evenements/${id}`)
    categorie.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    await nextTick()
    setupObserver()
  }
}

// Rechargement quand le paramètre :id change (réutilisation du composant par Vue Router)
watch(() => route.params.id, (newId) => {
  if (newId) load(newId)
})

const formatDateRange = (debut, fin) => {
  const fmt = (s) => {
    const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
    return new Date(s).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
  }
  if (!debut) return ''
  if (!fin || debut === fin) return fmt(debut)
  return `${fmt(debut)} – ${fmt(fin)}`
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

onMounted(() => load(route.params.id))
</script>

<style scoped>
.cat-event-page { min-height: 100vh; background: #fff; }

/* ── Hero ── */
.cat-hero {
  position: relative; 
  padding: 0; 
  color: #fff;
  background: linear-gradient(135deg, #040a5d, #192bc2);
  background-image: var(--cat-bg);
  background-size: cover; 
  background-position: center;
  height: 80vh;
  min-height: 500px; 
  display: flex; 
  align-items: center;
}
.cat-hero[style] { background-image: var(--cat-bg, none); }
.cat-hero-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.3);
}
.cat-hero-content { 
  position: relative; 
  z-index: 1; 
  max-width: 700px; 
}
.cat-hero-content h1 { 
  font-size: 56px; 
  font-weight: 800; 
  margin: 12px 0 20px; 
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
.cat-hero-content p  { 
  font-size: 20px; 
  opacity: .95; 
  line-height: 1.6;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}
.label-white {
  display: inline-block; 
  background: rgba(255,255,255,.25); 
  color: #fff;
  font-size: 12px; 
  font-weight: 700; 
  letter-spacing: 1.2px; 
  text-transform: uppercase;
  padding: 6px 18px; 
  border-radius: 50px; 
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* ── Vidéo ── */
.cat-video { padding: 60px 0; background: var(--light-bg, #f5f7fa); }
.cat-video-player { width: 100%; max-height: 480px; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,.15); }

/* ── Sections communes ── */
.cat-section-header { text-align: center; margin-bottom: 48px; }
.cat-section-header h2 { font-size: 30px; font-weight: 800; color: var(--navy); margin: 8px 0 10px; }
.cat-section-header p  { font-size: 16px; color: var(--body-text); }
.label-blue {
  display: inline-block; background: var(--blue); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 4px 14px; border-radius: 50px; margin-bottom: 10px;
}

/* ── Détails ── */
.cat-details { padding: 80px 0; background: #fff; }
.cat-details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.cat-detail-item {
  display: flex; gap: 16px; align-items: flex-start;
  background: var(--light-bg, #f5f7fa); border-radius: 12px; padding: 20px;
}
.cat-detail-num {
  font-size: 28px; font-weight: 800; color: var(--blue); line-height: 1;
  opacity: .35; flex-shrink: 0; min-width: 36px;
}
.cat-detail-text { font-size: 14px; color: var(--navy); line-height: 1.6; }

/* ── Événements ── */
.cat-events { padding: 80px 0; background: var(--light-bg, #f5f7fa); }
.cat-events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
.cat-event-card {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  display: flex; flex-direction: column;
  border: 1.5px solid transparent;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.cat-event-card:hover { border-color: var(--blue); box-shadow: 0 8px 24px rgba(0,0,0,.12); transform: translateY(-4px); }

.cat-event-img { position: relative; height: 180px; overflow: hidden; }
.cat-event-img img { width: 100%; height: 100%; object-fit: cover; }
.cat-event-img-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #192bc2, #2687e9);
  display: flex; align-items: center; justify-content: center;
  font-size: 48px; color: rgba(255,255,255,.4);
}
.ev-badge-featured {
  position: absolute; top: 12px; right: 12px;
  background: linear-gradient(135deg, #f49f0a, #ffb52e);
  color: #fff; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 50px;
}

.cat-event-body { padding: 20px 20px 0; flex: 1; }
.cat-event-body h3 { font-size: 17px; font-weight: 700; color: var(--navy); margin: 0 0 10px; }
.cat-event-meta { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.cat-event-meta span { font-size: 13px; color: var(--body-text); display: flex; align-items: center; gap: 6px; }
.cat-event-meta i { color: var(--blue); font-size: 12px; flex-shrink: 0; }
.cat-event-desc { font-size: 13px; color: var(--body-text); line-height: 1.5; margin: 0; }

.cat-event-entreprises { margin-top: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cat-event-entreprises-label { font-size: 12px; font-weight: 600; color: var(--body-text); }
.cat-event-logos { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.cat-ent-logo {
  width: 28px; height: 28px; border-radius: 6px; object-fit: contain;
  border: 1.5px solid var(--border, #e2e8f0); background: #fff; padding: 2px;
}
.cat-ent-initials {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--light-blue, #e8f0fe); color: var(--blue);
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.cat-ent-more {
  font-size: 11px; font-weight: 700; color: var(--body-text);
  background: var(--border, #e2e8f0); padding: 2px 7px; border-radius: 50px;
}

.cat-event-footer { padding: 16px 20px 20px; }

/* ── FAQs ── */
.cat-faqs { padding: 80px 0; background: #fff; }
.cat-faqs-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
.faq-item {
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 10px; overflow: hidden;
  transition: border-color .2s;
}
.faq-item--open { border-color: var(--blue); }
.faq-question {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--navy);
  gap: 12px;
}
.faq-chevron { font-size: 12px; color: var(--blue); transition: transform .25s; flex-shrink: 0; }
.faq-item--open .faq-chevron { transform: rotate(180deg); }
.faq-answer {
  padding: 0 20px 16px; font-size: 14px; color: var(--body-text);
  line-height: 1.7; border-top: 1px solid var(--border, #e2e8f0);
  padding-top: 12px;
}

/* ── Témoignages ── */
.cat-temoignages { padding: 80px 0; background: var(--light-bg, #f5f7fa); }
.cat-temoignages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.temoignage-card {
  background: #fff; border-radius: 14px; padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  display: flex; flex-direction: column; gap: 16px;
}
.temoignage-quote i { font-size: 28px; color: var(--blue); opacity: .25; }
.temoignage-contenu { font-size: 14px; color: var(--navy); line-height: 1.7; font-style: italic; flex: 1; margin: 0; }
.temoignage-author { display: flex; align-items: center; gap: 12px; }
.temoignage-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.temoignage-avatar-placeholder {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #192bc2, #2687e9);
  color: #fff; font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.temoignage-name  { font-size: 14px; font-weight: 700; color: var(--navy); }
.temoignage-poste { font-size: 12px; color: var(--body-text); }

/* ── CTA ── */
.cat-cta {
  padding: 80px 0; text-align: center;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  color: #fff;
}
.cat-cta h2 { font-size: 32px; font-weight: 800; margin: 0 0 12px; }
.cat-cta p  { font-size: 16px; opacity: .85; margin: 0 0 28px; }

/* ── Loading / erreur ── */
.cat-loading {
  min-height: 60vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.cat-loading i { font-size: 42px; opacity: .4; }

.fade-in { opacity: 0; transform: translateY(20px); transition: opacity .5s, transform .5s; }
.fade-in.visible { opacity: 1; transform: none; }
</style>
