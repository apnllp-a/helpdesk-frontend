<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span v-if="loading" class="animate-pulse">กำลังอัปเดตข้อมูล...</span>
                <span v-else>อัปเดตล่าสุด: {{ lastUpdated }}</span>
                <button @click="fetchAllData" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowPathIcon :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                class="card p-6 flex items-center gap-4 border-l-4 border-blue-500 shadow-sm bg-white dark:bg-dark-card">
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <TicketIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">งานซ่อม/เบิก ทั้งหมด</p>
                    <h2 class="text-2xl font-bold dark:text-white">{{ totalTickets }}</h2>
                </div>
            </div>

            <div
                class="card p-6 flex items-center gap-4 border-l-4 border-yellow-500 shadow-sm bg-white dark:bg-dark-card relative">
                <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600">
                    <ClockIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">รอดำเนินการ (New)</p>
                    <h2 class="text-2xl font-bold dark:text-white text-yellow-600">{{ pendingTickets.length }}</h2>
                </div>
                <div v-if="pendingTickets.length > 0" class="absolute -top-2 -right-2">
                    <span class="flex h-6 w-6">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span
                            class="relative inline-flex rounded-full h-6 w-6 bg-red-600 text-[10px] text-white items-center justify-center font-bold">NEW</span>
                    </span>
                </div>
            </div>

            <div
                class="card p-6 flex items-center gap-4 border-l-4 border-purple-500 shadow-sm bg-white dark:bg-dark-card">
                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
                    <WrenchScrewdriverIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">กำลังดำเนินการ</p>
                    <h2 class="text-2xl font-bold dark:text-white text-purple-600">{{ inProgressTickets }}</h2>
                </div>
            </div>

            <div
                class="card p-6 flex items-center gap-4 border-l-4 border-green-500 shadow-sm bg-white dark:bg-dark-card">
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                    <CheckCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">เสร็จสิ้นแล้ว</p>
                    <h2 class="text-2xl font-bold dark:text-white text-green-600">{{ resolvedTickets }}</h2>
                </div>
            </div>
        </div>

        <div class="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            <button @click="activeTab = 'repairs'"
                :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'repairs' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700']">
                งานแจ้งซ่อม
            </button>
            <button @click="activeTab = 'inventory'"
                :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2', activeTab === 'inventory' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700']">
                คำขอเบิกอุปกรณ์
                <span v-if="requisitionTickets.filter(t => t.status === 'pending').length"
                    class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{{requisitionTickets.filter(t =>
                        t.status === 'pending').length }}</span>
            </button>
        </div>

        <div class="card overflow-hidden shadow-sm bg-white dark:bg-dark-card min-h-[450px] flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 dark:text-white text-lg">
                    {{ activeTab === 'repairs' ? 'งานแจ้งซ่อมล่าสุด' : 'รายการคำขอเบิกอุปกรณ์ล่าสุด' }}
                </h3>
            </div>

            <div class="flex-grow overflow-x-auto">
                <table class="w-full text-left">
                    <thead
                        class="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-dark-muted text-xs uppercase font-semibold">
                        <tr v-if="activeTab === 'repairs'">
                            <th class="px-6 py-4">Ticket No</th>
                            <th class="px-6 py-4">หัวข้อปัญหา</th>
                            <th class="px-6 py-4">ผู้แจ้ง (LINE ID)</th>
                            <th class="px-6 py-4 text-center">สถานะ</th>
                        </tr>
                        <tr v-else>
                            <th class="px-6 py-4">Ticket No</th>
                            <th class="px-6 py-4">หัวข้อการเบิก</th>
                            <th class="px-6 py-4">ผู้ขอเบิก (LINE ID)</th>
                            <th class="px-6 py-4 text-center">สถานะ</th>
                            <th class="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <template v-if="activeTab === 'repairs'">
                            <tr v-for="ticket in paginatedRepairTickets" :key="ticket._id"
                                class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 text-sm font-medium text-primary">{{ ticket.ticketNo }}</td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-medium text-gray-800 dark:text-white truncate w-64">{{
                                        ticket.title }}</p>
                                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(ticket.createdAt) }}</p>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-dark-text truncate w-32"
                                    :title="ticket.reporterId">
                                    {{ ticket.reporterId }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        :class="['px-3 py-1 rounded-full text-[10px] font-bold border uppercase', statusStyle(ticket.status)]">
                                        {{ formatStatus(ticket.status) }}
                                    </span>
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr v-for="ticket in paginatedReqTickets" :key="ticket._id"
                                class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 text-sm font-medium text-primary">{{ ticket.ticketNo }}</td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-medium text-gray-800 dark:text-white truncate w-64">{{
                                        ticket.title }}</p>
                                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(ticket.createdAt) }}</p>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-dark-text truncate w-32"
                                    :title="ticket.reporterId">
                                    {{ ticket.reporterId }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        :class="['px-3 py-1 rounded-full text-[10px] font-bold border uppercase', statusStyle(ticket.status)]">
                                        {{ formatStatus(ticket.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button
                                        class="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                                        title="ไปหน้าจัดการตั๋ว">
                                        <ArrowPathIcon class="w-4 h-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div
                class="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50">
                <p class="text-sm text-gray-500">แสดงหน้า {{ currentPage }} จาก {{ totalPages }}</p>
                <div class="flex gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="btn-paginate">ก่อนหน้า</button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="btn-paginate">ถัดไป</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
    TicketIcon, ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline'

// ✅ ดึงจาก API ตั๋วรวม
const BASE_URL = 'https://servern8n-production-a0f5.up.railway.app/api'
const pageSize = 6

const activeTab = ref('repairs')
const currentPage = ref(1)
const allTickets = ref([])
const loading = ref(true)
const lastUpdated = ref('')

watch(activeTab, () => { currentPage.value = 1 })

// 1. Fetch Logic
const fetchAllData = async () => {
    loading.value = true
    try {
        const res = await axios.get(`${BASE_URL}/tickets`)
        allTickets.value = res.data
        lastUpdated.value = new Date().toLocaleTimeString('th-TH')
    } catch (err) {
        console.error("API Error:", err)
    } finally {
        loading.value = false
    }
}

// 2. แยกประเภทงาน (ซ่อม vs เบิก) โดยดูจาก Category
const repairTickets = computed(() => allTickets.value.filter((t: any) => !t.category?.includes('Inventory')))
const requisitionTickets = computed(() => allTickets.value.filter((t: any) => t.category?.includes('Inventory')))

// 3. Pagination
const totalPages = computed(() => {
    const list = activeTab.value === 'repairs' ? repairTickets.value : requisitionTickets.value
    return Math.ceil(list.length / pageSize) || 1
})

const paginatedRepairTickets = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return [...repairTickets.value].slice(start, start + pageSize)
})

const paginatedReqTickets = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return [...requisitionTickets.value].slice(start, start + pageSize)
})

// 4. สถิติรวม
const totalTickets = computed(() => allTickets.value.length)
const pendingTickets = computed(() => allTickets.value.filter((t: any) => t.status === 'pending'))
const inProgressTickets = computed(() => allTickets.value.filter((t: any) => t.status === 'in-progress').length)
const resolvedTickets = computed(() => allTickets.value.filter((t: any) => t.status === 'completed').length)

// 5. Styles & Formatters
const formatStatus = (s: string) => {
    if (s === 'pending') return 'Pending'
    if (s === 'in-progress') return 'In Progress'
    if (s === 'completed') return 'Resolved'
    return s
}

const statusStyle = (s: string) => {
    if (s === 'pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    if (s === 'in-progress') return 'bg-purple-50 text-purple-600 border-purple-200'
    if (s === 'completed') return 'bg-green-50 text-green-600 border-green-200'
    return 'bg-gray-50 text-gray-500'
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('th-TH', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
}

// 6. Lifecycle
let timer: any = null
onMounted(() => {
    fetchAllData()
    timer = setInterval(fetchAllData, 30000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
@reference "tailwindcss";
@import "tailwindcss";

@theme {
    --color-dark-bg: #0f172a;
    --color-dark-card: #1e293b;
    --color-dark-muted: #64748b;
    --color-primary: #3b82f6;
}

.card {
    @apply rounded-2xl transition-all duration-300;
}

.btn-paginate {
    @apply px-4 py-2 bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors;
}
</style>