<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span v-if="loading" class="animate-pulse">กำลังอัปเดตข้อมูล...</span>
                <span v-else>อัปเดตล่าสุด: {{ lastUpdated }}</span>
                <button @click="fetchDashboardData" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowPathIcon :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card p-6 flex items-center gap-4 border-l-4 border-blue-500 shadow-sm">
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <TicketIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">งานทั้งหมด</p>
                    <h2 class="text-2xl font-bold dark:text-white">{{ totalTickets }}</h2>
                </div>
            </div>

            <div class="card p-6 flex items-center gap-4 border-l-4 border-yellow-500 shadow-sm">
                <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600">
                    <ClockIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">รอดำเนินการ</p>
                    <h2 class="text-2xl font-bold dark:text-white text-yellow-600">{{ pendingTickets }}</h2>
                </div>
            </div>

            <div class="card p-6 flex items-center gap-4 border-l-4 border-purple-500 shadow-sm">
                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
                    <WrenchScrewdriverIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">กำลังดำเนินการ</p>
                    <h2 class="text-2xl font-bold dark:text-white text-purple-600">{{ inProgressTickets }}</h2>
                </div>
            </div>

            <div class="card p-6 flex items-center gap-4 border-l-4 border-green-500 shadow-sm">
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                    <CheckCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">เสร็จสิ้นแล้ว</p>
                    <h2 class="text-2xl font-bold dark:text-white text-green-600">{{ resolvedTickets }}</h2>
                </div>
            </div>
        </div>

        <div class="card overflow-hidden shadow-sm">
            <div
                class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-dark-card">
                <h3 class="font-bold text-gray-800 dark:text-white text-lg">งานแจ้งซ่อมล่าสุด</h3>
                <router-link to="/tickets" class="text-primary hover:underline text-sm font-medium">ดูทั้งหมด
                    →</router-link>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead
                        class="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-dark-muted text-xs uppercase font-semibold">
                        <tr>
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">หัวข้อปัญหา</th>
                            <th class="px-6 py-4">ผู้แจ้ง</th>
                            <th class="px-6 py-4">สถานะ</th>
                            <th class="px-6 py-4 text-right">ผู้รับผิดชอบ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-dark-card">
                        <tr v-if="loading && tickets.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-400">กำลังดึงข้อมูล...</td>
                        </tr>
                        <tr v-else-if="latestTickets.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-400">ยังไม่มีรายการแจ้งซ่อม</td>
                        </tr>
                        <tr v-for="ticket in latestTickets" :key="ticket._id"
                            class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td class="px-6 py-4 text-sm font-medium text-primary uppercase">#{{
                                ticket._id.substring(ticket._id.length - 4) }}</td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-medium text-gray-800 dark:text-white truncate w-48">{{
                                    ticket.problem_details }}</p>
                                <p class="text-xs text-gray-400">{{ formatDate(ticket.reported_at) }}</p>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-dark-text">{{ ticket.senderName ||
                                'ลูกค้าทั่วไป' }}</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="['px-3 py-1 rounded-full text-xs font-medium border', statusStyle(ticket.status)]">
                                    {{ ticket.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-right text-gray-500 dark:text-dark-muted font-medium">
                                {{ ticket.action_by || '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import {
    TicketIcon, ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline'

// API Config
const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api/repairs'

// State
const tickets = ref([])
const loading = ref(true)
const lastUpdated = ref('')

// 1. ดึงข้อมูลจาก MongoDB
const fetchDashboardData = async () => {
    loading.value = true
    try {
        const res = await axios.get(API_URL)
        tickets.value = res.data
        lastUpdated.value = new Date().toLocaleTimeString('th-TH')
    } catch (err) {
        console.error("Error fetching dashboard data:", err)
    } finally {
        loading.value = false
    }
}

// 2. Computed คำนวณตัวเลขสถิติ (Real-timeจาก State)
const totalTickets = computed(() => tickets.value.length)
const pendingTickets = computed(() => tickets.value.filter((t: any) => t.status === 'Pending').length)
const inProgressTickets = computed(() => tickets.value.filter((t: any) => t.status === 'In Progress').length)
const resolvedTickets = computed(() => tickets.value.filter((t: any) => t.status === 'Resolved').length)

// 3. กรองเอา 5 งานล่าสุด (เรียงตามวันที่)
const latestTickets = computed(() => {
    return [...tickets.value]
        .sort((a: any, b: any) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime())
        .slice(0, 5)
})

// Utilities: จัดรูปแบบสถานะ
const statusStyle = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-400'
        case 'In Progress': return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-400'
        case 'Resolved': return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400'
        default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
}

// จัดรูปแบบวันที่ให้ดูง่าย
const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// Lifecycle: ตั้งเวลา Auto Refresh ทุก 30 วินาที
let timer: any = null
onMounted(() => {
    fetchDashboardData()
    timer = setInterval(fetchDashboardData, 30000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>