// 用户角色
export enum UserRole {
  ADMIN = 'admin',
  AUDITOR = 'reviewer'
}

// 用户
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  avatar?: string;
  name: string;
}

// 游记状态
export enum DiaryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELETED = 'deleted'
}

// 游记
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

// 登录相关
export interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

// 审核
export interface AuditFormValues {
  status: DiaryStatus;
  rejectReason?: string;
} 