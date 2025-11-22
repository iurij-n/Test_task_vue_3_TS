<script setup lang="ts">
import type { User } from '@/types/user';
import UserTableRow from './UserTableRow.vue';
import { inject } from 'vue';

defineProps<{ users: User[] }>();

const { isAllSelected, sortBy, sortColumn, sortDirection, toggleSelectAll } = inject('userTableState')!;
</script>

<template>
    <table class="user-table">
        <thead>
            <tr>
                <th>
                    <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                </th>
                <th :class="{ sortable: true, active: sortColumn === 'id' }" @click="sortBy('id')">
                     ID
                    <span v-if="sortColumn === 'id'"> {{ sortDirection === 'asc' ? '↑' : '↓' }} </span>
                </th>
                <th :class="{ sortable: true, active: sortColumn === 'name' }" @click="sortBy('name')">
                     Имя
                    <span v-if="sortColumn === 'name'"> {{ sortDirection === 'asc' ? '↑' : '↓' }} </span>
                </th>
                <th :class="{ sortable: true, active: sortColumn === 'email' }" @click="sortBy('email')">
                     Email
                    <span v-if="sortColumn === 'email'"> {{ sortDirection === 'asc' ? '↑' : '↓' }} </span>
                </th>
                <th>Роль</th>
                <th>Статус</th>
                <th
                    :class="{
                        sortable: true,
                        active: sortColumn === 'registrationDate'
                    }"
                    @click="sortBy('registrationDate')">
                     Дата регистрации
                    <span v-if="sortColumn === 'registrationDate'"> {{ sortDirection === 'asc' ? '↑' : '↓' }} </span>
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