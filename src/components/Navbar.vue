<template>
    <v-tabs
        v-model="activeTab"
        align-tabs="center"
        bg-color="primary"
    >
        <v-tab
            to="/"
            value="/"
        >
            Главная
        </v-tab>
        <v-tab
            to="/converter"
            value="/converter"
        >
            Конвертер
        </v-tab>
    </v-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.path)

// Обновление активного таба при изменении маршрута
watch(
    () => route.path,
    newPath => {
        activeTab.value = newPath
    },
)
</script>
