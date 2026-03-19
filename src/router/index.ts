import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import TicketList from '../views/TicketList.vue'
import InventoryView from '../views/InventoryView.vue'
import UsersView from '../views/UsersView.vue'
import ReportsView from '../views/ReportsView.vue'
import CallbackView from '../views/CallbackView.vue' // Import มาเลยจะใช้ง่ายกว่าครับ

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView 
  },
  {
    path: '/callback',
    name: 'callback',
    component: CallbackView // ย้ายออกมาข้างนอก AdminLayout
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true }, // บังคับว่าต้อง Login ก่อนเข้ากลุ่มนี้
    children: [
      { path: '', name: 'Dashboard', component: DashboardView },
      { path: 'tickets', name: 'จัดการทิกเก็ต', component: TicketList },
      { path: 'inventory', name: 'คลังอุปกรณ์', component: InventoryView },
      { path: 'users', name: 'จัดการผู้ใช้งาน', component: UsersView },
      { path: 'reports', name: 'รายงานสถิติ', component: ReportsView },
    ]
  },
  // ถ้าเข้า URL มั่วๆ ให้ดีดไปหน้าแรก
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 👮‍♂️ Navigation Guard: เช็คสิทธิ์ก่อนเปลี่ยนหน้า
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // 1. ถ้าหน้าที่จะไปต้องการ Auth แต่ไม่มี Token หรือไม่ใช่ Admin
  if (to.meta.requiresAuth && (!token || role !== 'admin')) {
    next('/login')
  } 
  // 2. ถ้ามี Token อยู่แล้วแต่จะพยายามเข้าหน้า Login อีก ให้ดีดไป Dashboard
  else if (to.name === 'Login' && token && role === 'admin') {
    next('/')
  }
  // 3. นอกนั้นปล่อยผ่านปกติ
  else {
    next()
  }
})

export default router