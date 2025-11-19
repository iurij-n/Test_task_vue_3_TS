export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive';
  registrationDate: string;
  lastActivity: string;
  avatar: string | null;
  loginCount?: number;
  postsCount?: number;
  commentsCount?: number;
}

export type Role = User['role'];
export type Status = User['status'];
export type SortColumn = 'id' | 'name' | 'email' | 'registrationDate';