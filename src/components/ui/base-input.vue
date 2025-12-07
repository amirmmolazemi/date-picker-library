<script setup>
const props = defineProps(["placeholder"]);
</script>

<template>
  <div class="date-input">
    <input class="date-input__field" readonly :placeholder="placeholder" />
    <div class="date-input__button">📅</div>
    <div class="date-input__popup">
      <input type="date" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.date-input {
  position: relative;
  width: 360px;
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dcdcdc;
  gap: 8px;

  &__field {
    border: none;
    outline: none;
    flex: 1;
    font-size: 14px;
  }

  &__button {
    width: 28px;
    height: 28px;
    @include flex(center, center);
    background: #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #ddd;
    }
  }

  &__popup {
    position: absolute;
    top: 55px;
    left: 0;
    background: white;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #ccc;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    display: none;
  }

  &--open {
    .date-input__popup {
      display: block;
    }
  }
}
</style>
