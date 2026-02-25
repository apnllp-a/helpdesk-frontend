<template>
    <div
        class="min-h-screen flex items-center justify-center bg-secondary-light dark:bg-dark-bg transition-colors duration-300 p-4">
        <div class="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <div class="card w-full max-w-md">
            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                    <WrenchScrewdriverIcon class="w-8 h-8 text-primary" />
                </div>
                <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white">
                    IT Helpdesk
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-dark-muted">
                    {{ isRegister ? 'สมัครสมาชิกสำหรับเจ้าหน้าที่' : 'เข้าสู่ระบบเพื่อจัดการงาน' }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="isRegister">
                    <label class="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">ชื่อ-นามสกุล</label>
                    <input type="text" v-model="form.name" required
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="สมชาย ใจดี" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">อีเมล</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" v-model="form.email" required
                            class="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="you@example.com" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">รหัสผ่าน</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon class="h-5 w-5 text-gray-400" />
                        </div>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
                            class="w-full pl-10 pr-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="••••••••" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                            <EyeSlashIcon v-else class="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn-primary w-full flex justify-center items-center">
                    {{ isRegister ? 'ลงทะเบียน' : 'เข้าสู่ระบบ' }}
                </button>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-muted">
                            หรือ
                        </span>
                    </div>
                </div>

                <button @click="loginWithLine"
                    class="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00B900] hover:bg-[#009900] transition-colors">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE"
                        class="w-5 h-5 mr-2" />
                    <span>เข้าสู่ระบบด้วย LINE</span>
                </button>
            </div>

            <p class="mt-8 text-center text-sm text-gray-600 dark:text-dark-muted">
                {{ isRegister ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?' }}
                <button @click="isRegister = !isRegister"
                    class="font-medium text-primary hover:text-primary-light transition-colors">
                    {{ isRegister ? 'เข้าสู่ระบบ' : 'สมัครเลย' }}
                </button>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { WrenchScrewdriverIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const isRegister = ref(false)
const showPassword = ref(false)
const form = ref({ name: '', email: '', password: '' })

const handleSubmit = () => {
    // จำลองการล็อกอิน
    console.log(isRegister.value ? 'Registering...' : 'Logging in...', form.value)
    localStorage.setItem('token', 'dummy-token-123')
    localStorage.setItem('role', 'admin')
    router.push('/')
}

const loginWithLine = () => {
    alert('เชื่อมต่อ LINE Login API ที่นี่')
}
</script>