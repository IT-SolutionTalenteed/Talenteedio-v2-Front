<template>
  <div>
    <p v-if="error" style="color:red;">{{ error }}</p>
    <p v-else>Connexion en cours...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()
const error  = ref('')

onMounted(() => {
  const token = route.query.token
  const role  = route.query.role
  const err   = route.query.error

  if (err || !token || !role) {
    error.value = 'La connexion avec Google a échoué. Veuillez réessayer.'
    setTimeout(() => router.push('/login'), 3000)
    return
  }

  localStorage.setItem('token', token)
  localStorage.setItem('userRole', role)

  switch (role) {
    case 'admin':      router.push('/admin');      break
    case 'talent':     router.push('/talent');     break
    case 'entreprise': router.push('/entreprise'); break
    default:
      error.value = 'Rôle non reconnu'
      setTimeout(() => router.push('/login'), 2000)
  }
})
</script>
