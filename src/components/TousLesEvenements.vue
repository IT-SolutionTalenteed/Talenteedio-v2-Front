<template>
  <div class="tous-evenements">
    <PublicNav />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ t('evenements.all.title') }}</h1>
        <p class="hero-desc">{{ t('evenements.all.description') }}</p>
      </div>
    </section>

    <!-- Événements -->
    <section class="section-events">
      <div class="container">
        <!-- Tabs de filtrage -->
        <div class="events-tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            {{ t('evenements.all.allEvents') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'upcoming' }]"
            @click="activeTab = 'upcoming'"
          >
            {{ t('evenements.all.upcomingEvents') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'past' }]"
            @click="activeTab = 'past'"
          >
            {{ t('evenements.all.pastEvents') }}
          </button>
        </div>

        <div v-if="loading.events" class="loading-state">{{ t('common.loading') }}</div>
        <div v-else-if="filteredEvents.length === 0" class="empty-state">
          {{ t('evenements.all.noEvents') }}
        </div>
        <div v-else class="events-grid">
          <router-link
            v-for="event in filteredEvents"
            :key="event.id"
            :to="`/evenements/${event.id}`"
            class="event-card"
          >
            <div class="event-image" :class="{ 'event-past': isEventPast(event) }">
              <img
                v-if="event.image_mise_en_avant_url"
                v-lazy="event.image_mise_en_avant_url"
                :alt="event.titre"
              />
              <div v-else class="event-image-placeholder">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <span v-if="event.date_debut" class="event-date-badge">
                <i class="fa-solid fa-calendar"></i>
                {{ formatDate(event.date_debut) }}
              </span>
            </div>
            <div class="event-content">
              <h3 class="event-title">{{ event.titre }}</h3>
              <p v-if="event.description" class="event-desc">
                {{ truncate(stripHtml(event.description), 120) }}
              </p>
              <span class="event-link">
                {{ t('evenements.card.viewEvent') }}
                <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Galerie -->
    <section v-if="gallery.length > 0" class="section-gallery">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-label">{{ t('evenements.all.galleryLabel') }}</span>
          <h2 class="section-title">{{ t('evenements.all.galleryTitle') }}</h2>
        </div>
        <div class="gallery-grid">
          <div v-for="(item, idx) in gallery" :key="idx" class="gallery-item">
            <img v-lazy="item.url" :alt="item.alt || 'Gallery image'" />
          </div>
        </div>
      </div>
    </section>

    <!-- Témoignages -->
    <section v-if="testimonials.length > 0" class="section-testimonials">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-label">{{ t('evenements.all.testimonialsLabel') }}</span>
          <h2 class="section-title">{{ t('evenements.all.testimonialsTitle') }}</h2>
          <p class="section-description">{{ t('evenements.all.testimonialsDescription') }}</p>
        </div>
        <div class="testimonials-grid">
          <div v-for="(testimonial, idx) in testimonials" :key="idx" class="testimonial-card">
            <div class="testimonial-quote">
              <i class="fa-solid fa-quote-left"></i>
            </div>
            <p class="testimonial-text">{{ testimonial.texte }}</p>
            <div class="testimonial-author">
              <strong>{{ testimonial.nom }}</strong>
              <span v-if="testimonial.poste">{{ testimonial.poste }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import { useScrollAnimations } from '../composables/useScrollAnimations.js'

const { t } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Initialiser les animations au scroll
useScrollAnimations()

const allEvents = ref([])
const gallery = ref([])
const testimonials = ref([])
const activeTab = ref('all')

const loading = ref({
  events: true
})

function isEventPast(event) {
  if (!event.date_fin && !event.date_debut) return false
  const endDate = event.date_fin || event.date_debut
  return new Date(endDate) < new Date()
}

const filteredEvents = computed(() => {
  if (activeTab.value === 'all') {
    return allEvents.value
  } else if (activeTab.value === 'upcoming') {
    return allEvents.value.filter(event => !isEventPast(event))
  } else if (activeTab.value === 'past') {
    return allEvents.value.filter(event => isEventPast(event))
  }
  return allEvents.value
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str
}

onMounted(async () => {
  try {
    // Charger tous les événements disponibles (réponse paginée Laravel)
    const eventsRes = await axios.get(`${apiBase}/public/evenements`)
    const payload = eventsRes.data
    allEvents.value = Array.isArray(payload) ? payload : (payload?.data ?? [])
    loading.value.events = false

    // Charger la galerie (si endpoint disponible)
    try {
      const galleryRes = await axios.get(`${apiBase}/public/gallery`)
      gallery.value = Array.isArray(galleryRes.data) ? galleryRes.data : []
    } catch (err) {
      console.log('Gallery endpoint not available')
    }

    // Charger les témoignages (si endpoint disponible)
    try {
      const testimonialsRes = await axios.get(`${apiBase}/public/testimonials`)
      testimonials.value = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : []
    } catch (err) {
      console.log('Testimonials endpoint not available')
    }
  } catch (error) {
    console.error('Error loading events data:', error)
    loading.value.events = false
  }
})
</script>

<style scoped>
.tous-evenements {
  min-height: 100vh;
  background: #fafbff;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #00235a 0%, #1a3a8a 100%);
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(58,155,255,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  text-align: center;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255,255,255,0.8);
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Sections */
.section-events,
.section-gallery,
.section-testimonials {
  padding: 60px 0;
}

.section-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #00235a;
  margin: 0 0 40px;
  text-align: center;
  text-transform: uppercase;
}

/* Tabs de filtrage */
.events-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  color: #64748b;
  background: #fff;
  border: 2px solid #e8ecf5;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: #3a9bff;
  color: #3a9bff;
}

.tab-btn.active {
  background: linear-gradient(135deg, #3a9bff 0%, #1a7cd8 100%);
  border-color: #3a9bff;
  color: #fff;
  box-shadow: 0 4px 16px rgba(58, 155, 255, 0.25);
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 16px;
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.event-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid #e8ecf5;
  box-shadow: 0 4px 18px rgba(0, 35, 90, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.event-card:hover {
  border-color: #3a9bff;
  transform: translateY(-6px);
  box-shadow: 0 18px 44px rgba(58, 155, 255, 0.18);
}

.event-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f2f8;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.06);
}

/* Événements passés - image grisée */
.event-image.event-past img {
  filter: grayscale(100%);
  opacity: 0.6;
}

.event-card:hover .event-image.event-past img {
  filter: grayscale(80%);
  opacity: 0.75;
}

.event-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  color: rgba(255, 255, 255, 0.5);
  background: linear-gradient(135deg, #00235a 0%, #1a3a8a 100%);
}

.event-date-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #00235a;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

.event-date-badge i {
  color: #3a9bff;
  font-size: 12px;
}

.event-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px;
}

.event-title {
  font-size: 19px;
  font-weight: 700;
  color: #00235a;
  margin: 0 0 10px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 18px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-link {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #3a9bff;
  transition: gap 0.25s ease;
}

.event-card:hover .event-link {
  gap: 12px;
}

.event-link i {
  font-size: 12px;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f2f8;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

/* Testimonials Grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.testimonial-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 2px solid #e0e4ef;
  position: relative;
}

.testimonial-quote {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f29f1f, #e08e0a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  margin-bottom: 20px;
}

.testimonial-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.7;
  margin: 0 0 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.testimonial-author strong {
  font-size: 16px;
  color: #00235a;
}

.testimonial-author span {
  font-size: 13px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .events-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
