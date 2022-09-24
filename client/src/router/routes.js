
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
