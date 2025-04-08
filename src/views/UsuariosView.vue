<template>
  <div class="usuarios-container">
    <h1>Gestión de Usuarios</h1>

    <div class="actions">
      <button @click="abrirFormulario" class="btn-add">
        <i class="fas fa-plus"></i> Añadir Usuario
      </button>
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="Buscar usuarios..." 
          @input="filtrarUsuarios"
        />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <div v-if="loading" class="loading-message">
      <i class="fas fa-spinner fa-spin"></i> Cargando usuarios...
    </div>

    <div v-else-if="usuariosFiltrados.length === 0" class="no-results">
      No se encontraron usuarios
    </div>

    <div v-else>
      <table class="usuarios-table">
        <thead>
          <tr>
            <th @click="ordenarPor('id')">
              ID <i :class="ordenIcono('id')"></i>
            </th>
            <th @click="ordenarPor('name')">
              Nombre <i :class="ordenIcono('name')"></i>
            </th>
            <th @click="ordenarPor('email')">
              Email <i :class="ordenIcono('email')"></i>
            </th>
            <th @click="ordenarPor('role')">
              Rol <i :class="ordenIcono('role')"></i>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.name }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.role }}</td>
            <td class="actions-cell">
              <button @click="verDetalle(usuario)" class="btn-view">
                <i class="fas fa-eye"></i> Ver
              </button>
              <button @click="editarUsuario(usuario)" class="btn-edit">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button @click="eliminarUsuario(usuario.id)" class="btn-delete">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && usuariosFiltrados.length > 0" class="pagination">
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

    <div v-if="mostrarDetalle" class="form-overlay" @click.self="mostrarDetalle = false">
      <div class="detail-container">
        <div class="detail-header">
          <h3>Detalles del Usuario</h3>
          <button @click="mostrarDetalle = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="detail-content">
          <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">{{ usuarioDetalle.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">{{ usuarioDetalle.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ usuarioDetalle.email }}</span>
          </div>
           <div class="detail-row">
            <span class="detail-label">Rol:</span>
            <span class="detail-value">{{ usuarioDetalle.role }}</span>
          </div>
        </div>
        
        <div class="detail-actions">
          <button @click="mostrarDetalle = false" class="btn-close-detail">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="form-overlay" @click.self="cancelarFormulario">
      <div class="form-container">
        <div class="form-header">
          <h3>{{ usuarioSeleccionado.id ? 'Editar Usuario' : 'Añadir Usuario' }}</h3>
          <button @click="cancelarFormulario" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarUsuario">
          <div class="form-columns">
            <div>
              <div class="form-group">
                <label>Nombre: <span class="required">*</span></label>
                <input v-model="usuarioSeleccionado.name" required />
              </div>
              <div class="form-group">
                <label>Email: <span class="required">*</span></label>
                <input v-model="usuarioSeleccionado.email" type="email" required />
              </div>
              <div class="form-group">
                <label>Contraseña: <span v-if="!usuarioSeleccionado.id" class="required">*</span></label>
                <input v-model="usuarioSeleccionado.password" type="password" :required="!usuarioSeleccionado.id" />
              </div>
              <div class="form-group">
                <label>Rol: <span class="required">*</span></label>
                <select v-model="usuarioSeleccionado.role" required>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                  <option value="guest">Invitado</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelarFormulario" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ usuarioSeleccionado.id ? 'Actualizar' : 'Guardar' }}
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
import usuarioService from '@/services/usuarioService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'UsuariosView',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      loading: true,
      mostrarFormulario: false,
      mostrarDetalle: false,
      usuarioDetalle: null,
      usuarios: [],
      usuariosFiltrados: [],
      usuarioSeleccionado: this.getUsuarioVacio(),
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
      return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
    },
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.usuariosFiltrados.slice(inicio, fin);
    }
  },
  created() {
    this.cargarUsuarios();
  },
  methods: {
    verDetalle(usuario) {
      this.usuarioDetalle = { ...usuario };
      this.mostrarDetalle = true;
    },
    getUsuarioVacio() {
      return {
        name: '',
        email: '',
        password: '',
        role: ''
      };
    },
    async cargarUsuarios() {
      try {
        this.loading = true;
        const response = await usuarioService.getUsuarios();
        this.usuarios = response.data;
        this.filtrarUsuarios();
        this.mostrarNotificacion = false;
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        this.mostrarNotificacionError('Error al cargar usuarios');
      } finally {
        this.loading = false;
      }
    },
    filtrarUsuarios() {
      const query = this.searchQuery.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(usuario => 
        usuario.name.toLowerCase().includes(query) ||
        usuario.email.toLowerCase().includes(query) ||
        usuario.role.toLowerCase().includes(query)
      );
      this.paginaActual = 1;
      this.ordenarUsuarios();
    },
    ordenarPor(campo) {
      if (this.ordenCampo === campo) {
        this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
      } else {
        this.ordenCampo = campo;
        this.ordenDireccion = 'asc';
      }
      this.ordenarUsuarios();
    },
    ordenarUsuarios() {
      this.usuariosFiltrados.sort((a, b) => {
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
      this.usuarioSeleccionado = this.getUsuarioVacio();
      this.mostrarFormulario = true;
    },
    editarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario };
      this.mostrarFormulario = true;
    },
    cancelarFormulario() {
      this.mostrarFormulario = false;
    },
    async eliminarUsuario(id) {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await usuarioService.deleteUsuario(id);
          this.mostrarNotificacionExito('Usuario eliminado correctamente');
          this.cargarUsuarios();
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          this.mostrarNotificacionError('Error al eliminar el usuario');
        }
      }
    },
    async guardarUsuario() {
      try {
        if (this.usuarioSeleccionado.id) {
          await usuarioService.updateUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado);
          this.mostrarNotificacionExito('Usuario actualizado correctamente');
        } else {
          await usuarioService.createUsuario(this.usuarioSeleccionado);
          this.mostrarNotificacionExito('Usuario creado correctamente');
        }
        this.cargarUsuarios();
        this.cancelarFormulario();
      } catch (error) {
        console.error('Error al guardar usuario:', error);
        this.mostrarNotificacionError('Error al guardar el usuario');
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