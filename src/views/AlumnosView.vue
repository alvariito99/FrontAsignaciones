<template>
  <div>

    
     
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Asignaciones</a>
            </li>
          </ul>
        </div>
      </div>
    

  
    
</template>

<script>
import AlumnosList from '@/components/alumnos/AlumnosList.vue';
import AlumnosForm from '@/components/alumnos/AlumnosForm.vue';

export default {
  components: {
    AlumnosList,
    AlumnosForm,
  },
  data() {
    return {
      showForm: false,
      editingAlumno: null,
    };
  },
  methods: {
    handleEdit(alumno) {
      this.editingAlumno = { ...alumno };
      this.showForm = true;
    },
    handleSave() {
      this.showForm = false;
      this.$refs.alumnoList.fetchAlumnos();
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>