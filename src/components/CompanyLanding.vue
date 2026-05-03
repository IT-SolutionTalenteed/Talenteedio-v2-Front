<template>
  <div class="page-wrapper">
    <div class="company-landing">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">{{ t('company.hero.badge') }}</span>
          <h1 class="hero-title">{{ t('company.hero.title') }}</h1>
          <p class="hero-subtitle">{{ t('company.hero.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- ══ PAGE DE CONFIRMATION ══ -->
    <section v-if="registered" class="main-content">
      <div class="container">
        <div class="confirm-card">
          <div class="confirm-icon"><i class="fa-solid fa-circle-check"></i></div>
          <h2 class="confirm-title">Demande envoyée avec succès !</h2>
          <p class="confirm-text">
            Votre dossier a bien été transmis à l'équipe Talenteed.<br>
            Notre équipe va examiner vos informations et vous contactera <strong>dans les plus brefs délais</strong>.
          </p>
          <div class="confirm-details">
            <div class="confirm-detail-row">
              <i class="fa-regular fa-envelope"></i>
              <span>Un e-mail de confirmation a été envoyé à <strong>{{ form.email }}</strong></span>
            </div>
            <div class="confirm-detail-row">
              <i class="fa-regular fa-clock"></i>
              <span>Délai de traitement habituel : <strong>24 à 48 heures ouvrées</strong></span>
            </div>
            <div class="confirm-detail-row">
              <i class="fa-solid fa-bell"></i>
              <span>Vous recevrez un e-mail dès que votre compte sera activé</span>
            </div>
          </div>
          <router-link to="/" class="btn btn--blue btn--lg">
            <i class="fa-solid fa-house"></i> Retour à l'accueil
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══ CONTENU PRINCIPAL ══ -->
    <section v-else class="main-content">
      <div class="container">
        <div class="content-layout">

          <!-- ── Formulaire d'inscription ── -->
          <div class="form-section">
            <div class="form-card">
              <div class="form-header">
                <h2 class="form-title">
                  <i class="fa-solid fa-building"></i>
                  {{ t('company.form.title') }}
                </h2>
                <p class="form-subtitle">{{ t('company.form.subtitle') }}</p>
              </div>

              <form @submit.prevent="handleRegister" class="register-form">

                <!-- ─ Infos entreprise ─ -->
                <div class="form-section-title">
                  <i class="fa-solid fa-building-circle-check"></i>
                  {{ t('company.form.companyInfo') }}
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.companyName') }} <span class="required">*</span></label>
                    <input v-model="form.nom" type="text" class="form-input" :placeholder="t('company.form.companyNamePlaceholder')" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.sector') }} <span class="required">*</span></label>
                    <select v-model="form.activity_sector_id" class="form-input" required>
                      <option value="">{{ t('company.form.sectorSelect') }}</option>
                      <option v-for="sector in sectors" :key="sector.id" :value="sector.id">{{ sector.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.size') }}</label>
                    <select v-model="form.taille" class="form-input">
                      <option value="">{{ t('company.form.sizeSelect') }}</option>
                      <option value="1-10">{{ t('company.form.size1') }}</option>
                      <option value="11-50">{{ t('company.form.size2') }}</option>
                      <option value="51-200">{{ t('company.form.size3') }}</option>
                      <option value="201-500">{{ t('company.form.size4') }}</option>
                      <option value="500+">{{ t('company.form.size5') }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.website') }}</label>
                    <input v-model="form.site_web" type="url" class="form-input" :placeholder="t('company.form.websitePlaceholder')" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.city') }}</label>
                    <input v-model="form.ville" type="text" class="form-input" :placeholder="t('company.form.cityPlaceholder')" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.country') }}</label>
                    <input v-model="form.pays" type="text" class="form-input" :placeholder="t('company.form.countryPlaceholder')" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Adresse</label>
                  <input v-model="form.adresse" type="text" class="form-input" placeholder="Ex: 12 Rue de la Paix" />
                </div>

                <div class="form-group">
                  <label class="form-label">Description de l'entreprise</label>
                  <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Présentez votre entreprise en quelques lignes…"></textarea>
                </div>

                <!-- ─ Contact ─ -->
                <div class="form-section-title">
                  <i class="fa-solid fa-user-tie"></i>
                  {{ t('company.form.contact') }}
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.fullName') }} <span class="required">*</span></label>
                    <input v-model="form.name" type="text" class="form-input" :placeholder="t('company.form.fullNamePlaceholder')" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Poste / Fonction</label>
                    <input v-model="form.poste" type="text" class="form-input" placeholder="Ex: DRH, CEO, Responsable RH" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.email') }} <span class="required">*</span></label>
                    <input v-model="form.email" type="email" class="form-input" :placeholder="t('company.form.emailPlaceholder')" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.phone') }}</label>
                    <input v-model="form.telephone" type="tel" class="form-input" :placeholder="t('company.form.phonePlaceholder')" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.password') }} <span class="required">*</span></label>
                    <input v-model="form.password" type="password" class="form-input" :placeholder="t('company.form.passwordPlaceholder')" required minlength="8" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('company.form.confirmPassword') }} <span class="required">*</span></label>
                    <input v-model="form.password_confirmation" type="password" class="form-input" :placeholder="t('company.form.confirmPasswordPlaceholder')" required />
                  </div>
                </div>

                <!-- ─ Choix du plan ─ -->
                <div class="form-section-title">
                  <i class="fa-solid fa-crown"></i>
                  Choisissez votre plan <span class="required">*</span>
                </div>

                <div v-if="plans.length" class="plans-grid">
                  <div
                    v-for="plan in plans"
                    :key="plan.id"
                    class="plan-card"
                    :class="{ 'plan-card--selected': form.plan_id === plan.id }"
                    @click="form.plan_id = plan.id"
                  >
                    <div class="plan-card__header">
                      <div>
                        <span class="plan-card__name">{{ plan.name }}</span>
                      </div>
                      <span class="plan-card__price">{{ formatPlanPrice(plan.price) }}<small>/mois</small></span>
                    </div>
                    <ul class="plan-card__features">
                      <li><i class="fa-solid fa-briefcase"></i>
                        <span v-if="plan.max_offres !== null">{{ plan.max_offres }} offre(s) max</span>
                        <span v-else>Offres illimitées</span>
                      </li>
                      <li><i class="fa-solid fa-file-lines"></i>
                        <span v-if="plan.max_articles !== null">{{ plan.max_articles }} article(s) max</span>
                        <span v-else>Articles illimités</span>
                      </li>
                      <li><i class="fa-solid fa-calendar-check"></i>
                        <span v-if="plan.max_evenements !== null">{{ plan.max_evenements }} événement(s) max</span>
                        <span v-else>Événements illimités</span>
                      </li>
                      <li><i class="fa-solid fa-handshake"></i>
                        <span v-if="plan.max_entretiens_par_evenement !== null">{{ plan.max_entretiens_par_evenement }} entretiens/événement</span>
                        <span v-else>Entretiens illimités</span>
                      </li>
                      <li><i class="fa-solid fa-inbox"></i>
                        <span v-if="plan.max_candidatures_par_offre !== null">{{ plan.max_candidatures_par_offre }} candidatures/offre</span>
                        <span v-else>Candidatures illimitées</span>
                      </li>
                    </ul>
                    <div class="plan-card__check">
                      <i v-if="form.plan_id === plan.id" class="fa-solid fa-circle-check"></i>
                      <i v-else class="fa-regular fa-circle"></i>
                    </div>
                  </div>
                </div>
                <div v-else class="form-group">
                  <p class="text-muted">Chargement des plans…</p>
                </div>

                <!-- Erreur -->
                <div v-if="error" class="form-error">
                  <i class="fa-solid fa-triangle-exclamation"></i> {{ error }}
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn--blue btn--lg btn--block" :disabled="loading || !form.plan_id" style="margin-top:24px;">
                  <span v-if="loading" class="spinner"></span>
                  <i v-else class="fa-solid fa-rocket"></i>
                  {{ loading ? t('company.form.loading') : t('company.form.submit') }}
                </button>

                <p class="form-note">
                  {{ t('company.form.note') }}
                  <router-link to="/terms-and-conditions">{{ t('company.form.terms') }}</router-link> {{ t('company.form.and') }}
                  <router-link to="/privacy-policy">{{ t('company.form.privacy') }}</router-link>.
                </p>
              </form>
            </div>
          </div>

          <!-- ── CTA Rappel ── -->
          <div class="cta-section">
            <div class="cta-card">
              <div class="cta-icon">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <h3 class="cta-title">{{ t('company.callback.title') }}</h3>
              <p class="cta-text">{{ t('company.callback.text') }}</p>

              <form @submit.prevent="handleCallback" class="callback-form">
                <div class="form-group">
                  <input v-model="callbackForm.name" type="text" class="form-input" :placeholder="t('company.callback.namePlaceholder')" required />
                </div>
                <div class="form-group">
                  <input v-model="callbackForm.email" type="email" class="form-input" :placeholder="t('company.callback.emailPlaceholder')" required />
                </div>
                <div class="form-group">
                  <input v-model="callbackForm.phone" type="tel" class="form-input" :placeholder="t('company.callback.phonePlaceholder')" required />
                </div>
                <div class="form-group">
                  <textarea v-model="callbackForm.message" class="form-textarea" :placeholder="t('company.callback.messagePlaceholder')" rows="3"></textarea>
                </div>
                <div v-if="callbackError" class="form-error">
                  <i class="fa-solid fa-triangle-exclamation"></i> {{ callbackError }}
                </div>
                <div v-if="callbackSuccess" class="form-success">
                  <i class="fa-solid fa-check-circle"></i> {{ callbackSuccess }}
                </div>
                <button type="submit" class="btn btn--orange btn--lg btn--block" :disabled="callbackLoading">
                  <span v-if="callbackLoading" class="spinner"></span>
                  <i v-else class="fa-solid fa-phone"></i>
                  {{ callbackLoading ? t('company.callback.loading') : t('company.callback.submit') }}
                </button>
              </form>
            </div>

            <div class="benefits-list">
              <div class="benefit-item"><i class="fa-solid fa-check-circle"></i><span>{{ t('company.benefits.free') }}</span></div>
              <div class="benefit-item"><i class="fa-solid fa-check-circle"></i><span>{{ t('company.benefits.access') }}</span></div>
              <div class="benefit-item"><i class="fa-solid fa-check-circle"></i><span>{{ t('company.benefits.support') }}</span></div>
              <div class="benefit-item"><i class="fa-solid fa-check-circle"></i><span>{{ t('company.benefits.noCard') }}</span></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nom: '',
  description: '',
  adresse: '',
  activity_sector_id: '',
  plan_id: null,
  taille: '',
  ville: '',
  pays: '',
  site_web: '',
  telephone: '',
  poste: '',
})

const loading    = ref(false)
const error      = ref('')
const registered = ref(false)
const sectors    = ref([])
const plans      = ref([])

const callbackForm    = ref({ name: '', email: '', phone: '', message: '' })
const callbackLoading = ref(false)
const callbackError   = ref('')
const callbackSuccess = ref('')

const formatPlanPrice = (price) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)

const loadReferentiels = async () => {
  try {
    const [refRes, plansRes] = await Promise.all([
      axios.get(`${apiBase}/public/referentiels`),
      axios.get(`${apiBase}/plans`),
    ])
    sectors.value = refRes.data.activity_sectors || []
    plans.value   = (plansRes.data || []).filter(p => p.is_active)
  } catch (e) {
    console.error('Erreur chargement référentiels:', e)
  }
}

const handleRegister = async () => {
  error.value = ''

  if (form.value.password !== form.value.password_confirmation) {
    error.value = t('company.form.passwordMismatch')
    return
  }
  if (!form.value.plan_id) {
    error.value = 'Veuillez choisir un plan.'
    return
  }

  loading.value = true
  try {
    await axios.post(`${apiBase}/register`, {
      name:                  form.value.name,
      email:                 form.value.email,
      password:              form.value.password,
      password_confirmation: form.value.password_confirmation,
      role:                  'entreprise',
      company_name:          form.value.nom,
      company_description:   form.value.description || undefined,
      company_address:       form.value.adresse || undefined,
      company_size:          form.value.taille || undefined,
      company_poste:         form.value.poste || undefined,
      activity_sector_id:    form.value.activity_sector_id || undefined,
      plan_id:               form.value.plan_id,
      company_city:          form.value.ville || undefined,
      company_country:       form.value.pays || undefined,
      company_website:       form.value.site_web || undefined,
      company_phone:         form.value.telephone || undefined,
    })
    registered.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    const data = e.response?.data
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      error.value = Array.isArray(first) ? first[0] : first
    } else {
      error.value = data?.message || t('company.form.error')
    }
  } finally {
    loading.value = false
  }
}

const handleCallback = async () => {
  callbackError.value   = ''
  callbackSuccess.value = ''
  callbackLoading.value = true
  try {
    const res = await axios.post(`${apiBase}/public/callback`, callbackForm.value)
    callbackSuccess.value = res.data.message || t('company.callback.success')
    callbackForm.value = { name: '', email: '', phone: '', message: '' }
  } catch (e) {
    callbackError.value = e.response?.data?.message || t('company.callback.error')
  } finally {
    callbackLoading.value = false
  }
}

onMounted(loadReferentiels)
</script>

<style scoped>
.company-landing { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ══ HERO ══ */
.hero-section {
  position: relative;
  background: url('/images/Gemini_Generated_Image_gcxo7bgcxo7bgcxo.png') center/cover no-repeat;
  min-height: 50vh;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 80px 0 60px;
}
.hero-overlay { position: absolute; inset: 0; background: rgba(4,10,93,0.75); }
.hero-content { position: relative; z-index: 1; max-width: 800px; text-align: center; margin: 0 auto; }
.hero-badge {
  display: inline-block; background: rgba(255,152,0,0.2); color: var(--orange);
  font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  padding: 8px 20px; border-radius: 50px; margin-bottom: 20px; border: 2px solid var(--orange);
}
.hero-title { font-size: 42px; font-weight: 800; line-height: 1.2; margin: 0 0 16px; text-shadow: 0 2px 20px rgba(0,0,0,.3); }
.hero-subtitle { font-size: 18px; line-height: 1.6; opacity: .95; margin: 0 auto; max-width: 650px; }
@media(max-width:768px) { .hero-title { font-size: 28px; } .hero-subtitle { font-size: 16px; } }

/* ══ CONFIRMATION ══ */
.confirm-card {
  max-width: 600px; margin: 60px auto 80px; background: #fff; border-radius: 16px;
  padding: 48px 40px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,.08);
}
.confirm-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; font-size: 36px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 6px 24px rgba(34,197,94,.3);
}
.confirm-title { font-size: 26px; font-weight: 800; color: var(--navy, #00235a); margin: 0 0 12px; }
.confirm-text { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 28px; }
.confirm-details {
  background: #f8faff; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 20px; margin-bottom: 28px; text-align: left;
}
.confirm-detail-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 9px 0; border-bottom: 1px solid #eef2f8;
  font-size: 13.5px; color: #475569; line-height: 1.5;
}
.confirm-detail-row:last-child { border-bottom: none; }
.confirm-detail-row i { color: var(--blue, #3a9bff); margin-top: 2px; flex-shrink: 0; width: 14px; text-align: center; }
.btn--blue {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--blue, #3a9bff); color: #fff;
  padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 700;
  text-decoration: none; border: none; cursor: pointer;
  transition: background .15s, transform .15s;
}
.btn--blue:hover { background: #2d8ae8; transform: translateY(-1px); }

/* ══ LAYOUT ══ */
.main-content { padding: 60px 0 80px; }
.content-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; align-items: start; }
@media(max-width:1024px) { .content-layout { grid-template-columns: 1fr; } .cta-section { order: -1; } }

/* ══ FORMULAIRE ══ */
.form-card {
  background: #fff; border-radius: 16px; padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}
.form-header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid var(--border,#e2e8f0); }
.form-title { font-size: 28px; font-weight: 800; color: var(--navy); margin: 0 0 8px; display: flex; align-items: center; justify-content: center; gap: 12px; }
.form-title i { color: var(--blue); }
.form-subtitle { font-size: 15px; color: var(--body-text); margin: 0; }
.form-section-title {
  font-size: 16px; font-weight: 700; color: var(--navy); margin: 28px 0 16px;
  padding-bottom: 8px; border-bottom: 2px solid var(--border,#e2e8f0); display: flex; align-items: center; gap: 8px;
}
.form-section-title i { color: var(--blue); }
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 14px; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
.required { color: var(--orange); }
.form-input, .form-textarea {
  width: 100%; padding: 12px 16px; border: 2px solid var(--border,#e2e8f0);
  border-radius: 8px; font-size: 15px; color: var(--navy); transition: border-color .2s; box-sizing: border-box;
}
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--blue); }
.form-textarea { resize: vertical; font-family: inherit; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media(max-width:640px) { .form-row { grid-template-columns: 1fr; } }
.form-error {
  background: rgba(244,67,54,.1); color: #d32f2f; padding: 12px 16px;
  border-radius: 8px; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.form-success {
  background: rgba(76,175,80,.1); color: #388e3c; padding: 12px 16px;
  border-radius: 8px; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.form-note { text-align: center; font-size: 13px; color: var(--body-text); margin-top: 16px; }
.form-note a { color: var(--blue); text-decoration: underline; }

/* ══ PLANS CARDS ══ */
.plans-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 8px; }
@media(max-width:640px) { .plans-grid { grid-template-columns: 1fr; } }

.plan-card {
  border: 2px solid var(--border,#e2e8f0);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, transform .15s;
  position: relative;
  background: #fff;
}
.plan-card:hover { border-color: var(--blue); box-shadow: 0 4px 16px rgba(0,35,90,.1); transform: translateY(-2px); }
.plan-card--selected {
  border-color: var(--blue);
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  box-shadow: 0 4px 20px rgba(0,35,90,.15);
}
.plan-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.plan-card__name { font-size: 15px; font-weight: 800; color: var(--navy); display: block; }
.plan-card__price { font-size: 18px; font-weight: 800; color: var(--blue); text-align: right; line-height: 1.2; flex-shrink: 0; }
.plan-card__price small { font-size: 11px; font-weight: 500; color: #64748b; display: block; }
.plan-card__features { list-style: none; margin: 0; padding: 0; }
.plan-card__features li {
  display: flex; align-items: center; gap: 8px; font-size: 13px;
  color: #475569; padding: 4px 0;
}
.plan-card__features li i { color: var(--blue); font-size: 12px; flex-shrink: 0; width: 14px; }
.plan-card__check {
  position: absolute; top: 12px; right: 12px;
  font-size: 18px; color: var(--blue);
}
.plan-card:not(.plan-card--selected) .plan-card__check { color: #cbd5e1; }

/* ══ CTA RAPPEL ══ */
.cta-section { position: sticky; top: 100px; }
.cta-card {
  background: #fff; border-radius: 16px; padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08); margin-bottom: 24px;
}
.cta-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), #ffb52e);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin: 0 auto 20px;
}
.cta-title { font-size: 22px; font-weight: 700; color: var(--navy); text-align: center; margin: 0 0 12px; }
.cta-text { font-size: 14px; color: var(--body-text); text-align: center; line-height: 1.6; margin: 0 0 24px; }
.callback-form .form-group { margin-bottom: 16px; }

/* ══ AVANTAGES ══ */
.benefits-list {
  background: #fff; border-radius: 16px; padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}
.benefit-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 14px; color: var(--navy); font-weight: 500; }
.benefit-item i { color: var(--blue); font-size: 18px; flex-shrink: 0; }

/* ══ BOUTONS ══ */
.btn--block { width: 100%; display: block; text-align: center; }
.btn--lg { padding: 14px 32px; font-size: 16px; }
.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
