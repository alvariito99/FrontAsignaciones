<template>
  <div class="table-container">
    <h1>Gestión de Alumnos</h1>

    <div class="table-actions">
      <button @click="abrirFormulario" class="btn-add">
        <i class="fas fa-plus"></i> Añadir Alumno
      </button>
      <div class="filter-container">
        <button @click="mostrarFiltros = !mostrarFiltros" class="btn-filter">
          <i class="fas fa-filter"></i> Filtros
        </button>
        <div v-if="mostrarFiltros" class="filters-dropdown">
          <select v-model="filtroNota" @change="aplicarFiltros">
            <option value="">Todas las notas</option>
            <option value="suspensos">Suspensos (menos de 5)</option>
            <option value="suficientes">Suficientes (5-6)</option>
            <option value="notables">Notables (7-8)</option>
            <option value="sobresalientes">Sobresalientes (9-10)</option>
          </select>
        </div>
      </div>

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
      <table class="data-table">
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
          <tr v-for="alumno in alumnosPaginados" :key="alumno.id">
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
    <div v-if="mostrarDetalle" class="modal-overlay" @click.self="mostrarDetalle = false">
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
    <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cancelarFormulario">
      <div class="modal-container">
        <div class="modal-header">
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
          
          <div class="modal-actions">
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

export default {
  name: 'AlumnosView',
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
      notificacionTipo: 'success',
      mostrarFiltros: false,
      filtroNota: ''
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
    this.checkUrlAction();
  },
  methods: {
    aplicarFiltros() {
      let alumnosFiltrados = [...this.alumnos];
      
      // Aplicar filtro de búsqueda si hay query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        alumnosFiltrados = alumnosFiltrados.filter(alumno => 
          alumno.nombre.toLowerCase().includes(query) ||
          alumno.apellido.toLowerCase().includes(query) ||
          alumno.dni.toLowerCase().includes(query) ||
          (alumno.email && alumno.email.toLowerCase().includes(query))
        );
      }
      
      // Aplicar filtro por nota si está seleccionado
      if (this.filtroNota) {
        alumnosFiltrados = alumnosFiltrados.filter(alumno => {
          const nota = parseFloat(alumno.nota_curso);
          
          if (isNaN(nota)) return false;
          
          switch(this.filtroNota) {
            case 'suspensos':
              return nota < 5;
            case 'suficientes':
              return nota >= 5 && nota < 7;
            case 'notables':
              return nota >= 7 && nota < 9;
            case 'sobresalientes':
              return nota >= 9 && nota <= 10;
            default:
              return true;
          }
        });
      }
      
      this.alumnosFiltrados = alumnosFiltrados;
      this.paginaActual = 1;
      this.ordenarAlumnos();
    },
    checkUrlAction() {
      const query = this.$route.query;
      if (query.action === 'add') {
        this.abrirFormulario();
      }
    },

    
    filtrarAlumnos() {
      this.aplicarFiltros();
    },
    
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
    },
    watch: {
    '$route.query'(newQuery) {
      if (newQuery.action === 'add') {
        this.abrirFormulario();
      }
    }
  }
  }
}
</script>

<style src="@/assets/css/globalEstilos.css" scoped></style> 