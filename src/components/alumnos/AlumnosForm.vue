<template>
    <div>
      <h3>{{ alumno.id ? 'Editar Alumno' : 'Añadir Alumno' }}</h3>
      <form @submit.prevent="saveAlumno">
        <div>
          <label for="nombre">Nombre:</label>
          <input id="nombre" v-model="alumno.nombre" required />
        </div>
        <div>
          <label for="apellido">Apellido:</label>
          <input id="apellido" v-model="alumno.apellido" required />
        </div>
        <div>
          <label for="dni">DNI:</label>
          <input id="dni" v-model="alumno.dni" required />
        </div>
        <div>
          <label for="telefono">Teléfono:</label>
          <input id="telefono" v-model="alumno.telefono" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input id="email" v-model="alumno.email" />
        </div>
        <div>
          <label for="nota_curso">Nota Curso:</label>
          <input id="nota_curso" v-model="alumno.nota_curso" type="number" step="0.01" />
        </div>
        <button type="submit">Guardar</button>
        <button type="button" @click="$emit('cancel')">Cancelar</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      alumno: {
        type: Object,
        default: () => ({
          nombre: '',
          apellido: '',
          dni: '',
          telefono: '',
          email: '',
          nota_curso: null,
        }),
      },
    },
    methods: {
      saveAlumno() {
        this.$emit('save', this.alumno);
      },
    },
  };
  </script>