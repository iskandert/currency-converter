<template>
    <v-text-field
        v-model="inputValue"
        v-bind="$attrs"
        type="number"
        hide-details
        :precision="props.precision"
        @focus="$emit('input:focus', $event)"
        @blur="$emit('input:blur', $event)"
        ></v-text-field>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const inputValue = computed({
    get() {
        return props.value.toString()
    },
    set(value: string) {
        const parsedValue = parseFloat(value)
        const numberValue = isNaN(parsedValue) ? 0 : parsedValue
        emit('update:value', numberValue)
    },
})
</script>
