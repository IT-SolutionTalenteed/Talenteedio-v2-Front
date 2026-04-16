<template>
  <div class="profile-selection">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="selection-hero">
      <div class="container">
        <div class="hero-content">
          <div class="event-badge">
            <i class="fa-solid fa-calendar-days"></i>
            Africa Talent Summit — 5 &amp; 6 Novembre 2026
          </div>
          
          <h1 class="hero-title">
            Choisissez votre profil
          </h1>
          
          <p class="hero-subtitle">
            Rejoignez le premier sommet panafricain dédié aux talents et aux entreprises qui construisent l'Afrique de demain
          </p>
        </div>
      </div>
    </section>

    <!-- Profile Cards Section -->
    <section class="cards-section">
      <div class="container">
        <div class="cards-grid">
          
          <!-- Card Talent -->
          <div class="profile-card talent-card" @click="goToTalentRegister">
            <div class="card-icon talent-icon">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            
            <h2 class="card-title">Je suis un Talent</h2>
            
            <p class="card-description">
              Accédez à des opportunités de carrière exceptionnelles auprès d'entreprises panafricaines ambitieuses
            </p>
            
            <ul class="card-features">
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Accès aux offres panafricaines</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Matching IA avec les entreprises</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Entretiens en direct à Luxembourg</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Inscription 100% gratuite</span>
              </li>
            </ul>
            
            <button class="card-btn talent-btn">
              <span>S'inscrire comme Talent</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            
            <div class="card-badge">
              <i class="fa-solid fa-users"></i>
              2 000+ talents attendus
            </div>
          </div>

          <!-- Card Entreprise -->
          <div class="profile-card entreprise-card" @click="goToCorporateRegister">
            <div class="card-icon entreprise-icon">
              <i class="fa-solid fa-building"></i>
            </div>
            
            <h2 class="card-title">Je suis une Entreprise</h2>
            
            <p class="card-description">
              Recrutez les meilleurs talents d'Afrique et de la diaspora pour accélérer votre croissance
            </p>
            
            <ul class="card-features">
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>2 000+ talents présélectionnés</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Matching IA par profil et poste</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Entretiens planifiés sur 2 jours</span>
              </li>
              <li>
                <i class="fa-solid fa-check-circle"></i>
                <span>Accompagnement dédié</span>
              </li>
            </ul>
            
            <button class="card-btn entreprise-btn">
              <span>S'inscrire comme Entreprise</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            
            <div class="card-badge">
              <i class="fa-solid fa-briefcase"></i>
              150+ entreprises participantes
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="info-section">
      <div class="container">
        <div class="info-content">
          <h3 class="info-title">Pourquoi participer au Summit ?</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">
                <i class="fa-solid fa-globe-africa"></i>
              </div>
              <h4>Portée panafricaine</h4>
              <p>Connectez-vous avec des acteurs de 30+ pays africains</p>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <i class="fa-solid fa-brain"></i>
              </div>
              <h4>Matching intelligent</h4>
              <p>Notre IA optimise les rencontres selon vos besoins</p>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <i class="fa-solid fa-handshake"></i>
              </div>
              <h4>Opportunités concrètes</h4>
              <p>Des entretiens qualifiés, pas de simples rencontres</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const router = useRouter()

const goToTalentRegister = () => {
  router.push({ name: 'TalentRegister' })
}

const goToCorporateRegister = () => {
  router.push({ name: 'CorporateRegister' })
}
</script>

<style scoped>
@import '/static/assets/css/main.css';

/* Variables */
:root {
  --navy: #041a57;
  --blue: #3a9bff;
  --orange: #f07c00;
  --light-bg: #f5f7fa;
  --body-text: #6b7280;
  --border: #e0e4ef;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.selection-hero {
  position: relative;
  background: linear-gradient(160deg, #020830 0%, #040a5d 50%, #0d1a8a 100%);
  color: #fff;
  padding: 80px 0 60px;
  text-align: center;
  overflow: hidden;
}

.selection-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg, transparent, transparent 35px,
    rgba(255,255,255,.015) 35px, rgba(255,255,255,.015) 70px
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.event-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(240,124,0,.15);
  border: 1.5px solid rgba(240,124,0,.4);
  color: #f07c00;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: 50px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin: 0 0 16px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
  opacity: .85;
  margin: 0;
  max-width: 680px;
  margin: 0 auto;
}

/* Cards Section */
.cards-section {
  padding: 80px 0;
  background: var(--light-bg);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.profile-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.talent-card {
  --accent-color: #f07c00;
  --accent-light: #ff9500;
}

.entreprise-card {
  --accent-color: #3a9bff;
  --accent-light: #5eb3ff;
}

.profile-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,.15);
  border-color: var(--accent-color);
}

.profile-card:hover::before {
  opacity: 1;
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 24px;
  transition: transform 0.3s ease;
}

.talent-icon {
  background: linear-gradient(135deg, rgba(240,124,0,.15), rgba(240,124,0,.05));
  border: 3px solid rgba(240,124,0,.3);
  color: #f07c00;
}

.entreprise-icon {
  background: linear-gradient(135deg, rgba(58,155,255,.15), rgba(58,155,255,.05));
  border: 3px solid rgba(58,155,255,.3);
  color: #3a9bff;
}

.profile-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-title {
  font-size: 28px;
  font-weight: 900;
  color: var(--navy);
  text-align: center;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-description {
  font-size: 15px;
  color: var(--body-text);
  text-align: center;
  line-height: 1.6;
  margin: 0 0 32px;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.card-features li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  font-size: 15px;
  color: #374151;
}

.card-features i {
  color: #22c55e;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.talent-btn {
  background: linear-gradient(135deg, #f07c00 0%, #ff9500 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(240,124,0,.3);
}

.talent-btn:hover {
  background: linear-gradient(135deg, #d96d00 0%, #e68600 100%);
  box-shadow: 0 6px 24px rgba(240,124,0,.4);
  transform: translateY(-2px);
}

.entreprise-btn {
  background: linear-gradient(135deg, #3a9bff 0%, #5eb3ff 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(58,155,255,.3);
}

.entreprise-btn:hover {
  background: linear-gradient(135deg, #2a8bef 0%, #4ea3ef 100%);
  box-shadow: 0 6px 24px rgba(58,155,255,.4);
  transform: translateY(-2px);
}

.card-badge {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 13px;
  color: var(--body-text);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.card-badge i {
  color: var(--accent-color);
  font-size: 16px;
}

/* Info Section */
.info-section {
  padding: 80px 0;
  background: #fff;
}

.info-content {
  max-width: 1000px;
  margin: 0 auto;
}

.info-title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 900;
  color: var(--navy);
  text-align: center;
  margin: 0 0 48px;
  text-transform: uppercase;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.info-item {
  text-align: center;
}

.info-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(240,124,0,.1), rgba(58,155,255,.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: var(--navy);
}

.info-item h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 8px;
}

.info-item p {
  font-size: 14px;
  color: var(--body-text);
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .selection-hero {
    padding: 60px 0 40px;
  }
  
  .cards-section {
    padding: 60px 0;
  }
  
  .info-section {
    padding: 60px 0;
  }
}

@media (max-width: 600px) {
  .profile-card {
    padding: 32px 24px;
  }
  
  .card-icon {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
  
  .card-title {
    font-size: 22px;
  }
  
  .card-btn {
    font-size: 14px;
    padding: 14px 24px;
  }
}

/* Animation d'entrée */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card {
  animation: fadeInUp 0.6s ease-out;
}

.talent-card {
  animation-delay: 0.1s;
}

.entreprise-card {
  animation-delay: 0.2s;
}
</style>
