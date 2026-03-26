<template>
  <div>

    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <a href="tel:+3522060162"><i class="fa-solid fa-phone"></i> +3522060162</a>
          <a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-envelope"></i> contact@africatalentsummit.com</a>
        </div>
        <div class="topbar-right">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </div>

    <!-- ══ HEADER ══ -->
    <header class="site-header" id="site-header">
      <div class="container">
        <div class="header-inner">
          <a href="/" class="site-logo">
            <img src="/logo.png" alt="Talenteed" width="160" height="56">
            <span class="site-tagline">Le média alternatif pour les RH</span>
          </a>

          <!-- Boutons auth -->
          <div class="header-btns" id="headerBtns">
            <template v-if="isLoggedIn">
              <router-link :to="dashboardRoute" class="btn btn--blue btn--sm">
                <i class="fa-solid fa-gauge" style="margin-right:5px;"></i>DASHBOARD
              </router-link>
            </template>
            <template v-else>
              <router-link to="/register" class="btn btn--orange btn--sm">S'INSCRIRE</router-link>
              <router-link to="/login"    class="btn btn--blue   btn--sm">SE CONNECTER</router-link>
            </template>
          </div>

          <button class="menu-toggle" id="menuToggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <nav class="site-nav" id="siteNav">
            <ul>
              <li><router-link to="/">ACCUEIL</router-link></li>

              <!-- Mega menu Annonces -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  ANNONCES <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <router-link to="/annonces" class="mega-item">
                    <i class="fa-solid fa-briefcase mega-icon"></i>
                    <div>
                      <strong>Jobs</strong>
                      <small>Toutes les offres d'emploi</small>
                    </div>
                  </router-link>
                  <router-link to="/entreprises" class="mega-item">
                    <i class="fa-solid fa-building mega-icon"></i>
                    <div>
                      <strong>Entreprises</strong>
                      <small>Les entreprises partenaires</small>
                    </div>
                  </router-link>
                </div>
              </li>

              <!-- Mega menu Événements -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  ÉVÉNEMENTS <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <template v-if="categories.length">
                    <router-link
                      v-for="cat in categories"
                      :key="cat.id"
                      :to="`/evenements/categorie/${cat.id}`"
                      class="mega-item"
                    >
                      <i class="fa-solid fa-calendar-days mega-icon"></i>
                      <div>
                        <strong>{{ cat.titre }}</strong>
                      </div>
                    </router-link>
                  </template>
                  <div v-else class="mega-item mega-item--empty">
                    <i class="fa-solid fa-calendar-xmark mega-icon"></i>
                    <div><strong>Aucun événement disponible</strong></div>
                  </div>
                </div>
              </li>

              <li><router-link to="/blog">ARTICLES</router-link></li>

              <!-- Switcher Fr / En -->
              <li>
                <button class="lang-switch" @click="toggleLocale">
                  {{ locale === 'fr' ? 'EN' : 'FR' }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- ══ HERO — Événement mis en avant ══ -->
    <section class="hero">
      <div class="hero-bg" :style="heroStyle"></div>
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-inner">
          <div class="hero-content fade-in">
            <span class="hero-date">{{ eventDateRange }}</span>
            <h1 class="hero-title" v-if="event">{{ event.titre }}</h1>
            <h1 class="hero-title" v-else>Africa Talent Summit <span class="orange">Luxembourg</span></h1>
            <p class="hero-desc" v-if="event">
              {{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}
            </p>
            <p class="hero-desc" v-else>La première plateforme européenne qui mobilise le Talent africain pour accélérer la performance des entreprises en Afrique.</p>
            <p class="hero-cta-label">LES INSCRIPTIONS SONT OUVERTES – RÉSERVEZ VOTRE PLACE</p>
            <router-link to="/register" class="btn btn--blue btn--lg hero-btn">
              S'inscrire <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
            </router-link>
            <!-- Countdown -->
            <div class="countdown-inner" id="countdown">
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.days }}</span><span class="cd-label">Jours</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.hours }}</span><span class="cd-label">Heures</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.minutes }}</span><span class="cd-label">Minutes</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.seconds }}</span><span class="cd-label">Secondes</span></div></div>
            </div>
          </div>
          <div class="hero-right"></div>
        </div>
      </div>
    </section>

    <!-- ══ 4 CARDS ACCÈS RAPIDE ══ -->
    <section class="section-quicklinks">
      <div class="container">
        <div class="quicklinks-grid">

          <router-link to="/annonces" class="ql-card">
            <div class="ql-icon"><i class="fa-solid fa-briefcase"></i></div>
            <div class="ql-body">
              <h3>Trouver un emploi</h3>
              <p>Votre porte d'entrée vers des possibilités infinies et des opportunités de carrière passionnantes</p>
              <span class="ql-link">Parcourir les emplois <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="categories.length ? `/evenements/categorie/${categories[0].id}` : '/'" class="ql-card">
            <div class="ql-icon ql-icon--orange"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="ql-body">
              <h3>Événements</h3>
              <p>Participez aux événements RH et développez votre réseau professionnel</p>
              <span class="ql-link">Découvrir <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link to="/blog" class="ql-card">
            <div class="ql-icon ql-icon--green"><i class="fa-solid fa-newspaper"></i></div>
            <div class="ql-body">
              <h3>Articles</h3>
              <p>Actualités RH, conseils carrière et tendances du marché du travail africain</p>
              <span class="ql-link">Lire <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="isLoggedIn && userRole === 'talent' ? '/talent' : '/login'" class="ql-card ql-card--featured">
            <div class="ql-icon ql-icon--white"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="ql-body">
              <h3>Matching Profile</h3>
              <p>Trouvez les opportunités qui correspondent parfaitement à votre profil et vos compétences</p>
              <span class="ql-link">Découvrir mon match <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

        </div>
      </div>
    </section>

    <!-- ══ ENTREPRISES PARTICIPANTES ══ -->
    <section v-if="event && event.entreprises && event.entreprises.length" class="section-partners">
      <div class="container">
        <div class="partners-header fade-in">
          <span class="label-blue">Ils recrutent</span>
          <h2>Entreprises Participantes</h2>
          <p>Les entreprises qui recrutent lors de cet événement</p>
        </div>
        <div class="partners-grid fade-in">
          <router-link
            v-for="entreprise in event.entreprises"
            :key="entreprise.id"
            to="/entreprises"
            class="partner-card"
          >
            <div class="partner-logo">
              <img v-if="entreprise.logo_url"
                   :src="entreprise.logo_url"
                   :alt="entreprise.nom">
              <span v-else class="partner-initials">
                {{ entreprise.nom.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="partner-name">{{ entreprise.nom }}</span>
          </router-link>
        </div>
        <div class="partners-cta fade-in">
          <router-link to="/entreprises" class="btn btn--blue">
            Voir toutes les entreprises <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══ TRIPLE ANCRAGE ══ -->
    <section class="section-triple">
      <div class="triple-watermark">Impact Systémique</div>
      <div class="container">
        <div class="triple-header fade-in">
          <h2>Triple Ancrage Stratégique</h2>
          <p>Pour garantir un impact systémique et durable, le sommet repose sur trois piliers indissociables, pensés pour transformer l'intention en action :</p>
        </div>
        <div class="triple-cards">
          <!-- Articles dynamiques (3 premiers) -->
          <template v-if="articles.length">
            <div v-for="article in articles.slice(0, 3)" :key="article.id" class="triple-card fade-in">
              <div class="triple-card-img">
                <img v-if="article.image_url" :src="article.image_url" :alt="article.title" loading="lazy">
                <img v-else src="https://africatalentsummit.com/wp-content/uploads/2026/02/staff-tech-accounting-discussion-office-development-feedback-budget-communication-business-project-group-collaboration-financial-firm-people-planning-with-team-scaled.jpg"
                     :alt="article.title" loading="lazy">
              </div>
              <div class="triple-card-body">
                <div style="font-size:12px;color:var(--blue);margin-bottom:6px;">{{ formatDate(article.created_at) }}</div>
                <h3>{{ article.title }}</h3>
                <p>{{ truncate(stripHtml(article.content), 120) }}</p>
                <router-link to="/login" style="color:var(--blue);font-weight:600;font-size:14px;margin-top:8px;display:inline-block;">
                  Lire la suite <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
                </router-link>
              </div>
            </div>
          </template>
          <!-- Fallback statique si aucun article -->
          <template v-else>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/staff-tech-accounting-discussion-office-development-feedback-budget-communication-business-project-group-collaboration-financial-firm-people-planning-with-team-scaled.jpg"
                     alt="Think Tank" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>Think Tank</h3><p>Un Comité Scientifique international composé de chercheurs, experts RH et décideurs produit chaque année un Livre Blanc de référence.</p></div>
            </div>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/all-their-input-is-vital-when-it-comes-to-decision-2026-01-09-10-57-28-utc-scaled.jpg"
                     alt="Hub de Recrutement Premium" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>Hub de Recrutement Premium</h3><p>Une plateforme de matching direct entre les entreprises en quête de compétences critiques et les talents de la diaspora.</p></div>
            </div>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/recording-the-facts-shot-of-a-group-of-people-sit-2026-01-09-11-19-42-utc-scaled.jpg"
                     alt="Levier de Diplomatie Économique" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>Levier de Diplomatie Économique</h3><p>Un cadre privilégié pour la signature d'accords bilatéraux et le renforcement des partenariats institutionnels Europe-Afrique.</p></div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- ══ OFFRES D'EMPLOI ══ -->
    <section id="offres" style="padding:80px 0;background:var(--light-bg);">
      <div class="container">
        <div class="roles-header fade-in" style="text-align:center;margin-bottom:48px;">
          <span class="label-blue">Opportunités</span>
          <h2>Offres d'emploi récentes</h2>
          <p>Découvrez les dernières opportunités disponibles sur la plateforme</p>
        </div>
        <div v-if="offres.length" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px;">
          <div v-for="offre in offres" :key="offre.id" class="fade-in"
               style="background:#fff;border-radius:var(--radius-lg);box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;">
            <div style="padding:28px 28px 0;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div v-if="offre.entreprise && offre.entreprise.logo_url">
                  <img :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom"
                       style="width:44px;height:44px;object-fit:contain;border-radius:6px;border:1px solid var(--border);">
                </div>
                <div v-else style="width:44px;height:44px;border-radius:6px;background:var(--light-blue);display:flex;align-items:center;justify-content:center;">
                  <i class="fa-solid fa-building" style="color:var(--navy);font-size:18px;"></i>
                </div>
                <div>
                  <div style="font-weight:700;color:var(--navy);font-size:15px;">{{ offre.titre }}</div>
                  <div style="font-size:13px;color:var(--body-text);">{{ offre.entreprise ? offre.entreprise.nom : '—' }}</div>
                </div>
              </div>
              <p style="color:var(--body-text);font-size:14px;line-height:1.6;margin-bottom:16px;">
                {{ truncate(offre.mission, 120) }}
              </p>
            </div>
            <div style="margin-top:auto;padding:16px 28px 24px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);">
              <span style="font-size:13px;color:var(--body-text);">
                <i class="fa-solid fa-location-dot" style="color:var(--orange);margin-right:4px;"></i>{{ offre.localisation || '—' }}
              </span>
              <router-link to="/login" class="btn btn--blue btn--sm">Postuler</router-link>
            </div>
          </div>
        </div>
        <div v-else style="text-align:center;color:var(--body-text);padding:40px 0;">
          Aucune offre disponible pour le moment.
        </div>
        <div style="text-align:center;margin-top:40px;">
          <router-link to="/login" class="btn btn--blue btn--lg">
            Voir toutes les offres <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
          </router-link>
        </div>
      </div>
    </section>


    <!-- ══ SECTION EVENT (countdown 2) ══ -->
    <section class="section-event" v-if="event">
      <div class="event-img">
        <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/back-thinking-window-with-business-black-man-standing-his-office-looking-city-view-id-scaled.jpg"
             alt="Professionnel africain" loading="lazy">
      </div>
      <div class="event-info fade-in">
        <div class="event-info-arc"></div>
        <div class="event-info-arc2"></div>
        <span class="event-date">{{ eventDateRange }}</span>
        <h2>{{ event.titre }}</h2>
        <div class="event-location" v-if="event.ville">
          <i class="fa-solid fa-location-dot"></i>
          <span>{{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}</span>
        </div>
        <div class="event-countdown">
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.days, 3) }}</span><span class="ecd-label">Jours</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.hours, 2) }}</span><span class="ecd-label">Heures</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.minutes, 2) }}</span><span class="ecd-label">Minutes</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.seconds, 2) }}</span><span class="ecd-label">Secondes</span></div>
        </div>
        <router-link to="/register" class="btn btn--blue btn--lg" style="position:relative;z-index:2;">
          Participez <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
        </router-link>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="section-cta">
      <div class="cta-watermark">Participez</div>
      <div class="container">
        <span class="cta-label">Rejoignez-nous</span>
        <h2>Entreprises, talents, institutions,<br>partenaires</h2>
        <router-link to="/register" class="btn btn--blue btn--lg">
          Participez <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
        </router-link>
      </div>
    </section>

    <!-- ══ FOOTER ══ -->
    <footer class="site-footer">
      <div class="footer-bg"></div>
      <div class="footer-overlay"></div>
      <div class="footer-inner">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <img src="/logo.png" alt="Talenteed" width="180">
              </div>
              <p>L'Africa Talent Summit Luxembourg est la première plateforme stratégique européenne dédiée à la mobilisation de l'intelligence collective et des compétences rares de la diaspora, afin d'accélérer la performance des entreprises en Afrique.</p>
              <div class="footer-socials">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Contactez-nous</h4>
              <div class="contact-item"><i class="fa-solid fa-phone"></i><a href="tel:+3522060162">+3522060162</a></div>
              <div class="contact-item"><i class="fa-solid fa-location-dot"></i><span>57 avenue de la Gare, L-1611 Luxembourg</span></div>
              <div class="contact-item"><i class="fa-solid fa-envelope"></i><a href="mailto:contact@africatalentsummit.com">contact@africatalentsummit.com</a></div>
            </div>
            <div class="footer-col">
              <h4>Rejoignez-nous</h4>
              <ul>
                <li><router-link to="/register"><i class="fa-solid fa-chevron-right"></i> Devenir Talent</router-link></li>
                <li><router-link to="/login"><i class="fa-solid fa-chevron-right"></i> Se connecter</router-link></li>
                <li><a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-chevron-right"></i> Presse et Média</a></li>
                <li><a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-chevron-right"></i> Partenariats</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>© {{ new Date().getFullYear() }} Solution Talenteed SARL R.C.S. Luxembourg B 255 801. Tous droits réservés. Africa Talent Summit Luxembourg est une marque déposée.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const event      = ref(null)
const articles   = ref([])
const offres     = ref([])
const categories = ref([])
const cd         = ref({ days: '000', hours: '00', minutes: '00', seconds: '00' })
let   timer      = null

// ── Auth state ─────────────────────────────────────────────
const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')

const dashboardRoute = computed(() => {
  const routes = { admin: '/admin', talent: '/talent', entreprise: '/entreprise' }
  return routes[userRole.value] || '/login'
})

// ── Locale Fr / En ─────────────────────────────────────────
const locale = ref(localStorage.getItem('locale') || 'fr')
function toggleLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr'
  localStorage.setItem('locale', locale.value)
}

// ── Chargement des données ─────────────────────────────────
onMounted(async () => {
  try {
    const [evRes, artRes, offRes] = await Promise.all([
      axios.get(`${apiBase}/public/featured-event`),
      axios.get(`${apiBase}/public/articles`),
      axios.get(`${apiBase}/public/offres`),
    ])
    event.value    = evRes.data
    articles.value = artRes.data
    offres.value   = offRes.data
  } catch (e) {
    console.error('Erreur chargement page accueil', e)
  }

  // Catégories événements pour le mega menu (non bloquant)
  try {
    const catRes = await axios.get(`${apiBase}/public/categories-evenements`)
    categories.value = catRes.data
  } catch {}

  startCountdown()
  initMenuToggle()
  initScrollHeader()
  initFadeIn()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ── Countdown ─────────────────────────────────────────────
const countdownTarget = computed(() => {
  if (event.value?.date_debut) {
    const dateStr = event.value.date_debut.substring(0, 10)
    const timeStr = event.value.heure_debut_journee
      ? event.value.heure_debut_journee.substring(0, 5)
      : '08:00'
    return new Date(`${dateStr}T${timeStr}:00`)
  }
  return new Date('2026-11-05T08:00:00')
})

function startCountdown() {
  function tick() {
    const diff = Math.max(0, countdownTarget.value - new Date())
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000)  / 60000)
    const s = Math.floor((diff % 60000)    / 1000)
    cd.value = { days: pad(d, 3), hours: pad(h, 2), minutes: pad(m, 2), seconds: pad(s, 2) }
  }
  tick()
  timer = setInterval(tick, 1000)
}

// ── Style hero — image de fond dynamique ──────────────────
const heroStyle = computed(() => {
  if (event.value?.image_mise_en_avant_url) {
    return { backgroundImage: `url('${event.value.image_mise_en_avant_url}')` }
  }
  return {}
})

// ── Computed ──────────────────────────────────────────────
const eventDateRange = computed(() => {
  if (!event.value) return '5 - 6 Novembre 2026'
  const d = (str) => {
    const dt = new Date(str)
    return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  if (event.value.date_debut && event.value.date_fin) {
    return `${d(event.value.date_debut)} – ${d(event.value.date_fin)}`
  }
  if (event.value.date_debut) return d(event.value.date_debut)
  return '5 - 6 Novembre 2026'
})

// ── Utilitaires ───────────────────────────────────────────
function pad(n, w) {
  let s = String(n)
  while (s.length < w) s = '0' + s
  return s
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Init comportements du template ───────────────────────
function initMenuToggle() {
  const toggle = document.getElementById('menuToggle')
  const nav    = document.getElementById('siteNav')
  if (!toggle || !nav) return
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open')
    toggle.setAttribute('aria-expanded', open)
  })
}

function initScrollHeader() {
  const header = document.getElementById('site-header')
  if (!header) return
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50)
  })
}

function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.15 })
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
}
</script>

<style>
/* ── Logo + tagline ───────────────────────────────────── */
.site-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-decoration: none;
}
.site-tagline {
  font-size: 11px;
  font-weight: 700;
  color: var(--orange, #f07c00);
  letter-spacing: 0.3px;
  line-height: 1;
  position: relative;
  top: -8px;
}


/* ── Label bleu ───────────────────────────────────────── */
.label-blue {
  display: inline-block;
  background: var(--blue);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  margin-bottom: 12px;
}

/* ── Mega menu ────────────────────────────────────────── */
.has-mega {
  position: relative;
}
.has-mega .mega-menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  padding: 10px;
  min-width: 240px;
  z-index: 200;
  border-top: 3px solid var(--blue);
}
.has-mega:hover .mega-menu,
.has-mega:focus-within .mega-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mega-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--navy);
  text-decoration: none;
  transition: background .15s;
}
.mega-item:hover {
  background: var(--light-bg, #f5f7fa);
}
.mega-item strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--navy);
}
.mega-item small {
  display: block;
  font-size: 12px;
  color: var(--body-text);
  margin-top: 2px;
}
.mega-item--empty {
  opacity: .6;
  cursor: default;
  pointer-events: none;
}
.mega-icon {
  font-size: 18px;
  color: var(--blue);
  margin-top: 2px;
  flex-shrink: 0;
}
.nav-chevron {
  font-size: 9px;
  margin-left: 3px;
  vertical-align: middle;
  transition: transform .2s;
}
.has-mega:hover .nav-chevron {
  transform: rotate(180deg);
}

/* ── 4 cards accès rapide ─────────────────────────────── */
.section-quicklinks {
  padding: 80px 0;
  background: var(--light-bg, #f5f7fa);
}
.quicklinks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .quicklinks-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .quicklinks-grid { grid-template-columns: 1fr; }
}
.ql-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 28px;
  border-radius: var(--radius-lg, 14px);
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  text-decoration: none;
  border: none;
  transition: box-shadow .2s, transform .2s;
}
.ql-card:hover {
  box-shadow: 0 10px 32px rgba(0,0,0,.22);
  transform: translateY(-5px);
}
.ql-card:nth-child(1) { background: linear-gradient(135deg,#040a5d 0%,#192bc2 100%); }
.ql-card:nth-child(2) { background: linear-gradient(135deg,#192bc2 0%,#2687e9 100%); }
.ql-card:nth-child(3) { background: linear-gradient(135deg,#2687e9 0%,#5ba3f0 100%); }
.ql-card:nth-child(4) { background: linear-gradient(135deg,#f49f0a 0%,#ffb52e 100%); }
.ql-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  flex-shrink: 0;
}
.ql-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}
.ql-body p {
  font-size: 14px;
  color: rgba(255,255,255,.82);
  line-height: 1.6;
  margin: 0 0 16px;
  flex: 1;
}
.ql-link {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}
.ql-link i { font-size: 11px; transition: transform .2s; }
.ql-card:hover .ql-link i { transform: translateX(4px); }

/* ── Section partenaires ──────────────────────────────── */
.section-partners {
  padding: 80px 0;
  background: #fff;
}
.partners-header {
  text-align: center;
  margin-bottom: 48px;
}
.partners-header h2 {
  margin: 8px 0 12px;
}
.partners-header p {
  color: var(--body-text);
  font-size: 16px;
}
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}
.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 16px 22px;
  background: var(--light-bg, #f5f7fa);
  border: 1.5px solid transparent;
  border-radius: var(--radius-lg, 14px);
  text-decoration: none;
  transition: border-color .2s, box-shadow .2s, transform .2s;
  cursor: pointer;
}
.partner-card:hover {
  border-color: var(--blue);
  box-shadow: 0 6px 24px rgba(0,0,0,.10);
  transform: translateY(-4px);
}
.partner-logo {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  flex-shrink: 0;
}
.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}
.partner-initials {
  font-size: 28px;
  font-weight: 800;
  color: var(--blue);
  line-height: 1;
}
.partner-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  text-align: center;
  line-height: 1.3;
}
.partners-cta {
  text-align: center;
}

/* ── Switcher langue ──────────────────────────────────── */
.lang-switch {
  background: transparent;
  border: 1.5px solid var(--blue);
  color: var(--blue);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: var(--radius-pill, 50px);
  cursor: pointer;
  transition: background .15s, color .15s;
}
.lang-switch:hover {
  background: var(--blue);
  color: #fff;
}
</style>
