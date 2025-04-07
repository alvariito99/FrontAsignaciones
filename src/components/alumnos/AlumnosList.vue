<template>
    <div>
      <div class="filters mb-4">
        <input v-model="filters.nombre" placeholder="Buscar por nombre" class="mr-2" />
        <input v-model="filters.dni" placeholder="Buscar por DNI" class="mr-2" />
        <button @click="fetchAlumnos" class="btn btn-primary">Buscar</button>
      </div>
  
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Nota Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alumno in alumnos" :key="alumno.id">
            <td>{{ alumno.nombre }}</td>
            <td>{{ alumno.apellido }}</td>
            <td>{{ alumno.dni }}</td>
            <td>{{ alumno.telefono }}</td>
            <td>{{ alumno.email }}</td>
            <td>{{ alumno.nota_curso }}</td>
            <td>
              <button @click="editAlumno(alumno)" class="btn btn-sm btn-info">Editar</button>
              <button @click="deleteAlumno(alumno.id)" class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import alumnoService from '@/services/alumnoService';
  
  export default {
    data() {
      return {
        alumnos: [],
        filters: {
          nombre: '',
          dni: '',
        },
      };
    },
    created() {
      this.fetchAlumnos();
    },
    methods: {
      async fetchAlumnos() {
        try {
          const response = await alumnoService.getAlumnos(this.filters);
          this.alumnos = response.data;
        } catch (error) {
          console.error('Error fetching alumnos:', error);
        }
      },
      editAlumno(alumno) {
        this.$emit('edit', alumno);
      },
      async deleteAlumno(id) {
        if (confirm('¿Estás seguro de eliminar este alumno?')) {
          try {
            await alumnoService.deleteAlumno(id);
            this.fetchAlumnos();
          } catch (error) {
            console.error('Error deleting alumno:', error);
          }
        }
      },
    },
  };
  </script>