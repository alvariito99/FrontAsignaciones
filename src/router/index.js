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
  const user = JSON.parse(localStorage.getItem('user'));

  // Si la ruta requiere autenticación y no hay usuario, redirige a /login
  if (to.meta.requiresAuth && !user) {
    return next('/login');
  }

  // Si el usuario está autenticado, redirige según su rol
  if (user) {
    if (user.rol === 'profesor' && to.path === '/alumnos') {
      return next('/profesores'); // Redirige a /profesores si el rol es profesor
    }
    if (user.rol !== 'profesor' && to.path === '/profesores') {
      return next('/alumnos'); // Redirige a /alumnos para otros roles
    }
  }

  // Si no hay problemas, permite la navegación
  next();
});
export default router;
