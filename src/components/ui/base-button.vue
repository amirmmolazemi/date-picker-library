<script setup>
defineProps({
    text: String,
})
</script>

<template>
    <button>{{ text }}</button>
</template>

<style lang="scss" scoped>
button {
    background-color: $primary-600;
    height: 48px;
    padding-inline: 16px;
    border-radius: 12px;
    cursor: pointer;
    color: white;
}
</style>