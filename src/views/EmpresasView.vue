<template>
  <div class="table-container">
    <h1>Gestión de Empresas</h1>

    <div class="table-actions">
      <button @click="abrirFormulario" class="btn-add">
        <i class="fas fa-plus"></i> Añadir Empresa
      </button>
      <button @click="mostrarFiltros = true" class="btn-filter">
        <i class="fas fa-filter"></i> Filtros
      </button>
      <div class="search-box">
        <input
          v-model="searchQuery"
          placeholder="Buscar empresas..."
          @input="filtrarEmpresas"
        />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <div v-if="loading" class="loading-message">
      <i class="fas fa-spinner fa-spin"></i> Cargando empresas...
    </div>

    <div v-else-if="empresasFiltradas.length === 0" class="no-results">
      No se encontraron empresas
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
            <th>Dirección</th>
            <th>Sector</th>
            <th>Plazas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empresa in empresasFiltradas" :key="empresa.id">
            <td>{{ empresa.id }}</td>
            <td>{{ empresa.nombre }}</td>
            <td>{{ empresa.direccion }}</td>
            <td>{{ empresa.sector }}</td>
            <td>{{ empresa.plazas_disponibles }}</td>
            <td class="actions-cell">
              <button @click="verDetalle(empresa)" class="btn-view">
               <i class="fas fa-eye"></i> Ver
              </button>
              <button @click="editarEmpresa(empresa)" class="btn-edit">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button @click="eliminarEmpresa(empresa.id)" class="btn-delete">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && empresasFiltradas.length > 0" class="pagination">
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


<div v-if="mostrarDetalle" class="modal-overlay" @click.self="mostrarDetalle = false">
  <div class="detail-container">
    <div class="detail-container">
      <h3>Detalles de la Empresa</h3>
      <button @click="mostrarDetalle = false" class="btn-close">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="detail-content">
      <div class="detail-row">
        <span class="detail-label">ID:</span>
        <span class="detail-value">{{ empresaDetalle.id }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Nombre:</span>
        <span class="detail-value">{{ empresaDetalle.nombre }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">CIF:</span>
        <span class="detail-value">{{ empresaDetalle.cif }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Sector:</span>
        <span class="detail-value">{{ empresaDetalle.sector }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Dirección:</span>
        <span class="detail-value">{{ empresaDetalle.direccion }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Teléfono:</span>
        <span class="detail-value">{{ empresaDetalle.telefono }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">{{ empresaDetalle.email }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Representante:</span>
        <span class="detail-value">{{ empresaDetalle.representante }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">NIF Representante:</span>
        <span class="detail-value">{{ empresaDetalle.representante_nif }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tutor Laboral:</span>
        <span class="detail-value">{{ empresaDetalle.tutor_laboral }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">NIF Tutor:</span>
        <span class="detail-value">{{ empresaDetalle.tutor_laboral_nif }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Plazas Disponibles:</span>
        <span class="detail-value">{{ empresaDetalle.plazas_disponibles }}</span>
      </div>
    </div>

    <div class="modal-actions">
      <button @click="mostrarDetalle = false" class="btn-close-detail">
        Cerrar
      </button>
    </div>
  </div>
</div>

<div v-if="mostrarFiltros" class="modal-overlay" @click.self="cerrarFiltros">
  <div class="modal-container">
    <div class="modal-header">
      <h3>Filtros Avanzados</h3>
      <button @click="cerrarFiltros" class="btn-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-content">
      <div class="filter-group">
        <label>Sector:</label>
        <select v-model="filtros.sector" class="form-control">
          <option value="">Todos los sectores</option>
          <option v-for="sector in sectoresUnicos" :value="sector" :key="sector">
            {{ sector }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>Representante:</label>
        <input
          v-model="filtros.representante"
          placeholder="Filtrar por representante"
          class="form-control"
        />
      </div>
      <div class="filter-group">
        <label>Plazas disponibles:</label>
        <select v-model="filtros.plazas" class="form-control">
          <option value="">Cualquier cantidad</option>
          <option value="con-plazas">Con plazas disponibles</option>
          <option value="sin-plazas">Sin plazas disponibles</option>
          <option value="5+">5+ plazas</option>
          <option value="10+">10+ plazas</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Tutor laboral:</label>
        <input
          v-model="filtros.tutor"
          placeholder="Filtrar por tutor"
          class="form-control"
        />
      </div>
    </div>
    <div class="modal-actions">
      <button @click="aplicarFiltros" class="btn-apply">
        Aplicar Filtros
      </button>
      <button @click="resetearFiltros" class="btn-clear">
        Limpiar Filtros
      </button>
    </div>
  </div>
</div>

    <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cancelarFormulario">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ empresaSeleccionada.id ? 'Editar Empresa' : 'Añadir Empresa' }}</h3>
          <button @click="cancelarFormulario" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="guardarEmpresa">
          <div class="form-columns">
            <div>
              <div class="form-group">
                <label>Nombre: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.nombre" required />
              </div>
              <div class="form-group">
                <label>CIF: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.cif" required />
              </div>
              <div class="form-group">
                <label>Sector: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.sector" required />
              </div>
              <div class="form-group">
                <label>Dirección: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.direccion" required />
              </div>
              <div class="form-group">
                <label>Teléfono:</label>
                <input v-model="empresaSeleccionada.telefono" />
              </div>
            </div>

            <div>
              <div class="form-group">
                <label>Email:</label>
                <input v-model="empresaSeleccionada.email" type="email" />
              </div>
              <div class="form-group">
                <label>Representante: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.representante" required />
              </div>
              <div class="form-group">
                <label>NIF Representante: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.representante_nif" required />
              </div>
              <div class="form-group">
                <label>Tutor Laboral: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.tutor_laboral" required />
              </div>
              <div class="form-group">
                <label>NIF Tutor: <span class="required">*</span></label>
                <input v-model="empresaSeleccionada.tutor_laboral_nif" required />
              </div>
              <div class="form-group">
                <label>Plazas Disponibles: <span class="required">*</span></label>
                <input
                  v-model.number="empresaSeleccionada.plazas_disponibles"
                  type="number"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelarFormulario" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ empresaSeleccionada.id ? 'Actualizar' : 'Guardar' }}
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
import empresaService from '@/services/empresaService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


export default {
  name: 'EmpresasView',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      loading: true,
      mostrarFormulario: false,
      mostrarDetalle: false,
      empresaDetalle: null,
      empresas: [],
      empresasFiltradas: [],
      mostrarFiltros: false,
      filtros: {
        sector: '',
        representante: '',
        plazas: '',
        tutor: ''
      },
      empresaSeleccionada: this.getEmpresaVacia(),
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
    sectoresUnicos() {
      const sectores = new Set();
      this.empresas.forEach(empresa => {
        if (empresa.sector) sectores.add(empresa.sector);
      });
      return Array.from(sectores).sort();
    },
    totalPaginas() {
      return Math.ceil(this.empresasFiltradas.length / this.itemsPorPagina);
    },
    empresasPaginadas() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.empresasFiltradas.slice(inicio, fin);
    }
  },
  created() {
    this.cargarEmpresas();
  },
  methods: {
    cerrarFiltros() {
    this.mostrarFiltros = false;
  },
  aplicarFiltros() {
    this.empresasFiltradas = this.empresas.filter(empresa => {
      // Filtro por sector
      if (this.filtros.sector && empresa.sector !== this.filtros.sector) {
        return false;
      }

      // Filtro por representante (búsqueda parcial)
      if (this.filtros.representante && 
          !empresa.representante?.toLowerCase().includes(this.filtros.representante.toLowerCase())) {
        return false;
      }

      // Filtro por tutor laboral (búsqueda parcial)
      if (this.filtros.tutor && 
          !empresa.tutor_laboral?.toLowerCase().includes(this.filtros.tutor.toLowerCase())) {
        return false;
      }

      // Filtro por plazas disponibles
      if (this.filtros.plazas) {
        const plazas = empresa.plazas_disponibles || 0;

        switch(this.filtros.plazas) {
          case 'con-plazas': 
            if (plazas <= 0) return false;
            break;
          case 'sin-plazas': 
            if (plazas > 0) return false;
            break;
          case '5+': 
            if (plazas < 5) return false;
            break;
          case '10+': 
            if (plazas < 10) return false;
            break;
        }
      }

      return true;
    });

    this.paginaActual = 1;
    this.ordenarEmpresas();

    // Cerrar el modal después de aplicar los filtros
    this.cerrarFiltros();
  },
    
    // Método para resetear todos los filtros
    resetearFiltros() {
      this.filtros = {
        sector: '',
        representante: '',
        plazas: '',
        tutor: ''
      };
      this.filtrarEmpresas(); // Vuelve a aplicar solo el filtro de búsqueda general
    },
    verDetalle(empresa) {
    this.empresaDetalle = { ...empresa };
    this.mostrarDetalle = true;
  },
  getEmpresaVacia() {
    return {
      nombre: '',
      cif: '',
      sector: '',
      direccion: '',
      telefono: '',
      email: '',
      representante: '',
      representante_nif: '',
      tutor_laboral: '',
      tutor_laboral_nif: '',
      plazas_disponibles: 0,
    };
  },

  async cargarEmpresas() {
    try {
      this.loading = true;
      const response = await empresaService.getEmpresas();
      this.empresas = response.data;
      this.filtrarEmpresas();
      this.mostrarNotificacion = false;
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      this.mostrarNotificacionError('Error al cargar empresas');
    } finally {
      this.loading = false;
    }
  },

  filtrarEmpresas() {
      const query = this.searchQuery.toLowerCase();
      this.empresasFiltradas = this.empresas.filter(empresa => 
        (empresa.nombre?.toLowerCase() || '').includes(query) ||
        (empresa.cif?.toLowerCase() || '').includes(query) ||
        (empresa.sector?.toLowerCase() || '').includes(query) ||
        (empresa.direccion?.toLowerCase() || '').includes(query)
      );
      
      // Aplicar también los filtros avanzados si hay alguno activo
      if (Object.values(this.filtros).some(filtro => filtro !== '')) {
        this.aplicarFiltros();
      } else {
        this.paginaActual = 1;
        this.ordenarEmpresas();
      }
    },
  ordenarPor(campo) {
    if (this.ordenCampo === campo) {
      this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenCampo = campo;
      this.ordenDireccion = 'asc';
    }
    this.ordenarEmpresas();
  },

  ordenarEmpresas() {
    this.empresasFiltradas.sort((a, b) => {
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
    this.empresaSeleccionada = this.getEmpresaVacia();
    this.mostrarFormulario = true;
  },

  editarEmpresa(empresa) {
    this.empresaSeleccionada = { ...empresa };
    this.mostrarFormulario = true;
  },

  cancelarFormulario() {
    this.mostrarFormulario = false;
  },

  async eliminarEmpresa(id) {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      try {
        await empresaService.deleteEmpresa(id);
        this.mostrarNotificacionExito('Empresa eliminada correctamente');
        this.cargarEmpresas();
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
        this.mostrarNotificacionError('Error al eliminar la empresa');
      }
    }
  },

  async guardarEmpresa() {
    try {
      if (this.empresaSeleccionada.id) {
        await empresaService.updateEmpresa(this.empresaSeleccionada.id, this.empresaSeleccionada);
        this.mostrarNotificacionExito('Empresa actualizada correctamente');
      } else {
        await empresaService.createEmpresa(this.empresaSeleccionada);
        this.mostrarNotificacionExito('Empresa creada correctamente');
      }
      this.cargarEmpresas();
      this.cancelarFormulario();
    } catch (error) {
      console.error('Error al guardar empresa:', error);
      this.mostrarNotificacionError('Error al guardar la empresa');
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

<style src="@/assets/css/globalEstilos.css" scoped></style> 

