export interface imageType {
  url: string;
  altText: string;
  isPrimary?: boolean;
}


export interface IAuthContext {
  currentUser: ICurrentUser | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, role: "client" | "support") => Promise<void>;
  logoutUser: () => Promise<void>;
}

export type SignupDataType = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  validPassword: string;
  email: string;
  gender: string;
}

export type IUser = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  description?: string;
  password?: string;
  confirmPassword?: string;
  categoryId: string;
  supportId: string;
  phone: string;
  lastSeenAt: string;
  avatarUrl?: string;
  countryCode?: string;
  clientProfile?: ClientProfile,
  adminProfile?: AdminProfile
}

export type ClientProfile = {
  company?: string;
  jobTitle?: string;
  clientType?: 'individual' | 'business';
  status?: 'prospect' | 'active' | 'inactive' | 'vip';
  leadSource?: string;
  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  // Social
  socialProfiles?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };  
  // Preferences
  preferences?: {
    timezone?: string;
    language?: string;
    contactMethod?: 'email' | 'phone' | 'sms' | 'whatsapp';
    notificationPreferences?: {
      marketing?: boolean;
      productUpdates?: boolean;
    };
  };
}
export type AdminProfile = {
  role: AdminRole;
  status: AdminStatus;
  title: string;
  permissions: { [key: string]: boolean }; // JSON string of specific permissions
  canManageAdmins?: boolean;
  createdBy?: IUser;
}

export type TicketType = {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus
  priority: TicketPriority
  chat?: IChat;
  createdAt: string;
  updatedAt: string;
  category: string;
  attachments: IFile[];
  requester: IUser;
  assignee?: IUser;
  isUrgent: boolean;
  resolvedAt?: string;
}

export interface IChat {
  id: string;
  title: string;
  description: string;
  ended: boolean;
  users: IUser[];
  lastMessage?: IChatMessage;
  startedAt: string;
  updatedAt: string;
  unread_messages: IChatMessage[];
  status: 'active'|'waiting';
}

export type IMessageType = "text" | "audio" | "image" | "document"

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface IFile {
  id: string;
  path: string;
  bucket: string;
  name: string;
  type: 'audio'|'image'|'document';
  size: number;
  meta?: IFileMeta;
  user_id?: string;
  message_id?: string;
  uploaded_at: string;
}

export interface IFileMeta {
  duration?: number;
  height?: number;
  width?: number;
  name?: string;
  size?: number;
  type?: string;
}

export interface IChatMessage {
  id: string;
  localId?: string;
  type: IMessageType;
  chat?: IChat;
  sender?: IUser;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  file_id?: string,
  file?: IFile,
  status: 'sending' | 'delivered' | 'failed' | 'seen';
  updatedAt?: string;
}

export interface IMessageGroup {
  senderId: string;
  messages: IChatMessage[];
  showHeader: boolean;
  timestamp: string;
  senderInfo: IUser;
}

export interface ICurrentUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl?: string
  role: UserRole;
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  CONTENT_MANAGER = 'content_manager'
}

export type UserRole = typeof AdminRole[keyof typeof AdminRole] | 'client';

export enum AdminStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}