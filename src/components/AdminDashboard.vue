<template>
  <!-- Vue d'ensemble -->
  <div v-if="activeTab === 'overview'">
    <!-- Bannière bienvenue -->
    <v-card
      class="mb-6 overflow-hidden"
      color="primary"
      rounded="xl"
      elevation="0"
    >
      <v-card-text class="pa-6">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <div class="text-h5 font-weight-bold text-white mb-1">
              Bienvenue dans l'espace administrateur 👋
            </div>
            <div class="text-body-2" style="color:rgba(255,255,255,0.75)">
              Gérez les utilisateurs, les offres, les candidatures et bien plus.
            </div>
          </div>
          <v-icon size="72" style="color:rgba(255,255,255,0.15)">mdi-shield-crown</v-icon>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats cards avec mini charts -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border 
          class="stat-card-clickable"
          @click="router.push({ name: 'AdminTalents' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h4 font-weight-bold text-primary">
                  {{ totalTalents !== null ? totalTalents : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Talents inscrits</div>
              </div>
              <v-avatar color="primary" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-account-tie-outline</v-icon>
              </v-avatar>
            </div>
            <apexchart
              v-if="talentsSparkline.series[0].data.length"
              type="area"
              height="60"
              :options="talentsSparkline.options"
              :series="talentsSparkline.series"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'AdminEntreprises' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ totalEntreprises !== null ? totalEntreprises : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Entreprises actives</div>
              </div>
              <v-avatar color="success" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-office-building-outline</v-icon>
              </v-avatar>
            </div>
            <apexchart
              v-if="entreprisesSparkline.series[0].data.length"
              type="area"
              height="60"
              :options="entreprisesSparkline.options"
              :series="entreprisesSparkline.series"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'AdminOffres' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h4 font-weight-bold text-warning">
                  {{ totalOffres !== null ? totalOffres : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Offres publiées</div>
              </div>
              <v-avatar color="warning" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-briefcase-outline</v-icon>
              </v-avatar>
            </div>
            <apexchart
              v-if="offresSparkline.series[0].data.length"
              type="area"
              height="60"
              :options="offresSparkline.options"
              :series="offresSparkline.series"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'AdminEvenements' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h4 font-weight-bold text-info">
                  {{ totalEvenements !== null ? totalEvenements : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Événements à venir</div>
              </div>
              <v-avatar color="info" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-calendar-star</v-icon>
              </v-avatar>
            </div>
            <apexchart
              v-if="evenementsSparkline.series[0].data.length"
              type="area"
              height="60"
              :options="evenementsSparkline.options"
              :series="evenementsSparkline.series"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphiques principaux -->
    <v-row class="mb-6" dense>
      <!-- Évolution des inscriptions -->
      <v-col cols="12" lg="8">
        <v-card rounded="xl" elevation="0" border>
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="primary" size="20">mdi-chart-line</v-icon>
            Évolution des inscriptions
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <apexchart
              type="area"
              height="320"
              :options="inscriptionsChart.options"
              :series="inscriptionsChart.series"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Répartition par secteur -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border>
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="success" size="20">mdi-chart-donut</v-icon>
            Secteurs d'activité
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <apexchart
              type="donut"
              height="320"
              :options="secteursChart.options"
              :series="secteursChart.series"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphiques secondaires -->
    <v-row class="mb-6" dense>
      <!-- Offres par type de contrat -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border>
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold d-flex align-center justify-space-between">
            <div>
              <v-icon class="mr-2" color="warning" size="20">mdi-chart-bar</v-icon>
              Offres par type de contrat
            </div>
            <v-chip size="small" color="warning" variant="tonal">
              {{ totalOffres || 0 }} offres
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <apexchart
              type="bar"
              height="280"
              :options="contratsChart.options"
              :series="contratsChart.series"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Candidatures par statut -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border>
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="info" size="20">mdi-chart-pie</v-icon>
            Candidatures par statut
          </v-card-title>
          <v-card-text class="pa-5 pt-2">
            <apexchart
              type="pie"
              height="280"
              :options="candidaturesChart.options"
              :series="candidaturesChart.series"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides + Contenu -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border height="100%">
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="primary" size="20">mdi-lightning-bolt</v-icon>
            Actions rapides
          </v-card-title>
          <v-list lines="two" class="py-0">
            <v-list-item
              v-for="action in quickActions"
              :key="action.title"
              :prepend-icon="action.icon"
              :title="action.title"
              :subtitle="action.subtitle"
              :base-color="action.color"
              rounded="0"
              append-icon="mdi-chevron-right"
              @click="router.push(action.route)"
            >
              <template #prepend>
                <v-avatar :color="action.color" variant="tonal" size="38" rounded="lg" class="mr-3">
                  <v-icon size="18">{{ action.icon }}</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border height="100%">
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="secondary" size="20">mdi-newspaper-variant-outline</v-icon>
            Gestion du contenu
          </v-card-title>
          <v-list lines="two" class="py-0">
            <v-list-item
              v-for="item in contentActions"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :subtitle="item.subtitle"
              rounded="0"
              append-icon="mdi-chevron-right"
              @click="router.push(item.route)"
            >
              <template #prepend>
                <v-avatar :color="item.color" variant="tonal" size="38" rounded="lg" class="mr-3">
                  <v-icon size="18">{{ item.icon }}</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Référentiels -->
    <v-card rounded="xl" elevation="0" border>
      <v-card-title class="pa-5 pb-3 text-body-1 font-weight-semibold">
        <v-icon class="mr-2" color="secondary" size="20">mdi-cog-outline</v-icon>
        Référentiels
        <span class="text-body-2 font-weight-regular text-medium-emphasis ml-2">
          — Données de référence du système
        </span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0">
        <v-row dense>
          <v-col
            v-for="ref in referentiels"
            :key="ref.title"
            cols="6" sm="4" md="3"
          >
            <v-btn
              :prepend-icon="ref.icon"
              :color="ref.color"
              variant="tonal"
              block
              rounded="lg"
              class="justify-start"
              height="44"
              @click="router.push(ref.route)"
            >
              {{ ref.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>

  <!-- Sous-sections admin (CRUD components) -->
  <CategorieEvenementList v-if="activeTab === 'categorie-evenements'" />
  <EvenementList          v-if="activeTab === 'evenements'" />
  <OffreList              v-if="activeTab === 'offres'" />
  <MediaCategoryList      v-if="activeTab === 'media-categories'" />
  <ArticleList            v-if="activeTab === 'articles'" />
  <EntrepriseList         v-if="activeTab === 'entreprises'" />
  <TalentList             v-if="activeTab === 'talents'" />
  <EntretienList          v-if="activeTab === 'entretiens'" />
  <FeedbackList           v-if="activeTab === 'feedbacks'" />
  <ImportCandidats        v-if="activeTab === 'import-candidats'" />
  <SyncCrm               v-if="activeTab === 'sync-crm'" />
  <CandidatureList       v-if="activeTab === 'candidatures'" />
  <ParticipationList     v-if="activeTab === 'evenement-participations'" />
  <JobContractList        v-if="activeTab === 'job-contracts'" />
  <JobModeList            v-if="activeTab === 'job-modes'" />
  <SkillList              v-if="activeTab === 'skills'" />
  <StudyLevelList         v-if="activeTab === 'study-levels'" />
  <ExperienceList         v-if="activeTab === 'experiences'" />
  <LanguageList           v-if="activeTab === 'languages'" />
  <ActivitySectorList     v-if="activeTab === 'activity-sectors'" />
  <LegalPageList          v-if="activeTab === 'legal-pages'" />
  <AdminList              v-if="activeTab === 'admins'" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api.js'
import VueApexCharts from 'vue3-apexcharts'

import CategorieEvenementList from './admin/CategorieEvenementList.vue'
import EvenementList from './admin/EvenementList.vue'
import OffreList from './admin/OffreList.vue'
import MediaCategoryList from './admin/MediaCategoryList.vue'
import ArticleList from './admin/ArticleList.vue'
import JobContractList from './admin/JobContractList.vue'
import JobModeList from './admin/JobModeList.vue'
import SkillList from './admin/SkillList.vue'
import StudyLevelList from './admin/StudyLevelList.vue'
import ExperienceList from './admin/ExperienceList.vue'
import LanguageList from './admin/LanguageList.vue'
import ActivitySectorList from './admin/ActivitySectorList.vue'
import LegalPageList from './admin/LegalPageList.vue'
import EntrepriseList from './admin/EntrepriseList.vue'
import TalentList from './admin/TalentList.vue'
import EntretienList from './admin/EntretienList.vue'
import FeedbackList from './admin/FeedbackList.vue'
import ImportCandidats from './admin/ImportCandidats.vue'
import SyncCrm from './admin/SyncCrm.vue'
import CandidatureList from './admin/CandidatureList.vue'
import ParticipationList from './admin/ParticipationList.vue'
import AdminList from './admin/AdminList.vue'

const router = useRouter()
const route = useRoute()

const activeTab = computed(() => route.path.split('/').pop() || 'overview')

const totalTalents = ref(null)
const totalEntreprises = ref(null)
const totalOffres = ref(null)
const totalEvenements = ref(null)

// ══════════════════════════════════════════════════════════
// SPARKLINES (mini graphiques dans les cards)
// ══════════════════════════════════════════════════════════

const createSparklineOptions = (color) => ({
  chart: {
    type: 'area',
    sparkline: { enabled: true },
    toolbar: { show: false }
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  colors: [color],
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: {
      title: {
        formatter: () => ''
      }
    },
    marker: { show: false }
  }
})

const talentsSparkline = ref({
  series: [{ name: 'Talents', data: [] }],
  options: createSparklineOptions('#2563eb')
})

const entreprisesSparkline = ref({
  series: [{ name: 'Entreprises', data: [] }],
  options: createSparklineOptions('#22c55e')
})

const offresSparkline = ref({
  series: [{ name: 'Offres', data: [] }],
  options: createSparklineOptions('#f59e0b')
})

const evenementsSparkline = ref({
  series: [{ name: 'Événements', data: [] }],
  options: createSparklineOptions('#3b82f6')
})

// ══════════════════════════════════════════════════════════
// GRAPHIQUE PRINCIPAL - Évolution des inscriptions
// ══════════════════════════════════════════════════════════

const inscriptionsChart = ref({
  series: [
    { name: 'Talents', data: [] },
    { name: 'Entreprises', data: [] }
  ],
  options: {
    chart: {
      type: 'area',
      height: 320,
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        markerClick: (event, chartContext, { seriesIndex, dataPointIndex }) => {
          const serieName = chartContext.w.config.series[seriesIndex].name
          console.log('Point cliqué:', serieName)
          if (seriesIndex === 0) {
            router.push({ name: 'AdminTalents' })
          } else {
            router.push({ name: 'AdminEntreprises' })
          }
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#2563eb', '#22c55e'],
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
        formatter: (val) => Math.round(val)
      },
      title: {
        text: 'Nombre d\'inscriptions',
        style: { color: '#64748b', fontSize: '12px', fontWeight: 600 }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#64748b' },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
      x: { show: true },
      y: {
        formatter: (val) => val + ' inscriptions'
      }
    },
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    }
  }
})

// ══════════════════════════════════════════════════════════
// GRAPHIQUE DONUT - Secteurs d'activité
// ══════════════════════════════════════════════════════════

const secteursChart = ref({
  series: [],
  options: {
    chart: {
      type: 'donut',
      height: 320,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const sectorName = config.w.config.labels[config.dataPointIndex]
          console.log('Secteur cliqué:', sectorName)
        }
      }
    },
    labels: [],
    colors: ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
    legend: {
      position: 'bottom',
      labels: { colors: '#64748b' }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', fontWeight: 600 },
      formatter: function (val, opts) {
        const label = opts.w.config.labels[opts.dataPointIndex]
        return label + ': ' + Math.round(val) + '%'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { 
              show: true, 
              fontSize: '14px', 
              color: '#64748b',
              formatter: (val) => val
            },
            value: { 
              show: true, 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#1e293b',
              formatter: (val) => val + ' entreprises'
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#64748b',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return total + ' entreprises'
              }
            }
          }
        }
      }
    },
    tooltip: { 
      theme: 'light',
      y: {
        formatter: (val) => val + ' entreprises'
      }
    }
  }
})

// ══════════════════════════════════════════════════════════
// GRAPHIQUE BAR - Offres par type de contrat
// ══════════════════════════════════════════════════════════

const contratsChart = ref({
  series: [{ name: 'Nombre d\'offres', data: [] }],
  options: {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const contratName = config.w.config.xaxis.categories[config.dataPointIndex]
          console.log('Contrat cliqué:', contratName)
          router.push({ name: 'AdminOffres' })
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
        dataLabels: { position: 'top' },
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { 
        fontSize: '12px', 
        colors: ['#64748b'],
        fontWeight: 600
      },
      formatter: (val) => val + ' offres'
    },
    colors: ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
        rotate: -45,
        rotateAlways: false
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
        formatter: (val) => Math.round(val)
      },
      title: {
        text: 'Nombre d\'offres',
        style: { color: '#64748b', fontSize: '12px', fontWeight: 600 }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    tooltip: { 
      theme: 'light',
      y: {
        formatter: (val) => val + ' offres publiées'
      }
    },
    legend: { show: false }
  }
})

// ══════════════════════════════════════════════════════════
// GRAPHIQUE PIE - Candidatures par statut
// ══════════════════════════════════════════════════════════

const candidaturesChart = ref({
  series: [],
  options: {
    chart: {
      type: 'pie',
      height: 280,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const statut = config.w.config.labels[config.dataPointIndex]
          console.log('Statut cliqué:', statut)
          router.push({ name: 'AdminCandidatures' })
        }
      }
    },
    labels: [],
    colors: ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'],
    legend: {
      position: 'bottom',
      labels: { colors: '#64748b' }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', fontWeight: 600 },
      formatter: function (val, opts) {
        const label = opts.w.config.labels[opts.dataPointIndex]
        return label + '\n' + Math.round(val) + '%'
      }
    },
    tooltip: { 
      theme: 'light',
      y: {
        formatter: (val) => val + ' candidatures'
      }
    }
  }
})

// ══════════════════════════════════════════════════════════
// CHARGEMENT DES DONNÉES
// ══════════════════════════════════════════════════════════

onMounted(async () => {
  try {
    // Charger les stats de base pour les cards
    const [talentsRes, entreprisesRes, offresRes, evenementsRes] = await Promise.all([
      api.get('/admin/talents?page=1&per_page=1'),
      api.get('/admin/entreprises'),
      api.get('/admin/offres?page=1&per_page=1'),
      api.get('/admin/evenements')
    ])

    totalTalents.value = talentsRes.data.total ?? null
    const ents = entreprisesRes.data
    totalEntreprises.value = Array.isArray(ents) ? ents.length : (ents.total ?? null)
    totalOffres.value = offresRes.data.total ?? null
    const evts = evenementsRes.data
    totalEvenements.value = Array.isArray(evts) ? evts.length : (evts.total ?? null)

    // Charger toutes les stats depuis l'endpoint
    const statsRes = await api.get('/admin/dashboard-stats')
    const stats = statsRes.data

    // SPARKLINES (7 derniers jours)
    talentsSparkline.value.series[0].data = stats.sparklines.talents
    entreprisesSparkline.value.series[0].data = stats.sparklines.entreprises
    offresSparkline.value.series[0].data = stats.sparklines.offres
    evenementsSparkline.value.series[0].data = stats.sparklines.evenements

    // ÉVOLUTION DES INSCRIPTIONS (6 mois)
    inscriptionsChart.value.options.xaxis.categories = stats.evolution.months
    inscriptionsChart.value.series[0].data = stats.evolution.talents
    inscriptionsChart.value.series[1].data = stats.evolution.entreprises

    // SECTEURS D'ACTIVITÉ
    if (stats.secteurs && stats.secteurs.length > 0) {
      secteursChart.value.options = {
        ...secteursChart.value.options,
        labels: stats.secteurs.map(s => s.name)
      }
      secteursChart.value.series = stats.secteurs.map(s => s.count)
      console.log('✅ Secteurs chargés:', stats.secteurs.length, 'secteurs')
    }

    // OFFRES PAR TYPE DE CONTRAT
    if (stats.offres_par_contrat && stats.offres_par_contrat.length > 0) {
      contratsChart.value.options = {
        ...contratsChart.value.options,
        xaxis: {
          ...contratsChart.value.options.xaxis,
          categories: stats.offres_par_contrat.map(c => c.name)
        }
      }
      contratsChart.value.series[0].data = stats.offres_par_contrat.map(c => c.count)
      console.log('✅ Contrats chargés:', stats.offres_par_contrat.length, 'types')
    }

    // CANDIDATURES PAR STATUT
    candidaturesChart.value.options = {
      ...candidaturesChart.value.options,
      labels: ['Acceptées', 'En attente', 'Refusées', 'Archivées']
    }
    candidaturesChart.value.series = [
      stats.candidatures_statut.acceptees || 0,
      stats.candidatures_statut.en_attente || 0,
      stats.candidatures_statut.refusees || 0,
      stats.candidatures_statut.archivees || 0
    ]
    console.log('✅ Candidatures chargées:', candidaturesChart.value.series)

    console.log('✅ Dashboard chargé avec succès')

  } catch (e) {
    console.error('❌ Erreur chargement dashboard:', e)
  }
})

const quickActions = [
  {
    title: 'Gérer les talents',
    subtitle: 'Voir et modifier les profils',
    icon: 'mdi-account-tie-outline',
    color: 'primary',
    route: { name: 'AdminTalents' },
  },
  {
    title: 'Gérer les entreprises',
    subtitle: 'Administrer les comptes',
    icon: 'mdi-office-building-outline',
    color: 'success',
    route: { name: 'AdminEntreprises' },
  },
  {
    title: "Offres d'emploi",
    subtitle: 'Gérer les publications',
    icon: 'mdi-briefcase-outline',
    color: 'info',
    route: { name: 'AdminOffres' },
  },
  {
    title: 'Événements',
    subtitle: 'Planifier et organiser',
    icon: 'mdi-calendar-star',
    color: 'warning',
    route: { name: 'AdminEvenements' },
  },
]

const contentActions = [
  {
    title: 'Articles',
    subtitle: 'Gérer les publications',
    icon: 'mdi-file-document-outline',
    color: 'purple',
    route: { name: 'AdminArticles' },
  },
  {
    title: 'Catégories Média',
    subtitle: 'Organiser les contenus',
    icon: 'mdi-folder-multiple-outline',
    color: 'pink',
    route: { name: 'AdminMediaCategories' },
  },
  {
    title: 'Pages légales',
    subtitle: 'CGU, mentions légales',
    icon: 'mdi-file-certificate-outline',
    color: 'teal',
    route: { name: 'AdminLegalPages' },
  },
  {
    title: 'Import candidats',
    subtitle: 'Importer en masse (XLS)',
    icon: 'mdi-upload',
    color: 'cyan',
    route: { name: 'AdminImportCandidats' },
  },
]

const referentiels = [
  { title: 'Contrats', icon: 'mdi-file-sign', color: 'primary', route: { name: 'AdminJobContracts' } },
  { title: 'Modes travail', icon: 'mdi-laptop', color: 'success', route: { name: 'AdminJobModes' } },
  { title: 'Compétences', icon: 'mdi-star-outline', color: 'info', route: { name: 'AdminSkills' } },
  { title: 'Niveaux étude', icon: 'mdi-school-outline', color: 'warning', route: { name: 'AdminStudyLevels' } },
  { title: 'Expériences', icon: 'mdi-clock-outline', color: 'purple', route: { name: 'AdminExperiences' } },
  { title: 'Langues', icon: 'mdi-translate', color: 'pink', route: { name: 'AdminLanguages' } },
  { title: 'Secteurs', icon: 'mdi-sitemap-outline', color: 'teal', route: { name: 'AdminActivitySectors' } },
  { title: 'Catég. événements', icon: 'mdi-tag-multiple-outline', color: 'cyan', route: { name: 'AdminCategorieEvenements' } },
]
</script>

<style scoped>
.stat-card-clickable {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.stat-card-clickable:active {
  transform: translateY(-2px);
}
</style>
