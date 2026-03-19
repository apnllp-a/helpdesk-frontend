<template>
    <div class="space-y-6 relative">
        <div class="card flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="ค้นหาเลขตั๋ว (FIX-...), หัวข้อปัญหา..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <select v-model="statusFilter"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="">ทุกสถานะ</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="in-progress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
                </select>
                <button @click="fetchTickets"
                    class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowPathIcon
                        :class="['w-5 h-5 text-gray-600 dark:text-gray-300', loading ? 'animate-spin' : '']" />
                </button>
            </div>
        </div>

        <div class="card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700">
                            <th class="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-dark-text">Ticket ID</th>
                            <th class="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-dark-text">
                                รายละเอียดปัญหา</th>
                            <th class="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-dark-text">ผู้แจ้ง</th>
                            <th class="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-dark-text">สถานะ</th>
                            <th class="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-dark-text text-right">
                                จัดการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr v-if="loading">
                            <td colspan="5" class="py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                        </tr>
                        <tr v-else-if="paginatedTickets.length === 0">
                            <td colspan="5" class="py-8 text-center text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
                        </tr>
                        <tr v-for="ticket in paginatedTickets" :key="ticket.id"
                            class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                            <td class="py-4 px-6 text-sm font-medium text-primary">
                                {{ ticket.ticketNo }}
                            </td>
                            <td class="py-4 px-6">
                                <p class="text-sm font-medium text-gray-800 dark:text-white">{{ ticket.subject }}</p>
                                <p class="text-xs text-gray-500 dark:text-dark-muted mt-1 truncate w-48">{{ ticket.desc
                                }}</p>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-700 dark:text-dark-text">{{ ticket.user }}</td>
                            <td class="py-4 px-6">
                                <span
                                    :class="['px-3 py-1 rounded-full text-xs font-medium border', statusStyle(ticket.status)]">
                                    {{ formatStatus(ticket.status) }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-right">
                                <button @click="openModal(ticket)"
                                    class="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <EyeIcon class="w-5 h-5 inline" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800 mt-4">
                <span class="text-sm text-gray-500 dark:text-dark-muted">พบทั้งหมด {{ filteredTickets.length }}
                    รายการ</span>
                <div class="flex gap-1">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">&laquo;</button>
                    <button class="px-3 py-1 rounded border border-primary bg-primary text-white">{{ currentPage
                    }}</button>
                    <button @click="currentPage++" :disabled="currentPage >= totalPages"
                        class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">&raquo;</button>
                </div>
            </div>
        </div>

        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">จัดการงาน {{ selectedTicket?.ticketNo }}
                    </h3>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs text-gray-500">หมวดหมู่</label>
                        <p class="text-sm font-medium text-primary">{{ selectedTicket?.category }}</p>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">หัวข้อปัญหา</label>
                        <p class="text-sm font-medium dark:text-white">{{ selectedTicket?.subject }}</p>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">รายละเอียด</label>
                        <p
                            class="text-sm bg-gray-50 dark:bg-dark-bg p-3 rounded-lg mt-1 dark:text-gray-300 whitespace-pre-line">
                            {{
                                selectedTicket?.desc }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs text-gray-500">ผู้แจ้ง (LINE ID)</label>
                            <p class="text-sm dark:text-white truncate" :title="selectedTicket?.user">{{
                                selectedTicket?.user }}</p>
                        </div>
                        <div>
                            <label class="text-xs text-gray-500">สถานะปัจจุบัน</label>
                            <select v-model="selectedTicket.status"
                                class="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-sm">
                                <option value="pending">Pending (รอดำเนินการ)</option>
                                <option value="in-progress">In Progress (กำลังทำ)</option>
                                <option value="completed">Completed (เสร็จสิ้น)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button @click="showModal = false" class="px-4 py-2 text-sm text-gray-600">ปิด</button>
                    <button @click="saveTicket" class="btn-primary text-sm px-6">บันทึกและอัปเดต</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import Swal from 'sweetalert2'

// ✅ เปลี่ยนมาใช้ API /tickets
const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api/tickets'

const tickets = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const showModal = ref(false)
const selectedTicket = ref<any>(null)

// 1. Fetch Data จาก MongoDB
const fetchTickets = async () => {
    loading.value = true
    try {
        const res = await axios.get(API_URL)
        // ✅ Map ข้อมูลให้เข้ากับ Field ของ DB ตารางใหม่ (tickets)
        tickets.value = res.data.map((t: any) => ({
            id: t._id,
            ticketNo: t.ticketNo || 'N/A',
            category: t.category || 'ทั่วไป',
            subject: t.title || 'ไม่มีหัวข้อ',
            desc: t.description || 'ไม่มีรายละเอียด',
            user: t.reporterId || 'ไม่ทราบชื่อ', // ถ้าอนาคตมีการจอยชื่อ User ค่อยเอามาใส่
            status: t.status || 'pending'
        }))
    } catch (err) {
        console.error(err)
        Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลได้', 'error')
    } finally {
        loading.value = false
    }
}

// 2. บันทึกการเปลี่ยนสถานะ
const saveTicket = async () => {
    try {
        Swal.fire({
            title: 'กำลังบันทึกและส่งการแจ้งเตือน...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        // ✅ ยิง API อัปเดตตั๋ว (ผมเพิ่ม Route นี้ให้ใน Server แล้ว)
        const res = await axios.put(`${API_URL}/admin/${selectedTicket.value.id}`, {
            status: selectedTicket.value.status
        });

        const updatedData = res.data.data;

        // ตรงนี้ถ้า Webhook ของพี่ยังรับ parameter เดิมอยู่ ก็ส่งไปตามนี้ก่อนได้ครับ
        await axios.post('https://secure-generosity-production-ebfa.up.railway.app/webhook/update-notification', {
            userId: updatedData.reporterId, // เปลี่ยนจาก userId เป็น reporterId ตามตารางใหม่
            status: updatedData.status,
            details: updatedData.description, // เปลี่ยนเป็น description
            admin: 'Admin'
        });

        Swal.fire({
            icon: 'success',
            title: 'อัปเดตสำเร็จ!',
            text: 'ระบบได้แจ้งเตือนสถานะใหม่ไปยัง LINE ลูกค้าเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });

        showModal.value = false;
        fetchTickets();

    } catch (err) {
        console.error("Save Ticket Error:", err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'อัปเดตสถานะไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        });
    }
}

// Logic: ค้นหาและกรอง (เพิ่มการค้นหาด้วย TicketNo)
const filteredTickets = computed(() => {
    return tickets.value.filter((t: any) => {
        const query = searchQuery.value.toLowerCase()
        const matchSearch = t.subject.toLowerCase().includes(query) ||
            t.ticketNo.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query)

        const matchStatus = statusFilter.value ? t.status === statusFilter.value : true
        return matchSearch && matchStatus
    })
})

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage))

const paginatedTickets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredTickets.value.slice(start, start + itemsPerPage)
})

const openModal = (ticket: any) => {
    selectedTicket.value = { ...ticket }
    showModal.value = true
}

// ✅ จัดรูปแบบสีและข้อความให้ตรงกับ DB ใหม่
const formatStatus = (status: string) => {
    switch (status) {
        case 'pending': return 'Pending'
        case 'in-progress': return 'In Progress'
        case 'completed': return 'Resolved'
        default: return status
    }
}

const statusStyle = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-400'
        case 'in-progress': return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-400'
        case 'completed': return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400'
        default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
}

onMounted(fetchTickets)
</script>