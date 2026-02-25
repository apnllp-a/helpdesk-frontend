<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">จัดการผู้ใช้งานระบบ</h2>
            <button class="btn-primary text-sm px-3 py-1.5">เพิ่มเจ้าหน้าที่</button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="pb-3 text-sm font-semibold text-gray-500 dark:text-dark-muted">ชื่อ-นามสกุล</th>
                        <th class="pb-3 text-sm font-semibold text-gray-500 dark:text-dark-muted">อีเมล</th>
                        <th class="pb-3 text-sm font-semibold text-gray-500 dark:text-dark-muted">สิทธิ์การใช้งาน (Role)
                        </th>
                        <th class="pb-3 text-sm font-semibold text-gray-500 dark:text-dark-muted">สถานะ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="user in users" :key="user.id">
                        <td class="py-4 font-medium text-gray-800 dark:text-white flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                {{ user.name.charAt(0) }}
                            </div>
                            {{ user.name }}
                        </td>
                        <td class="py-4 text-sm text-gray-600 dark:text-dark-text">{{ user.email }}</td>
                        <td class="py-4">
                            <span v-if="user.role === 'admin'"
                                class="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">Admin</span>
                            <span v-else
                                class="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold dark:bg-blue-900/30 dark:text-blue-400">IT
                                Support</span>
                        </td>
                        <td class="py-4">
                            <span class="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span> ใช้งานปกติ
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
    { id: 1, name: 'อภินันท์ แอดมิน', email: 'admin@company.com', role: 'admin' },
    { id: 2, name: 'สมชาย ไอทีซัพพอร์ต', email: 'somchai.it@company.com', role: 'support' },
    { id: 3, name: 'วิภาดา ฝ่ายระบบ', email: 'wipada.s@company.com', role: 'support' },
])
</script>