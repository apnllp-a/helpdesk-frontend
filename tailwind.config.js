// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // เปิดใช้งาน Dark Mode แบบควบคุมด้วย class
    theme: {
        extend: {
            colors: {
                // ชุดสีจากในรูป
                primary: {
                    DEFAULT: '#7286D3', // สีน้ำเงินเข้มสุด
                    light: '#8EA7E9',   // สีน้ำเงินกลาง
                },
                secondary: {
                    DEFAULT: '#E5E0FF', // สีม่วงอ่อน
                    light: '#FFF2F2',   // สีขาวอมชมพู
                },
                // สีสำหรับ Dark Mode (ปรับให้เข้มขึ้นเพื่อให้สบายตา)
                dark: {
                    bg: '#1a1b26',      // พื้นหลังหลัก
                    card: '#242533',    // พื้นหลังการ์ด
                    text: '#a9b1d6',    // สีตัวอักษร
                    muted: '#565f89'    // สีตัวอักษรแบบจาง
                }
            },
            fontFamily: {
                sans: ['Inter', 'Sarabun', 'sans-serif'], // แนะนำให้หาฟอนต์สวยๆ มาใส่ (เช่น Google Fonts)
            }
        },
    },
    plugins: [],
}