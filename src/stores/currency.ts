import { defineStore } from 'pinia'
import { ref, onUnmounted, computed } from 'vue'
import { currencyEnum } from '@/common/const'
export type CurrencyRates = Record<string, number>

export const useCurrencyStore = defineStore('currency', () => {
    const baseCurrency = ref<string>(currencyEnum.RUB)
    const rates = ref<CurrencyRates>({})
    const displayedCurrencies = computed<string[]>(() =>
        Object.values(currencyEnum).filter(currency => currency !== baseCurrency.value),
    )
    const isLoading = ref<boolean>(false)
    const isDataReady = ref<boolean>(false)
    const error = ref<string | null>(null)

    let intervalId: number | null = null

    const fetchRates = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await fetch('https://status.neuralgeneration.com/api/currency')

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            rates.value = data
            isDataReady.value = true
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке курсов валют'
        } finally {
            isLoading.value = false
        }
    }

    const startAutoFetch = () => {
        fetchRates()
        intervalId = setInterval(fetchRates, 3000) // Обновление каждые 3 секунды
    }

    const stopAutoFetch = () => {
        if (intervalId !== null) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    const setBaseCurrency = (currency: string) => {
        baseCurrency.value = currency
    }

    // Получение курса конкретной валюты относительно базовой
    const getRate = (currency: string): number | null => {
        const key = `${currency.toLowerCase()}-${baseCurrency.value.toLowerCase()}`
        const inverseKey = `${baseCurrency.value.toLowerCase()}-${currency.toLowerCase()}`

        if (rates.value[key]) {
            return rates.value[key]
        } else if (rates.value[inverseKey]) {
            return 1 / rates.value[inverseKey]
        }

        return null
    }

    // Очистка интервала при размонтировании компонента
    onUnmounted(() => {
        stopAutoFetch()
    })

    return {
        baseCurrency,
        rates,
        displayedCurrencies,
        isLoading,
        isDataReady,
        error,
        fetchRates,
        startAutoFetch,
        stopAutoFetch,
        setBaseCurrency,
        getRate,
    }
})
