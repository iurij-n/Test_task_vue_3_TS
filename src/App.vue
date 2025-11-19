<script setup lang="ts">
import UserTable from '@/components/users/UserTable.vue'
</script>

<template>
  <div class="app-wrapper">
    <UserTable 
      title="Управление пользователями (Рефакторинг)" 
      :initial-page-size="25" 
      api-endpoint="/api/users"
    />
  </div>
</template>