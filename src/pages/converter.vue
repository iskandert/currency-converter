<template>
    <div>
        <div class="text-h4 text-center mb-4 mt-6">Конвертер валют</div>

        <v-row
            v-if="store.isDataReady"
            justify="center"
            class="px-4"
        >
            <v-col
                cols="12"
                sm="10"
                md="8"
                lg="6"
            >
                <v-card
                    class="mx-auto my-4"
                    elevation="3"
                >
                    <v-card-text class="py-4">
                        <v-alert
                            v-if="store.error"
                            type="error"
                            density="compact"
                            class="mb-4"
                        >
                            {{ store.error }}
                        </v-alert>

                        <div class="mb-6">
                            <div class="d-flex align-center mb-4">
                                <InputNumber
                                    v-model:value="fromAmount"
                                    label="Сумма"
                                    class="mr-4"
                                    :styles="'width: 60%'"
                                    @input:focus="mainField = 'from'"
                                ></InputNumber>

                                <v-select
                                    v-model="fromCurrency"
                                    :items="availableCurrencies.filter(currency => currency !== fromCurrency)"
                                    label="Из валюты"
                                    density="comfortable"
                                    hide-details
                                    style="width: 40%"
                                ></v-select>
                            </div>

                            <div class="d-flex align-center mt-4">
                                <InputNumber
                                    v-model:value="toAmount"
                                    label="Сумма"
                                    class="mr-4"
                                    :styles="'width: 60%'"
                                    @input:focus="mainField = 'to'"
                                    @input:blur="mainField = 'from'"
                                ></InputNumber>

                                <v-select
                                    v-model="toCurrency"
                                    :items="availableCurrencies.filter(currency => currency !== toCurrency)"
                                    label="В валюту"
                                    density="comfortable"
                                    hide-details
                                    style="width: 40%"
                                ></v-select>
                            </div>
                        </div>

                        <div
                            class="text-center text-subtitle-1"
                            v-if="displayedConversionRate !== null"
                        >
                            1 {{ fromCurrency }} = {{ displayedConversionRate.toFixed(4) }} {{ toCurrency }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { currencyEnum } from '@/common/const'
import InputNumber from '@/components/InputNumber.vue'

const store = useCurrencyStore()

// Инициализация валют и значений
const fromCurrency = ref(store.baseCurrency)
const toCurrency = ref(Object.values(currencyEnum).find(currency => currency !== store.baseCurrency) as string)
const fromAmount = ref(1000)
const toAmount = ref(0)
const mainField = ref<string>('from')
const availableCurrencies = computed(() => {
    return Object.values(currencyEnum)
})

const displayedConversionRate = computed(() => {
    return getConversionRate(fromCurrency.value, toCurrency.value)
})

// Получение курса между двумя валютами
const getConversionRate = (from: string, to: string): number | null => {
    const key = `${from.toLowerCase()}-${to.toLowerCase()}`
    const inverseKey = `${to.toLowerCase()}-${from.toLowerCase()}`

    if (store.rates[key]) {
        return store.rates[key]
    } else if (store.rates[inverseKey]) {
        return 1 / store.rates[inverseKey]
    }

    return null
}

const convert = () => {
    const mainAmount = mainField.value === 'from' ? fromAmount : toAmount
    const mainCurrency = mainField.value === 'from' ? fromCurrency : toCurrency
    const computedAmount = mainField.value === 'from' ? toAmount : fromAmount
    const computedCurrency = mainField.value === 'from' ? toCurrency : fromCurrency
    const rate = getConversionRate(mainCurrency.value, computedCurrency.value)

    if (rate !== null && mainAmount.value) {
        const result = mainAmount.value * rate
        computedAmount.value = parseFloat(result.toFixed(2))
    } else {
        computedAmount.value = 0
    }
}

watch(
    [fromAmount, toAmount, fromCurrency, toCurrency],
    ([, , oldFromCurrency, oldToCurrency], [, , newFromCurrency, newToCurrency]) => {
        if (fromCurrency.value !== toCurrency.value) {
            convert()
        } else if (oldToCurrency === newToCurrency) {
            toCurrency.value = Object.values(currencyEnum).find(currency => currency !== fromCurrency.value) as string
        } else if (oldFromCurrency === newFromCurrency) {
            fromCurrency.value = Object.values(currencyEnum).find(currency => currency !== toCurrency.value) as string
        }
    },
)

onMounted(() => {
    // Выполняем первую конвертацию после загрузки данных
    watch(
        () => store.isDataReady,
        isReady => {
            if (isReady) {
                convert()
            }
        },
        { immediate: true, once: true },
    )
})
</script>

<style scoped></style>
