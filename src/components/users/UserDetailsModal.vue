<script setup lang="ts">
import { useUserTable } from '@/composables/useUserTable';

const {
    closeDetailsModal,
    formatDate,
    formatRelativeTime,
    getDefaultAvatar,
    getRoleLabel,
    selectedUser,
    showDetailsModal
} = useUserTable();
</script>

<template>
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
        <div class="modal modal-large">
            <div class="modal-header">
                <h3>Информация о пользователе</h3>
                <button class="btn-close" @click="closeDetailsModal">✕</button>
            </div>
            <div v-if="selectedUser" class="modal-body">
                <div class="user-details">
                    <div class="detail-section">
                        <img
                            :src="selectedUser.avatar || getDefaultAvatar(selectedUser.name)"
                            :alt="selectedUser.name"
                            class="avatar-large" />
                        <h2>{{ selectedUser.name }}</h2>
                        <p class="user-email">{{ selectedUser.email }}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Основная информация</h4>
                        <div class="detail-row">
                            <span class="label">ID:</span>
                            <span>{{ selectedUser.id }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Роль:</span>
                            <span :class="['role-badge', 'role-' + selectedUser.role]">
                                 {{ getRoleLabel(selectedUser.role) }}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Статус:</span>
                            <span
                                :class="[
                                    'status-badge',
                                    selectedUser.status === 'active' ? 'status-active' : 'status-inactive'
                                ]">
                                 {{ selectedUser.status === 'active' ? 'Активен' : 'Неактивен' }}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Дата регистрации:</span>
                            <span>{{ formatDate(selectedUser.registrationDate) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Последняя активность:</span>
                            <span>{{ formatRelativeTime(selectedUser.lastActivity) }}</span>
                        </div>
                    </div>
                    <div class="detail-section">
                        <h4>Статистика</h4>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-value"> {{ selectedUser.loginCount || 0 }} </div>
                                <div class="stat-label">Входов</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value"> {{ selectedUser.postsCount || 0 }} </div>
                                <div class="stat-label">Постов</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value"> {{ selectedUser.commentsCount || 0 }} </div>
                                <div class="stat-label">Комментариев</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" @click="closeDetailsModal"> Закрыть </button>
            </div>
        </div>
    </div>
</template>