<script setup lang="ts">
import { useUserTable } from '@/composables/useUserTable';

const {
    clearDateFilter,
    dateFrom,
    dateTo,
    filterStatus
} = useUserTable();

const emit = defineEmits<{ 'clear-all': [] }>();

const setFilterStatus = (status: string) => (filterStatus.value = status as any);
</script>

<template>
    <div class="filters-section">
        <div class="filter-group">
            <label>Статус:</label>
            <button :class="['filter-btn', { active: filterStatus === '' }]" @click="setFilterStatus('')"> Все </button>
            <button :class="['filter-btn', { active: filterStatus === 'active' }]" @click="setFilterStatus('active')">
                 Активные
            </button>
            <button
                :class="['filter-btn', { active: filterStatus === 'inactive' }]"
                @click="setFilterStatus('inactive')">
                 Неактивные
            </button>
        </div>
        <div class="filter-group">
            <label>Дата регистрации:</label>
            <input v-model="dateFrom" type="date" class="date-input" />
            <span>-</span>
            <input v-model="dateTo" type="date" class="date-input" />
            <button class="btn-clear" @click="clearDateFilter"> Очистить</button>
        </div>
    </div>
</template>