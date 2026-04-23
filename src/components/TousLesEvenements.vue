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

    <!-- Catégories d'événements -->
    <section class="section-categories">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-label">{{ t('evenements.all.categoriesLabel') }}</span>
          <h2 class="section-title">{{ t('evenements.all.categoriesTitle') }}</h2>
          <p class="section-description">{{ t('evenements.all.categoriesDescription') }}</p>
        </div>
        <div v-if="loading.categories" class="loading-state">{{ t('common.loading') }}</div>
        <div v-else-if="categories.length === 0" class="empty-state">
          {{ t('evenements.all.noCategories') }}
        </div>
        <div v-else class="categories-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/evenements/categorie/${cat.id}`"
            class="category-card"
          >
            <div class="category-icon">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <h3 class="category-title">{{ cat.titre }}</h3>
            <p v-if="cat.description" class="category-desc">{{ cat.description }}</p>
            <span class="category-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Événements -->
    <section class="section-events">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-label">{{ t('evenements.all.eventsLabel') }}</span>
          <h2 class="section-title">{{ t('evenements.all.eventsTitle') }}</h2>
          <p class="section-description">{{ t('evenements.all.eventsDescription') }}</p>
        </div>
        <div v-if="loading.events" class="loading-state">{{ t('common.loading') }}</div>
        <div v-else-if="allEvents.length === 0" class="empty-state">
          {{ t('evenements.all.noEvents') }}
        </div>
        <div v-else class="events-grid">
          <router-link
            v-for="event in allEvents"
            :key="event.id"
            :to="`/evenements/${event.id}`"
            class="event-card"
          >
            <div v-if="event.image_url" class="event-image">
              <img :src="event.image_url" :alt="event.titre" />
            </div>
            <div class="event-content">
              <span v-if="event.categorie" class="event-category">{{ event.categorie.titre }}</span>
              <h3 class="event-title">{{ event.titre }}</h3>
              <div class="event-meta">
                <span v-if="event.date_debut" class="event-date">
                  <i class="fa-solid fa-calendar"></i>
                  {{ formatDate(event.date_debut) }}
                </span>
                <span v-if="event.lieu" class="event-location">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ event.lieu }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Événements orphelins (sans catégorie) -->
    <section v-if="orphanEvents.length > 0" class="section-orphans">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-label">{{ t('evenements.all.orphanEventsLabel') }}</span>
          <h2 class="section-title">{{ t('evenements.all.orphanEventsTitle') }}</h2>
        </div>
        <div class="events-grid">
          <router-link
            v-for="event in orphanEvents"
            :key="event.id"
            :to="`/evenements/${event.id}`"
            class="event-card"
          >
            <div v-if="event.image_url" class="event-image">
              <img :src="event.image_url" :alt="event.titre" />
            </div>
            <div class="event-content">
              <h3 class="event-title">{{ event.titre }}</h3>
              <div class="event-meta">
                <span v-if="event.date_debut" class="event-date">
                  <i class="fa-solid fa-calendar"></i>
                  {{ formatDate(event.date_debut) }}
                </span>
                <span v-if="event.lieu" class="event-location">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ event.lieu }}
                </span>
              </div>
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
            <img :src="item.url" :alt="item.alt || 'Gallery image'" />
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import { useScrollAnimations } from '../composables/useScrollAnimations.js'

const { t } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Initialiser les animations au scroll
useScrollAnimations()

const categories = ref([])
const allEvents = ref([])
const orphanEvents = ref([])
const gallery = ref([])
const testimonials = ref([])

const loading = ref({
  categories: true,
  events: true
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    // Charger les catégories
    const catRes = await axios.get(`${apiBase}/public/categories-evenements`)
    categories.value = catRes.data
    loading.value.categories = false

    // Charger tous les événements
    const eventsRes = await axios.get(`${apiBase}/public/evenements`)
    const events = Array.isArray(eventsRes.data) ? eventsRes.data : []

    // Séparer les événements avec et sans catégorie
    allEvents.value = events.filter(e => e.categorie_evenement_id)
    orphanEvents.value = events.filter(e => !e.categorie_evenement_id)
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
    loading.value.categories = false
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
  font-family: 'Barlow Condensed', sans-serif;
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
.section-categories,
.section-events,
.section-orphans,
.section-gallery,
.section-testimonials {
  padding: 60px 0;
}

.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #00235a;
  margin: 0 0 40px;
  text-align: center;
  text-transform: uppercase;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 16px;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.category-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-decoration: none;
  border: 2px solid #e0e4ef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3a9bff, #f29f1f);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.category-card:hover {
  border-color: #3a9bff;
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(58,155,255,0.15);
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3a9bff, #1a7fd8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
}

.category-title {
  font-size: 20px;
  font-weight: 700;
  color: #00235a;
  margin: 0 0 8px;
}

.category-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 16px;
}

.category-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f4ff;
  color: #3a9bff;
  font-size: 12px;
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow {
  background: #3a9bff;
  color: #fff;
  transform: translateX(4px);
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.event-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  border: 2px solid #e0e4ef;
  transition: all 0.3s ease;
}

.event-card:hover {
  border-color: #3a9bff;
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(58,155,255,0.15);
}

.event-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f2f8;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-content {
  padding: 20px;
}

.event-category {
  display: inline-block;
  padding: 4px 12px;
  background: #eef2ff;
  color: #3a9bff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-title {
  font-size: 18px;
  font-weight: 700;
  color: #00235a;
  margin: 0 0 12px;
  line-height: 1.4;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-date,
.event-location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.event-date i,
.event-location i {
  color: #3a9bff;
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

  .categories-grid,
  .events-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
