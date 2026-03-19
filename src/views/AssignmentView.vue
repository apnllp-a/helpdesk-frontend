<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="staff in staffLoad" :key="staff.id"
                class="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border-l-4"
                :class="staff.taskCount > 5 ? 'border-red-500' : 'border-green-500'">
                <div class="flex items-center space-x-3">
                    <img :src="staff.avatar" class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 dark:text-white">{{ staff.name }}</h3>
                        <div class="flex items-center justify-between mt-1">
                            <span class="text-xs text-gray-500">งานในมือ: {{ staff.taskCount }} รายการ</span>
                            <span :class="staff.taskCount > 5 ? 'text-red-500' : 'text-green-500'"
                                class="text-[10px] font-bold uppercase">
                                {{ staff.taskCount > 5 ? 'Busy' : 'Available' }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3">
                    <div class="h-1.5 rounded-full transition-all duration-500"
                        :style="{ width: (staff.taskCount * 10) + '%', backgroundColor: staff.taskCount > 5 ? '#ef4444' : '#22c55e' }">
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <TicketIcon class="w-6 h-6 mr-2 text-primary" />
                    รายการงานรอมอบหมาย
                </h2>
                <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {{ pendingTickets.length }} งานใหม่
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-dark-muted text-sm uppercase">
                            <th class="px-6 py-4">Ticket</th>
                            <th class="px-6 py-4">ความสำคัญ</th>
                            <th class="px-6 py-4">หมวดหมู่</th>
                            <th class="px-6 py-4">มอบหมายให้</th>
                            <th class="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr v-for="ticket in pendingTickets" :key="ticket.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-gray-800 dark:text-white">#{{ ticket.no }}</div>
                                <div class="text-sm text-gray-500 truncate max-w-[200px]">{{ ticket.title }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="priorityClass(ticket.priority)"
                                    class="px-2 py-1 rounded text-[10px] font-bold uppercase">
                                    {{ ticket.priority }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-dark-text">
                                {{ ticket.category }}
                            </td>
                            <td class="px-6 py-4">
                                <select @change="assignTask(ticket.id, $event)"
                                    class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
                                    <option selected disabled>เลือกผู้รับผิดชอบ...</option>
                                    <option v-for="staff in staffLoad" :key="staff.id" :value="staff.id">
                                        {{ staff.name }} ({{ staff.taskCount }} งาน)
                                    </option>
                                </select>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button @click="viewDetail(ticket.id)"
                                    class="text-primary hover:underline text-sm font-medium">ดูรายละเอียด</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TicketIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'

// Mock ข้อมูลเจ้าหน้าที่และโหลดงาน
const staffLoad = ref([
    { id: 1, name: 'คุณมานะ (Hardware)', taskCount: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'คุณวิชัย (Software)', taskCount: 8, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'คุณสมศรี (Network)', taskCount: 4, avatar: 'https://i.pravatar.cc/150?u=3' },
])

// Mock รายการงานที่รอการมอบหมาย
const pendingTickets = ref([
    { id: 101, no: 'TK-001', title: 'เครื่องพิมพ์ชั้น 2 พิมพ์ไม่ออก', priority: 'high', category: 'Hardware' },
    { id: 102, no: 'TK-002', title: 'ขอติดตั้งโปรแกรม Adobe', priority: 'low', category: 'Software' },
    { id: 103, no: 'TK-003', title: 'Internet ห้องประชุมกระตุก', priority: 'urgent', category: 'Network' },
])

const priorityClass = (p: string) => {
    if (p === 'urgent') return 'bg-red-100 text-red-600'
    if (p === 'high') return 'bg-orange-100 text-orange-600'
    return 'bg-blue-100 text-blue-600'
}

const assignTask = async (ticketId: number, event: any) => {
    const staffId = event.target.value
    const staff = staffLoad.value.find(s => s.id == staffId)

    const result = await Swal.fire({
        title: 'ยืนยันการมอบหมาย?',
        text: `มอบหมายงานนี้ให้ ${staff?.name} ใช่หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
        // ในอนาคต พี่ต้องยิง API ไป Update ใน MongoDB ตรงนี้ครับ
        Swal.fire('สำเร็จ!', 'มอบหมายงานเรียบร้อยแล้ว เจ้าหน้าที่จะได้รับแจ้งเตือนทาง LINE', 'success')
        // ลบออกจากรายการรอมอบหมายแบบ Mockup
        pendingTickets.value = pendingTickets.value.filter(t => t.id !== ticketId)
    }
}
</script>