<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps<{
  title: string;
  totalCount: number;
}>();

const {
  deleteSelectedUsers,
  exportToCSV,
  filterRole,
  isLoading,
  openAddUserModal,
  searchQuery,
  selectedUsers,
  showAllUsers
} = inject('userTableState')!;
</script>

<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ props.title }}</h2>
      <span class="total-count">{{ props.totalCount }} записей</span>
    </div>
    <div class="header-right">
      <input v-model="searchQuery" placeholder="Поиск..." class="search-input" @input="$emit('search')" />
      <select v-model="filterRole" class="role-filter">
        <option value="">Все роли</option>
        <option value="admin">Администратор</option>
        <option value="user">Пользователь</option>
        <option value="moderator">Модератор</option>
      </select>
            <button @click="openAddUserModal"class="btn btn-primary" :disabled="isLoading">+ Добавить пользователя</button>
            <button 
          @click="exportToCSV"
          class="btn btn-secondary"
          :disabled="isLoading || selectedUsers.length === 0 && !showAllUsers"
        >
          📥 Экспорт
        </button>
      <button v-if="selectedUsers.length > 0" @click="deleteSelectedUsers" class="btn btn-danger">
        🗑️ Удалить ({{ selectedUsers.length }})
      </button>
    </div>
  </div>
</template>