
const routes = [
  {
    path: '/',
    component: () => import('layouts/StaticLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },
  {
    path: '/accounts',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      {
        path: '',
        name: 'accounts',
        meta: {requiresAuth: true, },
        component: () => import('pages/AccountsPage.vue')
      },
      {
        path: '/accounts/:id',
        meta: {requiresAuth: true, },
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
      }
    ]
  },
  {
    path: '/services',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      {
        path: '',
        name: 'services',
        meta: {requiresAuth: true, },
        component: () => import('pages/ServicesPage.vue')
      },
      {
        path: '/services/:id',
        meta: {requiresAuth: true, },
        name: 'service',
        component: () => import('pages/ServicePage.vue'),
      }
    ]
  },
  {
    path: '/employees',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      {
        path: '',
        name: 'employees',
        meta: {requiresAuth: true, },
        component: () => import('pages/EmployeesPage.vue')
      },
      {
        path: '/employee/:id',
        meta: {requiresAuth: true, },
        name: 'employee',
        component: () => import('pages/EmployeePage.vue'),
      }
    ]
  },
  {
    path: '/customers',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      {
        path: '',
        name: 'customers',
        meta: {requiresAuth: true, },
        component: () => import('pages/CustomersPage.vue')
      },
      {
        path: '/customer/:id',
        meta: {requiresAuth: true, },
        name: 'customer',
        component: () => import('pages/CustomerPage.vue'),
      }
    ]
  },
  {
    path: '/reservations',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      {
        path: '',
        name: 'reservations',
        meta: {requiresAuth: true, },
        component: () => import('pages/ReservationsPage.vue')
      },
      {
        path: '/reservation/:id',
        meta: {requiresAuth: true, },
        name: 'reservation',
        component: () => import('pages/ReservationPage.vue'),
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/AdminPage.vue') },
      {
        path: 'accounts',
        meta: {requiresAuth: true, },
        component: () => import('pages/admin/AccountPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
