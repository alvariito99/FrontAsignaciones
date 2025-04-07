<template>
    <div class="login-container">
      <div class="title-container">
        <h1>Bienvenido a DualMarisma 🔄🏫</h1>
      </div>
      <div class="form-container">
        <h2>{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div>
            <label for="email">Correo Electrónico:</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>
          <div>
            <label for="password">Contraseña:</label>
            <input id="password" v-model="form.password" type="password" required />
          </div>
          <div v-if="!isLogin">
            <label for="password_confirmation"> Confirmacion de Contraseña:</label>
            <input id="password_confirmation" v-model="form.password_confirmation" type="password" required />
          </div>
          <div v-if="!isLogin">
            <label for="name">Nombre:</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>
          <button type="submit">{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</button>
        </form>
        <p @click="toggleForm">
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import profesorService from '@/services/profesorService';
  
  export default {
    data() {
  return {
    isLogin: true, // Alterna entre login y registro
    form: {
      name: '', // Cambia 'nombre' a 'name'
      email: '',
      password: '',
      password_confirmation: '', // Solo se usa en el registro
    },
  };
},
    methods: {
      async handleSubmit() {
  try {
    if (this.isLogin) {
      const response = await profesorService.login(this.form);
      const userData = response.data;

      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirigir según el rol
      if (userData.rol === 'profesor') {
        this.$router.push('/profesores');
      } else {
        this.$router.push('/alumnos');
      }
    } else {
      await profesorService.register(this.form);
      alert('Registro exitoso');
      this.isLogin = true;
    }
  } catch (error) {
    console.error('Error del backend:', error.response?.data || error.message);
    alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
  }
},
      toggleForm() {
        this.isLogin = !this.isLogin;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Contenedor principal para centrar el formulario */
  .login-container {
    display: flex;
    flex-direction: column; /* Asegura que el título esté arriba del formulario */
    justify-content: center;
    align-items: center;
    height: 100vh; /* Ocupa toda la altura de la ventana */
    width: 100vw; /* Ocupa todo el ancho de la ventana */
    background: linear-gradient(135deg, #007bff, #0056b3); /* Fondo degradado */
    margin: 0; /* Asegúrate de que no haya márgenes */
    padding: 0; /* Asegúrate de que no haya padding */
    box-sizing: border-box; /* Incluye bordes y padding en el tamaño total */
  }
  
  /* Contenedor del título */
  .title-container {
    margin-bottom: 2rem; /* Espacio entre el título y el formulario */
    text-align: center;
  }
  
  .title-container h1 {
    font-size: 2.5rem; /* Tamaño grande para el título */
    color: white;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Sombra para mejor visibilidad */
  }
  
  /* Contenedor del formulario */
  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px; /* Ancho máximo del formulario */
    text-align: center;
  }
  
  /* Título del formulario */
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  /* Estilo de los campos del formulario */
  form div {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  /* Botón */
  button {
    width: 100%;
    padding: 0.7rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  /* Texto para alternar entre login y registro */
  p {
    margin-top: 1rem;
    color: #007bff;
    cursor: pointer;
  }
  
  p:hover {
    text-decoration: underline;
  }
  </style>