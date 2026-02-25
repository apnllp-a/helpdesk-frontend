<template>
    <div class="flex h-screen bg-secondary-light dark:bg-dark-bg transition-colors duration-300">
        <div :class="['fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none']"
            @click="isSidebarOpen = false"></div>

        <aside :class="[
            'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-card shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div
                class="flex items-center justify-between h-16 px-6 bg-primary dark:bg-dark-card border-b border-primary-light dark:border-gray-700">
                <h1 class="text-xl font-bold text-white">IT Helpdesk</h1>
                <button @click="isSidebarOpen = false" class="lg:hidden text-white hover:text-gray-200">
                    <XMarkIcon class="w-6 h-6" />
                </button>
            </div>

            <nav class="mt-6 px-4 space-y-2">
                <router-link v-for="(link, index) in links" :key="index" :to="link.to"
                    class="flex items-center px-4 py-3 text-gray-700 dark:text-dark-text rounded-lg transition-colors duration-200 group"
                    active-class="bg-secondary dark:bg-primary/20 text-primary dark:text-primary"
                    @click="isSidebarOpen = false">
                    <component :is="link.icon"
                        :class="['w-6 h-6 mr-3 text-gray-400 dark:text-dark-muted group-hover:text-primary dark:group-hover:text-primary transition-colors', { 'text-primary dark:text-primary': $route.path === link.to }]" />
                    <span class="font-medium">{{ link.name }}</span>
                </router-link>
            </nav>

            <div class="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                <button @click="logout"
                    class="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-3" />
                    <span class="font-medium">ออกจากระบบ</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header
                class="flex items-center justify-between h-16 px-6 bg-white dark:bg-dark-card shadow-sm transition-colors duration-300">
                <div class="flex items-center">
                    <button @click="isSidebarOpen = true" class="text-gray-500 hover:text-primary lg:hidden">
                        <Bars3Icon class="w-6 h-6" />
                    </button>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white ml-4 lg:ml-0">
                        {{ $route.name }}
                    </h2>
                </div>

                <div class="flex items-center space-x-4">
                    <ThemeToggle />
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            A
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-dark-text hidden md:block">Admin
                            User</span>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const userRole = ref(localStorage.getItem('role') || 'support')

const allLinks = [
    { name: 'แดชบอร์ด', to: '/', icon: HomeIcon, roles: ['admin', 'support'] },
    { name: 'จัดการทิกเก็ต', to: '/tickets', icon: TicketIcon, roles: ['admin', 'support'] },
    { name: 'คลังอุปกรณ์', to: '/inventory', icon: ArchiveBoxIcon, roles: ['admin', 'support'] },
    { name: 'ผู้ใช้งาน', to: '/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'รายงาน', to: '/reports', icon: ChartBarIcon, roles: ['admin'] },
]

const links = computed(() => {
    return allLinks.filter(link => link.roles.includes(userRole.value))
})

const logout = () => {
    localStorage.clear()
    router.push('/login')
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