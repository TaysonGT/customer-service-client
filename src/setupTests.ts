import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill for scrollIntoView in Jest tests
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = function() {};
}


// Mock for supabase
vi.mock('./lib/supabase', () => ({
  default: {
    auth: {
      getUser: async () => ({ data: { user: { id: 'test-user' } } })
    },
    from: () => ({
      insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'real-message', content: 'Hello', chatId: '1', senderId: 'test-user', senderType: 'client', createdAt: new Date() }, error: null }) }) })
    })
  }
}));

// Mock for useAuth
vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ currentUser: { id: 'test-user' } })
}));

// Mock for useChatMessages
vi.mock('./hooks/useChatMessages', () => ({
  useChatMessages: () => ({
    groups: [
      {
        senderId: 'test-user',
        timestamp: new Date().toISOString(),
        senderInfo: { id: 'test-user', username: 'username', firstname: 'Test', lastname: 'User' },
        messages: [
          { id: '1', content: 'Hello', chatId: '1', senderId: 'test-user', senderType: 'client', createdAt: new Date() }
        ]
      }
    ],
    setGroups: vi.fn(),
    participants: [{ id: 'test-user', username: 'username', firstname: 'Test', lastname: 'User', senderType: 'client' }],
    loadMore: vi.fn()
  })
}));
