export interface imageType {
  url: string;
  altText: string;
  isPrimary?: boolean;
}


export interface IAuthContext {
  currentUser: ICurrentUser | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, role: "client" | "support_agent") => Promise<void>;
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
  role: 'client' | 'support_agent' | 'admin';
  email: string;
  gender: string;
  description?: string;
  password: string;
  confirmPassword: string;
  categoryId: string;
  supportId: string;
  phone: string;
  last_seen_at: string;
  avatarUrl?: string;
  countryCode?: string;
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

export type TicketType = {
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    category: string;
    attachments: Partial<IFile>[];
    requester: Partial<IUser>;
    assignee: Partial<IUser>|null;
    resolvedAt: string|null;
}

export interface IChat {
  id: string;
  title: string;
  description: string;
  ended: boolean;
  participants: IUser[];
  lastMessage?: IChatMessage;
  client: IUser;
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
  path: string;
  bucket: string;
  name: string;
  type: 'audio'|'image'|'document';
  size: number;
  meta?: { duration?: number; width?: number; height?: number };
  client_id?: string;
  message_id?: string;
}

export interface IChatMessage {
  id: string;               // Real UUID from database
  localId?: string;         // Only for optimistic messages (client-side only)
  chatId: string;
  type: IMessageType;
  senderId: string;
  senderType: 'client' | 'support_agent';
  content: string;
  createdAt: string;
  file?: IFile,
  status: 'sending' | 'delivered' | 'failed' | 'seen';
  updatedAt?: string;
}

export interface IMessageGroup {
  senderId: string;
  senderType: 'client' | 'support_agent';
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
  role: 'client' | 'support_agent' | 'admin';
}
