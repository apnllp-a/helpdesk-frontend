<template>
    <div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div v-for="(stat, index) in stats" :key="index" class="card flex items-center">
                <div :class="['p-3 rounded-full mr-4', stat.bgColor, stat.textColor]">
                    <component :is="stat.icon" class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-dark-muted">{{ stat.title }}</p>
                    <p class="text-3xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
                </div>
            </div>
        </div>

        <div class="card overflow-hidden">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">งานแจ้งซ่อมล่าสุด</h2>
                <router-link to="/tickets" class="text-sm text-primary hover:text-primary-light font-medium">
                    ดูทั้งหมด &rarr;
                </router-link>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-dark-text">ID</th>
                            <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-dark-text">หัวข้อปัญหา
                            </th>
                            <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-dark-text">ผู้แจ้ง</th>
                            <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-dark-text">สถานะ</th>
                            <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-dark-text">ผู้รับผิดชอบ
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ticket in recentTickets" :key="ticket.id"
                            class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="py-4 px-4 text-sm text-primary dark:text-primary-light font-medium">#{{ ticket.id
                                }}</td>
                            <td class="py-4 px-4 text-sm text-gray-800 dark:text-white">{{ ticket.subject }}</td>
                            <td class="py-4 px-4 text-sm text-gray-600 dark:text-dark-text">{{ ticket.user }}</td>
                            <td class="py-4 px-4">
                                <span
                                    :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyle(ticket.status)]">
                                    {{ ticket.status }}
                                </span>
                            </td>
                            <td class="py-4 px-4 text-sm text-gray-600 dark:text-dark-text">
                                {{ ticket.assignee || '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TicketIcon, ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

const stats = [
    { title: 'งานทั้งหมด', value: '124', icon: TicketIcon, bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'รอดำเนินการ', value: '12', icon: ClockIcon, bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { title: 'กำลังดำเนินการ', value: '5', icon: WrenchScrewdriverIcon, bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'เสร็จสิ้นแล้ว', value: '107', icon: CheckCircleIcon, bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400' },
]

const recentTickets = ref([
    { id: '1003', subject: 'ขอเบิกเมาส์ใหม่', user: 'คุณจอห์น (MKT)', status: 'Resolved', assignee: 'IT Admin' },
    { id: '1002', subject: 'เข้า Wi-Fi บริษัทไม่ได้', user: 'คุณสมหญิง (HR)', status: 'In Progress', assignee: 'IT Support A' },
    { id: '1001', subject: 'ปริ้นเตอร์แผนกบัญชีพิมพ์ไม่ออก', user: 'คุณสมชาย (ACC)', status: 'Pending', assignee: null },
    { id: '1000', subject: 'หน้าจอฟ้า เปิดไม่ติด', user: 'คุณวิชัย (SALES)', status: 'Pending', assignee: null },
])

const statusStyle = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
        case 'In Progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
        case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
}
</script>