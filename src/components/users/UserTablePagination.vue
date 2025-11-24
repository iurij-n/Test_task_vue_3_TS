<script setup lang="ts">
import { useUserTable } from '@/composables/useUserTable';

const {
    currentPage,
    totalPages,
    visiblePages,
    paginationStart,
    paginationEnd,
    filteredAndSearchedUsers,
    pageSize,
    goToPage
} = useUserTable();

const handlePageSizeChange = () => (currentPage.value = 1);
</script>

<template>
    <div class="pagination">
        <div class="pagination-info">
             Показано {{ paginationStart }} - {{ paginationEnd }} из {{ filteredAndSearchedUsers.length }}
        </div>
        <div class="pagination-controls">
            <button :disabled="currentPage === 1" class="btn-page" @click="goToPage(1)"> ⏮️</button>
            <button :disabled="currentPage === 1" class="btn-page" @click="goToPage(currentPage - 1)"> ◀️</button>
            <button
                v-for="page in visiblePages"
                :key="page"
                :class="['btn-page', { active: currentPage === page }]"
                @click="goToPage(page as number)">
                 {{ page }}
            </button>
            <button :disabled="currentPage === totalPages" class="btn-page" @click="goToPage(currentPage + 1)">
                 ▶️
            </button>
            <button :disabled="currentPage === totalPages" class="btn-page" @click="goToPage(totalPages)"> ⏭️</button>
        </div>
        <div class="page-size-selector">
            <label>На странице:</label>
            <select v-model="pageSize" @change="handlePageSizeChange">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
            </select>
        </div>
    </div>
</template>