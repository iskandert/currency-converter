<template>
    <v-text-field
        v-model="inputValue"
        v-bind="$attrs"
        type="number"
        hide-details
        :precision="props.precision"
        @focus="$emit('input:focus', $event)"
        @blur="onBlur"
        ></v-text-field>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
    value: {
        type: Number,
        default: 0,
    },
    precision: {
        type: Number,
        default: 2,
    },
})

const emit = defineEmits(['update:value', 'input:focus', 'input:blur'])

const lastSeparator = ref('')

const inputValue = computed({
    get() {
        return props.value.toString() + lastSeparator.value
    },
    set(value: string) {
        const lastChar = value.slice(-1)
        if (lastChar === '.' || lastChar === ',') {
            lastSeparator.value = lastChar
        } else {
            lastSeparator.value = ''
        }
        const parsedValue = parseFloat(value)
        const numberValue = isNaN(parsedValue) ? 0 : parsedValue
        emit('update:value', numberValue)
    },
})

const onBlur = (event: Event) => {
    lastSeparator.value = ''
    emit('input:blur', event)
}
</script>
