// User roles
export enum UserRole {
  ADMIN = 'admin',
  AUDITOR = 'auditor'
}

// User interface
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  avatar?: string;
  name: string;
}

// Travel diary status
export enum DiaryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELETED = 'deleted'
}

// Travel diary interface
export interface TravelDiary {
  id: string;
  title: string;
  content: string;
  images: string[];
  video?: string;
  coverImage?: string;
  author: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
  };
  status: DiaryStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Login form values
export interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

// Audit form values
export interface AuditFormValues {
  status: DiaryStatus;
  rejectReason?: string;
} 