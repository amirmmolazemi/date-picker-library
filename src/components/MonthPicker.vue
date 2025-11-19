<script setup></script>

<template>
    <div class="container">
        <header class="container__header">
            <p class="container__header--title">تاریخ را انتخاب نمایید</p>
        </header>
        <div class="container__content">
            <div class="container__content__filter">
                <p class="container__content__filter--item">شمسی</p>
                <p class="container__content__filter--item">فروردین</p>
                <p class="container__content__filter--item">1400</p>
            </div>
            <div class="container__content__months">
                <div class="container__content__months--month">تیر</div>
            </div>
            <button class="container__content--button">تایید</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    background-color: $gray-100;
    width: 360px;
    height: 448px;
    padding: 24px 16px 16px 16px;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &__header {
        &--title {
            font-size: 12px;
            line-height: 16px;
            color: $text-light-base;
            text-align: center;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 20px;

        &__filter {
            display: flex;
            justify-content: space-between;
            height: 24px;

            &--item {
                font-size: 12px;
                line-height: 16px;
                color: $text-light-base;
            }
        }

        &__months {
            display: grid;
            justify-content: space-between;
            grid-template-columns: repeat(3, 90px);
            grid-template-rows: repeat(4, 55px);
            gap: 12px;

            &--month {
                border: 1px solid $gray-200;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                line-height: 20px;
                font-size: 12px;
                color: $text-light-base2;
                cursor: pointer;
            }
        }

        &--button {
            background-color: $primary-600;
            height: 48px;
            padding-inline: 16px;
            border-radius: 12px;
            cursor: pointer;
            color: white;
        }
    }
}
</style>