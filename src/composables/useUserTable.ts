import { ref, computed, readonly } from 'vue'
import type { User, Role, Status, SortColumn } from '@/types/user'

const users = ref<User[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const filterRole = ref<Role | ''>('')
const filterStatus = ref<Status | ''>('')
const dateFrom = ref('')
const dateTo = ref('')

const sortColumn = ref<SortColumn>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

const currentPage = ref(1)
const pageSize = ref(25)

const selectedUsers = ref<number[]>([])

const editingUserId = ref<number | null>(null)
const editForm = ref({ name: '', email: '', role: 'user' as Role })

const showAddUserModal = ref(false)
const showDetailsModal = ref(false)
const selectedUser = ref<User | null>(null)

const newUser = ref({
  name: '',
  email: '',
  role: 'user' as Role,
  sendWelcomeEmail: true
})
const newUserErrors = ref({ name: '', email: '' })

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const getRoleLabel = (role: Role): string => ({
  admin: 'Администратор',
  user: 'Пользователь',
  moderator: 'Модератор'
}[role])

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

const formatRelativeTime = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} ч. назад`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} д. назад`
  return formatDate(dateString)
}

const getActivityClass = (dateString: string): string => {
  const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000)
  if (diffDays < 1) return 'activity-recent'
  if (diffDays < 7) return 'activity-week'
  if (diffDays < 30) return 'activity-month'
  return 'activity-old'
}

const getDefaultAvatar = (name: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  const initial = name.charAt(0).toUpperCase()
  const color = colors[name.charCodeAt(0) % colors.length]
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`
}

const filteredAndSearchedUsers = computed(() => {
  let result = [...users.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toString().includes(q)
    )
  }

  if (filterRole.value) result = result.filter(u => u.role === filterRole.value)
  if (filterStatus.value) result = result.filter(u => u.status === filterStatus.value)
  if (dateFrom.value) {
    const from = new Date(dateFrom.value)
    result = result.filter(u => new Date(u.registrationDate) >= from)
  }
  if (dateTo.value) {
    const to = new Date(dateTo.value)
    to.setHours(23, 59, 59, 999)
    result = result.filter(u => new Date(u.registrationDate) <= to)
  }

  result.sort((a, b) => {
    let aVal: any = (a as any)[sortColumn.value]
    let bVal: any = (b as any)[sortColumn.value]

    if (sortColumn.value === 'registrationDate') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    const order = sortDirection.value === 'asc' ? 1 : -1
    return aVal < bVal ? -order : aVal > bVal ? order : 0
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredAndSearchedUsers.value.length / pageSize.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredAndSearchedUsers.value.slice(start, start + pageSize.value)
})

const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => {
    const end = currentPage.value * pageSize.value;
    return end > filteredAndSearchedUsers.value.length ? filteredAndSearchedUsers.value.length : end;
});
const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = currentPage.value;
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
    } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
    }
    return pages;
});

const isAllSelected = computed(() =>
  paginatedUsers.value.length > 0 &&
  paginatedUsers.value.every(u => selectedUsers.value.includes(u.id))
);

const isNewUserValid = computed(() =>
    newUser.value.name.trim().length > 0 &&
    newUser.value.email.trim().length > 0 &&
    validateEmail(newUser.value.email) &&
    !newUserErrors.value.name &&
    !newUserErrors.value.email
);

const generateMockUsers = (count: number): User[] => {
  const names = ['Алексей', 'Мария', 'Дмитрий', 'Екатерина', 'Сергей', 'Анна', 'Павел', 'Ольга', 'Иван', 'Татьяна']
  const roles: Role[] = ['admin', 'user', 'moderator']
  const statuses: Status[] = ['active', 'inactive']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    registrationDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: null
  }))
}

const resetPage = () => (currentPage.value = 1);

const loadUsers = async () => {
  isLoading.value = true
  error.value = null
  try {
    await new Promise(r => setTimeout(r, 800))
    users.value = generateMockUsers(150)
  } catch (err) {
    error.value = 'Ошибка загрузки данных'
  } finally {
    isLoading.value = false
  }
}

const sortBy = (column: SortColumn) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const toggleSelectUser = (id: number) => {
  const idx = selectedUsers.value.indexOf(id)
  if (idx > -1) selectedUsers.value.splice(idx, 1)
  else selectedUsers.value.push(id)
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value = selectedUsers.value.filter(id => !paginatedUsers.value.some(u => u.id === id))
  } else {
    paginatedUsers.value.forEach(u => {
      if (!selectedUsers.value.includes(u.id)) selectedUsers.value.push(u.id)
    })
  }
}

const startEdit = (user: User) => {
  editingUserId.value = user.id
  editForm.value = { name: user.name, email: user.email, role: user.role }
}

const cancelEdit = () => {
  editingUserId.value = null
  editForm.value = { name: '', email: '', role: 'user' }
}

const saveEdit = async () => {
  if (!editingUserId.value) return
  isSaving.value = true
  await new Promise(r => setTimeout(r, 400))
  const idx = users.value.findIndex(u => u.id === editingUserId.value)
  if (idx !== -1) {
    users.value[idx] = { ...users.value[idx], ...editForm.value }
  }
  cancelEdit()
  isSaving.value = false
}

const deleteUser = async (id: number) => {
  if (!confirm('Удалить пользователя?')) return
  users.value = users.value.filter(u => u.id !== id)
  selectedUsers.value = selectedUsers.value.filter(x => x !== id)
}

const deleteSelectedUsers = async () => {
    if (!confirm(`Удалить ${selectedUsers.value.length}?`)) return;
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        users.value = users.value.filter((u) => !selectedUsers.value.includes(u.id));
        selectedUsers.value = [];
    } catch (err) {
        alert('Ошибка: ' + (err as Error).message);
    }
};

const toggleUserStatus = (id: number) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.status = user.status === 'active' ? 'inactive' : 'active'
}

const openUserDetails = (user: User) => {
  selectedUser.value = user
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedUser.value = null
}

const openAddUserModal = () => {
  showAddUserModal.value = true
  newUser.value = { name: '', email: '', role: 'user', sendWelcomeEmail: true }
  newUserErrors.value = { name: '', email: '' }
}

const closeAddUserModal = () => showAddUserModal.value = false

const exportToCSV = () => {
    const usersToExport =
        selectedUsers.value.length > 0
            ? users.value.filter((u) => selectedUsers.value.includes(u.id))
            : filteredAndSearchedUsers.value;
    const headers = ['ID', 'Имя', 'Email', 'Роль', 'Статус', 'Дата регистрации'];
    const rows = usersToExport.map((u) => [
        u.id,
        u.name,
        u.email,
        getRoleLabel(u.role),
        u.status === 'active' ? 'Активен' : 'Неактивен',
        formatDate(u.registrationDate)
    ]);
    const csv = headers.join(',') + '\n' + rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], {
        type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${Date.now()}.csv`;
    link.click();
};

const clearDateFilter = () => {
    dateFrom.value = '';
    dateTo.value = '';
};

const validateNewUser = () => {
  newUserErrors.value.name = newUser.value.name.trim() ? '' : 'Обязательное поле'
  newUserErrors.value.email = validateEmail(newUser.value.email) && !users.value.some(u => u.email === newUser.value.email)
    ? '' : 'Некорректный или занятый email'
}

const addNewUser = async () => {
  validateNewUser()
  if (newUserErrors.value.name || newUserErrors.value.email) return

  isSaving.value = true
  await new Promise(r => setTimeout(r, 600))

  const newId = Math.max(...users.value.map(u => u.id), 0) + 1
  const newU: User = {
    id: newId,
    name: newUser.value.name.trim(),
    email: newUser.value.email.trim(),
    role: newUser.value.role,
    status: 'active',
    registrationDate: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    avatar: null
  }
  users.value.unshift(newU)
  closeAddUserModal()
  isSaving.value = false
}

const clearAllFilters = () => {
  searchQuery.value = ''
  filterRole.value = ''
  filterStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

export function useUserTable() {
  return {
    // Состояние
    currentPage,
    dateFrom,
    dateTo,
    editForm,
    editingUserId: readonly(editingUserId),
    error: readonly(error),
    filterRole,
    filterStatus,
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    newUser,
    newUserErrors,
    pageSize,
    searchQuery,
    selectedUser: readonly(selectedUser),
    selectedUsers: readonly(selectedUsers),
    showAddUserModal,
    showDetailsModal,
    sortColumn: readonly(sortColumn),
    sortDirection: readonly(sortDirection),
    users: readonly(users),

    // Computed
    filteredAndSearchedUsers,
    isAllSelected,
    isNewUserValid,
    paginatedUsers,
    paginationEnd,
    paginationStart,
    totalPages,
    visiblePages,

    // Методы
    addNewUser,
    cancelEdit,
    clearAllFilters,
    clearDateFilter,
    closeAddUserModal,
    closeDetailsModal,
    deleteSelectedUsers,
    deleteUser,
    exportToCSV,
    formatDate,
    formatRelativeTime,
    getActivityClass,
    getDefaultAvatar,
    getRoleLabel,
    goToPage,
    loadUsers,
    openAddUserModal,
    openUserDetails,
    resetPage,
    saveEdit,
    sortBy,
    startEdit,
    toggleSelectAll,
    toggleSelectUser,
    toggleUserStatus,
    validateEmail
  }
}