<template>
    <div class="empresas-container">
      <h1>Gestión de Empresas</h1>
      
      <div class="actions">
        <button @click="mostrarFormulario = true" class="btn-add">
          Añadir Empresa
        </button>
      </div>
  
      <div v-if="loading" class="loading-message">
        Cargando empresas...
      </div>
  
      <div v-else>
        <table class="empresas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in empresas" :key="empresa.id">
              <td>{{ empresa.id }}</td>
              <td>{{ empresa.nombre }}</td>
              <td>{{ empresa.direccion }}</td>
              <td>{{ empresa.contacto }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Formulario básico (opcional) -->
      <div v-if="mostrarFormulario" class="form-overlay">
        <div class="form-container">
          <h3>Añadir Nueva Empresa</h3>
          <form @submit.prevent="guardarEmpresa">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevaEmpresa.nombre" required>
            </div>
            <div class="form-group">
              <label>Dirección:</label>
              <input v-model="nuevaEmpresa.direccion">
            </div>
            <div class="form-group">
              <label>Contacto:</label>
              <input v-model="nuevaEmpresa.contacto">
            </div>
            <div class="form-actions">
              <button type="submit">Guardar</button>
              <button type="button" @click="mostrarFormulario = false">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EmpresasView',
    data() {
      return {
        loading: false,
        mostrarFormulario: false,
        empresas: [
          // Datos de ejemplo
          { id: 1, nombre: 'Empresa Ejemplo 1', direccion: 'Calle Principal 123', contacto: 'contacto@empresa1.com' },
          { id: 2, nombre: 'Empresa Ejemplo 2', direccion: 'Avenida Central 456', contacto: 'info@empresa2.com' }
        ],
        nuevaEmpresa: {
          nombre: '',
          direccion: '',
          contacto: ''
        }
      }
    },
    methods: {
      guardarEmpresa() {
        // Simulamos guardar la empresa
        const nuevoId = this.empresas.length + 1;
        this.empresas.push({
          id: nuevoId,
          ...this.nuevaEmpresa
        });
        
        // Limpiamos el formulario
        this.nuevaEmpresa = { nombre: '', direccion: '', contacto: '' };
        this.mostrarFormulario = false;
        
        alert('Empresa guardada correctamente');
      }
    }
  }
  </script>
  
  <style scoped>
  .empresas-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .actions {
    margin: 20px 0;
  }
  
  .btn-add {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .loading-message {
    padding: 20px;
    text-align: center;
    font-style: italic;
    color: #666;
  }
  
  .empresas-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .empresas-table th, .empresas-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  .empresas-table th {
    background-color: #f2f2f2;
  }
  
  .empresas-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  /* Estilos del formulario */
  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .form-actions button {
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .form-actions button[type="submit"] {
    background-color: #42b983;
    color: white;
    border: none;
  }
  </style>