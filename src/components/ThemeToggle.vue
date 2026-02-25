<template>
    <div class="relative inline-block text-left">
        <div class="flex items-center bg-secondary dark:bg-dark-bg rounded-full p-1 shadow-inner">
            <button v-for="t in themes" :key="t.value" @click="themeStore.setTheme(t.value)" :class="[
                'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
                themeStore.theme === t.value
                    ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm scale-110'
                    : 'text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-dark-text'
            ]" :title="t.label">
                <component :is="t.icon" class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()

const themes = [
    { value: 'light', icon: SunIcon, label: 'Light' },
    { value: 'system', icon: ComputerDesktopIcon, label: 'System' },
    { value: 'dark', icon: MoonIcon, label: 'Dark' },
]
</script>