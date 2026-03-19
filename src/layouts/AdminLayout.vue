<template>
    <div class="flex h-screen bg-secondary-light dark:bg-dark-bg transition-colors duration-300">
        <div :class="['fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none']"
            @click="isSidebarOpen = false"></div>

        <aside :class="[
            'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-card shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto flex flex-col',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div
                class="flex items-center justify-between h-16 px-6 bg-primary dark:bg-dark-card border-b border-primary-light dark:border-gray-700">
                <h1 class="text-xl font-bold text-white">IT Helpdesk</h1>
                <button @click="isSidebarOpen = false" class="lg:hidden text-white hover:text-gray-200">
                    <XMarkIcon class="w-6 h-6" />
                </button>
            </div>

            <nav class="mt-6 px-4 space-y-2 flex-grow overflow-y-auto">
                <router-link v-for="(link, index) in links" :key="index" :to="link.to"
                    class="flex items-center px-4 py-3 text-gray-700 dark:text-dark-text rounded-lg transition-colors duration-200 group"
                    active-class="bg-secondary dark:bg-primary/20 text-primary dark:text-primary"
                    @click="isSidebarOpen = false">
                    <component :is="link.icon"
                        :class="['w-6 h-6 mr-3 text-gray-400 dark:text-dark-muted group-hover:text-primary dark:group-hover:text-primary transition-colors', { 'text-primary dark:text-primary': $route.path === link.to }]" />
                    <span class="font-medium">{{ link.name }}</span>
                </router-link>
            </nav>

            <div class="p-4 border-t border-gray-100 dark:border-gray-800">
                <button @click="logout"
                    class="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-3" />
                    <span class="font-medium">ออกจากระบบ</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header
                class="flex items-center justify-between h-16 px-6 bg-white dark:bg-dark-card shadow-sm transition-colors duration-300 shrink-0">
                <div class="flex items-center">
                    <button @click="isSidebarOpen = true" class="text-gray-500 hover:text-primary lg:hidden mr-4">
                        <Bars3Icon class="w-6 h-6" />
                    </button>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
                        {{ $route.name }}
                    </h2>
                </div>

                <div class="flex items-center space-x-4">
                    <ThemeToggle />

                    <div class="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <img v-if="userProfile.picture" :src="userProfile.picture" alt="Profile"
                            class="w-9 h-9 rounded-full object-cover border-2 border-primary/20" />
                        <div v-else
                            class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {{ userProfile.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="hidden md:flex flex-col">
                            <span class="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                                {{ userProfile.name }}
                            </span>
                            <span
                                class="text-[10px] text-gray-500 dark:text-dark-muted uppercase font-bold tracking-wider">
                                {{ userRole }}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main
                class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-secondary-light dark:bg-dark-bg relative">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import ThemeToggle from '@/components/ThemeToggle.vue'
import {
    HomeIcon,
    TicketIcon,
    ArchiveBoxIcon,
    UsersIcon,
    ChartBarIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)

// ดึง Role เพื่อมาเช็คสิทธิ์แสดงเมนู (ค่าเริ่มต้นคือ support ถ้าดึงไม่เจอ)
const userRole = ref(localStorage.getItem('role') || 'support')

// ข้อมูลโปรไฟล์ เอาไว้โชว์มุมขวาบน
const userProfile = ref({
    name: localStorage.getItem('userName') || 'Admin User',
    picture: localStorage.getItem('userPicture') || null
})

// ข้อมูลเมนูทั้งหมด
const allLinks = [
    { name: 'แดชบอร์ด', to: '/', icon: HomeIcon, roles: ['admin', 'support'] },
    { name: 'จัดการทิกเก็ต', to: '/tickets', icon: TicketIcon, roles: ['admin', 'support'] },
    { name: 'คลังอุปกรณ์', to: '/inventory', icon: ArchiveBoxIcon, roles: ['admin', 'support'] },
    // เมนูตั้งค่าหรือดูสถิติ ให้เฉพาะ admin เห็นเท่านั้น
    { name: 'ผู้ใช้งานระบบ', to: '/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'รายงานสถิติ', to: '/reports', icon: ChartBarIcon, roles: ['admin'] },
]

// กรองเมนูตามสิทธิ์การใช้งาน
const links = computed(() => {
    return allLinks.filter(link => link.roles.includes(userRole.value))
})

// ฟังก์ชันออกจากระบบ
const logout = async () => {
    const result = await Swal.fire({
        title: 'ออกจากระบบ?',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
        // ล้างข้อมูลทั้งหมดใน LocalStorage
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userName')
        localStorage.removeItem('userPicture')

        router.push('/login')
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>