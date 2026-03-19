<template>
    <div class="card space-y-6 relative">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">จัดการผู้ใช้งานระบบ</h2>
            <button @click="openModal()"
                class="btn-primary text-sm px-4 py-2 flex items-center gap-2 shadow-lg shadow-primary/30">
                <span>+ เพิ่มผู้ใช้งาน</span>
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-bg/50">
                        <th class="py-4 px-4 text-sm font-semibold text-gray-500 dark:text-dark-muted">ชื่อ-นามสกุล</th>
                        <th class="py-4 px-4 text-sm font-semibold text-gray-500 dark:text-dark-muted">แผนก (Dept)</th>
                        <th class="py-4 px-4 text-sm font-semibold text-gray-500 dark:text-dark-muted">สิทธิ์การใช้งาน
                            (Role)</th>
                        <th class="py-4 px-4 text-sm font-semibold text-gray-500 dark:text-dark-muted">สถานะ</th>
                        <th class="py-4 px-4 text-sm font-semibold text-gray-500 dark:text-dark-muted text-right">จัดการ
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-if="loading">
                        <td colspan="5" class="py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                    </tr>
                    <tr v-else-if="users.length === 0">
                        <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีข้อมูลผู้ใช้งาน</td>
                    </tr>
                    <tr v-for="user in users" :key="user._id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td class="py-4 px-4 font-medium text-gray-800 dark:text-white flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                {{ user.firstName ? user.firstName.charAt(0) : '?' }}
                            </div>
                            <div>
                                <p>{{ user.firstName }} {{ user.lastName }}</p>
                                <p class="text-xs text-gray-500 font-normal">LINE ID: {{ user.lineUserId || '-' }}</p>
                            </div>
                        </td>
                        <td class="py-4 px-4 text-sm text-gray-600 dark:text-dark-text">{{ user.department || '-' }}
                        </td>
                        <td class="py-4 px-4">
                            <span v-if="user.role === 'admin'"
                                class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">Admin</span>
                            <span v-else
                                class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold dark:bg-blue-900/30 dark:text-blue-400">User</span>
                        </td>
                        <td class="py-4 px-4">
                            <span v-if="user.active"
                                class="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                                <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> ใช้งานปกติ
                            </span>
                            <span v-else
                                class="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 font-medium">
                                <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> ปิดกั้น (Banned)
                            </span>
                        </td>
                        <td class="py-4 px-4 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button @click="openModal(user)"
                                    class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                    title="แก้ไข">
                                    <PencilSquareIcon class="w-5 h-5" />
                                </button>
                                <button @click="deleteUser(user._id)"
                                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="ลบ">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ isEditing ? 'แก้ไขข้อมูลผู้ใช้งาน' :
                        'เพิ่มผู้ใช้งานใหม่' }}</h3>
                </div>

                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อจริง</label>
                            <input v-model="form.firstName" type="text"
                                class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="เช่น สมชาย">
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">นามสกุล</label>
                            <input v-model="form.lastName" type="text"
                                class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="เช่น ใจดี">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LINE User ID
                            (เอาไว้รับการแจ้งเตือน)</label>
                        <input v-model="form.lineUserId" type="text"
                            class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="U123456789...">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">แผนก</label>
                            <input v-model="form.department" type="text"
                                class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="เช่น IT, HR, Sales">
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">สิทธิ์การใช้งาน
                                (Role)</label>
                            <select v-model="form.role"
                                class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg dark:text-white outline-none">
                                <option value="user">User (ผู้ใช้ทั่วไป)</option>
                                <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 pt-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="form.active" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500">
                            </div>
                            <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">เปิดใช้งานบัญชีนี้
                                (Active)</span>
                        </label>
                    </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button @click="showModal = false"
                        class="px-5 py-2.5 text-sm rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">ยกเลิก</button>
                    <button @click="saveUser"
                        class="btn-primary text-sm px-6 py-2.5 shadow-lg shadow-primary/30">บันทึกข้อมูล</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api/users'

const users = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

// ฟอร์มข้อมูล
const form = ref({
    _id: null,
    firstName: '',
    lastName: '',
    lineUserId: '',
    department: '',
    role: 'user',
    active: true
})

// 1. โหลดข้อมูล
const fetchUsers = async () => {
    loading.value = true
    try {
        const res = await axios.get(API_URL)
        users.value = res.data
    } catch (err) {
        console.error(err)
        Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้', 'error')
    } finally {
        loading.value = false
    }
}

// 2. เปิด Modal (แยกระหว่างเพิ่มใหม่ กับ แก้ไข)
const openModal = (user: any = null) => {
    if (user) {
        isEditing.value = true
        form.value = { ...user } // Copy ข้อมูลเดิมมาใส่ฟอร์ม
    } else {
        isEditing.value = false
        // รีเซ็ตฟอร์ม
        form.value = { _id: null, firstName: '', lastName: '', lineUserId: '', department: '', role: 'user', active: true }
    }
    showModal.value = true
}

// 3. บันทึก (เพิ่ม / อัปเดต)
const saveUser = async () => {
    if (!form.value.firstName) {
        return Swal.fire('แจ้งเตือน', 'กรุณากรอกชื่อจริงอย่างน้อย 1 ช่องครับ', 'warning')
    }

    try {
        Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

        if (isEditing.value) {
            // โหมดแก้ไข (PUT)
            await axios.put(`${API_URL}/${form.value._id}`, form.value)
        } else {
            // โหมดเพิ่มใหม่ (POST)
            await axios.post(API_URL, form.value)
        }

        Swal.fire({ icon: 'success', title: 'สำเร็จ!', text: 'บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false })
        showModal.value = false
        fetchUsers() // รีเฟรชตาราง
    } catch (err) {
        console.error(err)
        Swal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
    }
}

// 4. ลบผู้ใช้งาน
const deleteUser = async (id: string) => {
    const confirm = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: 'หากลบแล้วจะไม่สามารถกู้คืนข้อมูลผู้ใช้งานนี้ได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'ใช่, ลบเลย',
        cancelButtonText: 'ยกเลิก'
    })

    if (confirm.isConfirmed) {
        try {
            await axios.delete(`${API_URL}/${id}`)
            Swal.fire('ลบสำเร็จ!', 'ลบผู้ใช้งานเรียบร้อยแล้ว', 'success')
            fetchUsers() // รีเฟรชตาราง
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error')
        }
    }
}

onMounted(() => {
    fetchUsers()
})
</script>