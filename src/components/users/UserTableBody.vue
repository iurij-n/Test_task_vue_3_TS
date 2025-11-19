<script setup lang="ts">
import type { User } from '@/types/user';
import UserTableRow from './UserTableRow.vue';
import { inject } from 'vue';  

defineProps<{ users: User[] }>();

const {
    isAllSelected,
    sortBy,
    sortColumn,
    sortDirection,
    toggleSelectAll
} = inject('userTableState')!;
</script>

<template>
  <table class="user-table">
    <thead>
      <tr>
            <th>
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th 
              @click="sortBy('id')"
              :class="{ sortable: true, active: sortColumn === 'id' }"
            >
              ID
              <span v-if="sortColumn === 'id'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="sortBy('name')"
              :class="{ sortable: true, active: sortColumn === 'name' }"
            >
              Имя
              <span v-if="sortColumn === 'name'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="sortBy('email')"
              :class="{ sortable: true, active: sortColumn === 'email' }"
            >
              Email
              <span v-if="sortColumn === 'email'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>Роль</th>
            <th>Статус</th>
            <th 
              @click="sortBy('registrationDate')"
              :class="{ sortable: true, active: sortColumn === 'registrationDate' }"
            >
              Дата регистрации
              <span v-if="sortColumn === 'registrationDate'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>Последняя активность</th>
            <th>Действия</th>
          </tr>
    </thead>
    <tbody>
      <UserTableRow v-for="user in users" :key="user.id" :user="user" />
    </tbody>
  </table>
</template>