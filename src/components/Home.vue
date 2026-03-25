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
            <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/ATSL-Logo-1.png"
                 alt="Africa Talent Summit Luxembourg" width="160" height="56">
          </a>
          <div class="header-btns" id="headerBtns">
            <router-link to="/register" class="btn btn--orange btn--sm">S'INSCRIRE</router-link>
            <router-link to="/login"    class="btn btn--blue   btn--sm">SE CONNECTER</router-link>
          </div>
          <button class="menu-toggle" id="menuToggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <nav class="site-nav" id="siteNav">
            <ul>
              <li><a href="#about">À PROPOS</a></li>
              <li><a href="#offres">OFFRES</a></li>
              <li><a href="#articles">ACTUALITÉS</a></li>
              <li><router-link to="/login">MATCHING PROFILE</router-link></li>
              <li><a href="mailto:contact@africatalentsummit.com">CONTACTEZ-NOUS</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- ══ HERO — Événement mis en avant ══ -->
    <section class="hero" :style="heroStyle">
      <div class="hero-bg"></div>
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

    <!-- ══ BRIDGING ══ -->
    <section class="section-bridging">
      <div class="container">
        <h2 class="bridging-title fade-in">
          Bridging<br>Competencies,<br>Accelerating<br><span class="orange">Performance</span>
        </h2>
      </div>
    </section>

    <!-- ══ À PROPOS DE L'ÉVÉNEMENT ══ -->
    <section class="section-defi" id="about" v-if="event">
      <div class="container">
        <div class="defi-grid">
          <div class="defi-text fade-in">
            <h1>{{ event.titre }}</h1>
            <p>{{ event.description }}</p>
            <div v-if="event.details_supplementaires" style="margin-top:8px;color:var(--body-text);">
              {{ event.details_supplementaires }}
            </div>
            <div style="margin-top:16px;display:flex;gap:16px;flex-wrap:wrap;font-size:14px;color:var(--navy);">
              <span v-if="event.ville"><i class="fa-solid fa-location-dot" style="color:var(--orange);margin-right:6px;"></i>{{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}</span>
              <span v-if="event.adresse"><i class="fa-solid fa-map-pin" style="color:var(--orange);margin-right:6px;"></i>{{ event.adresse }}</span>
            </div>
            <router-link to="/register" class="btn btn--blue" style="margin-top:20px;">
              S'inscrire <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
            </router-link>
          </div>
          <div class="defi-img fade-in" v-if="event.image_mise_en_avant_url">
            <img :src="event.image_mise_en_avant_url" :alt="event.titre" loading="lazy">
          </div>
          <div class="defi-img fade-in" v-else>
            <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/business-partners-at-seminar-2026-01-08-00-15-05-utc-1024x683.jpg"
                 alt="Événement" loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- ══ ENTREPRISES PARTICIPANTES ══ -->
    <section v-if="event && event.entreprises && event.entreprises.length" style="padding:60px 0;background:var(--light-bg);">
      <div class="container">
        <div class="triple-header fade-in" style="text-align:center;margin-bottom:40px;">
          <h2>Entreprises Participantes</h2>
          <p>Les entreprises qui recrutent lors de cet événement</p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;">
          <div v-for="entreprise in event.entreprises" :key="entreprise.id"
               style="background:#fff;border-radius:12px;padding:20px 28px;box-shadow:var(--shadow);display:flex;align-items:center;gap:14px;min-width:180px;">
            <img v-if="entreprise.logo_url" :src="entreprise.logo_url" :alt="entreprise.nom"
                 style="width:48px;height:48px;object-fit:contain;border-radius:6px;">
            <div v-else style="width:48px;height:48px;border-radius:6px;background:var(--light-blue);display:flex;align-items:center;justify-content:center;">
              <i class="fa-solid fa-building" style="color:var(--navy);font-size:20px;"></i>
            </div>
            <span style="font-weight:600;color:var(--navy);font-size:15px;">{{ entreprise.nom }}</span>
          </div>
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

    <!-- ══ ARTICLES / ACTUALITÉS ══ -->
    <section id="articles" style="padding:80px 0;background:#fff;">
      <div class="container">
        <div class="roles-header fade-in" style="text-align:center;margin-bottom:48px;">
          <span class="label-blue">Actualités</span>
          <h2>Nos derniers articles</h2>
          <p>Restez informé des dernières tendances et actualités du monde du talent africain</p>
        </div>
        <div v-if="articles.length" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px;">
          <div v-for="article in articles" :key="article.id" class="triple-card fade-in">
            <div class="triple-card-img">
              <img v-if="article.image_url" :src="article.image_url" :alt="article.title" loading="lazy"
                   style="width:100%;height:200px;object-fit:cover;">
              <img v-else src="https://africatalentsummit.com/wp-content/uploads/2026/02/business-partners-at-seminar-2026-01-08-00-15-05-utc-1024x683.jpg"
                   :alt="article.title" loading="lazy" style="width:100%;height:200px;object-fit:cover;">
            </div>
            <div class="triple-card-body">
              <div style="font-size:12px;color:var(--blue);margin-bottom:8px;">
                {{ formatDate(article.created_at) }}
              </div>
              <h3 style="font-size:18px;margin-bottom:10px;">{{ article.title }}</h3>
              <p>{{ truncate(stripHtml(article.content), 120) }}</p>
              <router-link to="/login" style="color:var(--blue);font-weight:600;font-size:14px;margin-top:8px;display:inline-block;">
                Lire la suite <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else style="text-align:center;color:var(--body-text);padding:40px 0;">
          Aucun article disponible pour le moment.
        </div>
        <div style="text-align:center;margin-top:40px;">
          <router-link to="/login" class="btn btn--blue btn--lg">
            Voir tous les articles <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
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
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/ATSL-Logo-2.png"
                     alt="Africa Talent Summit Luxembourg" width="180">
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

const event    = ref(null)
const articles = ref([])
const offres   = ref([])
const cd       = ref({ days: '000', hours: '00', minutes: '00', seconds: '00' })
let   timer    = null

// ── Chargement des données ─────────────────────────────────
onMounted(async () => {
  try {
    const [evRes, artRes, offRes] = await Promise.all([
      axios.get(`${apiBase}/api/public/featured-event`),
      axios.get(`${apiBase}/api/public/articles`),
      axios.get(`${apiBase}/api/public/offres`),
    ])
    event.value    = evRes.data
    articles.value = artRes.data
    offres.value   = offRes.data
  } catch (e) {
    console.error('Erreur chargement page accueil', e)
  }

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
  if (event.value?.date_debut) return new Date(event.value.date_debut + 'T08:00:00')
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
    return { '--hero-bg-image': `url('${event.value.image_mise_en_avant_url}')` }
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
/* Surcharge hero-bg pour image dynamique via CSS variable */
.hero[style] .hero-bg {
  background-image: var(--hero-bg-image, url('https://africatalentsummit.com/wp-content/uploads/2026/02/sn6234-lux-kirchberg-centredeconference-13.jpeg'));
}

/* Label bleu (réutilisé depuis le template) */
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
</style>
