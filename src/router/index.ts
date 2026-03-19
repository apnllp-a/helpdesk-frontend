// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import TicketList from '../views/TicketList.vue'
// เพิ่ม 3 บรรทัดนี้
import InventoryView from '../views/InventoryView.vue'
import UsersView from '../views/UsersView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: DashboardView },
      { path: 'tickets', name: 'จัดการทิกเก็ต', component: TicketList },
      // เพิ่ม 3 Route นี้
      { path: 'inventory', name: 'คลังอุปกรณ์', component: InventoryView },
      { path: 'users', name: 'จัดการผู้ใช้งาน', component: UsersView },
      { path: 'reports', name: 'รายงานสถิติ', component: ReportsView },
      {
  path: '/callback',
  name: 'callback',
  component: () => import('../views/CallbackView.vue')
}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router