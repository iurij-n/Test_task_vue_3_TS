<script setup lang="ts">
import { inject } from 'vue';

const {
    currentPage,
    totalPages,
    visiblePages,
    paginationStart,
    paginationEnd,
    filteredAndSearchedUsers,
    pageSize,
    goToPage } = inject('userTableState')!;

const handlePageSizeChange = () => currentPage.value = 1;
</script>

<template>
  <div class="pagination">
    <div class="pagination-info">
      Показано {{ paginationStart }} - {{ paginationEnd }} из {{ filteredAndSearchedUsers.length }}
    </div>
    <div class="pagination-controls">
      <button @click="goToPage(1)" :disabled="currentPage === 1" class="btn-page">⏮️</button>
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn-page">◀️</button>
      <button v-for="page in visiblePages" :key="page" @click="goToPage(page as number)" :class="['btn-page', { active: currentPage === page }]">
        {{ page }}
      </button>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn-page">▶️</button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="btn-page">⏭️</button>
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