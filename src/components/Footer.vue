<template>
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
            <p>{{ t('footer.description') }}</p>
            <div class="footer-socials">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>{{ t('footer.contactUs') }}</h4>
            <div class="contact-item"><i class="fa-solid fa-phone"></i><a href="tel:+3522060162">+3522060162</a></div>
            <div class="contact-item"><i class="fa-solid fa-location-dot"></i><span>57 avenue de la Gare, L-1611 Luxembourg</span></div>
            <div class="contact-item"><i class="fa-solid fa-envelope"></i><a href="mailto:contact@africatalentsummit.com">contact@africatalentsummit.com</a></div>
          </div>
          <div class="footer-col">
            <h4>{{ t('footer.joinUs') }}</h4>
            <ul>
              <li><router-link to="/register"><i class="fa-solid fa-chevron-right"></i> {{ t('footer.becomeTalent') }}</router-link></li>
              <li><router-link to="/login"><i class="fa-solid fa-chevron-right"></i> {{ t('nav.login') }}</router-link></li>
              <li><a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-chevron-right"></i> {{ t('footer.pressMedia') }}</a></li>
              <li><a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-chevron-right"></i> {{ t('footer.partnerships') }}</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>{{ t('footer.legalInfo') }}</h4>
            <ul>
              <li v-for="page in legalPages" :key="page.id">
                <router-link :to="`/legal/${page.slug}`"><i class="fa-solid fa-chevron-right"></i> {{ page.title }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© {{ currentYear }} {{ t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../services/api.js'

const { t } = useI18n()
const legalPages = ref([])
const currentYear = new Date().getFullYear()

onMounted(async () => {
  try {
    const res = await api.get('/legal-pages')
    legalPages.value = res.data
  } catch {
    // silencieux
  }
})
</script>


<style scoped>
.site-footer { position: relative; background: #040a5d; color: rgba(255,255,255,.85); overflow: hidden; }
.footer-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%); opacity: .95; }
.footer-overlay { position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.03" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom; background-size: cover; }
.footer-inner { position: relative; padding: 60px 0 30px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; } }
@media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } }
.footer-brand p { font-size: 14px; line-height: 1.7; margin: 16px 0 20px; opacity: .85; }
.footer-logo img { max-width: 180px; height: auto; }
.footer-socials { display: flex; gap: 10px; }
.footer-socials a { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; transition: background .2s, transform .2s; }
.footer-socials a:hover { background: var(--orange, #f07c00); transform: translateY(-3px); }
.footer-col h4 { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 16px; }
.footer-col ul { list-style: none; margin: 0; padding: 0; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a, .footer-col ul li router-link { font-size: 14px; color: rgba(255,255,255,.75); text-decoration: none; display: flex; align-items: center; gap: 8px; transition: color .2s, padding-left .2s; }
.footer-col ul li a:hover, .footer-col ul li router-link:hover { color: var(--orange, #f07c00); padding-left: 4px; }
.footer-col ul li i { font-size: 10px; }
.contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; }
.contact-item i { color: var(--orange, #f07c00); margin-top: 2px; width: 16px; flex-shrink: 0; }
.contact-item a { color: rgba(255,255,255,.75); text-decoration: none; transition: color .2s; }
.contact-item a:hover { color: var(--orange, #f07c00); }
.footer-bottom { position: relative; border-top: 1px solid rgba(255,255,255,.1); padding: 20px 0; }
.footer-bottom p { font-size: 13px; text-align: center; margin: 0; opacity: .7; }
</style>
