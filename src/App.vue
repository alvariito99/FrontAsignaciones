<template>
  <nav v-if="user && $route.path !== '/login'" class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/inicio">DualMarisma</router-link> <!-- Cambiado a /inicio -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul v-if="user" class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="user?.role === 'profesor'" class="nav-item">
            <router-link class="nav-link" to="/profesores/alumnos">Alumnos</router-link>
          </li>
          <li v-if="user?.role === 'profesor'" class="nav-item">
            <router-link class="nav-link" to="/profesores/empresas">Empresas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/asignaciones">Asignaciones</router-link>
          </li>
          <li v-if="user?.role === 'profesor'" class="nav-item">
            <router-link class="nav-link" to="/profesores/usuarios">Usuarios</router-link>
          </li>
        </ul>
        <div v-if="user" class="d-flex">
          <button @click="logout" class="btn btn-outline-danger">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>

  <RouterView />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = ref(null)

const checkAuth = () => {
  const userData = localStorage.getItem('user')
  user.value = userData ? JSON.parse(userData) : null
  
  // Si no hay usuario y no estamos en login, redirigir
  if (!user.value && route.path !== '/login') {
    router.push('/login')
  }
}

onMounted(() => {
  checkAuth()
})

// Observar cambios en la ruta
watch(() => route.path, () => {
  checkAuth()
})

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/login')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 15px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.btn-outline-danger {
  margin-left: 10px;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  margin-left: 10px;
}
</style>