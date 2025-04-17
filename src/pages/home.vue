<template>
    <div>
        <div class="text-h4 text-center mb-4 mt-6">Курсы валют</div>

        <v-row
            v-if="store.isDataReady"
            justify="center"
            class="px-4"
        >
            <v-col
                cols="12"
                sm="7"
                md="5"
                lg="4"
            >
                <v-card
                    class="mx-auto my-4 mb-6"
                    elevation="3"
                >
                    <v-card-text class="py-4">
                        <div class="d-flex align-center">
                            <div class="text-h6 mr-4 whitespace-nowrap">Основная валюта:</div>
                            <v-select
                                v-model="store.baseCurrency"
                                :items="availableCurrencies"
                                density="comfortable"
                                @update:model-value="handleBaseCurrencyChange"
                                hide-details
                                class="flex-grow-1"
                            ></v-select>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-alert
                v-if="store.error"
                type="error"
                density="compact"
                class="mx-auto my-4"
                max-width="800"
            >
                {{ store.error }}
            </v-alert>
        </v-row>

        <div
            v-if="store.isLoading && !store.isDataReady"
            class="d-flex justify-center my-6"
        >
            <v-progress-circular
                indeterminate
                color="primary"
                size="64"
            ></v-progress-circular>
        </div>

        <v-row
            v-if="store.isDataReady"
            justify="center"
            class="px-4"
        >
            <v-col
                v-for="currency in store.displayedCurrencies"
                :key="currency"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-card
                    class="mx-auto"
                    elevation="3"
                >
                    <v-card-title class="text-center">
                        <div class="text-h6">{{ currency }}</div>
                    </v-card-title>

                    <v-card-text class="d-flex flex-column align-center justify-center">
                        <div class="text-h4 text-center">
                            {{ formatRate(currency) }}
                        </div>
                        <div class="text-subtitle-1 text-center mt-2">
                            {{ store.baseCurrency }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { currencyEnum } from '@/common/const'
const store = useCurrencyStore()

// Форматирование курса валюты
const formatRate = (currency: string): string => {
    const rate = store.getRate(currency)
    return rate === null ? 'Н/Д' : rate.toFixed(4)
}

// Вычисляем доступные валюты из массива displayedCurrencies
const availableCurrencies = computed(() => {
    return Object.values(currencyEnum)
})

// Обработчик изменения базовой валюты
const handleBaseCurrencyChange = (currency: string) => {
    if (currency) {
        store.setBaseCurrency(currency)
    }
}
</script>

<style scoped></style>
