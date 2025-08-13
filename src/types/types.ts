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
  avatarUrl: string;
  role: 'client' | 'support_agent' | 'admin';
  email: string;
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
  unread_messages: number;
  status: 'active'|'waiting';
}

export type IMessageType = "text" | "audio" | "image" | "document"

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
