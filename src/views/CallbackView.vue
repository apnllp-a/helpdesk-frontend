<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const API_URL = 'https://servern8n-production-a0f5.up.railway.app/api'

onMounted(async () => {
    const code = route.query.code as string

    if (!code) {
        router.push('/login')
        return
    }

    try {
        // 1. ส่ง Code ไปที่ Backend ของพี่บน Railway
        const response = await axios.post(`${API_URL}/auth/line`, { code })

        // 💡 แก้ตรงนี้: Backend ของเราส่งตัวแปรชื่อ user กลับมาครับ
        const { token, role, user } = response.data

        // 2. เช็คว่าเป็น Admin หรือไม่
        if (role === 'admin') {
            localStorage.setItem('token', token)
            localStorage.setItem('role', role)

            // 💡 เพิ่มตรงนี้: เก็บชื่อและรูปภาพ เผื่อเอาไปโชว์ที่มุมขวาบนของ AdminLayout
            if (user) {
                localStorage.setItem('userName', user.displayName || 'Admin')
                if (user.pictureUrl) {
                    localStorage.setItem('userPicture', user.pictureUrl)
                }
            }

            router.push('/') // เข้าหน้า Dashboard

        } else {
            // 3. ถ้าไม่ใช่ Admin ให้เตะไปหน้า Add LINE บอท
            await Swal.fire({
                icon: 'warning',
                title: 'เฉพาะเจ้าหน้าที่เท่านั้น',
                text: 'บัญชีของคุณไม่มีสิทธิ์เข้าถึงระบบนี้ กรุณาใช้งานผ่าน Chatbot',
                confirmButtonText: 'ตกลง'
            })
            window.location.href = 'https://lin.ee/@755whwxp' // ลิงก์บอทถูกต้องครับ!
        }
    } catch (error) {
        console.error(error)
        Swal.fire('ผิดพลาด', 'ไม่สามารถเข้าสู่ระบบได้ หรือ Session หมดอายุ', 'error')
        router.push('/login')
    }
})
</script>