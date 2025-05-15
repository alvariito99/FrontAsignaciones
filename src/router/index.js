import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import InicioView from '@/views/InicioView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login', 
  },
  {
    path: '/inicio',
    name: 'inicio',
    component: InicioView,
    meta: { requiresAuth: true }, // Cambiado a true para proteger esta ruta
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/profesores',
    name: 'profesores',
    component: () => import('@/views/ProfesorView.vue'),
    meta: { requiresAuth: true, requiredRole: 'profesor' },
    children: [
      {
        path: 'alumnos',
        component: () => import('@/views/AlumnosView.vue'),
      },
      {
        path: 'empresas',
        component: () => import('@/views/EmpresasView.vue'),
      },
      {
        path: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
      },
    ],
  },
  {
    path: '/alumnos',
    name: 'alumnos',
    component: () => import('@/views/AlumnosView.vue'),
    meta: { requiresAuth: true, requiredRole: 'alumno' },
  },
  {
    path: '/asignaciones',
    name: 'asignaciones',
    component: () => import('@/views/AsignacionesView.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['profesor', 'alumno'] // Permitir ambos roles
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // 1. Redirige siempre la ruta raíz (/) a /login
  if (to.path === '/') {
    return next('/login');
  }

  // 2. Si la ruta requiere autenticación y no hay usuario, redirige a login
  if (to.meta.requiresAuth && !user) {
    return next('/login');
  }

  // 3. Verificación de roles (allowedRoles)
  if (to.meta.allowedRoles) {
    if (!user || !to.meta.allowedRoles.includes(user.role)) {
      return next('/login'); // Siempre redirige a login si no tiene permiso
    }
  }

  // 4. Verificación de rol específico (requiredRole)
  if (to.meta.requiredRole && user?.role !== to.meta.requiredRole) {
    return next('/login'); // Redirige a login si el rol no coincide
  }

  // Si todo está bien, permite la navegación
  next();
});
export default router;