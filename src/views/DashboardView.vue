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
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">งานซ่อมทั้งหมด</p>
                    <h2 class="text-2xl font-bold dark:text-white">{{ totalTickets }}</h2>
                </div>
            </div>

            <div
                class="card p-6 flex items-center gap-4 border-l-4 border-yellow-500 shadow-sm bg-white dark:bg-dark-card relative">
                <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600">
                    <ClockIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">รออนุมัติของ</p>
                    <h2 class="text-2xl font-bold dark:text-white text-yellow-600">{{ pendingRequisitions.length }}</h2>
                </div>
                <div v-if="pendingRequisitions.length > 0" class="absolute -top-2 -right-2">
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
                <span v-if="pendingRequisitions.length"
                    class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{{ pendingRequisitions.length
                    }}</span>
            </button>
        </div>

        <div class="card overflow-hidden shadow-sm bg-white dark:bg-dark-card min-h-[450px] flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 dark:text-white text-lg">
                    {{ activeTab === 'repairs' ? 'งานแจ้งซ่อมล่าสุด' : 'รายการคำขอเบิกอุปกรณ์' }}
                </h3>
            </div>

            <div class="flex-grow overflow-x-auto">
                <table class="w-full text-left">
                    <thead
                        class="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-dark-muted text-xs uppercase font-semibold">
                        <tr v-if="activeTab === 'repairs'">
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">หัวข้อปัญหา</th>
                            <th class="px-6 py-4">ผู้แจ้ง</th>
                            <th class="px-6 py-4 text-center">สถานะ</th>
                            <th class="px-6 py-4 text-right">ผู้รับผิดชอบ</th>
                        </tr>
                        <tr v-else>
                            <th class="px-6 py-4">ผู้ขอเบิก</th>
                            <th class="px-6 py-4">อุปกรณ์</th>
                            <th class="px-6 py-4 text-center">จำนวน</th>
                            <th class="px-6 py-4 text-center">สถานะ</th>
                            <th class="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <template v-if="activeTab === 'repairs'">
                            <tr v-for="ticket in paginatedTickets" :key="ticket._id"
                                class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 text-sm font-medium text-primary uppercase">#{{
                                    ticket._id.substring(ticket._id.length - 4) }}</td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-medium text-gray-800 dark:text-white truncate w-64">{{
                                        ticket.problem_details }}</p>
                                    <p class="text-xs text-gray-400">{{ formatDate(ticket.reported_at) }}</p>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-dark-text">{{ ticket.senderName ||
                                    'ลูกค้าทั่วไป' }}</td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        :class="['px-3 py-1 rounded-full text-[10px] font-bold border uppercase', statusStyle(ticket.status)]">
                                        {{ ticket.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-right text-gray-500 font-medium">{{ ticket.action_by
                                    || '-' }}</td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr v-for="req in paginatedRequisitions" :key="req._id"
                                class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <p class="text-sm font-medium dark:text-white">{{ req.senderName || 'ไม่ระบุชื่อ' }}
                                    </p>
                                    <p class="text-xs text-gray-400">{{ formatDate(req.requested_at) }}</p>
                                </td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-800 dark:text-white">{{ req.item_name
                                    }}</td>
                                <td class="px-6 py-4 text-center font-mono font-bold">{{ req.quantity }}</td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        :class="['px-3 py-1 rounded-full text-[10px] font-bold border uppercase', reqStatusStyle(req.status)]">
                                        {{ req.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div v-if="req.status === 'Pending'" class="flex justify-end gap-2">
                                        <button @click="approveRequest(req)"
                                            class="btn-action bg-green-500 hover:bg-green-600 text-white">
                                            <CheckIcon class="w-4 h-4" />
                                        </button>
                                        <button @click="rejectRequest(req)"
                                            class="btn-action bg-red-500 hover:bg-red-600 text-white">
                                            <XMarkIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span v-else class="text-xs text-gray-400 italic">โดย {{ req.action_by || 'Admin'
                                        }}</span>
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
    TicketIcon, ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon, ArrowPathIcon, CheckIcon, XMarkIcon
} from '@heroicons/vue/24/outline'

// Config
const BASE_URL = 'https://servern8n-production-a0f5.up.railway.app/api'
const pageSize = 6

// State
const activeTab = ref('repairs')
const currentPage = ref(1)
const tickets = ref([])
const requisitions = ref([])
const loading = ref(true)
const lastUpdated = ref('')

// Watch tab change to reset pagination
watch(activeTab, () => { currentPage.value = 1 })

// Fetch Logic
const fetchAllData = async () => {
    loading.value = true
    try {
        const [repRes, reqRes] = await Promise.all([
            axios.get(`${BASE_URL}/repairs`),
            axios.get(`${BASE_URL}/requisitions`)
        ])
        tickets.value = repRes.data
        requisitions.value = reqRes.data
        lastUpdated.value = new Date().toLocaleTimeString('th-TH')
    } catch (err) {
        console.error("API Error:", err)
    } finally {
        loading.value = false
    }
}

// Pagination Computeds
const totalPages = computed(() => {
    const list = activeTab.value === 'repairs' ? tickets.value : requisitions.value
    return Math.ceil(list.length / pageSize) || 1
})

const paginatedTickets = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return [...tickets.value].slice(start, start + pageSize)
})

const paginatedRequisitions = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return [...requisitions.value].slice(start, start + pageSize)
})

const pendingRequisitions = computed(() => requisitions.value.filter((r: any) => r.status === 'Pending'))

// Stats Computeds
const totalTickets = computed(() => tickets.value.length)
const inProgressTickets = computed(() => tickets.value.filter((t: any) => t.status === 'In Progress').length)
const resolvedTickets = computed(() => tickets.value.filter((t: any) => t.status === 'Resolved').length)

// Action Handlers with Swal
const approveRequest = async (req: any) => {
    const result = await Swal.fire({
        title: 'ยืนยันอนุมัติ?',
        text: `คุณกำลังจะอนุมัติเบิก ${req.item_name} จำนวน ${req.quantity} ชิ้น`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        confirmButtonText: 'ยืนยันอนุมัติ',
        cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
        try {
            await axios.put(`${BASE_URL}/requisitions/approve/${req._id}`, { action_by: 'Dashboard Admin' })
            await axios.post('URL_WEBHOOK_N8N_ของพี่', {
                type: 'dashboard_approval',
                replyToken: req.replyToken,
                userId: req.userId,
                item_name: req.item_name,
                quantity: req.quantity
            });
            Swal.fire('สำเร็จ!', 'อนุมัติและตัดสต๊อกเรียบร้อยแล้ว แจ้งเตือนเข้า LINE แล้วครับ', 'success')
            fetchAllData()
        } catch (err) {
            Swal.fire('ผิดพลาด', 'ไม่สามารถอนุมัติได้ในขณะนี้', 'error')
        }
    }
}

const rejectRequest = (req: any) => {
    Swal.fire('Coming Soon', 'ระบบปฏิเสธกำลังพัฒนา...', 'info')
}

// Styles & Formatters
const statusStyle = (s: string) => {
    if (s === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    if (s === 'In Progress') return 'bg-purple-50 text-purple-600 border-purple-200'
    if (s === 'Resolved') return 'bg-green-50 text-green-600 border-green-200'
    return 'bg-gray-50 text-gray-500'
}

const reqStatusStyle = (s: string) => {
    if (s === 'Pending') return 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
    if (s === 'Approved') return 'bg-green-50 text-green-600 border-green-200 font-bold'
    return 'bg-red-50 text-red-600 border-red-200'
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('th-TH', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
}

// Lifecycle
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
    /* ประกาศสีที่พี่ต้องการใช้ในโปรเจกต์ */
    --color-dark-bg: #0f172a;
    /* สีพื้นหลังเข้ม (ปรับโค้ดสีตามใจชอบ) */
    --color-dark-card: #1e293b;
    /* สีการ์ดเข้ม */
    --color-dark-muted: #64748b;
    /* สีตัวหนังสือจางๆ */
    --color-primary: #3b82f6;
    /* สีหลักของแอป */
}

.card {
    @apply rounded-2xl transition-all duration-300;
}

.btn-paginate {
    @apply px-4 py-2 bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors;
}

.btn-action {
    @apply p-2 rounded-lg transition-transform active:scale-90 shadow-sm;
}
</style>