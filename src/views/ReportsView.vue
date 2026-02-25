<template>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">รายงานสถิติ (Reports)</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                class="card bg-gradient-to-br from-primary to-primary-light text-white border-none shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
                <h3 class="text-white/80 text-sm font-medium">เวลาเฉลี่ยในการปิดงาน (SLA)</h3>
                <p class="text-4xl font-bold mt-2">2.4 <span class="text-lg font-normal">ชั่วโมง</span></p>
                <p class="text-xs mt-2 text-white/90">↓ เร็วขึ้นกว่าเดือนที่แล้ว 15%</p>
            </div>
            <div class="card transform hover:scale-105 transition-transform">
                <h3 class="text-gray-500 dark:text-dark-muted text-sm font-medium">คะแนนความพึงพอใจ (CSAT)</h3>
                <p class="text-4xl font-bold text-yellow-500 mt-2">4.8 <span class="text-lg font-normal text-gray-400">/
                        5</span></p>
                <p class="text-sm mt-2 text-gray-600 dark:text-dark-text">จากผู้ประเมิน 86 คน</p>
            </div>
            <div class="card transform hover:scale-105 transition-transform">
                <h3 class="text-gray-500 dark:text-dark-muted text-sm font-medium">งานที่ค้างอยู่ (Backlog)</h3>
                <p class="text-4xl font-bold text-red-500 mt-2">12 <span
                        class="text-lg font-normal text-gray-400">งาน</span></p>
                <p class="text-sm mt-2 text-gray-600 dark:text-dark-text">ทีมงานกำลังเร่งดำเนินการ</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">ปริมาณการแจ้งปัญหา (7 วันย้อนหลัง)</h3>
                <div class="h-64">
                    <Bar :data="barChartData" :options="chartOptions" />
                </div>
            </div>

            <div class="card">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">สัดส่วนประเภทปัญหา</h3>
                <div class="h-64 flex justify-center">
                    <Doughnut :data="doughnutChartData" :options="doughnutOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Bar, Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js'

// ลงทะเบียน Component ของ Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// ข้อมูลสำหรับ Bar Chart (กราฟแท่ง)
const barChartData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    datasets: [
        {
            label: 'จำนวนงาน (Tickets)',
            backgroundColor: '#7286D3', // สี primary
            borderRadius: 6,
            data: [12, 19, 15, 25, 22, 5, 2]
        }
    ]
}

// ข้อมูลสำหรับ Doughnut Chart (กราฟวงแหวน)
const doughnutChartData = {
    labels: ['ฮาร์ดแวร์', 'ซอฟต์แวร์', 'เครือข่าย', 'เบิกอุปกรณ์'],
    datasets: [
        {
            backgroundColor: ['#7286D3', '#8EA7E9', '#E5E0FF', '#FFF2F2'],
            borderWidth: 0,
            data: [45, 25, 20, 10]
        }
    ]
}

// ตั้งค่า Options ให้กราฟดูสวยงามและ Responsive
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' } },
        x: { grid: { display: false } }
    }
}

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const }
    },
    cutout: '70%' // ทำให้ตรงกลางกลวง (วงแหวน)
}
</script>