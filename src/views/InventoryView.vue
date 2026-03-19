<template>
    <div class="space-y-6 relative">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">คลังอุปกรณ์</h2>
            <button @click="showAddModal = true" class="btn-primary">
                + เพิ่มอุปกรณ์ใหม่
            </button>
        </div>

        <div class="card overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b dark:border-gray-700">
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">รูป</th>
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">รหัส</th>
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ชื่ออุปกรณ์</th>
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">คงเหลือ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="item in inventory" :key="item._id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td class="py-4 px-4">
                            <img :src="item.image || 'https://via.placeholder.com/40'"
                                class="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        </td>
                        <td class="py-4 px-4 text-sm text-gray-500">{{ item.id || item._id.slice(-6).toUpperCase() }}
                        </td>
                        <td class="py-4 px-4 font-medium text-gray-800 dark:text-white">{{ item.itemName }}</td>
                        <td class="py-4 px-4 font-bold text-primary">{{ item.stock }} ชิ้น</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showAddModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                class="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">เพิ่มอุปกรณ์ใหม่</h3>

                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รูปภาพอุปกรณ์</label>
                        <div
                            class="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                            <img v-if="imagePreview" :src="imagePreview"
                                class="w-32 h-32 object-cover rounded-lg shadow-md" />
                            <div v-else
                                class="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                <span class="text-xs">ไม่มีรูปภาพ</span>
                            </div>
                            <input type="file" @change="handleImageUpload" accept="image/*"
                                class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">รหัสอุปกรณ์</label>
                        <input v-model="newItem.id" type="text"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="เช่น IT-001">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่ออุปกรณ์</label>
                        <input v-model="newItem.itemName" type="text"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="เช่น เมาส์ไร้สาย">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนเริ่มต้น</label>
                        <input v-model="newItem.stock" type="number"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary/50 outline-none">
                    </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button @click="closeModal"
                        class="px-4 py-2 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">ยกเลิก</button>
                    <button @click="addNewItem" class="btn-primary text-sm shadow-lg shadow-primary/30">บันทึก</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api/inventory'

const inventory = ref([])
const showAddModal = ref(false)
const imagePreview = ref<string | null>(null)
// ✅ แก้ตรงนี้: เปลี่ยนโครงสร้างเริ่มต้นให้ใช้ itemName
const newItem = ref({ id: '', itemName: '', stock: 1, image: null })

const Toast = Swal.mixin({
    background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1e293b',
});

const loadInventory = async () => {
    try {
        const res = await axios.get(API_URL)
        inventory.value = res.data
    } catch (err) {
        console.error("โหลดข้อมูลล้มเหลว:", err)
    }
}

const addNewItem = async () => {
    // ✅ แก้ตรงนี้: เช็คค่า itemName แทน name
    if (newItem.value.id && newItem.value.itemName) {
        try {
            Swal.fire({
                title: 'กำลังบันทึกข้อมูล...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            await axios.post(API_URL, newItem.value)

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                text: 'อุปกรณ์ถูกเพิ่มลงในคลังเรียบร้อยแล้ว',
                confirmButtonColor: '#6366f1',
                timer: 2000,
                timerProgressBar: true
            })

            closeModal()
            loadInventory()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#ef4444'
            })
            console.error(err)
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'ข้อมูลไม่ครบ',
            text: 'กรุณากรอกรหัสและชื่ออุปกรณ์ให้ครบถ้วนนะ',
            confirmButtonColor: '#f59e0b'
        })
    }
}

const deleteItem = async (id, mongoId) => {
    const result = await Swal.fire({
        title: `ยืนยันการลบ?`,
        text: `รหัส ${id} จะถูกลบออกจากระบบถาวร`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
        try {
            await axios.delete(`${API_URL}/${mongoId}`)
            Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อย', 'success')
            loadInventory()
        } catch (err) {
            Swal.fire('Error', 'ลบไม่สำเร็จ', 'error')
        }
    }
}

const handleImageUpload = (event: any) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64String = e.target?.result as string
            imagePreview.value = base64String
            newItem.value.image = base64String
        }
        reader.readAsDataURL(file)
    }
}

const closeModal = () => {
    showAddModal.value = false
    imagePreview.value = null
    // ✅ แก้ตรงนี้: รีเซ็ตค่าให้เป็น itemName
    newItem.value = { id: '', itemName: '', stock: 1, image: null }
}

onMounted(() => {
    loadInventory()
})
</script>