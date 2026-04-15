<template>
  <div class="corporate-confirm">
    <!-- ══ MINI HERO ══ -->
    <div class="confirm-hero">
      <div class="container">
        <div class="confirm-hero-inner">
          <span class="confirm-event-label">
            <i class="fa-solid fa-building"></i>&nbsp;
            Africa Talent Summit — 5 &amp; 6 Novembre 2026
          </span>
          <p class="confirm-hero-title">
            Accédez aux talents que votre croissance exige
          </p>
        </div>
      </div>
    </div>

    <!-- ══ CONFIRMATION + MOT DE PASSE ══ -->
    <section class="confirm-section">
      <div class="container">
        <div class="confirm-card">

          <div class="confirm-icon">
            <i class="fa-solid fa-handshake"></i>
          </div>

          <h1 class="confirm-title">Merci pour votre inscription !</h1>
          <p class="confirm-subtitle">
            Votre demande de partenariat a bien été enregistrée.<br>
            Finalisez votre inscription en créant votre mot de passe — <strong>nous vous recontacterons dans les meilleurs délais</strong> pour vous présenter les opportunités du Summit.
          </p>

          <hr class="confirm-divider">

          <div class="confirm-note">
            <i class="fa-solid fa-circle-check"></i>
            <span>
              Un e-mail de confirmation vous sera envoyé dès que votre compte sera actif. Notre équipe vous contactera <strong>dans les meilleurs délais</strong> pour un premier échange sans engagement.
            </span>
          </div>

          <div class="confirm-recall-note">
            <i class="fa-solid fa-phone-volume"></i>
            <span>
              Vous pouvez également nous joindre directement au <strong><a href="tel:+3522060162" style="color:var(--blue)">+352 20 60 162</a></strong> ou par e-mail à <strong><a href="mailto:contact@africatalentsummit.com" style="color:var(--blue)">contact@africatalentsummit.com</a></strong>.
            </span>
          </div>

          <div class="confirm-section-label">
            <i class="fa-solid fa-lock"></i>
            Choisissez votre mot de passe
          </div>

          <form @submit.prevent="handleSubmit" novalidate>

            <div class="form-group">
              <label class="form-label">Mot de passe <span class="required">*</span></label>
              <div style="position:relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-input"
                  placeholder="Minimum 8 caractères" 
                  required 
                  minlength="8"
                  style="padding-right:44px"
                  @input="updatePasswordStrength">
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:var(--body-text);font-size:15px"
                  aria-label="Afficher/masquer">
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmer le mot de passe <span class="required">*</span></label>
              <div style="position:relative">
                <input 
                  v-model="passwordConfirmation" 
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  class="form-input" 
                  placeholder="Retapez votre mot de passe" 
                  required
                  style="padding-right:44px">
                <button 
                  type="button" 
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:var(--body-text);font-size:15px"
                  aria-label="Afficher/masquer">
                  <i :class="showPasswordConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Indicateur de force -->
            <div v-if="password" style="margin:-8px 0 20px">
              <div style="height:4px;border-radius:2px;background:var(--border);overflow:hidden">
                <div 
                  :style="{
                    height: '100%',
                    width: strengthLevel.width,
                    background: strengthLevel.color,
                    borderRadius: '2px',
                    transition: 'width .3s, background .3s'
                  }">
                </div>
              </div>
              <p :style="{ fontSize: '12px', color: strengthLevel.color, margin: '4px 0 0' }">
                {{ strengthLevel.text }}
              </p>
            </div>

            <div v-if="error" class="form-error visible">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>{{ error }}</span>
            </div>
            <div v-if="success" class="form-success visible">
              <i class="fa-solid fa-check-circle"></i>
              Compte créé ! Notre équipe vous contactera très prochainement.
            </div>

            <button type="submit" class="btn btn--orange btn--lg btn--block" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner"></span>
              <template v-else-if="success">
                <i class="fa-solid fa-check"></i>
                Inscription finalisée
              </template>
              <template v-else>
                <i class="fa-solid fa-user-check"></i>
                Finaliser mon inscription
              </template>
            </button>

            <p class="form-note">
              En créant un compte, vous acceptez nos
              <a href="/legal/terms-and-conditions">conditions d'utilisation</a> et notre
              <a href="/legal/privacy-policy">politique de confidentialité</a>.
            </p>
          </form>

        </div>
      </div>
    </section>

    <!-- ══ FOOTER MINIMAL ══ -->
    <div class="footer-bottom" style="background:var(--navy)">
      <div class="container">
        <p style="color:rgba(255,255,255,.5);font-size:12px;text-align:center;padding:16px 0">
          © {{ currentYear }}
          Solution Talenteed SARL R.C.S. Luxembourg B 255 801. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CorporateConfirm',
  data() {
    return {
      password: '',
      passwordConfirmation: '',
      showPassword: false,
      showPasswordConfirm: false,
      error: '',
      success: false,
      isSubmitting: false,
      strengthScore: 0
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    strengthLevel() {
      const levels = [
        { width: '20%', color: '#ef4444', text: 'Très faible' },
        { width: '40%', color: '#f97316', text: 'Faible' },
        { width: '60%', color: '#eab308', text: 'Moyen' },
        { width: '80%', color: '#22c55e', text: 'Fort' },
        { width: '100%', color: '#16a34a', text: 'Très fort' }
      ]
      return levels[Math.min(this.strengthScore - 1, 4)] || levels[0]
    }
  },
  methods: {
    updatePasswordStrength() {
      const val = this.password
      
      if (!val) {
        this.strengthScore = 0
        return
      }

      let score = 0
      if (val.length >= 8) score++
      if (val.length >= 12) score++
      if (/[A-Z]/.test(val)) score++
      if (/[0-9]/.test(val)) score++
      if (/[^A-Za-z0-9]/.test(val)) score++

      this.strengthScore = score
    },
    handleSubmit() {
      this.error = ''
      this.success = false

      if (this.password.length < 8) {
        this.error = 'Le mot de passe doit contenir au moins 8 caractères.'
        return
      }

      if (this.password !== this.passwordConfirmation) {
        this.error = 'Les mots de passe ne correspondent pas.'
        return
      }

      this.isSubmitting = true

      // TODO: POST /api/public/ats/corporate/set-password
      setTimeout(() => {
        this.success = true
        this.isSubmitting = false
      }, 1800)
    }
  }
}
</script>

<style scoped>
/* ══ MINI HERO ══ */
.confirm-hero {
  background: linear-gradient(160deg, #020830 0%, #040a5d 60%, #0d1a8a 100%);
  color: #fff;
  padding: 32px 0;
  text-align: center;
}

.confirm-hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.confirm-event-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #f07c00;
}

.confirm-hero-title {
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: .9;
  margin: 0;
}

/* ══ MAIN ══ */
.confirm-section {
  padding: 60px 0 100px;
  background: var(--light-bg);
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.confirm-card {
  background: #fff;
  border-radius: 20px;
  padding: 52px 48px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
}

.confirm-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(240,124,0,.15), rgba(240,124,0,.05));
  border: 2px solid rgba(240,124,0,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: #f07c00;
}

.confirm-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--navy);
  text-align: center;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.confirm-subtitle {
  font-size: 15px;
  color: var(--body-text);
  text-align: center;
  line-height: 1.7;
  margin: 0 0 36px;
}

.confirm-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 0 0 32px;
}

.confirm-section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--body-text);
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.confirm-note {
  background: rgba(240,124,0,.06);
  border: 1px solid rgba(240,124,0,.2);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 28px;
  display: flex;
  gap: 10px;
}

.confirm-note i {
  color: #f07c00;
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.confirm-recall-note {
  background: rgba(25,43,194,.05);
  border: 1px solid rgba(25,43,194,.15);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 28px;
  display: flex;
  gap: 10px;
}

.confirm-recall-note i {
  color: var(--blue);
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 600px) {
  .confirm-card { 
    padding: 32px 20px; 
    border-radius: 0; 
    box-shadow: none; 
  }
  .confirm-section { 
    padding: 0 0 80px; 
  }
}
</style>
