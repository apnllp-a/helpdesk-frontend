<template>
    <div class="space-y-6 relative">
        <div class="card flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="ค้นหา Ticket ID, หัวข้อปัญหา..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <select v-model="statusFilter"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="">ทุกสถานะ</option>
                    <option value="Pending">รอดำเนินการ</option>
                    <option value="In Progress">กำลังดำเนินการ</option>
                    <option value="Resolved">เสร็จสิ้น</option>
                </select>
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
                        <tr v-if="paginatedTickets.length === 0">
                            <td colspan="5" class="py-8 text-center text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
                        </tr>
                        <tr v-for="ticket in paginatedTickets" :key="ticket.id"
                            class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                            <td class="py-4 px-6 text-sm font-medium text-primary">#{{ ticket.id }}</td>
                            <td class="py-4 px-6">
                                <p class="text-sm font-medium text-gray-800 dark:text-white">{{ ticket.subject }}</p>
                                <p class="text-xs text-gray-500 dark:text-dark-muted mt-1 truncate w-48">{{ ticket.desc
                                    }}</p>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-700 dark:text-dark-text">{{ ticket.user }}</td>
                            <td class="py-4 px-6">
                                <span
                                    :class="['px-3 py-1 rounded-full text-xs font-medium border', statusStyle(ticket.status)]">
                                    {{ ticket.status }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-right space-x-2">
                                <button @click="openModal(ticket)"
                                    class="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                                    title="ดูรายละเอียด/แก้ไข">
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
            <div
                class="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform transition-all">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">รายละเอียดงาน #{{ selectedTicket?.id }}
                    </h3>
                    <button @click="showModal = false"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs text-gray-500 dark:text-dark-muted">หัวข้อปัญหา</label>
                        <p class="text-sm font-medium text-gray-800 dark:text-white">{{ selectedTicket?.subject }}</p>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500 dark:text-dark-muted">รายละเอียด</label>
                        <p
                            class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-bg p-3 rounded-lg mt-1">
                            {{ selectedTicket?.desc }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs text-gray-500 dark:text-dark-muted">ผู้แจ้ง</label>
                            <p class="text-sm text-gray-800 dark:text-white">{{ selectedTicket?.user }}</p>
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 dark:text-dark-muted">เปลี่ยนสถานะ</label>
                            <select v-model="selectedTicket.status"
                                class="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-sm">
                                <option value="Pending">รอดำเนินการ</option>
                                <option value="In Progress">กำลังดำเนินการ</option>
                                <option value="Resolved">เสร็จสิ้น</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button @click="showModal = false"
                        class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">ปิด</button>
                    <button @click="saveTicket" class="btn-primary text-sm">บันทึกข้อมูล</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Mock Data
const tickets = ref([
    { id: '1005', subject: 'จอคอมพิวเตอร์กะพริบ', desc: 'จอ LG ที่โต๊ะทำงานมีอาการกะพริบเป็นช่วงๆ ขอให้มาตรวจสอบ', user: 'คุณสมศักดิ์ (IT)', status: 'Pending' },
    { id: '1004', subject: 'ลืมรหัสผ่าน ERP', desc: 'เข้าระบบ ERP ไม่ได้ ต้องการให้รีเซ็ตรหัสผ่านใหม่ด่วน', user: 'คุณมาลี (HR)', status: 'Pending' },
    { id: '1003', subject: 'ขอเบิกเมาส์ใหม่', desc: 'เมาส์คลิกซ้ายไม่ติด ขอเบิกตัวใหม่ครับ', user: 'คุณจอห์น (MKT)', status: 'Resolved' },
    { id: '1002', subject: 'เข้า Wi-Fi บริษัทไม่ได้', desc: 'เปลี่ยนรหัสผ่านใหม่แล้วแต่ยังเชื่อมต่อไม่ได้ ขึ้น Authentication Error', user: 'คุณสมหญิง (HR)', status: 'In Progress' },
    { id: '1001', subject: 'ปริ้นเตอร์แผนกบัญชีพิมพ์ไม่ออก', desc: 'สั่งปริ้นแล้วคิวค้าง เครื่องไม่ทำงาน ไฟแดงกระพริบ', user: 'คุณสมชาย (ACC)', status: 'Resolved' },
])

// ฟังก์ชันค้นหา & กรอง
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 3

const filteredTickets = computed(() => {
    return tickets.value.filter(t => {
        const matchSearch = t.subject.includes(searchQuery.value) || t.id.includes(searchQuery.value)
        const matchStatus = statusFilter.value ? t.status === statusFilter.value : true
        return matchSearch && matchStatus
    })
})

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage))

const paginatedTickets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredTickets.value.slice(start, start + itemsPerPage)
})

// ระบบ Modal
const showModal = ref(false)
const selectedTicket = ref<any>(null)

const openModal = (ticket: any) => {
    selectedTicket.value = { ...ticket } // Copy ข้อมูลกันแก้แล้วกระทบตารางทันที
    showModal.value = true
}

const saveTicket = () => {
    const index = tickets.value.findIndex(t => t.id === selectedTicket.value.id)
    if (index !== -1) {
        tickets.value[index].status = selectedTicket.value.status
    }
    showModal.value = false
    alert('บันทึกข้อมูลเรียบร้อยแล้ว (Mock)')
}

const statusStyle = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-400'
        case 'In Progress': return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-400'
        case 'Resolved': return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400'
        default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
}
</script>