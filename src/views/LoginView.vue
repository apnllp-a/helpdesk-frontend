<template>
    <div
        class="min-h-screen flex items-center justify-center bg-secondary-light dark:bg-dark-bg transition-colors duration-300 p-4">
        <div class="absolute top-4 right-4">
            <ThemeToggle />
        </div>

        <div class="w-full max-w-md p-8 shadow-2xl bg-white dark:bg-dark-card rounded-2xl transition-all">
            <div class="text-center mb-10">
                <div
                    class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00B900]/10 dark:bg-[#00B900]/20 mb-6">
                    <WrenchScrewdriverIcon class="w-10 h-10 text-[#00B900]" />
                </div>
                <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                    IT Helpdesk
                </h2>
                <p class="mt-3 text-sm text-gray-500 dark:text-dark-muted">
                    ระบบจัดการสำหรับเจ้าหน้าที่เท่านั้น
                </p>
            </div>

            <div class="space-y-6">
                <button @click="loginWithLine" :disabled="isLoading"
                    class="w-full flex justify-center items-center px-4 py-3.5 border border-transparent rounded-xl shadow-lg shadow-[#00B900]/30 text-base font-bold text-white bg-[#00B900] hover:bg-[#009900] transform transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70">
                    <img v-if="!isLoading" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                        alt="LINE" class="w-7 h-7 mr-3" />
                    <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span>{{ isLoading ? 'กำลังไปหน้า LINE...' : 'เข้าสู่ระบบด้วย LINE' }}</span>
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/solid'

const isLoading = ref(false)

// 🎯 ข้อมูลที่ต้องใช้ (แนะนำให้เอาไปไว้ใน .env ของ Frontend)
const LINE_CLIENT_ID = '2009544560'
const REDIRECT_URI = encodeURIComponent('https://helpdesk-frontend-2asnq4cla-apinanlimlampai-1234s-projects.vercel.app/callback') // หรือ URL จริงของพี่

const loginWithLine = () => {
    isLoading.value = true

    // สร้าง URL สำหรับไปหน้ายืนยันตัวตนของ LINE
    const state = Math.random().toString(36).substring(7) // สร้าง string สุ่มเพื่อความปลอดภัย
    const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=profile%20openid%20email`

    // ส่งผู้ใช้ไปหน้า Login ของ LINE
    window.location.href = lineUrl
}
</script>
