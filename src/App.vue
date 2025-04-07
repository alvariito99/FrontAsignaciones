<script setup>
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null); // Almacenará todos los datos del usuario, incluido el rol

// Verificar usuario al cargar la aplicación
onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

// Observar cambios de ruta para actualizar el usuario
router.afterEach(() => {
  const userData = localStorage.getItem('user');
  user.value = userData ? JSON.parse(userData) : null;
});

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('user');
  user.value = null;
  router.push('/login');
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">DualMarisma</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Menú para profesores -->
          <li v-if="user?.rol === 'profesor'" class="nav-item">
            <router-link class="nav-link" to="/profesores/alumnos">Alumnos</router-link>
          </li>
          <li v-if="user?.rol === 'profesor'" class="nav-item">
            <router-link class="nav-link" to="/profesores/empresas">Empresas</router-link>
          </li>
          <li v-if="user" class="nav-item">
            <router-link class="nav-link" to="/asignaciones">Asignaciones</router-link>
          </li>
          <li v-if="user?.rol === 'profesor'" class="nav-item">
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.btn-outline-danger {
  margin-left: 10px;
}
</style>