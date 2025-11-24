<script setup lang="ts">
import { computed } from 'vue';
import { useUserTable } from '@/composables/useUserTable';
import type { User } from '@/types/user';

const props = defineProps<{
    user: User;
}>();

const {
    cancelEdit,
    deleteUser,
    editForm,
    editingUserId,
    formatDate,
    formatRelativeTime,
    getActivityClass,
    getDefaultAvatar,
    getRoleLabel,
    openUserDetails,
    saveEdit,
    selectedUsers,
    startEdit,
    toggleSelectUser,
    toggleUserStatus
} = useUserTable();

const isSelected = computed(() => selectedUsers.value.includes(props.user.id));
const isEditing = computed(() => editingUserId.value === props.user.id);
</script>

<template>
    <tr
        :class="{
            selected: isSelected,
            editing: isEditing,
            inactive: user.status === 'inactive'
        }">
        <td>
            <input type="checkbox" :checked="isSelected" @change="toggleSelectUser(user.id)" />
        </td>
        <td>{{ user.id }}</td>
        <td>
            <div v-if="isEditing">
                <input v-model="editForm.name" type="text" class="edit-input" />
            </div>
            <div v-else class="user-name-cell">
                <img :src="user.avatar || getDefaultAvatar(user.name)" :alt="user.name" class="avatar" />
                <span>{{ user.name }}</span>
            </div>
        </td>
        <td>
            <div v-if="isEditing">
                <input v-model="editForm.email" type="email" class="edit-input" />
            </div>
            <div v-else>{{ user.email }}</div>
        </td>
        <td>
            <div v-if="isEditing">
                <select v-model="editForm.role" class="edit-select">
                    <option value="admin">Администратор</option>
                    <option value="user">Пользователь</option>
                    <option value="moderator">Модератор</option>
                </select>
            </div>
            <div v-else>
                <span :class="['role-badge', 'role-' + user.role]"> {{ getRoleLabel(user.role) }} </span>
            </div>
        </td>
        <td>
            <span
                :class="['status-badge', user.status === 'active' ? 'status-active' : 'status-inactive']"
                class="status-clickable"
                @click="toggleUserStatus(user.id)">
                 {{ user.status === 'active' ? 'Активен' : 'Неактивен' }}
            </span>
        </td>
        <td>{{ formatDate(user.registrationDate) }}</td>
        <td>
            <span :class="getActivityClass(user.lastActivity)"> {{ formatRelativeTime(user.lastActivity) }} </span>
        </td>
        <td>
            <div class="action-buttons">
                <button
                    v-if="editingUserId !== user.id"
                    class="btn-icon"
                    title="Редактировать"
                    @click="startEdit(user)">
                     ✏️
                </button>
                <button
                    v-if="editingUserId === user.id"
                    class="btn-icon btn-success"
                    title="Сохранить"
                    @click="saveEdit(user.id)">
                     ✓
                </button>
                <button v-if="editingUserId === user.id" class="btn-icon btn-cancel" title="Отмена" @click="cancelEdit">
                     ✗
                </button>
                <button
                    v-if="editingUserId !== user.id"
                    class="btn-icon"
                    title="Подробнее"
                    @click="openUserDetails(user)">
                     👁️
                </button>
                <button
                    v-if="editingUserId !== user.id"
                    class="btn-icon btn-danger"
                    title="Удалить"
                    @click="deleteUser(user.id)">
                     🗑️
                </button>
            </div>
        </td>
    </tr>
</template>

<style scoped>
.status-clickable {
  cursor: pointer;
  user-select: none;
}
.status-clickable:hover {
  opacity: 0.8;
}
</style>

