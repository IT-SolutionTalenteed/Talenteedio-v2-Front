<template>
  <div class="page-wrapper">
    <PublicNav />

    <section class="ato-hero">
      <div class="container">
        <span class="ato-label">Africa Diaspora Skills Index</span>
        <h1 class="ato-title">Africa Talent Observatory</h1>
        <p class="ato-desc">
          Cartographie des compétences des diasporas africaines en Europe, Africa Diaspora Skills Index
        </p>
      </div>
    </section>

    <div class="ato-page">
      <div class="container">
        <div class="ato-form-wrapper">
          <!-- Message de succès -->
          <div v-if="success" class="ato-success">
            {{ successMessage }}
          </div>

          <form v-else @submit.prevent="submitForm" class="ato-form">
            <!-- Prénom -->
            <div class="form-group">
              <label for="prenom">Prénom <span class="required">*</span></label>
              <input
                type="text"
                id="prenom"
                v-model="form.prenom"
                required
              />
              <span v-if="errors.prenom" class="field-error">{{ errors.prenom[0] }}</span>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email <span class="required">*</span></label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
              />
              <span v-if="errors.email" class="field-error">{{ errors.email[0] }}</span>
            </div>

            <!-- Pays de résidence -->
            <div class="form-group">
              <label for="pays_residence">Pays de résidence <span class="required">*</span></label>
              <select id="pays_residence" v-model="form.pays_residence" required>
                <option value="">Sélectionnez un pays</option>
                <option v-for="pays in paysResidence" :key="pays" :value="pays">{{ pays }}</option>
              </select>
              <span v-if="errors.pays_residence" class="field-error">{{ errors.pays_residence[0] }}</span>
            </div>

            <!-- Pays d'origine ou d'attachement -->
            <div class="form-group">
              <label for="pays_origine">Pays d'origine ou d'attachement <span class="required">*</span></label>
              <select id="pays_origine" v-model="form.pays_origine" required>
                <option value="">Sélectionnez un pays</option>
                <option v-for="pays in paysOrigine" :key="pays" :value="pays">{{ pays }}</option>
              </select>
              <span v-if="errors.pays_origine" class="field-error">{{ errors.pays_origine[0] }}</span>
            </div>

            <!-- Secteur d'activité -->
            <div class="form-group">
              <label for="secteur_activite">Secteur d'activité <span class="required">*</span></label>
              <select id="secteur_activite" v-model="form.secteur_activite" required>
                <option value="">Sélectionnez un secteur</option>
                <option v-for="secteur in secteurs" :key="secteur" :value="secteur">{{ secteur }}</option>
              </select>
              <span v-if="errors.secteur_activite" class="field-error">{{ errors.secteur_activite[0] }}</span>
            </div>

            <!-- Lien avec la diaspora -->
            <div class="form-group">
              <label for="lien_diaspora">Lien avec la diaspora <span class="required">*</span></label>
              <select id="lien_diaspora" v-model="form.lien_diaspora" required>
                <option value="">Sélectionnez une option</option>
                <option v-for="lien in liensDiaspora" :key="lien" :value="lien">{{ lien }}</option>
              </select>
              <span v-if="errors.lien_diaspora" class="field-error">{{ errors.lien_diaspora[0] }}</span>
            </div>

            <!-- Consentement traitement des données (obligatoire) -->
            <div class="form-group form-check">
              <label class="check-label">
                <input type="checkbox" v-model="form.consent_data" />
                <span>
                  J'accepte que mes données soient collectées et traitées dans le cadre de
                  l'Africa Talent Observatory. <span class="required">*</span>
                </span>
              </label>
              <span v-if="errors.consent_data" class="field-error">{{ errors.consent_data[0] }}</span>
            </div>

            <!-- Consentement communications (optionnel) -->
            <div class="form-group form-check">
              <label class="check-label">
                <input type="checkbox" v-model="form.consent_communications" />
                <span>
                  J'accepte de recevoir des communications et actualités de la part de Talenteed.
                </span>
              </label>
            </div>

            <div v-if="error" class="ato-error">{{ error }}</div>

            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Envoi en cours...' : 'Rejoindre la communauté' }}
            </button>

            <p class="ato-privacy">
              Vos données sont traitées de manière confidentielle et ne seront jamais
              revendues à des tiers.
            </p>
          </form>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import observatoryService from '../services/observatoryService.js'

const form = ref({
  prenom: '',
  email: '',
  pays_residence: '',
  pays_origine: '',
  secteur_activite: '',
  lien_diaspora: '',
  consent_data: false,
  consent_communications: false,
})

const loading = ref(false)
const error = ref('')
const errors = ref({})
const success = ref(false)
const successMessage = ref('')

// Pays de résidence (Europe principalement)
const paysResidence = [
  'Belgique', 'France', 'Allemagne', 'Pays-Bas', 'Luxembourg', 'Suisse',
  'Royaume-Uni', 'Espagne', 'Italie', 'Portugal', 'Irlande', 'Autriche',
  'Suède', 'Danemark', 'Norvège', 'Finlande', 'Autre',
]

// Pays d'origine ou d'attachement (Afrique)
const paysOrigine = [
  'Algérie', 'Angola', 'Bénin', 'Burkina Faso', 'Burundi', 'Cameroun',
  'Cap-Vert', 'Congo (RDC)', 'Congo (Brazzaville)', "Côte d'Ivoire", 'Égypte',
  'Éthiopie', 'Gabon', 'Ghana', 'Guinée', 'Kenya', 'Madagascar', 'Mali',
  'Maroc', 'Maurice', 'Mauritanie', 'Niger', 'Nigéria', 'Ouganda', 'Rwanda',
  'Sénégal', 'Somalie', 'Soudan', 'Tanzanie', 'Tchad', 'Togo', 'Tunisie',
  'Zambie', 'Zimbabwe', 'Autre',
]

// Secteurs d'activité
const secteurs = [
  'Technologie', 'Ingénierie', 'Finance', 'Santé', 'Éducation', 'Agriculture',
  'Transport', 'Médias', 'Arts & Culture', 'Hôtellerie & Tourisme',
  'Commerce', 'Autre',
]

// Lien avec la diaspora
const liensDiaspora = [
  'Membre de la diaspora',
  'Association',
  'Institution',
  'Partenaire',
  'Autre',
]

const submitForm = async () => {
  loading.value = true
  error.value = ''
  errors.value = {}

  try {
    const { data } = await observatoryService.submit(form.value)
    success.value = true
    successMessage.value = data?.message || 'Merci ! Votre participation a bien été enregistrée.'
  } catch (e) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors || {}
      error.value = 'Veuillez corriger les champs indiqués.'
    } else {
      error.value = e.response?.data?.message || "Une erreur est survenue. Veuillez réessayer."
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.ato-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #fff;
  padding: 5rem 0 4rem;
  text-align: center;
}

.ato-label {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.ato-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0.5rem 0 1rem;
}

.ato-desc {
  max-width: 640px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.6;
  opacity: 0.9;
}

.ato-page {
  flex: 1;
  padding: 3rem 0 4rem;
  background: #f8fafc;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
}

.ato-form-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #1e293b;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
  padding: 0.7rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #0f172a;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
}

.required {
  color: #dc2626;
}

.form-check .check-label {
  flex-direction: row;
  align-items: flex-start;
  gap: 0.6rem;
  font-weight: 400;
  cursor: pointer;
}

.form-check input[type="checkbox"] {
  margin-top: 0.2rem;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.field-error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.35rem;
}

.ato-error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.ato-success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #1e293b;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ato-privacy {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
}

@media (max-width: 600px) {
  .ato-title { font-size: 1.9rem; }
  .ato-form-wrapper { padding: 1.5rem; }
}
</style>
