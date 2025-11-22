<script setup lang="ts">
import { onMounted, watch, provide } from 'vue';
import UserTableHeader from './UserTableHeader.vue';
import UserTableFilters from './UserTableFilters.vue';
import UserTableBody from './UserTableBody.vue';
import UserTablePagination from './UserTablePagination.vue';
import AddUserModal from './AddUserModal.vue';
import UserDetailsModal from './UserDetailsModal.vue';

import { useUserTable } from '@/composables/useUserTable';

const props = withDefaults(
    defineProps<{
        title?: string;
        initialPageSize?: number;
        apiEndpoint?: string;
    }>(),
    {
        title: 'Управление пользователями',
        initialPageSize: 25,
        apiEndpoint: '/api/users'
    }
);

const userTableState = useUserTable({ initialPageSize: props.initialPageSize });

const {
    clearAllFilters,
    error,
    filterRole,
    filterStatus,
    filteredAndSearchedUsers,
    isLoading,
    loadUsers,
    paginatedUsers,
    resetPage,
    searchQuery
} = userTableState;

provide('userTableState', userTableState);

watch([searchQuery, filterRole, filterStatus], () => {
    resetPage();
});

onMounted(() => {
    loadUsers();
});
</script>

<template>
    <div class="user-table-container">
        <UserTableHeader :title="props.title" :total-count="filteredAndSearchedUsers.length" />
        <UserTableFilters @clear-all="clearAllFilters" />
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
        </div>
        <div v-if="error" class="error-message">
            <span>Ошибка: {{ error }}</span>
            <button class="btn-retry" @click="loadUsers">Повторить</button>
        </div>
        <div v-if="!isLoading && !error" class="table-wrapper">
            <template v-if="paginatedUsers.length">
                <UserTableBody :users="paginatedUsers" />
                <UserTablePagination v-if="!isLoading && !error" />
            </template>
            <div v-if="!paginatedUsers.length" class="no-data">
                <p>Нет данных для отображения</p>
                <button class="btn btn-primary" @click="clearAllFilters"> Сбросить фильтры</button>
            </div>
        </div>
        <AddUserModal />
        <UserDetailsModal />
    </div>
</template>

<style>
.user-table-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.role-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
}

.filters-section {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  min-width: 150px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #f0f0f0;
}

.filter-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.date-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-clear {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-clear:hover {
  background: #f0f0f0;
}

.loading-overlay {
  background: white;
  padding: 60px 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-retry {
  padding: 8px 16px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.user-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.user-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.user-table th.sortable:hover {
  background: #eeeeee;
}

.user-table th.active {
  color: #4CAF50;
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-table tbody tr {
  transition: background 0.2s;
}

.user-table tbody tr:hover {
  background: #fafafa;
}

.user-table tbody tr.selected {
  background: #e8f5e9;
}

.user-table tbody tr.editing {
  background: #fff9c4;
}

.user-table tbody tr.inactive {
  opacity: 0.6;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: #ffebee;
  color: #c62828;
}

.role-user {
  background: #e3f2fd;
  color: #1565c0;
}

.role-moderator {
  background: #fff3e0;
  color: #e65100;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background: #ffebee;
  color: #c62828;
}

.activity-recent {
  color: #2e7d32;
  font-weight: 500;
}

.activity-week {
  color: #1565c0;
}

.activity-month {
  color: #e65100;
}

.activity-old {
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.btn-icon.btn-success {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-icon.btn-cancel {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-icon.btn-danger {
  border-color: #f44336;
}

.btn-icon.btn-danger:hover {
  background: #f44336;
  color: white;
}

.edit-input,
.edit-select {
  padding: 6px 10px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}

.no-data {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.btn-page {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 36px;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-selector label {
  color: #666;
  font-size: 14px;
}

.page-size-selector select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  display: block;
}

.user-email {
  color: #666;
  text-align: center;
  margin: 5px 0 0 0;
}

.detail-section h2 {
  text-align: center;
  margin: 0 0 5px 0;
  font-size: 22px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}
</style>

