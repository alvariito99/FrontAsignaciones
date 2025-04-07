<template>
    <div class="usuarios-container">
      <h1>Gestión de Usuarios</h1>
      <p>Listado de usuarios del sistema</p>
      
      <div v-if="loading" class="loading">
        Cargando usuarios...
      </div>
      
      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.rol }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UsuariosView',
    data() {
      return {
        loading: true,
        usuarios: []
      }
    },
    async created() {
      try {
        // Simulamos una carga de datos (reemplazar con llamada real a tu API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo - reemplazar con tu llamada API real
        this.usuarios = [
          { id: 1, nombre: 'Admin', email: 'admin@dualmarisma.com', rol: 'profesor' },
          { id: 2, nombre: 'Alumno Ejemplo', email: 'alumno@dualmarisma.com', rol: 'alumno' }
        ];
        
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        this.loading = false;
      }
    }
  }
  </script>
  
  <style scoped>
  .usuarios-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .loading {
    padding: 20px;
    text-align: center;
    font-style: italic;
    color: #666;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .table th {
    background-color: #f2f2f2;
  }
  
  .table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  </style>