<template>
  <div class="page-wrapper">
    <div class="ev-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="evd-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ t('evenements.detail.loading') }}</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!evenement" class="evd-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>{{ t('evenements.detail.notFound') }}</p>
      <router-link to="/" class="btn btn--blue" style="margin-top:16px;">{{ t('evenements.backHome') }}</router-link>
    </div>

    <template v-else>

      <!-- ══ HERO ══ -->
      <section class="evd-hero" :style="heroStyle">
        <div class="evd-hero-overlay"></div>
        <div class="container">
          <div class="evd-hero-content">
            <span class="label-white" v-if="evenement.categorie">{{ evenement.categorie.titre }}</span>
            <h1 class="evd-hero-title">{{ evenement.titre }}</h1>
            <div class="evd-hero-meta">
              <span v-if="evenement.date_debut">
                <i class="fa-solid fa-calendar"></i>
                {{ formatDateRange(evenement.date_debut, evenement.date_fin) }}
              </span>
              <span v-if="evenement.ville">
                <i class="fa-solid fa-location-dot"></i>
                {{ evenement.ville }}{{ evenement.pays ? ', ' + evenement.pays : '' }}
              </span>
              <span v-if="evenement.heure_debut_journee">
                <i class="fa-solid fa-clock"></i>
                {{ evenement.heure_debut_journee?.substring(0,5) }} – {{ evenement.heure_fin_journee?.substring(0,5) }}
              </span>
            </div>
            <!-- CTA selon rôle -->
            <div class="evd-hero-cta">
              <template v-if="isTalent">
                <button class="btn btn--orange btn--lg" @click="scrollToMatching">
                  <i class="fa-solid fa-wand-magic-sparkles" style="margin-right:6px;"></i>{{ t('evenements.detail.launchMatching') }}
                </button>
              </template>
              <template v-else>
                <button @click="showRegisterModal = true; registerDefaultProfile = 'talent'" class="btn btn--orange btn--lg">
                  <i class="fa-solid fa-user-plus" style="margin-right:6px;"></i>{{ t('evenements.detail.subscribeToParticipate') }}
                </button>
                <button @click="showLoginModal = true" class="btn btn--outline-white btn--lg">
                  {{ t('evenements.detail.login') }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CORPS ══ -->
      <section class="evd-body">
        <div class="container">
          <div class="evd-layout">

            <!-- ── Colonne principale ── -->
            <div class="evd-main">

              <!-- Description -->
              <div v-if="evenement.description" class="evd-block">
                <h2 class="evd-block-title"><i class="fa-solid fa-circle-info"></i> {{ t('evenements.detail.about') }}</h2>
                <div class="evd-description" v-html="evenement.description"></div>
              </div>

              <!-- ══ PARTICIPATION ENTREPRISE ══ -->
              <div v-if="isEntreprise" class="evd-block evd-participation-block">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-handshake"></i> {{ t('evenements.detail.participation') }}
                </h2>

                <div v-if="estParticipant" class="evd-part-status evd-part-status--ok">
                  <i class="fa-solid fa-circle-check"></i>
                  <div>
                    <strong>{{ t('evenements.detail.alreadyParticipating') }}</strong>
                    <p>{{ t('evenements.detail.alreadyParticipatingDesc') }}</p>
                  </div>
                </div>

                <div v-else-if="maDemandeStatut === 'en_attente'" class="evd-part-status evd-part-status--pending">
                  <i class="fa-solid fa-clock"></i>
                  <div>
                    <strong>{{ t('evenements.detail.pendingRequest') }}</strong>
                    <p>{{ t('evenements.detail.pendingRequestDesc') }}</p>
                  </div>
                </div>

                <div v-else-if="maDemandeStatut === 'accepte'" class="evd-part-status evd-part-status--ok">
                  <i class="fa-solid fa-circle-check"></i>
                  <div>
                    <strong>{{ t('evenements.detail.acceptedRequest') }}</strong>
                    <p>{{ t('evenements.detail.acceptedRequestDesc') }}</p>
                  </div>
                </div>

                <div v-else-if="maDemandeStatut === 'refuse'" class="evd-part-status evd-part-status--refused">
                  <i class="fa-solid fa-circle-xmark"></i>
                  <div>
                    <strong>{{ t('evenements.detail.refusedRequest') }}</strong>
                    <p>{{ t('evenements.detail.refusedRequestDesc') }}</p>
                  </div>
                </div>

                <div v-else class="evd-part-cta">
                  <p>{{ t('evenements.detail.noParticipation') }}</p>
                  <button class="btn btn--blue" :disabled="demandeLoading" @click="demanderParticipation">
                    <i class="fa-solid fa-paper-plane" v-if="!demandeLoading"></i>
                    <i class="fa-solid fa-spinner fa-spin" v-else></i>
                    {{ demandeLoading ? t('evenements.detail.sendingRequest') : t('evenements.detail.requestToParticipate') }}
                  </button>
                </div>
              </div>

              <!-- ══ ENTREPRISES PARTICIPANTES ══ -->
              <div class="evd-block" id="entreprises-section">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-building"></i> {{ t('evenements.detail.participatingCompanies') }}
                  <span class="evd-count">{{ evenement.entreprises?.length || 0 }}</span>
                </h2>
                <div v-if="evenement.entreprises?.length" class="evd-companies-grid">
                  <div v-for="ent in evenement.entreprises" :key="ent.id" class="evd-company-card">
                    <div class="evd-company-logo">
                      <img v-if="ent.logo_url" :src="ent.logo_url" :alt="ent.nom" />
                      <span v-else class="evd-company-initial">{{ ent.nom.charAt(0) }}</span>
                    </div>
                    <h3 class="evd-company-name">{{ ent.nom }}</h3>
                    <p v-if="ent.activity_sector" class="evd-company-sector">
                      <i class="fa-solid fa-industry"></i> {{ ent.activity_sector.name }}
                    </p>
                    <p v-if="ent.ville || ent.pays" class="evd-company-loc">
                      <i class="fa-solid fa-location-dot"></i>
                      {{ [ent.ville, ent.pays].filter(Boolean).join(', ') }}
                    </p>
                    <div v-if="ent.offres?.length" class="evd-company-offres">
                      <i class="fa-solid fa-briefcase"></i>
                      {{ ent.offres.length }} {{ ent.offres.length > 1 ? t('evenements.detail.offers') : t('evenements.detail.offer') }}
                    </div>
                    <div class="evd-company-action">
                      <router-link :to="`/entreprises/${ent.id}`" class="btn btn--outline-nav btn--sm">
                        {{ t('evenements.detail.viewProfile') }}
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="evd-empty">
                  <i class="fa-solid fa-building-circle-xmark"></i>
                  <p>{{ t('evenements.detail.noCompanies') }}</p>
                </div>
              </div>

              <div v-if="isTalent" class="evd-block evd-matching-block" id="matching-section">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> {{ t('evenements.detail.matchingTitle') }}
                </h2>
                <p class="evd-matching-intro">{{ t('evenements.detail.matchingIntro') }}</p>

                <div v-if="!matchingResultats" class="evd-matching-form">
                  <!-- Poste recherché -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">{{ t('evenements.detail.jobSought') }} <span class="req">*</span></label>
                    <input v-model="matchingForm.poste_recherche" type="text" class="evd-form-input" :placeholder="t('evenements.detail.jobSoughtPlaceholder')" />
                  </div>

                  <!-- CV upload + extraction auto -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">
                      {{ t('evenements.detail.cvLabel') }}
                      <span v-if="parsingCv" class="evd-parsing-badge">
                        <i class="fa-solid fa-spinner fa-spin"></i> Extraction des compétences…
                      </span>
                      <span v-else-if="cvFile" class="evd-parsed-badge">
                        <i class="fa-solid fa-check"></i> {{ cvFile.name }}
                      </span>
                    </label>
                    <div class="evd-file-input" @click="$refs.cvInput.click()">
                      <i class="fa-solid fa-upload"></i>
                      <span>{{ cvFile ? cvFile.name : t('evenements.detail.cvDropzone') }}</span>
                    </div>
                    <input ref="cvInput" type="file" accept=".pdf,.doc,.docx" @change="onCvChange" style="display:none;" />
                    <small class="evd-form-hint">Le contenu du CV sera analysé pour pré-remplir les compétences.</small>
                  </div>

                  <!-- Compétences (auto-remplies depuis le CV) -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">
                      Compétences *
                      <small style="font-weight:400;color:#6b7280">(pré-rempli depuis votre CV — modifiable)</small>
                    </label>
                    <textarea v-model="matchingForm.competences" class="evd-form-input" rows="2" placeholder="Ex: PHP, Laravel, React, JavaScript…"></textarea>
                    <small v-if="cvParsed && !matchingForm.competences" class="evd-form-hint evd-hint-warn">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                      Aucune compétence extraite du CV — veuillez les saisir manuellement.
                    </small>
                  </div>

                  <!-- Secteur d'activité souhaité -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">Secteur d'activité souhaité</label>
                    <select v-model="matchingForm.secteur_souhaite_id" class="evd-form-select-single">
                      <option :value="null">Peu importe</option>
                      <option v-for="s in activitySectors" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>

                  <!-- Pays souhaités -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">Pays où je souhaite travailler <small style="font-weight:400;color:#6b7280">(laissez vide = flexible)</small></label>
                    <div class="evd-tags" v-if="matchingForm.pays_souhaites.length">
                      <span v-for="p in matchingForm.pays_souhaites" :key="p" class="evd-tag">
                        {{ p }} <button type="button" @click="removeTag('pays_souhaites', p)">×</button>
                      </span>
                    </div>
                    <select class="evd-form-select-single" @change="e => { addTag('pays_souhaites', e.target.value); e.target.value = '' }">
                      <option value="">— Choisir un pays —</option>
                      <option v-for="cn in countryNames.filter(n => !matchingForm.pays_souhaites.includes(n))" :key="cn" :value="cn">{{ cn }}</option>
                    </select>
                  </div>

                  <!-- Villes souhaitées -->
                  <div class="evd-form-row">
                    <label class="evd-form-label">Villes souhaitées <small style="font-weight:400;color:#6b7280">(laissez vide = flexible)</small></label>
                    <div class="evd-tag-input">
                      <div v-if="matchingForm.villes_souhaitees.length" class="evd-tags">
                        <span v-for="v in matchingForm.villes_souhaitees" :key="v" class="evd-tag">
                          {{ v }} <button type="button" @click="removeTag('villes_souhaitees', v)">×</button>
                        </span>
                      </div>
                      <div class="evd-tag-row">
                        <input v-model="villesInput" class="evd-form-input evd-tag-field" placeholder="Ex: Paris, Lyon…" @keydown.enter.prevent="addTag('villes_souhaitees', villesInput)" />
                        <button type="button" class="btn btn--outline-nav btn--sm" @click="addTag('villes_souhaitees', villesInput)">+</button>
                      </div>
                    </div>
                  </div>

                  <div v-if="matchingError" class="evd-error">
                    <i class="fa-solid fa-triangle-exclamation"></i> {{ matchingError }}
                  </div>
                  <button class="btn btn--blue btn--lg evd-matching-btn" :disabled="!matchingForm.poste_recherche || matchingLoading || parsingCv" @click="lancerMatching">
                    <i class="fa-solid fa-wand-magic-sparkles" v-if="!matchingLoading"></i>
                    <i class="fa-solid fa-spinner fa-spin" v-else></i>
                    {{ matchingLoading ? t('evenements.detail.analyzing') : t('evenements.detail.launchMatching') }}
                  </button>
                </div>

                <div v-else class="evd-matching-results">
                  <div class="evd-matching-results-header">
                    <h3>
                      <i class="fa-solid fa-chart-bar"></i>
                      {{ t('evenements.detail.matchingResults') }} —
                      {{ matchingResultats.resultats?.length }}
                      {{ matchingResultats.resultats?.length !== 1 ? t('evenements.detail.companies') : t('evenements.detail.company') }}
                      {{ matchingResultats.resultats?.length !== 1 ? t('evenements.detail.analyzedPlural') : t('evenements.detail.analyzed') }}
                    </h3>
                    <button class="btn btn--outline-nav btn--sm" @click="resetMatching">
                      <i class="fa-solid fa-rotate-left"></i> {{ t('evenements.detail.newMatching') }}
                    </button>
                  </div>
                  <div v-if="matchingResultats.resultats?.length" class="evd-results-list">
                    <div v-for="(r, i) in matchingResultats.resultats" :key="r.entreprise_id" class="evd-result-card">
                      <div class="evd-result-rank" :class="`rank-${i+1}`">
                        {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}` }}
                      </div>
                      <div class="evd-result-info">
                        <h4 class="evd-result-name">{{ r.nom }}</h4>
                        <p class="evd-result-raison">{{ r.raison }}</p>
                        <div v-if="r.ville" class="evd-result-loc">
                          <i class="fa-solid fa-location-dot"></i> {{ r.ville }}
                        </div>
                      </div>
                      <div class="evd-result-score">
                        <div class="evd-score-circle" :class="scoreClass(r.score)">
                          <span class="evd-score-num">{{ r.score }}</span>
                          <span class="evd-score-max">/100</span>
                        </div>
                        <div class="evd-score-bar">
                          <div class="evd-score-fill" :style="{ width: r.score + '%' }" :class="scoreClass(r.score)"></div>
                        </div>
                      </div>
                      <div class="evd-result-cta">
                        <button class="btn btn--blue btn--sm" @click="ouvrirReservationById(r.entreprise_id, r.nom)">
                          <i class="fa-solid fa-calendar-plus"></i> {{ t('evenements.detail.bookAppointment') }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="evd-empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>{{ t('evenements.detail.noResults') }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="evd-block evd-cta-login-block">
                <div class="evd-cta-login-inner">
                  <div class="evd-cta-login-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                  <div>
                    <h3>{{ t('evenements.detail.loginMatchingTitle') }}</h3>
                    <p>{{ t('evenements.detail.loginMatchingDesc') }}</p>
                    <div class="evd-cta-login-btns">
                      <button @click="showLoginModal = true" class="btn btn--blue">{{ t('evenements.detail.loginBtn') }}</button>
                      <button @click="showRegisterModal = true; registerDefaultProfile = 'talent'" class="btn btn--orange">{{ t('evenements.detail.createTalentAccount') }}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="isTalent && mesEntretiens.length" class="evd-block">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-calendar-check"></i> {{ t('evenements.detail.myInterviews') }}
                  <span class="evd-count">{{ mesEntretiens.length }}</span>
                </h2>
                <div class="evd-entretiens-list">
                  <div v-for="ent in mesEntretiens" :key="ent.id" class="evd-entretien-card">
                    <div class="evd-entretien-row">
                      <div class="evd-entretien-logo">
                        <img v-if="ent.entreprise?.logo_url" :src="ent.entreprise.logo_url" :alt="ent.entreprise?.nom" />
                        <span v-else>{{ ent.entreprise?.nom?.charAt(0) || '?' }}</span>
                      </div>
                      <div class="evd-entretien-info">
                        <div class="evd-entretien-company">{{ ent.entreprise?.nom || '—' }}</div>
                        <div class="evd-entretien-datetime">
                          <i class="fa-solid fa-calendar"></i> {{ ent.date }}
                          &nbsp;·&nbsp;
                          <i class="fa-solid fa-clock"></i> {{ ent.heure_debut?.substring(0,5) }}
                        </div>
                      </div>
                      <span :class="['evd-entretien-badge', `status--${ent.statut}`]">
                        {{ ent.statut === 'confirme' ? t('evenements.detail.statusConfirmed') : ent.statut === 'refuse' ? t('evenements.detail.statusRefused') : t('evenements.detail.statusPending') }}
                      </span>
                    </div>

                    <div v-if="getFeedback(ent.id)" class="evd-feedback-display">
                      <div class="evd-feedback-stars">
                        <i v-for="s in 5" :key="s" :class="['fa-star', s <= getFeedback(ent.id).note ? 'fa-solid' : 'fa-regular']"></i>
                        <span class="evd-feedback-note">{{ getFeedback(ent.id).note }}/5</span>
                      </div>
                      <p v-if="getFeedback(ent.id).commentaire" class="evd-feedback-comment">
                        "{{ getFeedback(ent.id).commentaire }}"
                      </p>
                      <button class="evd-feedback-edit-btn" @click="ouvrirFeedback(ent)" :disabled="!isEntretienTermine(ent)" :title="!isEntretienTermine(ent) ? t('evenements.detail.modifyAfterInterview') : ''">
                        <i class="fa-solid fa-pen"></i> {{ t('evenements.detail.editFeedback') }}
                      </button>
                    </div>

                    <div v-else-if="ent.statut === 'confirme' && feedbackOpen !== ent.id" class="evd-feedback-cta">
                      <button class="btn btn--outline-nav btn--sm" @click="ouvrirFeedback(ent)" :disabled="!isEntretienTermine(ent)" :title="!isEntretienTermine(ent) ? t('evenements.detail.availableAfterInterview') : ''">
                        <i class="fa-solid fa-star"></i>
                        {{ isEntretienTermine(ent) ? t('evenements.detail.giveFeedback') : t('evenements.detail.feedbackAfterInterview') }}
                      </button>
                    </div>

                    <div v-if="feedbackOpen === ent.id" class="evd-feedback-form">
                      <div class="evd-stars-input">
                        <button v-for="s in 5" :key="s" :class="['evd-star-btn', { active: s <= feedbackForm.note }]" @click="feedbackForm.note = s" type="button">
                          <i class="fa-solid fa-star"></i>
                        </button>
                        <span class="evd-star-label">{{ feedbackForm.note ? feedbackForm.note + '/5' : t('evenements.detail.chooseRating') }}</span>
                      </div>
                      <textarea v-model="feedbackForm.commentaire" class="evd-feedback-textarea" :placeholder="t('evenements.detail.feedbackPlaceholder')" rows="3"></textarea>
                      <div v-if="feedbackError" class="evd-error" style="margin-bottom:8px;">{{ feedbackError }}</div>
                      <div class="evd-feedback-form-btns">
                        <button class="btn btn--ghost" @click="feedbackOpen = null">{{ t('evenements.detail.cancelFeedback') }}</button>
                        <button class="btn btn--blue btn--sm" :disabled="feedbackSaving" @click="soumettreF(ent)">
                          <i class="fa-solid fa-paper-plane"></i>
                          {{ feedbackSaving ? t('evenements.detail.sendingFeedback') : (getFeedback(ent.id) ? t('evenements.detail.updateFeedback') : t('evenements.detail.sendFeedback')) }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ── Sidebar ── -->
            <aside class="evd-sidebar">

              <!-- Infos événement -->
              <div class="evd-side-card">
                <h3 class="evd-side-title">{{ t('evenements.detail.information') }}</h3>
                <ul class="evd-info-list">
                  <li v-if="evenement.date_debut">
                    <i class="fa-solid fa-calendar-days"></i>
                    <div>
                      <span class="evd-info-label">{{ t('evenements.detail.date') }}</span>
                      <span>{{ formatDateRange(evenement.date_debut, evenement.date_fin) }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.heure_debut_journee">
                    <i class="fa-solid fa-clock"></i>
                    <div>
                      <span class="evd-info-label">{{ t('evenements.detail.schedule') }}</span>
                      <span>{{ evenement.heure_debut_journee?.substring(0,5) }} – {{ evenement.heure_fin_journee?.substring(0,5) }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.ville">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <span class="evd-info-label">{{ t('evenements.detail.location') }}</span>
                      <span>{{ evenement.ville }}{{ evenement.pays ? ', ' + evenement.pays : '' }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.entreprises?.length">
                    <i class="fa-solid fa-building"></i>
                    <div>
                      <span class="evd-info-label">{{ t('evenements.detail.recruiters') }}</span>
                      <span>{{ evenement.entreprises.length }} {{ evenement.entreprises.length > 1 ? t('evenements.detail.enterprises') : t('evenements.detail.enterprise') }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div v-if="evenement.entreprises?.length" class="evd-side-card">
                <h3 class="evd-side-title">{{ t('evenements.detail.recruitersLabel') }}</h3>
                <div class="evd-logos-mini">
                  <template v-for="ent in evenement.entreprises.slice(0, 12)" :key="ent.id">
                    <div class="evd-logo-mini" :title="ent.nom">
                      <img v-if="ent.logo_url" :src="ent.logo_url" :alt="ent.nom" />
                      <span v-else>{{ ent.nom.charAt(0) }}</span>
                    </div>
                  </template>
                  <div v-if="evenement.entreprises.length > 12" class="evd-logo-mini evd-logo-more">
                    +{{ evenement.entreprises.length - 12 }}
                  </div>
                </div>
              </div>

              <div class="evd-side-card evd-side-cta">
                <template v-if="isTalent">
                  <p>{{ t('evenements.detail.readyForMatching') }}</p>
                  <button class="btn btn--blue" style="width:100%;" @click="scrollToMatching">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> {{ t('evenements.detail.launchMatchingBtn') }}
                  </button>
                </template>
                <template v-else>
                  <p>{{ t('evenements.detail.joinCommunity') }}</p>
                  <button @click="showRegisterModal = true; registerDefaultProfile = 'talent'" class="btn btn--orange" style="display:block;text-align:center;width:100%;">
                    {{ t('evenements.detail.subscribeFree') }}
                  </button>
                </template>
              </div>

              <!-- Partage -->
              <ShareCard :text="evenement.titre" />

            </aside>
          </div>
        </div>
      </section>

      <!-- ══ MODAL RÉSERVATION ══ -->
      <div v-if="rdvEntreprise" class="evd-modal-overlay" @click.self="rdvEntreprise = null">
        <div class="evd-modal">

          <!-- Header modal -->
          <div class="evd-modal-header">
            <div class="evd-modal-company">
              <div class="evd-modal-logo">
                <img v-if="rdvEntreprise.logo_url" :src="rdvEntreprise.logo_url" :alt="rdvEntreprise.nom" />
                <span v-else>{{ rdvEntreprise.nom.charAt(0) }}</span>
              </div>
              <div>
                <div class="evd-modal-company-name">{{ rdvEntreprise.nom }}</div>
                <div class="evd-modal-event-name">{{ evenement.titre }}</div>
              </div>
            </div>
            <button class="evd-modal-close" @click="rdvEntreprise = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div v-if="rdvLoading" class="evd-rdv-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ t('evenements.detail.loadingSlots') }}</span>
          </div>

          <div v-else-if="rdvConfirme" class="evd-rdv-confirme">
            <i class="fa-solid fa-circle-check"></i>
            <p>{{ t('evenements.detail.reservationConfirmed') }} <strong>{{ rdvConfirme.date }}</strong> {{ t('evenements.detail.reservationAt') }} <strong>{{ rdvConfirme.heure_debut }}</strong></p>
            <p class="evd-rdv-status">{{ t('evenements.detail.pendingConfirmation') }}</p>
            <button class="btn btn--blue" @click="rdvEntreprise = null">{{ t('evenements.detail.close') }}</button>
          </div>

          <div v-else class="evd-modal-body">
            <div v-if="rdvCreneaux.length" class="evd-creneaux">
              <div v-for="jour in rdvCreneaux" :key="jour.date" class="evd-creneau-jour">
                <div class="evd-creneau-date">
                  <i class="fa-solid fa-calendar-day"></i> {{ formatJour(jour.date) }}
                </div>
                <div class="evd-creneau-slots">
                  <button
                    v-for="slot in jour.slots"
                    :key="slot.heure_debut"
                    :disabled="!slot.disponible"
                    :class="['evd-slot', {
                      'evd-slot--selected': selectedSlot?.heure_debut === slot.heure_debut && selectedDate === jour.date,
                      'evd-slot--pris': !slot.disponible
                    }]"
                    @click="slot.disponible && selectSlot(jour.date, slot)"
                  >
                    {{ slot.heure_debut.substring(0,5) }}
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="evd-rdv-loading">
              <i class="fa-solid fa-calendar-xmark"></i>
              <span>{{ t('evenements.detail.noSlots') }}</span>
            </div>
          </div>

          <div v-if="selectedSlot && !rdvConfirme" class="evd-modal-footer">
            <div class="evd-slot-selected-info">
              <i class="fa-solid fa-clock"></i>
              <span>{{ formatJour(selectedDate) }} · <strong>{{ selectedSlot.heure_debut.substring(0,5) }}</strong></span>
            </div>
            <div v-if="rdvError" class="evd-error">{{ rdvError }}</div>
            <div class="evd-modal-footer-btns">
              <button class="btn btn--ghost" @click="selectedSlot = null">{{ t('evenements.detail.cancel') }}</button>
              <button class="btn btn--blue" @click="confirmerReservation" :disabled="rdvLoading">
                <i class="fa-solid fa-check"></i> {{ t('evenements.detail.confirm') }}
              </button>
            </div>
          </div>

        </div>
      </div>

    </template>

    </div>

    <!-- ══ FOOTER ══ -->
    <Footer />

    <!-- ══ MODALS ══ -->
    <LoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @switch-to-register="handleSwitchToRegister"
    />
    <RegisterModal 
      :show="showRegisterModal" 
      :defaultProfile="registerDefaultProfile"
      @close="showRegisterModal = false; registerDefaultProfile = null"
      @switch-to-login="handleSwitchToLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import ShareCard from './ShareCard.vue'
import LoginModal from './LoginModal.vue'
import RegisterModal from './RegisterModal.vue'
import api from '../services/api.js'
import { useCountries } from '../composables/useCountries.js'
import { useMeta } from '../composables/useMeta'

const { t, locale } = useI18n()
const { setMeta, resetMeta } = useMeta()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route   = useRoute()

// ── Data ──────────────────────────────────────────────────────
const evenement = ref(null)
const loading   = ref(true)

// ── Auth ──────────────────────────────────────────────────────
const isLoggedIn   = ref(!!localStorage.getItem('token'))
const userRole     = ref(localStorage.getItem('userRole') || '')
const isTalent     = computed(() => isLoggedIn.value && userRole.value === 'talent')
const isEntreprise = computed(() => isLoggedIn.value && userRole.value === 'entreprise')

// ── Modals ────────────────────────────────────────────────────
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const registerDefaultProfile = ref(null)

const handleSwitchToRegister = () => {
  showLoginModal.value = false
  registerDefaultProfile.value = null
  showRegisterModal.value = true
}

const handleSwitchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

// ── Matching ──────────────────────────────────────────────────
const matchingForm = ref({
  poste_recherche:     '',
  competences:         '',
  pays_souhaites:      [],
  villes_souhaitees:   [],
  secteur_souhaite_id: null,
})
const matchingLoading      = ref(false)
const matchingError        = ref('')
const matchingResultats    = ref(null)
const matchingEntrepriseId = ref(null)
const cvFile               = ref(null)
const cvPath               = ref(null)
const parsingCv            = ref(false)
const cvParsed             = ref(false)   // true quand parsing terminé (succès ou échec)
const activitySectors      = ref([])
const villesInput          = ref('')
const countryNames         = computed(() => useCountries('fr').map(c => c.name))

// ── Réservation ───────────────────────────────────────────────
const rdvEntreprise = ref(null)
const rdvLoading    = ref(false)
const rdvCreneaux   = ref([])
const rdvError      = ref('')
const rdvConfirme   = ref(null)
const selectedDate  = ref(null)
const selectedSlot  = ref(null)

// ── Participation entreprise ───────────────────────────────────
const maDemandeStatut  = ref(null)   // null | 'en_attente' | 'accepte' | 'refuse'
const demandeLoading   = ref(false)
const demandeEnvoye    = ref(false)
const estParticipant   = computed(() =>
  isEntreprise.value &&
  evenement.value?.entreprises?.some(e => e.user_id === parseInt(localStorage.getItem('userId') || '0'))
)

const loadMaDemande = async () => {
  if (!isEntreprise.value || !evenement.value) return
  try {
    const res = await api.get('/entreprise/mes-demandes')
    const demandes = Array.isArray(res.data) ? res.data : []
    const d = demandes.find(d => d.evenement_id === evenement.value.id)
    maDemandeStatut.value = d?.statut ?? null
  } catch {}
}

const demanderParticipation = async () => {
  demandeLoading.value = true
  try {
    await api.post(`/entreprise/evenements/${evenement.value.id}/demande`, {})
    maDemandeStatut.value = 'en_attente'
    demandeEnvoye.value   = true
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la demande.')
  } finally {
    demandeLoading.value = false
  }
}

// ── Mes entretiens + feedbacks (talent) ───────────────────────
const mesEntretiens  = ref([])
const mesFeedbacks   = ref([])   // { entretien_id, note, commentaire, id }
const feedbackOpen   = ref(null) // entretien.id dont le formulaire est ouvert
const feedbackForm   = ref({ note: 0, commentaire: '' })
const feedbackSaving = ref(false)
const feedbackError  = ref('')

const loadMesEntretiens = async () => {
  if (!isTalent.value || !evenement.value) return
  try {
    const [entRes, fbRes] = await Promise.all([
      api.get('/talent/mes-entretiens'),
      api.get('/talent/mes-feedbacks'),
    ])
    const allEnt = Array.isArray(entRes.data) ? entRes.data : (entRes.data.data || [])
    mesEntretiens.value = allEnt.filter(e => e.evenement_id === evenement.value.id)
    const allFb = Array.isArray(fbRes.data) ? fbRes.data : (fbRes.data.data || [])
    // Garder uniquement les feedbacks liés à cet événement
    mesFeedbacks.value = allFb.filter(f => f.entretien?.evenement_id === evenement.value.id)
  } catch {}
}

const getFeedback = (entretienId) => mesFeedbacks.value.find(f => f.entretien_id === entretienId)

// Vérifier si l'entretien est terminé (date + heure passées)
const isEntretienTermine = (entretien) => {
  if (!entretien.date || !entretien.heure_fin) return false
  const entretienDateTime = new Date(`${entretien.date}T${entretien.heure_fin}`)
  return entretienDateTime < new Date()
}

const ouvrirFeedback = (entretien) => {
  const existing = getFeedback(entretien.id)
  feedbackForm.value = { note: existing?.note || 0, commentaire: existing?.commentaire || '' }
  feedbackError.value = ''
  feedbackOpen.value = entretien.id
}

const soumettreF = async (entretien) => {
  if (!feedbackForm.value.note) { feedbackError.value = t('evenements.detail.feedbackRequired'); return }
  feedbackSaving.value = true
  feedbackError.value  = ''
  try {
    const existing = getFeedback(entretien.id)
    if (existing) {
      await api.put(`/talent/feedbacks/${existing.id}`, feedbackForm.value)
    } else {
      await api.post(`/talent/entretiens/${entretien.id}/feedback`, feedbackForm.value)
    }
    await loadMesEntretiens()
    feedbackOpen.value = null
  } catch (e) {
    feedbackError.value = e.response?.data?.message || 'Erreur lors de la soumission.'
  } finally {
    feedbackSaving.value = false
  }
}

// ── Computed style héro ───────────────────────────────────────
const heroStyle = computed(() => {
  if (evenement.value?.image_mise_en_avant_url) {
    return { backgroundImage: `url('${evenement.value.image_mise_en_avant_url}')` }
  }
  return {}
})

// ── Chargement événement ──────────────────────────────────────
const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/evenements/${route.params.id}`)
    evenement.value = res.data
    
    // Mettre à jour les meta tags pour le partage
    if (evenement.value) {
      const evt = evenement.value
      const description = evt.description 
        ? evt.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : `Événement : ${evt.titre} - ${evt.date_debut ? new Date(evt.date_debut).toLocaleDateString('fr-FR') : ''}`
      
      setMeta({
        title: evt.titre,
        description: description,
        image: evt.image_url || 'https://talenteed.io/favicon.png',
        url: window.location.href,
        type: 'article'
      })
    }
  } catch {
    evenement.value = null
  } finally {
    loading.value = false
  }
}

// ── Chargement secteurs d'activité ───────────────────────────
const loadActivitySectors = async () => {
  try {
    const res = await api.get('/activity-sectors')
    activitySectors.value = res.data
  } catch {}
}

// ── CV upload + extraction compétences ───────────────────────
const onCvChange = async (e) => {
  const file = e.target.files?.[0] ?? null
  cvFile.value = file
  cvPath.value = null
  cvParsed.value = false
  if (!file) return
  parsingCv.value = true
  try {
    const fd = new FormData()
    fd.append('cv', file)
    const res = await api.post('/talent/cv/parse', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    cvPath.value = res.data.cv_path ?? null
    if (res.data.competences?.length) {
      matchingForm.value.competences = res.data.competences.join(', ')
    }
  } catch {
    // silencieux — le talent peut saisir manuellement
  } finally {
    parsingCv.value = false
    cvParsed.value = true
  }
}

// ── Tag helpers (pays / villes) ───────────────────────────────
const addTag = (field, val) => {
  const v = (val ?? '').trim()
  if (!v || matchingForm.value[field].includes(v)) return
  matchingForm.value[field] = [...matchingForm.value[field], v]
  if (field === 'villes_souhaitees') villesInput.value = ''
}
const removeTag = (field, val) => {
  matchingForm.value[field] = matchingForm.value[field].filter(x => x !== val)
}

// ── Matching ──────────────────────────────────────────────────
const lancerMatching = async () => {
  if (!matchingForm.value.poste_recherche) return
  matchingLoading.value = true
  matchingError.value   = ''
  try {
    const fd = new FormData()
    fd.append('poste_recherche', matchingForm.value.poste_recherche)
    if (matchingForm.value.competences) fd.append('competences', matchingForm.value.competences)
    if (cvPath.value) {
      fd.append('cv_path', cvPath.value)
    } else if (cvFile.value) {
      fd.append('cv', cvFile.value)
    }
    matchingForm.value.pays_souhaites.forEach(p => fd.append('pays_souhaites[]', p))
    matchingForm.value.villes_souhaitees.forEach(v => fd.append('villes_souhaitees[]', v))
    if (matchingForm.value.secteur_souhaite_id) fd.append('secteur_souhaite_id', matchingForm.value.secteur_souhaite_id)

    const res = await api.post(`/talent/evenements/${evenement.value.id}/matching`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    matchingResultats.value = res.data
  } catch (e) {
    matchingError.value = e.response?.data?.message || 'Erreur lors du matching. Vérifiez la clé OpenAI.'
  } finally {
    matchingLoading.value = false
  }
}

const resetMatching = () => {
  matchingResultats.value = null
  matchingForm.value = { poste_recherche: '', competences: '', pays_souhaites: [], villes_souhaitees: [], secteur_souhaite_id: null }
  cvFile.value = null
  cvPath.value = null
  cvParsed.value = false
  matchingError.value = ''
}

// ── Réservation ───────────────────────────────────────────────
const ouvrirReservation = async (entreprise) => {
  rdvEntreprise.value = entreprise
  rdvLoading.value    = true
  rdvCreneaux.value   = []
  rdvConfirme.value   = null
  selectedSlot.value  = null
  selectedDate.value  = null
  rdvError.value      = ''

  try {
    const res = await api.get(`/talent/evenements/${evenement.value.id}/creneaux`, {
      params: { entreprise_id: entreprise.id }
    })
    rdvCreneaux.value = res.data
  } catch {
    rdvError.value = 'Impossible de charger les créneaux.'
  } finally {
    rdvLoading.value = false
  }
}

const ouvrirReservationById = (entrepriseId, entrepriseNom) => {
  const ent = evenement.value?.entreprises?.find(e => e.id === entrepriseId)
  if (ent) ouvrirReservation(ent)
  else ouvrirReservation({ id: entrepriseId, nom: entrepriseNom })
}

const selectSlot = (date, slot) => {
  selectedDate.value = date
  selectedSlot.value = slot
  rdvError.value = ''
}

const confirmerReservation = async () => {
  rdvLoading.value = true
  rdvError.value   = ''
  try {
    const res = await api.post(`/talent/evenements/${evenement.value.id}/reserver`, {
      entreprise_id: rdvEntreprise.value.id,
      date:          selectedDate.value,
      heure_debut:   selectedSlot.value.heure_debut,
    })
    rdvConfirme.value = res.data
    await loadMesEntretiens()
  } catch (e) {
    rdvError.value = e.response?.data?.message || 'Erreur lors de la réservation.'
  } finally {
    rdvLoading.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────
const scrollToMatching = () => {
  document.getElementById('matching-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatDateRange = (debut, fin) => {
  const fmt = (s) => {
    const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
    return new Date(s).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
  }
  if (!debut) return ''
  if (!fin || debut === fin) return fmt(debut)
  return `${fmt(debut)} – ${fmt(fin)}`
}

const formatJour = (dateStr) => {
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(dateStr).toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' })
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

const scoreClass = (score) => {
  if (score >= 75) return 'score--high'
  if (score >= 50) return 'score--mid'
  return 'score--low'
}

// Watcher pour recharger quand l'ID change
watch(() => route.params.id, () => {
  if (route.params.id) {
    load().then(() => {
      if (isTalent.value) {
        loadActivitySectors()
        loadMesEntretiens()
      }
      if (isEntreprise.value) {
        loadMaDemande()
      }
    })
  }
})

onMounted(async () => {
  await load()
  if (isTalent.value) {
    loadActivitySectors()
    loadMesEntretiens()
  }
  if (isEntreprise.value) {
    loadMaDemande()
  }
})

onUnmounted(() => {
  resetMeta()
})
</script>

<style scoped>
.ev-detail-page { min-height: 100vh; background: #fff; }

.evd-loading {
  min-height: 50vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.evd-loading i { font-size: 42px; opacity: .4; }

/* ══ HERO ══ */
.evd-hero {
  position: relative; 
  padding: 0;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  background-size: cover; 
  background-position: center;
  height: 80vh;
  min-height: 500px; 
  display: flex; 
  align-items: center;
}
.evd-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(4,10,93,.4) 0%, rgba(4,10,93,.6) 100%);
}
.evd-hero-content { 
  position: relative; 
  z-index: 1; 
  max-width: 800px; 
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
.evd-hero-title { 
  font-size: 52px; 
  font-weight: 800; 
  color: #fff; 
  margin: 0 0 20px; 
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
@media (max-width: 600px) { .evd-hero-title { font-size: 32px; } }
.evd-hero-meta { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 20px; 
  margin-bottom: 32px; 
}
.evd-hero-meta span { 
  font-size: 16px; 
  color: rgba(255,255,255,.95); 
  display: flex; 
  align-items: center; 
  gap: 8px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}
.evd-hero-meta i { color: var(--orange, #f07c00); }
.evd-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; }

.btn--outline-white {
  border: 2px solid rgba(255,255,255,.5); background: transparent; color: #fff;
  padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700;
  text-decoration: none; cursor: pointer; transition: background .15s, border-color .15s;
  display: inline-flex; align-items: center;
}
.btn--outline-white:hover { background: rgba(255,255,255,.12); border-color: #fff; }

/* ══ CORPS ══ */
.evd-body { padding: 48px 0 80px; }
.evd-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px; align-items: start;
}
@media (max-width: 960px) {
  .evd-layout { grid-template-columns: 1fr; }
  .evd-sidebar { order: 1; }
}

/* Blocs */
.evd-block {
  background: #fff; border-radius: 14px;
  padding: 28px; margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.evd-block-title {
  font-size: 18px; font-weight: 700; color: var(--navy);
  margin: 0 0 20px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.evd-block-title i { color: var(--blue); }
.evd-count {
  font-size: 12px; font-weight: 700; color: #fff;
  background: var(--blue); padding: 2px 9px; border-radius: 50px; margin-left: auto;
}
.evd-description { 
  font-size: 15px; 
  color: var(--navy); 
  line-height: 1.7; 
  margin: 0; 
}
.evd-description p {
  margin: 0 0 16px;
}
.evd-description p:last-child {
  margin-bottom: 0;
}
.evd-description strong {
  font-weight: 700;
  color: var(--navy);
}
.evd-description ul, .evd-description ol {
  margin: 12px 0;
  padding-left: 24px;
}
.evd-description li {
  margin-bottom: 8px;
}
.evd-description h1, .evd-description h2, .evd-description h3 {
  margin: 20px 0 12px;
  color: var(--navy);
}
.evd-description a {
  color: var(--blue);
  text-decoration: underline;
}
.evd-empty { text-align: center; padding: 32px; color: var(--body-text); }
.evd-empty i { font-size: 36px; opacity: .25; margin-bottom: 12px; display: block; }

/* ── Grille entreprises ── */
.evd-companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
.evd-company-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 24px 16px 18px;
  border-radius: 14px;
  border: 1.5px solid var(--border, #e2e8f0);
  background: #fff;
  transition: border-color .2s, box-shadow .2s, transform .2s;
  gap: 8px;
}
.evd-company-card.evd-company-card--selected { border-color: var(--blue); }
.evd-company-card:hover { border-color: var(--blue); box-shadow: 0 6px 20px rgba(0,0,0,.10); transform: translateY(-3px); }

.evd-company-logo {
  width: 72px; height: 72px; border-radius: 12px;
  background: var(--light-bg, #f5f7fa); overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08); margin-bottom: 4px;
}
.evd-company-logo img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.evd-company-initial { font-size: 28px; font-weight: 800; color: var(--blue); }

.evd-company-name   { font-size: 14px; font-weight: 700; color: var(--navy); margin: 0; line-height: 1.3; }
.evd-company-sector { font-size: 11px; color: var(--body-text); margin: 0; display: flex; align-items: center; justify-content: center; gap: 4px; }
.evd-company-sector i { color: var(--blue); font-size: 10px; }
.evd-company-loc    { font-size: 11px; color: var(--body-text); margin: 0; display: flex; align-items: center; justify-content: center; gap: 4px; }
.evd-company-loc i  { color: var(--orange); font-size: 10px; }
.evd-company-offres { font-size: 11px; font-weight: 600; color: var(--navy); display: flex; align-items: center; justify-content: center; gap: 4px; }
.evd-company-offres i { color: var(--orange); }
.evd-company-action { margin-top: auto; padding-top: 8px; }

@media (max-width: 640px) {
  .evd-companies-grid { grid-template-columns: repeat(2, 1fr); }
}

.btn--outline-nav {
  border: 1.5px solid var(--border, #e2e8f0); background: #fff; color: var(--navy);
  padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
  text-decoration: none; cursor: pointer; transition: border-color .15s, color .15s;
  display: inline-flex; align-items: center; gap: 5px;
}
.btn--outline-nav:hover { border-color: var(--blue); color: var(--blue); }

/* Encart hint matching */
.evd-matching-hint {
  margin-top: 24px;
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  padding: 18px 22px;
  background: #eef2ff;
  border: 1.5px solid #c7d2fe;
  border-left: 4px solid #192bc2;
  border-radius: 12px;
}
.evd-matching-hint__icon { font-size: 22px; color: #192bc2; flex-shrink: 0; }
.evd-matching-hint__body { flex: 1; min-width: 0; }
.evd-matching-hint__body strong { display: block; font-size: 14px; font-weight: 700; color: #040a5d; margin-bottom: 3px; }
.evd-matching-hint__body p { font-size: 13px; color: #4b5563; margin: 0; line-height: 1.5; }
.evd-matching-hint__cta {
  display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  padding: 9px 20px; border-radius: 50px;
  background: #192bc2; color: #fff;
  font-size: 13px; font-weight: 700; border: none; cursor: pointer;
  white-space: nowrap; transition: background .15s;
}
.evd-matching-hint__cta:hover { background: #1020a8; }
.evd-matching-hint__cta i { font-size: 12px; }

/* ── Matching ── */
.evd-matching-block { border-top: 3px solid var(--blue); }
.evd-label-ai {
  font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  background: linear-gradient(135deg, #f49f0a, #ffb52e); color: #fff;
  padding: 2px 10px; border-radius: 50px; margin-left: 4px;
}
.evd-matching-intro { font-size: 14px; color: var(--body-text); margin: 0 0 24px; line-height: 1.6; }

.evd-matching-form { display: flex; flex-direction: column; gap: 20px; }
.evd-form-row { display: flex; flex-direction: column; gap: 6px; }
.evd-form-label { font-size: 13px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: .4px; }
.req { color: #ef4444; }
.evd-form-input {
  padding: 11px 14px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 14px; color: var(--navy); outline: none;
  transition: border-color .15s;
}
.evd-form-input:focus { border-color: var(--blue); }
.evd-form-select {
  padding: 8px 12px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 13px; color: var(--navy); outline: none;
  transition: border-color .15s;
}
.evd-form-select:focus { border-color: var(--blue); }
.evd-form-hint { font-size: 12px; color: var(--body-text); }

.evd-file-input {
  padding: 20px; border: 2px dashed var(--border, #e2e8f0);
  border-radius: 10px; text-align: center; cursor: pointer;
  color: var(--body-text); font-size: 13px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: border-color .15s, background .15s;
}
.evd-file-input:hover { border-color: var(--blue); background: rgba(25,43,194,.03); }
.evd-file-input i { font-size: 18px; color: var(--blue); }

.evd-matching-btn { align-self: flex-start; display: flex; align-items: center; gap: 8px; }

.evd-form-select-single {
  width: 100%; padding: 8px 12px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 13px; color: var(--navy); outline: none;
  background: #fff; transition: border-color .15s;
}
.evd-form-select-single:focus { border-color: var(--blue); }

.evd-parsing-badge { margin-left: 8px; font-size: 11px; color: var(--blue); font-weight: 500; }
.evd-parsed-badge  { margin-left: 8px; font-size: 11px; color: #16a34a; font-weight: 500; }
.evd-hint-warn     { color: #d97706; font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 4px; }

.evd-tag-input { display: flex; flex-direction: column; gap: 8px; }
.evd-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.evd-tag {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,111,0,.1); border: 1px solid rgba(255,111,0,.3);
  color: var(--navy); font-size: 12px; padding: 2px 8px; border-radius: 20px;
}
.evd-tag button { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 14px; line-height: 1; padding: 0; }
.evd-tag-row { display: flex; gap: 8px; align-items: center; }
.evd-tag-field { flex: 1; margin: 0; }
.evd-matching-btn:disabled { opacity: .6; cursor: not-allowed; }

.evd-error {
  font-size: 13px; color: #dc2626;
  background: #fee2e2; border-radius: 8px; padding: 10px 14px;
  display: flex; align-items: center; gap: 8px;
}

/* Résultats matching */
.evd-matching-results-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.evd-matching-results-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); margin: 0; display: flex; align-items: center; gap: 8px; }
.evd-matching-results-header h3 i { color: var(--blue); }

.evd-results-list { display: flex; flex-direction: column; gap: 14px; }
.evd-result-card {
  display: grid;
  grid-template-columns: 48px 1fr auto auto;
  gap: 16px; align-items: center;
  padding: 18px 20px; border-radius: 12px;
  border: 1.5px solid var(--border, #e2e8f0);
  background: var(--light-bg, #f5f7fa);
  transition: border-color .2s, box-shadow .2s;
}
.evd-result-card:hover { border-color: var(--blue); box-shadow: 0 4px 14px rgba(0,0,0,.09); background: #fff; }
@media (max-width: 640px) {
  .evd-result-card { grid-template-columns: 40px 1fr; }
  .evd-result-score, .evd-result-cta { grid-column: 2 / -1; }
}

.evd-result-rank { font-size: 24px; text-align: center; flex-shrink: 0; }
.evd-result-name { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 5px; }
.evd-result-raison { font-size: 13px; color: var(--body-text); margin: 0 0 4px; line-height: 1.4; font-style: italic; }
.evd-result-loc { font-size: 12px; color: var(--body-text); display: flex; align-items: center; gap: 5px; margin: 0; }
.evd-result-loc i { color: var(--orange); }

.evd-result-score { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 80px; }
.evd-score-circle {
  display: flex; align-items: baseline; gap: 1px;
  font-weight: 800;
}
.evd-score-num  { font-size: 24px; line-height: 1; }
.evd-score-max  { font-size: 11px; color: var(--body-text); }
.score--high .evd-score-num { color: #16a34a; }
.score--mid  .evd-score-num { color: #d97706; }
.score--low  .evd-score-num { color: #dc2626; }

.evd-score-bar { width: 100%; height: 4px; background: var(--border, #e2e8f0); border-radius: 2px; overflow: hidden; }
.evd-score-fill { height: 100%; border-radius: 2px; transition: width .4s; }
.score--high .evd-score-fill { background: #16a34a; }
.score--mid  .evd-score-fill { background: #d97706; }
.score--low  .evd-score-fill { background: #dc2626; }

/* CTA connexion */
.evd-cta-login-block { background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%); }
.evd-cta-login-inner { display: flex; gap: 24px; align-items: flex-start; }
.evd-cta-login-icon {
  font-size: 36px; color: rgba(255,255,255,.4);
  background: rgba(255,255,255,.12); border-radius: 14px;
  width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.evd-cta-login-inner h3 { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.evd-cta-login-inner p  { font-size: 14px; color: rgba(255,255,255,.8); margin: 0 0 16px; line-height: 1.6; }
.evd-cta-login-btns { display: flex; gap: 10px; flex-wrap: wrap; }
.evd-block-title.evd-cta-login-block { color: #fff !important; }

/* ── Sidebar ── */
.evd-sidebar { 
  display: flex; 
  flex-direction: column; 
  gap: 20px;
  position: sticky;
  top: 90px;
  align-self: flex-start;
}
.evd-side-card {
  background: #fff; border-radius: 14px;
  padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.evd-side-title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 16px; }

.evd-info-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.evd-info-list li { display: flex; align-items: flex-start; gap: 12px; }
.evd-info-list i  { color: var(--blue); font-size: 14px; margin-top: 3px; flex-shrink: 0; }
.evd-info-list div { display: flex; flex-direction: column; gap: 2px; }
.evd-info-label { font-size: 11px; font-weight: 700; color: var(--body-text); text-transform: uppercase; letter-spacing: .4px; }
.evd-info-list span:last-child { font-size: 13px; color: var(--navy); font-weight: 600; }

.evd-logos-mini { display: flex; flex-wrap: wrap; gap: 8px; }
.evd-logo-mini {
  width: 40px; height: 40px; border-radius: 8px; overflow: hidden;
  background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--border, #e2e8f0);
}
.evd-logo-mini img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.evd-logo-mini span { font-size: 14px; font-weight: 800; color: var(--blue); }
.evd-logo-more { font-size: 11px; font-weight: 700; color: var(--body-text); background: var(--border, #e2e8f0); }

.evd-side-cta { background: linear-gradient(135deg, #040a5d, #192bc2); }
.evd-side-cta p { font-size: 14px; color: rgba(255,255,255,.85); margin: 0 0 14px; text-align: center; }
.evd-side-cta .btn--blue { gap: 8px; }

/* ══ MODAL RÉSERVATION ══ */
.evd-modal-overlay {
  position: fixed; inset: 0; background: rgba(4,10,93,.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  backdrop-filter: blur(3px);
}
.evd-modal {
  background: #fff; border-radius: 20px; width: 100%; max-width: 520px;
  max-height: 88vh; display: flex; flex-direction: column;
  box-shadow: 0 24px 64px rgba(0,0,0,.2);
  overflow: hidden;
}

/* Header */
.evd-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #f0f2f8; flex-shrink: 0;
}
.evd-modal-company { display: flex; align-items: center; gap: 12px; }
.evd-modal-logo {
  width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
  background: #f5f7fa; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.evd-modal-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.evd-modal-logo span { font-size: 18px; font-weight: 800; color: var(--blue); }
.evd-modal-company-name { font-size: 15px; font-weight: 700; color: var(--navy); }
.evd-modal-event-name   { font-size: 12px; color: var(--body-text); margin-top: 1px; }
.evd-modal-close {
  background: #f5f7fa; border: none; width: 34px; height: 34px;
  border-radius: 50%; cursor: pointer; font-size: 13px; color: var(--navy);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background .15s;
}
.evd-modal-close:hover { background: #e2e8f0; }

/* Body scrollable */
.evd-modal-body { flex: 1; overflow-y: auto; padding: 20px 24px; }

.evd-rdv-loading {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 40px 24px; color: var(--body-text);
}
.evd-rdv-loading i { font-size: 28px; color: var(--blue); }

/* Créneaux */
.evd-creneaux { display: flex; flex-direction: column; gap: 24px; }
.evd-creneau-jour {}
.evd-creneau-date {
  font-size: 12px; font-weight: 700; color: var(--body-text);
  text-transform: uppercase; letter-spacing: .6px;
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 1px solid #f0f2f8;
}
.evd-creneau-date i { color: var(--blue); }
.evd-creneau-slots {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.evd-slot {
  padding: 8px 0; border-radius: 8px; font-size: 12.5px; font-weight: 600;
  border: 1.5px solid #e2e8f0; background: #f8fafc;
  color: var(--navy); cursor: pointer; transition: all .12s;
  text-align: center;
}
.evd-slot:hover:not(:disabled) { border-color: var(--blue); background: #eef2ff; color: var(--blue); }
.evd-slot--selected { border-color: var(--blue) !important; background: var(--blue) !important; color: #fff !important; }
.evd-slot--pris { opacity: .35; cursor: not-allowed !important; text-decoration: line-through; }

/* Confirmation réussie */
.evd-rdv-confirme { text-align: center; padding: 36px 24px; }
.evd-rdv-confirme i { font-size: 52px; color: #16a34a; margin-bottom: 16px; display: block; }
.evd-rdv-confirme p { font-size: 15px; color: var(--navy); margin: 0 0 8px; }
.evd-rdv-status { font-size: 13px; color: var(--body-text) !important; font-style: italic; }

/* Footer sticky */
.evd-modal-footer {
  border-top: 1px solid #f0f2f8; padding: 16px 24px;
  background: #fafbff; flex-shrink: 0;
}
.evd-slot-selected-info {
  display: flex; align-items: center; gap: 8px;
  font-size: 13.5px; color: var(--navy); margin-bottom: 12px;
}
.evd-slot-selected-info i { color: var(--blue); }
.evd-modal-footer-btns { display: flex; gap: 10px; justify-content: flex-end; }

.btn--ghost {
  background: transparent; border: 1.5px solid #e2e8f0; color: var(--body-text);
  font-size: 13.5px; font-weight: 600; cursor: pointer; padding: 9px 20px;
  border-radius: 50px; transition: background .15s;
}
.btn--ghost:hover { background: #f5f7fa; }

/* ── Participation entreprise ── */
.evd-part-status {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px 18px; border-radius: 10px;
}
.evd-part-status i { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.evd-part-status strong { font-size: 14px; font-weight: 700; display: block; margin-bottom: 4px; }
.evd-part-status p { font-size: 13px; margin: 0; }

.evd-part-status--ok      { background: #dcfce7; color: #15803d; }
.evd-part-status--ok i    { color: #16a34a; }
.evd-part-status--pending { background: #fef9c3; color: #92400e; }
.evd-part-status--pending i { color: #b45309; }
.evd-part-status--refused { background: #fee2e2; color: #991b1b; }
.evd-part-status--refused i { color: #dc2626; }

.evd-part-cta { display: flex; flex-direction: column; gap: 14px; }
.evd-part-cta p { font-size: 14px; color: var(--body-text); margin: 0; line-height: 1.6; }

/* ── Mes entretiens ── */
.evd-entretiens-list { display: flex; flex-direction: column; gap: 12px; }

.evd-entretien-card {
  border-radius: 12px; border: 1px solid #e8edf5;
  background: #f8fafc; overflow: hidden;
}
.evd-entretien-row {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px;
}
.evd-entretien-logo {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  background: #fff; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.evd-entretien-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.evd-entretien-logo span { font-size: 15px; font-weight: 800; color: var(--blue); }
.evd-entretien-info { flex: 1; min-width: 0; }
.evd-entretien-company { font-size: 13px; font-weight: 700; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.evd-entretien-datetime { font-size: 11px; color: var(--body-text); margin-top: 2px; display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }
.evd-entretien-datetime i { color: var(--blue); font-size: 10px; }
.evd-entretien-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 50px; white-space: nowrap; flex-shrink: 0; }
.status--confirme  { background: #dcfce7; color: #16a34a; }
.status--refuse    { background: #fee2e2; color: #dc2626; }
.status--en_attente, .status--pending { background: #fef9c3; color: #b45309; }

/* Feedback affiché */
.evd-feedback-display {
  padding: 10px 14px 12px; border-top: 1px solid #e8edf5;
  background: #fff;
}
.evd-feedback-stars { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.evd-feedback-stars i { font-size: 14px; color: #f59e0b; }
.evd-feedback-note { font-size: 12px; font-weight: 700; color: var(--navy); margin-left: 4px; }
.evd-feedback-comment { font-size: 12px; color: var(--body-text); font-style: italic; margin: 4px 0 8px; line-height: 1.5; }
.evd-feedback-edit-btn {
  background: none; border: none; cursor: pointer; font-size: 11px;
  color: var(--blue); font-weight: 600; padding: 0; display: flex; align-items: center; gap: 4px;
}
.evd-feedback-edit-btn:hover { text-decoration: underline; }

/* Bouton donner feedback */
.evd-feedback-cta { padding: 0 14px 12px; }

/* Formulaire inline */
.evd-feedback-form {
  padding: 12px 14px 14px; border-top: 1px solid #e8edf5;
  background: #fff; display: flex; flex-direction: column; gap: 10px;
}
.evd-stars-input { display: flex; align-items: center; gap: 6px; }
.evd-star-btn {
  background: none; border: none; cursor: pointer; padding: 2px;
  font-size: 22px; color: #d1d5db; transition: color .1s, transform .1s;
}
.evd-star-btn.active, .evd-star-btn:hover { color: #f59e0b; }
.evd-star-btn:hover { transform: scale(1.15); }
.evd-star-label { font-size: 12px; color: var(--body-text); margin-left: 4px; }
.evd-feedback-textarea {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1.5px solid #e2e8f0; font-size: 13px; color: var(--navy);
  resize: vertical; outline: none; font-family: inherit; box-sizing: border-box;
}
.evd-feedback-textarea:focus { border-color: var(--blue); }
.evd-feedback-form-btns { display: flex; gap: 8px; justify-content: flex-end; }
</style>
