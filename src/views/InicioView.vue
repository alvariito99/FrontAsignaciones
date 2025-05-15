<template>
  <div class="inicio-container">
    <!-- Header con bienvenida -->
    <header class="header-banner">
      <div class="header-content">
        <h1>Bienvenido a DualMarisma</h1>
        <p class="subtitle">Gestión educativa integral para profesores y alumnos</p>
        <div class="user-greeting" v-if="user">
          <p>Hola, {{ user.name }} ({{ user.role }})</p>
          <p v-if="user.role === 'alumno' && asignacionAlumno" class="asignacion-info">
            Empresa asignada: {{ asignacionAlumno.empresa_nombre }}
          </p>
        </div>
      </div>
    </header>

    <!-- Estadísticas rápidas -->
    <section class="stats-section">
      <div class="stat-card" @click="$router.push('/profesores/alumnos')">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ alumnosCount }}</h3>
          <p>Alumnos registrados</p>
        </div>
      </div>
      <div class="stat-card" @click="$router.push('/profesores/alumnos')">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>{{ promedioNotas }}</h3>
          <p>Nota promedio</p>
        </div>
      </div>
      <div class="stat-card" @click="$router.push('/profesores/empresas')">
  <div class="stat-icon">
    <i class="fas fa-building"></i>
  </div>
  <div class="stat-content">
    <h3>{{ empresasCount }}</h3>
    <p>Empresas colaboradoras</p>
  </div>
</div>
      <div class="stat-card" v-if="user?.role === 'profesor'" @click="$router.push('/asignaciones')">
        <div class="stat-icon">
          <i class="fas fa-handshake"></i>
        </div>
        <div class="stat-content">
          <h3>{{ asignacionesCount }}</h3>
          <p>Asignaciones activas</p>
        </div>
      </div>
    </section>

    <!-- Acciones rápidas -->
    <section class="quick-actions">
      <h2 class="section-title">Acciones rápidas</h2>
      <div class="actions-grid">
        <button class="action-btn" @click="$router.push('/profesores/alumnos?action=add')">
          <i class="fas fa-user-plus"></i>
          <span>Añadir alumno</span>
        </button>
        <button class="action-btn" @click="$router.push('/profesores/alumnos')">
          <i class="fas fa-search"></i>
          <span>Buscar alumno</span>
        </button>
        <button class="action-btn" v-if="user?.role === 'profesor'" @click="$router.push('/asignaciones')">
          <i class="fas fa-handshake"></i>
          <span>Gestionar asignaciones</span>
        </button>
        <button class="action-btn" v-if="user?.role === 'profesor'" @click="$router.push('/profesores/empresas')">
  <i class="fas fa-building"></i>
  <span>Gestionar empresas</span>
</button>
        <button class="action-btn" v-if="user?.role === 'alumno' && asignacionAlumno" @click="$router.push('/asignaciones')">
          <i class="fas fa-info-circle"></i>
          <span>Ver mi asignación</span>
        </button>
        <button class="action-btn" v-if="user?.role === 'alumno' && !asignacionAlumno">
          <i class="fas fa-question-circle"></i>
          <span>Estado de asignación</span>
        </button>
      </div>
    </section>

    <!-- Noticias/Anuncios recientes -->
    <section class="news-section">
      <h2 class="section-title">Últimos anuncios</h2>
      <div class="news-card" v-for="(news, index) in noticias" :key="index">
        <div class="news-date">{{ formatDate(news.date) }}</div>
        <h3 class="news-title">{{ news.title }}</h3>
        <p class="news-content">{{ news.content }}</p>
      </div>
    </section>

    <!-- Calendario próximo (solo para profesores) -->
    <section class="calendar-section" v-if="user?.role === 'profesor'">
      <h2 class="section-title">Próximos eventos</h2>
      <div class="calendar-container">
        <div class="calendar-event" v-for="(event, index) in proximosEventos" :key="index">
          <div class="event-date">
            <span class="event-day">{{ event.day }}</span>
            <span class="event-month">{{ event.month }}</span>
          </div>
          <div class="event-details">
            <h3>{{ event.title }}</h3>
            <p>{{ event.time }} - {{ event.location }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Información para alumnos -->
    <section class="student-info" v-if="user?.role === 'alumno'">
      <h2 class="section-title">Mi información</h2>
      <div class="info-cards">
        <div class="info-card" v-if="asignacionAlumno">
          <h3><i class="fas fa-building"></i> Empresa asignada</h3>
          <p>{{ asignacionAlumno.empresa_nombre }}</p>
          <p>Tutor laboral: {{ asignacionAlumno.tutor_laboral }}</p>
          <button @click="$router.push('/asignaciones')" class="btn-details">
            Ver detalles completos
          </button>
        </div>
        <div class="info-card" v-else>
          <h3><i class="fas fa-info-circle"></i> Estado de asignación</h3>
          <p>Actualmente no tienes una empresa asignada.</p>
          <p>Por favor, consulta con tu tutor para más información.</p>
        </div>
        <div class="info-card">
          <h3><i class="fas fa-calendar-check"></i> Próximas entregas</h3>
          <div v-if="tareasPendientes.length > 0">
            <div v-for="tarea in tareasPendientes" :key="tarea.id" class="tarea-item">
              <p><strong>{{ tarea.titulo }}</strong></p>
              <p>Entrega: {{ formatDate(tarea.fecha_entrega) }}</p>
            </div>
          </div>
          <p v-else>No tienes tareas pendientes</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import alumnoService from '@/services/alumnoService';
import empresaService from '@/services/empresaService';
import asignacionService from '@/services/asignacionService';

export default {
  name: 'InicioView',
  setup() {
    const router = useRouter();
    const user = ref(JSON.parse(localStorage.getItem('user')));
    const alumnosCount = ref(0);
    const empresasCount = ref(0);
    const asignacionesCount = ref(0);
    const promedioNotas = ref(0);
    const asignacionAlumno = ref(null);
    const tareasPendientes = ref([]);
    const loading = ref(true);

    const noticias = ref([
      {
        date: new Date(),
        title: 'Nuevo sistema de gestión',
        content: 'Hemos implementado mejoras en la plataforma para una mejor experiencia de usuario.'
      },
      {
        date: new Date(Date.now() - 86400000 * 2),
        title: 'Reunión de profesores',
        content: 'Recordatorio: reunión mensual de profesores el próximo viernes a las 16:00.'
      }
    ]);

    const proximosEventos = ref([
      {
        day: '15',
        month: 'Oct',
        title: 'Entrega de notas',
        time: '09:00 - 14:00',
        location: 'Sala de profesores'
      },
      {
        day: '20',
        month: 'Oct',
        title: 'Excursión educativa',
        time: '08:30 - 17:00',
        location: 'Parque Natural'
      }
    ]);

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const cargarAsignacionAlumno = async () => {
      if (user.value?.role === 'alumno') {
        try {
          const response = await asignacionService.getAsignaciones();
          const asignaciones = response.data;
          const asignacion = asignaciones.find(a => a.alumno_id === user.value.id);
          
          if (asignacion) {
            const empresasResponse = await empresaService.getEmpresas();
            const empresa = empresasResponse.data.find(e => e.id === asignacion.empresa_id);
            
            asignacionAlumno.value = {
              ...asignacion,
              empresa_nombre: empresa?.nombre || 'Empresa no disponible',
              tutor_laboral: empresa?.tutor_laboral || 'Tutor no asignado'
            };
          }
        } catch (error) {
          console.error('Error al cargar asignación del alumno:', error);
        }
      }
    };

    const cargarTareasPendientes = async () => {
      if (user.value?.role === 'alumno') {
        // Simulación de tareas pendientes - en una aplicación real esto vendría de un servicio
        tareasPendientes.value = [
          {
            id: 1,
            titulo: 'Informe de prácticas',
            fecha_entrega: new Date(Date.now() + 86400000 * 7) // 7 días desde hoy
          },
          {
            id: 2,
            titulo: 'Autoevaluación',
            fecha_entrega: new Date(Date.now() + 86400000 * 14) // 14 días desde hoy
          }
        ];
      }
    };

    onMounted(async () => {
      try {
        // Obtener datos de alumnos
        const alumnosResponse = await alumnoService.getAlumnos();
        alumnosCount.value = alumnosResponse.data.length;
        
        // Calcular promedio de notas
        const notas = alumnosResponse.data.map(a => parseFloat(a.nota_curso)).filter(n => !isNaN(n));
        if (notas.length > 0) {
          promedioNotas.value = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
        }

        // Obtener datos de empresas
        const empresasResponse = await empresaService.getEmpresas();
        empresasCount.value = empresasResponse.data.length;

        // Obtener datos de asignaciones
        const asignacionesResponse = await asignacionService.getAsignaciones();
        asignacionesCount.value = asignacionesResponse.data.length;

        // Cargar información específica del alumno si es necesario
        await cargarAsignacionAlumno();
        await cargarTareasPendientes();

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      user,
      alumnosCount,
      empresasCount,
      asignacionesCount,
      promedioNotas,
      asignacionAlumno,
      tareasPendientes,
      noticias,
      proximosEventos,
      formatDate,
      loading
    };
  }
};
</script>

<style scoped>
.inicio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header styles */
.header-banner {
  background: linear-gradient(135deg, #002366, #0056b3);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.user-greeting {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.asignacion-info {
  margin-top: 0.5rem;
  font-style: italic;
}

/* Stats section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  color: #0056b3;
  margin-right: 1.5rem;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  color: #002366;
}

.stat-content p {
  margin: 0;
  color: #666;
}

/* Quick actions */
.section-title {
  color: #002366;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f5f9ff;
  border-color: #0056b3;
}

.action-btn i {
  font-size: 1.8rem;
  color: #0056b3;
  margin-bottom: 0.8rem;
}

.action-btn span {
  font-weight: 500;
  color: #333;
}

/* News section */
.news-section {
  margin-bottom: 2rem;
}

.news-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.news-date {
  color: #0056b3;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.news-title {
  color: #002366;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.news-content {
  color: #555;
  line-height: 1.5;
}

/* Calendar section */
.calendar-section {
  margin-bottom: 2rem;
}

.calendar-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-event {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.calendar-event:last-child {
  border-bottom: none;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  margin-right: 1.5rem;
  background: #f5f9ff;
  border-radius: 6px;
  padding: 0.5rem;
}

.event-day {
  font-size: 1.5rem;
  font-weight: bold;
  color: #002366;
}

.event-month {
  font-size: 0.9rem;
  color: #0056b3;
  text-transform: uppercase;
}

.event-details h3 {
  margin: 0 0 0.3rem 0;
  color: #333;
}

.event-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Student info section */
.student-info {
  margin-bottom: 2rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  color: #002366;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.info-card h3 i {
  margin-right: 0.5rem;
  color: #0056b3;
}

.info-card p {
  margin: 0.5rem 0;
  color: #555;
}

.btn-details {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-details:hover {
  background: #003d7a;
}

.tarea-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.tarea-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .header-banner {
    padding: 1.5rem 1rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>