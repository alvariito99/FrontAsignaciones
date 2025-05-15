<template>
  <div class="table-container">
    <h1>Gestión de Asignaciones</h1>

    <div class="table-actions">
      <button 
      @click="abrirFormulario" 
         class="btn-add"
        v-if="user?.role !== 'alumno'"
        >
      <i class="fas fa-plus"></i> Nueva Asignación
</button>
      <div class="search-box">
        <input
          v-model="searchQuery"
          placeholder="Buscar asignaciones..."
          @input="filtrarAsignaciones"
        />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <div v-if="loading" class="loading-message">
      <i class="fas fa-spinner fa-spin"></i> Cargando asignaciones...
    </div>

    <div v-else-if="asignacionesFiltradas.length === 0" class="no-results">
      No se encontraron asignaciones
    </div>

    <div v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th @click="ordenarPor('id')">
              ID <i :class="ordenIcono('id')"></i>
            </th>
            <th @click="ordenarPor('alumno_nombre')">
              Alumno <i :class="ordenIcono('alumno_nombre')"></i>
            </th>
            <th @click="ordenarPor('empresa_nombre')">
              Empresa <i :class="ordenIcono('empresa_nombre')"></i>
            </th>
            <th>Tutor Laboral</th>
            <th>Representante</th>
            <th @click="ordenarPor('curso_academico')">
              Curso <i :class="ordenIcono('curso_academico')"></i>
            </th>
            <th @click="ordenarPor('fecha_asignacion')">
              Fecha <i :class="ordenIcono('fecha_asignacion')"></i>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asignacion in asignacionesPaginadas" :key="asignacion.id">
            <td>{{ asignacion.id }}</td>
            <td>{{ asignacion.alumno_nombre }} {{ asignacion.alumno_apellido }}</td>
            <td>{{ asignacion.empresa_nombre }}</td>
            <td>{{ asignacion.tutor_laboral }}</td>
            <td>{{ asignacion.representante }}</td>
            <td>{{ asignacion.curso_academico }}</td>
            <td>{{ formatFecha(asignacion.fecha_asignacion) }}</td>
            <td class="actions-cell">
  <button @click="verDetalle(asignacion)" class="btn-view">
    <i class="fas fa-eye"></i> Ver
  </button>
  
  <!-- Botón Editar (oculto para alumnos) -->
  <button 
    @click="editarAsignacion(asignacion)" 
    class="btn-edit"
    v-if="user?.role !== 'alumno'" 
  >
    <i class="fas fa-edit"></i> Editar
  </button>
  
  <!-- Botón Eliminar (oculto para alumnos) -->
  <button 
    @click="eliminarAsignacion(asignacion.id)" 
    class="btn-delete"
    v-if="user?.role !== 'alumno'" 
  
  >
    <i class="fas fa-trash"></i> Eliminar
  </button>
</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && asignacionesFiltradas.length > 0" class="pagination">
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

    <!-- Modal de Detalle -->
    <div v-if="mostrarDetalle" class="modal-overlay" @click.self="mostrarDetalle = false">
      <div class="detail-container">
        <div class="detail-container">
          <h3>Detalles de la Asignación</h3>
          <button @click="mostrarDetalle = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="detail-content">
          <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">{{ asignacionDetalle.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Alumno:</span>
            <span class="detail-value">{{ asignacionDetalle.alumno_nombre }} {{ asignacionDetalle.alumno_apellido }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">DNI Alumno:</span>
            <span class="detail-value">{{ asignacionDetalle.alumno?.dni || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Empresa:</span>
            <span class="detail-value">{{ asignacionDetalle.empresa?.nombre || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">CIF Empresa:</span>
            <span class="detail-value">{{ asignacionDetalle.empresa?.cif || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tutor Laboral:</span>
            <span class="detail-value">{{ asignacionDetalle.tutor_laboral || 'N/A' }} ({{ asignacionDetalle.tutor_laboral_nif || 'N/A' }})</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Representante:</span>
            <span class="detail-value">{{ asignacionDetalle.representante || 'N/A' }} ({{ asignacionDetalle.representante_nif || 'N/A' }})</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Curso Académico:</span>
            <span class="detail-value">{{ asignacionDetalle.curso_academico }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha Asignación:</span>
            <span class="detail-value">{{ formatFecha(asignacionDetalle.fecha_asignacion) }}</span>
          </div>
        </div>
        
        <div class="detail-actions">
          <button @click="mostrarDetalle = false" class="btn-close-detail">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Formulario de Asignación -->
    <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cancelarFormulario">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ asignacionSeleccionada.id ? 'Editar Asignación' : 'Nueva Asignación' }}</h3>
          <button @click="cancelarFormulario" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarAsignacion">
          <div class="form-columns">
            <div>
              <div class="form-group">
                <label>Alumno: <span class="required">*</span></label>
                <select v-model="asignacionSeleccionada.alumno_id" required>
                  <option v-for="alumno in alumnos" :value="alumno.id" :key="alumno.id">
                    {{ alumno.nombre }} {{ alumno.apellido }} ({{ alumno.dni }})
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Empresa: <span class="required">*</span></label>
                <select v-model="asignacionSeleccionada.empresa_id" required @change="cargarDatosEmpresa">
                  <option v-for="empresa in empresas" :value="empresa.id" :key="empresa.id">
                    {{ empresa.nombre }} ({{ empresa.cif }})
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Tutor Laboral:</label>
                <input v-model="asignacionSeleccionada.tutor_laboral" disabled />
              </div>
              
              <div class="form-group">
                <label>Representante:</label>
                <input v-model="asignacionSeleccionada.representante" disabled />
              </div>
            </div>
            
            <div>
              <div class="form-group">
                <label>Curso Académico: <span class="required">*</span></label>
                <input v-model="asignacionSeleccionada.curso_academico" required />
              </div>
              
              <div class="form-group">
                <label>Fecha Asignación: <span class="required">*</span></label>
                <input v-model="asignacionSeleccionada.fecha_asignacion" type="date" required />
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cancelarFormulario" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ asignacionSeleccionada.id ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <transition name="fade">
      <div v-if="mostrarNotificacion" class="notification" :class="notificacionTipo">
        {{ notificacionMensaje }}
      </div>
    </transition>
  </div>
</template>

<script>
import asignacionService from '@/services/asignacionService';
import alumnoService from '@/services/alumnoService';
import empresaService from '@/services/empresaService';

export default {
  name: 'AsignacionesView',
  data() {
    return {
      loading: true,
      mostrarFormulario: false,
      mostrarDetalle: false,
      asignacionDetalle: null,
      asignaciones: [],
      asignacionesFiltradas: [],
      alumnos: [],
      empresas: [],
      asignacionSeleccionada: this.getAsignacionVacia(),
      searchQuery: '',
      ordenCampo: 'id',
      ordenDireccion: 'asc',
      paginaActual: 1,
      itemsPorPagina: 10,
      mostrarNotificacion: false,
      notificacionMensaje: '',
      notificacionTipo: 'success',
      user: null // Añadido para almacenar datos del usuario
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.asignacionesFiltradas.length / this.itemsPorPagina);
    },
    asignacionesPaginadas() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.asignacionesFiltradas.slice(inicio, fin);
    }
  },
  created() {
  const userData = localStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData);
    
    // Elimina esta redirección o ajústala
    // if (this.user?.role === 'alumno') {
    //   this.$router.push('/inicio');
    // }
  }
  this.cargarDatos();
},
  methods: {
    async cargarDatos() {
      try {
        this.loading = true;
        const asignacionesResponse = await asignacionService.getAsignaciones();
        this.asignaciones = asignacionesResponse.data;

        // Cargar alumnos y empresas para los selects del formulario
        const alumnosResponse = await alumnoService.getAlumnos();
        this.alumnos = alumnosResponse.data;

        const empresasResponse = await empresaService.getEmpresas();
        this.empresas = empresasResponse.data;

        // Procesar las asignaciones para incluir nombre del alumno y empresa
        this.asignacionesFiltradas = this.asignaciones.map(asignacion => {
          const alumno = this.alumnos.find(a => a.id === asignacion.alumno_id);
          const empresa = this.empresas.find(e => e.id === asignacion.empresa_id);
          return {
            ...asignacion,
            alumno_nombre: alumno ? alumno.nombre : '',
            alumno_apellido: alumno ? alumno.apellido : '',
            empresa_nombre: empresa ? empresa.nombre : '',
            tutor_laboral: empresa ? empresa.tutor_laboral : '',
            representante: empresa ? empresa.representante : '',
          };
        });

        this.mostrarNotificacion = false;
      } catch (error) {
        console.error('Error al cargar datos:', error);
        this.mostrarNotificacionError('Error al cargar los datos');
      } finally {
        this.loading = false;
      }
    },
    
    getAsignacionVacia() {
      return {
        id: null,
        alumno_id: null,
        empresa_id: null,
        curso_academico: '',
        fecha_asignacion: new Date().toISOString().split('T')[0],
        tutor_laboral: '',
        representante: ''
      };
    },
    
    verDetalle(asignacion) {
      this.asignacionDetalle = { ...asignacion };
      this.mostrarDetalle = true;
    },
    
    abrirFormulario() {
      this.asignacionSeleccionada = this.getAsignacionVacia();
      this.mostrarFormulario = true;
    },
    
    editarAsignacion(asignacion) {
      this.asignacionSeleccionada = { 
        ...asignacion,
        alumno_id: parseInt(asignacion.alumno_id),
        empresa_id: parseInt(asignacion.empresa_id)
      };
      this.mostrarFormulario = true;
    },
    
    cancelarFormulario() {
      this.mostrarFormulario = false;
    },
    
    async cargarDatosEmpresa() {
      const empresaId = this.asignacionSeleccionada.empresa_id;
      if (!empresaId) return;
      
      const empresa = this.empresas.find(e => e.id === empresaId);
      if (empresa) {
        this.asignacionSeleccionada.tutor_laboral = empresa.tutor_laboral;
        this.asignacionSeleccionada.representante = empresa.representante;
      }
    },
    
    async guardarAsignacion() {
      try {
        if (this.asignacionSeleccionada.id) {
          await asignacionService.updateAsignacion(
            this.asignacionSeleccionada.id, 
            this.asignacionSeleccionada
          );
          this.mostrarNotificacionExito('Asignación actualizada correctamente');
        } else {
          await asignacionService.createAsignacion(this.asignacionSeleccionada);
          this.mostrarNotificacionExito('Asignación creada correctamente');
        }
        
        this.cargarDatos();
        this.cancelarFormulario();
      } catch (error) {
        console.error('Error al guardar asignación:', error);
        this.mostrarNotificacionError('Error al guardar la asignación');
      }
    },
    
    async eliminarAsignacion(id) {
      if (confirm('¿Estás seguro de eliminar esta asignación?')) {
        try {
          await asignacionService.deleteAsignacion(id);
          this.mostrarNotificacionExito('Asignación eliminada correctamente');
          this.cargarDatos();
        } catch (error) {
          console.error('Error al eliminar asignación:', error);
          this.mostrarNotificacionError('Error al eliminar la asignación');
        }
      }
    },
    
    filtrarAsignaciones() {
  const query = this.searchQuery.toLowerCase();
  
  // Primero aplica el filtro a los datos originales
  const resultadosFiltrados = this.asignaciones.filter(asignacion => {
    // Reconstruye los datos combinados para cada asignación
    const alumno = this.alumnos.find(a => a.id === asignacion.alumno_id);
    const empresa = this.empresas.find(e => e.id === asignacion.empresa_id);
    
    const alumnoNombre = alumno ? `${alumno.nombre} ${alumno.apellido}`.toLowerCase() : '';
    const empresaNombre = empresa ? empresa.nombre.toLowerCase() : '';
    const tutorLaboral = empresa ? empresa.tutor_laboral.toLowerCase() : '';
    const representante = empresa ? empresa.representante.toLowerCase() : '';
    const cursoAcademico = asignacion.curso_academico ? asignacion.curso_academico.toLowerCase() : '';

    return (
      alumnoNombre.includes(query) ||
      empresaNombre.includes(query) ||
      tutorLaboral.includes(query) ||
      representante.includes(query) ||
      cursoAcademico.includes(query)
    );
  });
  this.asignacionesFiltradas = resultadosFiltrados.map(asignacion => {
    const alumno = this.alumnos.find(a => a.id === asignacion.alumno_id);
    const empresa = this.empresas.find(e => e.id === asignacion.empresa_id);
    
    return {
      ...asignacion,
      alumno_nombre: alumno ? alumno.nombre : '',
      alumno_apellido: alumno ? alumno.apellido : '',
      empresa_nombre: empresa ? empresa.nombre : '',
      tutor_laboral: empresa ? empresa.tutor_laboral : '',
      representante: empresa ? empresa.representante : ''
    };
  });
      this.paginaActual = 1;
      this.ordenarAsignaciones();
    },
    
    ordenarPor(campo) {
      if (this.ordenCampo === campo) {
        this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
      } else {
        this.ordenCampo = campo;
        this.ordenDireccion = 'asc';
      }
      this.ordenarAsignaciones();
    },
    
    ordenarAsignaciones() {
      this.asignacionesFiltradas.sort((a, b) => {
        let valorA;
        let valorB;

        if (this.ordenCampo === 'alumno_nombre') {
          valorA = `${a.alumno_nombre} ${a.alumno_apellido}`.toLowerCase();
          valorB = `${b.alumno_nombre} ${b.alumno_apellido}`.toLowerCase();
        } else if (this.ordenCampo === 'empresa_nombre') {
          valorA = a.empresa_nombre ? a.empresa_nombre.toLowerCase() : '';
          valorB = b.empresa_nombre ? b.empresa_nombre.toLowerCase() : '';
        } else {
          valorA = a[this.ordenCampo];
          valorB = b[this.ordenCampo];
          if (typeof valorA === 'string') valorA = valorA.toLowerCase();
          if (typeof valorB === 'string') valorB = valorB.toLowerCase();
        }

        if (valorA < valorB) return this.ordenDireccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return this.ordenDireccion === 'asc' ? 1 : -1;
        return 0;
      });
    },
    
    ordenIcono(campo) {
      if (this.ordenCampo !== campo) return 'fas fa-sort';
      return this.ordenDireccion === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    
    formatFecha(fecha) {
      if (!fecha) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', options);
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

<style src="@/assets/css/globalEstilos.css" ></style>