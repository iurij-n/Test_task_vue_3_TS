<script setup lang="ts">
import { inject } from 'vue';

const {
    addNewUser,
    closeAddUserModal,
    isNewUserValid,
    isSaving,
    newUser,
    newUserErrors,
    showAddUserModal,
    validateNewUserEmail,
    validateNewUserName
} = inject('userTableState')!;
</script>

<template>
    <div v-if="showAddUserModal" class="modal-overlay" @click.self="closeAddUserModal">
        <div class="modal">
            <div class="modal-header">
                <h3>Добавить пользователя</h3>
                <button class="btn-close" @click="closeAddUserModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Имя*</label>
                    <input
                        v-model="newUser.name"
                        type="text"
                        :class="{ error: newUserErrors.name }"
                        @input="validateNewUserName" />
                    <span v-if="newUserErrors.name" class="error-text">{{ newUserErrors.name }}</span>
                </div>
                <div class="form-group">
                    <label>Email*</label>
                    <input
                        v-model="newUser.email"
                        type="email"
                        :class="{ error: newUserErrors.email }"
                        @input="validateNewUserEmail" />
                    <span v-if="newUserErrors.email" class="error-text">{{ newUserErrors.email }}</span>
                </div>
                <div class="form-group">
                    <label>Роль*</label>
                    <select v-model="newUser.role">
                        <option value="user">Пользователь</option>
                        <option value="moderator">Модератор</option>
                        <option value="admin">Администратор</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input v-model="newUser.sendWelcomeEmail" type="checkbox" />
                         Отправить приветственное письмо
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" @click="closeAddUserModal"> Отмена</button>
                <button :disabled="!isNewUserValid || isSaving" class="btn btn-primary" @click="addNewUser">
                     {{ isSaving ? 'Сохранение...' : 'Добавить' }}
                </button>
            </div>
        </div>
    </div>
</template>