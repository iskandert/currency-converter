<template>
    <v-app>
        <v-main>
            <Navbar />

            <router-view v-slot="{ Component }">
                <v-fade-transition mode="out-in">
                    <component :is="Component" />
                </v-fade-transition>
            </router-view>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import Navbar from '@/components/Navbar.vue'

const store = useCurrencyStore()

// Запускаем автоматическое обновление курсов валют
onMounted(() => {
    store.startAutoFetch()
})
</script>
