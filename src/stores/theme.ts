// src/stores/theme.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // ค่าที่เป็นไปได้: 'light', 'dark', 'system'
    const theme = ref<string>(localStorage.getItem('theme') || 'system')

    // ฟังก์ชันสำหรับเปลี่ยน Class ที่ <html>
    const applyTheme = () => {
        const isDark =
            theme.value === 'dark' ||
            (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // เรียกใช้ครั้งแรกเมื่อโหลดหน้าเว็บ
    applyTheme()

    // คอยดูการเปลี่ยนแปลงค่า theme แล้วบันทึกลง localStorage และเปลี่ยน class
    watch(theme, (newTheme) => {
        localStorage.setItem('theme', newTheme)
        applyTheme()
    })

    // คอยดูการเปลี่ยนแปลง theme ของระบบ (กรณีเลือก 'system')
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)

    function setTheme(newTheme: 'light' | 'dark' | 'system') {
        theme.value = newTheme
    }

    return { theme, setTheme }
})