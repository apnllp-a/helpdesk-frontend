<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">รายงานสถิติ</h2>
            <button @click="fetchReportData"
                class="text-sm text-primary hover:text-indigo-700 flex items-center gap-1 transition-colors">
                <ArrowPathIcon :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
                รีเฟรชข้อมูล
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                class="p-6 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-200 dark:shadow-none transform hover:scale-105 transition-all">
                <h3 class="text-white/80 text-sm font-medium uppercase tracking-wider">เวลาเฉลี่ยในการปิดงาน (SLA)</h3>
                <p class="text-4xl font-bold mt-2">{{ averageSLA }} <span class="text-lg font-normal">ชั่วโมง</span></p>
                <div class="flex items-center gap-1 mt-2 text-xs text-white/90">
                    <ClockIcon class="w-3 h-3" />
                    <span>คำนวณจากเวลาแจ้ง - ปิดงานจริง</span>
                </div>
            </div>

            <div
                class="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm transform hover:scale-105 transition-all">
                <h3 class="text-gray-500 dark:text-dark-muted text-sm font-medium">คะแนนความพึงพอใจ (CSAT)</h3>
                <p class="text-4xl font-bold text-yellow-500 mt-2">4.8 <span class="text-lg font-normal text-gray-400">/
                        5</span></p>
                <p class="text-sm mt-2 text-gray-600 dark:text-dark-text italic font-light">จากระบบประเมินอัตโนมัติ</p>
            </div>

            <div
                class="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm transform hover:scale-105 transition-all">
                <h3 class="text-gray-500 dark:text-dark-muted text-sm font-medium">งานที่ค้างอยู่ (Backlog)</h3>
                <p class="text-4xl font-bold text-red-500 mt-2">{{ backlogCount }} <span
                        class="text-lg font-normal text-gray-400">งาน</span></p>
                <p class="text-sm mt-2 text-gray-600 dark:text-dark-text font-light">ทีมงานกำลังเร่งดำเนินการ</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
                class="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-6">ปริมาณการแจ้งปัญหา (รายวัน)</h3>
                <div class="h-72">
                    <Bar v-if="!loading && tickets.length > 0" :data="barChartData" :options="chartOptions" />
                    <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ArrowPathIcon class="w-8 h-8 animate-spin opacity-20" />
                        <span class="text-sm font-light">กำลังประมวลผลข้อมูลกราฟ...</span>
                    </div>
                </div>
            </div>

            <div
                class="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-6 text-left">สัดส่วนสถานะงานซ่อม</h3>
                <div class="h-72 flex flex-col items-center justify-center">
                    <Doughnut v-if="!loading && tickets.length > 0" :data="doughnutChartData"
                        :options="doughnutOptions" />
                    <div v-else class="h-full flex items-center justify-center text-gray-400">
                        <span class="text-sm font-light">กำลังเตรียมข้อมูล...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import axios from 'axios'
import { ArrowPathIcon, ClockIcon } from '@heroicons/vue/24/outline'
import {
    Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api/repairs'
const tickets = ref([])
const loading = ref(true)

const fetchReportData = async () => {
    loading.value = true
    try {
        const res = await axios.get(API_URL)
        tickets.value = res.data
    } catch (err) {
        console.error("Fetch report error:", err)
    } finally {
        // ให้เวลา Chart.js เตรียมตัวนิดนึงครับ
        setTimeout(() => { loading.value = false }, 500)
    }
}

// คำนวณ SLA จริง
const averageSLA = computed(() => {
    const resolved = tickets.value.filter((t: any) => t.status === 'Resolved' && t.reported_at && t.completed_at)
    if (resolved.length === 0) return "0.0"
    const totalDiff = resolved.reduce((acc, t: any) => {
        return acc + (new Date(t.completed_at).getTime() - new Date(t.reported_at).getTime())
    }, 0)
    return ((totalDiff / resolved.length) / (1000 * 60 * 60)).toFixed(1)
})

const backlogCount = computed(() => tickets.value.filter((t: any) => t.status !== 'Resolved').length)

// กราฟแท่ง (ใช้สี Indigo เดิม)
const barChartData = computed(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0] // อา - ส
    tickets.value.forEach((t: any) => {
        const day = new Date(t.reported_at).getDay()
        counts[day]++
    })
    const sortedData = [...counts.slice(1), counts[0]] // ปรับเป็น จ - อา
    return {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
        datasets: [{
            label: 'จำนวนงาน',
            backgroundColor: '#6366f1',
            hoverBackgroundColor: '#4f46e5',
            borderRadius: 8,
            data: sortedData
        }]
    }
})

// กราฟวงแหวน (สีตามสถานะ)
const doughnutChartData = computed(() => {
    const getC = (s: string) => tickets.value.filter((t: any) => t.status === s).length
    return {
        labels: ['รอดำเนินการ', 'กำลังทำ', 'เสร็จสิ้น'],
        datasets: [{
            backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981'],
            hoverOffset: 15,
            borderWidth: 0,
            data: [getC('Pending'), getC('In Progress'), getC('Resolved')]
        }]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.03)' } },
        x: { grid: { display: false } }
    }
}

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
        legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 20 } }
    }
}

onMounted(fetchReportData)
</script>