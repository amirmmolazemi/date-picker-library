<script setup>
import { computed, ref, watch } from "vue";
import ArrowIcon from "./icons/arrow-icon.vue";
import CloseIcon from "@/components/icons/close-icon.vue";
import chevronIcon from "@/components/icons/chevron-icon.vue";
import BaseButton from "@/components/ui/base-button.vue";
import { langDates } from "@/constants/langDates";
import { createCalendarEngine } from "@/composables/useCalenderEngine";

const showMonths = ref(false);
const showyears = ref(false);
const activeLang = ref("fa");
const currentYear = ref(1404);
const currentMonth = ref(9);
const currentDay = ref(2);

const weekdays = computed(() => langDates.langs[activeLang.value].weekdays);
const months = computed(() => langDates.langs[activeLang.value].months);
const adapter = computed(() => langDates.langs[activeLang.value].adaptor)
const currentMonthText = computed(() => langDates.langs[activeLang.value].months[currentMonth.value - 1])
const engine = createCalendarEngine(adapter.value, currentYear.value, currentMonth.value);
console.log(engine.grid.value);


watch([currentMonth, currentYear], () => {
    engine.setMonth(currentMonth.value);
    engine.setYear(currentYear.value);
});

const handleDayClick = (cell) => {
    if (cell.current) currentDay.value = cell.day;
};


const handleMonthClick = (index) => {
    currentMonth.value = index + 1
    showMonths.value = false;
};

const clickHandler = () => {
    console.log(`1404/${currentMonth.value}/${currentDay.value}`)
}

</script>

<template>
    <div class="container">
        <header class="container__header">
            <close-icon class="container__header--close" />
            <p class="container__header--title">تاریخ را انتخاب نمایید</p>
        </header>
        <div class="container__content">
            <div class="container__content__filter" v-if="!showyears">
                <div class="container__content__filter--item" @click="showMonths = true">
                    <span>{{ currentMonthText }}</span>
                    <chevron-icon />
                </div>
                <div class="container__content__filter--item" @click="showyears = true">
                    <span>{{ currentYear }}</span>
                    <chevron-icon />
                </div>
            </div>
            <div class="container__content__filter" v-if="showyears">
                <div class="container__content__filter--item" style="rotate: 180deg;">
                    <arrow-icon />
                </div>
                <div class="container__content__filter--item">
                    <span>1400</span>
                </div>
                <div class="container__content__filter--item">
                    <arrow-icon />
                </div>
            </div>
            <div class="container__content__weekdays" v-if="!showMonths && !showyears">
                <span class="container__content__weekdays--day" v-for="weekday in weekdays" :key="weekday">
                    {{ weekday }}
                </span>
            </div>
            <div class="container__content__days" v-if="!showMonths && !showyears">
                <div class="container__content__days--day" v-for="(cell, i) in engine.grid.value"
                    :class="{ 'selected': currentDay === cell.day && cell.current }" :key="i"
                    @click="handleDayClick(cell)">
                    {{ cell.day }}
                </div>
            </div>
            <div class="container__content__months" v-if="showMonths || showyears">
                <div class="container__content__months--month" v-for="(month, index) in months" :key="month"
                    :class="{ 'selected': currentMonth - 1 === index }" @click="handleMonthClick(index)">
                    {{ month }}
                </div>
            </div>
            <base-button text="تایید" @click="clickHandler" />
        </div>
        <div class="container__calender">
            <div class="container__calender__block">
                <span class="container__calender__block--text">27</span>
            </div>
            <div class="container__calender__block">
                <span class="container__calender__block--text" v-for="month in months" :key="month">
                    {{ month }}
                </span>
            </div>
            <div class="container__calender__block">
                <span class="container__calender__block--text">1404</span>
            </div>
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

    &__calender {
        width: 360px;
        height: 207px;
        display: none;
        gap: 68px;
        padding-inline: 22px;

        &__block {
            width: 68px;
            height: 207px;
            @include flex(start, start, 14px, column);

            &--text {
                line-height: 32px;
                font-weight: $font-weight-semibold;
                color: $gray-400;

                &:nth-child(3) {
                    color: $primary-main;
                    border-top: 1px solid $primary-main;
                    border-bottom: 1px solid $primary-main;
                }
            }
        }
    }

    &__header {
        @include flex();
        position: relative;
        margin-bottom: 12px;
        height: 24px;

        &--title {
            font-size: 12px;
            line-height: 16px;
            color: $text-light-base;
        }

        &--close {
            cursor: pointer;
            width: 24px;
            height: 24px;
            position: absolute;
            right: 0;
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
                @include flex(start, center, 4px);
                color: $text-light-base;
                cursor: pointer;
            }
        }

        &__months {
            display: grid;
            justify-content: space-between;
            grid-template-columns: repeat(3, 90px);
            grid-template-rows: repeat(4, 55px);
            gap: 12px;
            flex: 1;
            overflow-y: auto;
            max-height: 256px;
            // padding-right: 12px;
            margin-bottom: 4px;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                border-radius: 10px;
                background-color: $primary-200;
                border-left: 1px solid white;
                border-right: 1px solid white;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: $primary-400;
            }

            &--month {
                border: 1px solid $gray-200;
                border-radius: 10px;
                height: 55px;
                @include flex();
                line-height: 20px;
                font-size: 12px;
                color: $text-light-base2;
                cursor: pointer;
                transition: all 0.2s ease;

                &.selected {
                    background-color: $primary-main;
                    color: $text-dark-primary;
                }
            }
        }

        &__weekdays {
            height: 16px;
            display: flex;
            justify-content: space-between;
            background-color: $bg-light-default;
            border-radius: 4px;
            padding-inline: 2px;

            &--day {
                font-size: 12px;
                line-height: 16px;
                color: $text-light-base;
            }
        }

        &__days {
            display: grid;
            justify-content: space-between;
            grid-template-columns: repeat(7, 32px);
            grid-template-rows: repeat(5, 32px);
            gap: 16px;

            &--day {
                border-radius: 10px;
                font-size: 14px;
                color: $text-light-base;
                cursor: pointer;
                @include flex();
                transition: all 0.2s ease;

                &.selected {
                    background-color: $primary-main;
                    color: $text-dark-primary;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .container {
        background-color: $bg-white;
        width: 100%;
        height: 100%;
        max-width: 600px;
        max-height: 451px;
        @include flex();
        border-radius: 60px;
        box-shadow: -68px 62px 176px #0000001A;

        &__calender {
            display: flex;
        }

        &__header,
        &__content {
            display: none;
        }
    }
}
</style>
