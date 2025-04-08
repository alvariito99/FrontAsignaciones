import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/profesores',
    name: 'profesores',
    component: () => import('@/views/ProfesorView.vue'),
    meta: { requiresAuth: true, requiredRole: 'profesor' },
    children: [
      {
        path: 'alumnos',
        component: () => import('@/views/AlumnosView.vue')
      },
      {
        path: 'empresas',
        component: () => import('@/views/EmpresasView.vue')
      },
      {
        path: 'usuarios',
        component: () => import('@/views/UsuariosView.vue')
      }
    ]
  },
  {
    path: '/alumnos',
    name: 'alumnos',
    component: () => import('@/views/AlumnosView.vue'),
    meta: { requiresAuth: true, requiredRole: 'alumno' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  console.log('Ruta destino:', to.path);
  console.log('Usuario actual:', user);

  // Si la ruta requiere autenticación y no hay usuario, redirige a login
  if (to.meta.requiresAuth && !user) {
    console.log('Redirigiendo a login: no autenticado');
    return next('/login');
  }

  // Si hay usuario pero la ruta requiere un rol específico
  if (to.meta.requiredRole && user?.role !== to.meta.requiredRole) {
    console.log('Redirigiendo: rol incorrecto');
    
    // Redirige según el rol del usuario
    if (user.role === 'profesor') {
      return next('/profesores');
    } else if (user.role === 'alumno') {
      return next('/alumnos');
    } else {
      // Rol desconocido, redirige a login
      return next('/login');
    }
  }

  // Si todo está bien, permite la navegación
  next();
});
export default router;
