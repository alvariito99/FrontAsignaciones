<template>
  <div class="alumnos-container">
    <h1>Gestión de Alumnos</h1>

    <div class="actions">
      <button @click="abrirFormulario" class="btn-add">
        <i class="fas fa-plus"></i> Añadir Alumno
      </button>
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="Buscar alumnos..." 
          @input="filtrarAlumnos"
        />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <div v-if="loading" class="loading-message">
      <i class="fas fa-spinner fa-spin"></i> Cargando alumnos...
    </div>

    <div v-else-if="alumnosFiltrados.length === 0" class="no-results">
      No se encontraron alumnos
    </div>

    <div v-else>
      <table class="alumnos-table">
        <thead>
          <tr>
            <th @click="ordenarPor('id')">
              ID <i :class="ordenIcono('id')"></i>
            </th>
            <th @click="ordenarPor('nombre')">
              Nombre <i :class="ordenIcono('nombre')"></i>
            </th>
            <th @click="ordenarPor('apellido')">
              Apellido <i :class="ordenIcono('apellido')"></i>
            </th>
            <th>DNI</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alumno in alumnosFiltrados" :key="alumno.id">
            <td>{{ alumno.id }}</td>
            <td>{{ alumno.nombre }}</td>
            <td>{{ alumno.apellido }}</td>
            <td>{{ alumno.dni }}</td>
            <td>{{ alumno.nota_curso }}</td>
            <td class="actions-cell">
              <button @click="verDetalle(alumno)" class="btn-view">
                <i class="fas fa-eye"></i> Ver
              </button>
              <button @click="editarAlumno(alumno)" class="btn-edit">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button @click="eliminarAlumno(alumno.id)" class="btn-delete">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && alumnosFiltrados.length > 0" class="pagination">
      <button 
        @click="paginaActual--" 
        :disabled="paginaActual === 1"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button 
        @click="paginaActual++" 
        :disabled="paginaActual === totalPaginas"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Modal para ver detalles -->
    <div v-if="mostrarDetalle" class="form-overlay" @click.self="mostrarDetalle = false">
      <div class="detail-container">
        <div class="detail-header">
          <h3>Detalles del Alumno</h3>
          <button @click="mostrarDetalle = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="detail-content">
          <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">{{ alumnoDetalle.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">{{ alumnoDetalle.nombre }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Apellido:</span>
            <span class="detail-value">{{ alumnoDetalle.apellido }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">DNI:</span>
            <span class="detail-value">{{ alumnoDetalle.dni }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Teléfono:</span>
            <span class="detail-value">{{ alumnoDetalle.telefono || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ alumnoDetalle.email || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nota del Curso:</span>
            <span class="detail-value">{{ alumnoDetalle.nota_curso }}</span>
          </div>
        </div>
        
        <div class="detail-actions">
          <button @click="mostrarDetalle = false" class="btn-close-detail">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para añadir/editar alumnos -->
    <div v-if="mostrarFormulario" class="form-overlay" @click.self="cancelarFormulario">
      <div class="form-container">
        <div class="form-header">
          <h3>{{ alumnoSeleccionado.id ? 'Editar Alumno' : 'Añadir Alumno' }}</h3>
          <button @click="cancelarFormulario" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarAlumno">
          <div class="form-columns">
            <!-- Columna 1 -->
            <div>
              <div class="form-group">
                <label>Nombre: <span class="required">*</span></label>
                <input v-model="alumnoSeleccionado.nombre" required />
              </div>
              <div class="form-group">
                <label>Apellido: <span class="required">*</span></label>
                <input v-model="alumnoSeleccionado.apellido" required />
              </div>
              <div class="form-group">
                <label>DNI: <span class="required">*</span></label>
                <input v-model="alumnoSeleccionado.dni" required />
              </div>
            </div>
            
            <!-- Columna 2 -->
            <div>
              <div class="form-group">
                <label>Teléfono:</label>
                <input v-model="alumnoSeleccionado.telefono" />
              </div>
              <div class="form-group">
                <label>Email:</label>
                <input v-model="alumnoSeleccionado.email" type="email" />
              </div>
              <div class="form-group">
                <label>Nota del Curso:</label>
                <input 
                  v-model.number="alumnoSeleccionado.nota_curso" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="10" 
                />
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelarFormulario" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ alumnoSeleccionado.id ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notificaciones -->
    <transition name="fade">
      <div v-if="mostrarNotificacion" class="notification" :class="notificacionTipo">
        {{ notificacionMensaje }}
      </div>
    </transition>
  </div>
</template>

<script>
import alumnoService from '@/services/alumnoService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'AlumnosView',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      loading: true,
      mostrarFormulario: false,
      mostrarDetalle: false,
      alumnoDetalle: null,
      alumnos: [],
      alumnosFiltrados: [],
      alumnoSeleccionado: this.getAlumnoVacio(),
      searchQuery: '',
      ordenCampo: 'id',
      ordenDireccion: 'asc',
      paginaActual: 1,
      itemsPorPagina: 10,
      mostrarNotificacion: false,
      notificacionMensaje: '',
      notificacionTipo: 'success'
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.alumnosFiltrados.length / this.itemsPorPagina);
    },
    alumnosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.alumnosFiltrados.slice(inicio, fin);
    }
  },
  created() {
    this.cargarAlumnos();
  },
  methods: {
    verDetalle(alumno) {
      this.alumnoDetalle = { ...alumno };
      this.mostrarDetalle = true;
    },
    getAlumnoVacio() {
      return {
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        email: '',
        nota_curso: null
      };
    },
    async cargarAlumnos() {
      try {
        this.loading = true;
        const response = await alumnoService.getAlumnos();
        this.alumnos = response.data;
        this.filtrarAlumnos();
        this.mostrarNotificacion = false;
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
        this.mostrarNotificacionError('Error al cargar alumnos');
      } finally {
        this.loading = false;
      }
    },
    filtrarAlumnos() {
      const query = this.searchQuery.toLowerCase();
      this.alumnosFiltrados = this.alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(query) ||
        alumno.apellido.toLowerCase().includes(query) ||
        alumno.dni.toLowerCase().includes(query) ||
        (alumno.email && alumno.email.toLowerCase().includes(query))
      );
      this.paginaActual = 1;
      this.ordenarAlumnos();
    },
    ordenarPor(campo) {
      if (this.ordenCampo === campo) {
        this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
      } else {
        this.ordenCampo = campo;
        this.ordenDireccion = 'asc';
      }
      this.ordenarAlumnos();
    },
    ordenarAlumnos() {
      this.alumnosFiltrados.sort((a, b) => {
        let valorA = a[this.ordenCampo];
        let valorB = b[this.ordenCampo];

        if (typeof valorA === 'string') valorA = valorA.toLowerCase();
        if (typeof valorB === 'string') valorB = valorB.toLowerCase();

        if (valorA < valorB) return this.ordenDireccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return this.ordenDireccion === 'asc' ? 1 : -1;
        return 0;
      });
    },
    ordenIcono(campo) {
      if (this.ordenCampo !== campo) return 'fas fa-sort';
      return this.ordenDireccion === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    abrirFormulario() {
      this.alumnoSeleccionado = this.getAlumnoVacio();
      this.mostrarFormulario = true;
    },
    editarAlumno(alumno) {
      this.alumnoSeleccionado = { ...alumno };
      this.mostrarFormulario = true;
    },
    cancelarFormulario() {
      this.mostrarFormulario = false;
    },
    async eliminarAlumno(id) {
      if (confirm('¿Estás seguro de eliminar este alumno?')) {
        try {
          await alumnoService.deleteAlumno(id);
          this.mostrarNotificacionExito('Alumno eliminado correctamente');
          this.cargarAlumnos();
        } catch (error) {
          console.error('Error al eliminar alumno:', error);
          this.mostrarNotificacionError('Error al eliminar el alumno');
        }
      }
    },
    async guardarAlumno() {
      try {
        if (this.alumnoSeleccionado.id) {
          await alumnoService.updateAlumno(this.alumnoSeleccionado.id, this.alumnoSeleccionado);
          this.mostrarNotificacionExito('Alumno actualizado correctamente');
        } else {
          await alumnoService.createAlumno(this.alumnoSeleccionado);
          this.mostrarNotificacionExito('Alumno creado correctamente');
        }
        this.cargarAlumnos();
        this.cancelarFormulario();
      } catch (error) {
        console.error('Error al guardar alumno:', error);
        this.mostrarNotificacionError('Error al guardar el alumno');
      }
    },
    mostrarNotificacionExito(mensaje) {
      this.notificacionMensaje = mensaje;
      this.notificacionTipo = 'success';
      this.mostrarNotificacion = true;
      setTimeout(() => {
        this.mostrarNotificacion = false;
      }, 3000);
    },
    mostrarNotificacionError(mensaje) {
      this.notificacionMensaje = mensaje;
      this.notificacionTipo = 'error';
      this.mostrarNotificacion = true;
      setTimeout(() => {
        this.mostrarNotificacion = false;
      }, 3000);
    }
  }
}
</script>

<style src="@/assets/css/UsuariosView.css" scoped></style> 