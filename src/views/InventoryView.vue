<template>
    <div class="space-y-6 relative">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">คลังอุปกรณ์</h2>
            <button @click="showAddModal = true" class="btn-primary">
                + เพิ่มอุปกรณ์ใหม่ .
            </button>
        </div>

        <div class="card overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b dark:border-gray-700">
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">รหัส</th>
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ชื่ออุปกรณ์</th>
                        <th class="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">คงเหลือ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="item in inventory" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td class="py-4 px-4 text-sm text-gray-500">{{ item.id }}</td>
                        <td class="py-4 px-4 font-medium text-gray-800 dark:text-white">{{ item.name }}</td>
                        <td class="py-4 px-4 font-bold text-primary">{{ item.stock }} ชิ้น</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showAddModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-xl p-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">เพิ่มอุปกรณ์ใหม่</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">รหัสอุปกรณ์</label>
                        <input v-model="newItem.id" type="text"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white"
                            placeholder="เช่น IT-001">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่ออุปกรณ์</label>
                        <input v-model="newItem.name" type="text"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white"
                            placeholder="เช่น เมาส์ไร้สาย">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนเริ่มต้น</label>
                        <input v-model="newItem.stock" type="number"
                            class="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white">
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button @click="showAddModal = false"
                        class="px-4 py-2 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300">ยกเลิก</button>
                    <button @click="addNewItem" class="btn-primary text-sm">บันทึก</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inventory = ref([
    { id: 'IT-M-001', name: 'Wireless Mouse', stock: 12 },
    { id: 'IT-K-002', name: 'Keyboard', stock: 5 },
])

const showAddModal = ref(false)
const newItem = ref({ id: '', name: '', stock: 1 })

const addNewItem = () => {
    if (newItem.value.id && newItem.value.name) {
        inventory.value.push({ ...newItem.value })
        newItem.value = { id: '', name: '', stock: 1 } // Reset
        showAddModal.value = false
    } else {
        alert('กรุณากรอกข้อมูลให้ครบ')
    }
}
</script>