import { IUser, TicketType } from '../../types/types';

// Mock users that will be assigned as clients
export const mockUsers: IUser[] = [
  {
    id: "1a2b3c4d-1234-5678-9012-abcdef123456",
    username: "johndoe_biz",
    firstname: "John",
    lastname: "Doe",
    role: "client",
    email: "john.doe@acmecorp.com",
    gender: "male",
    description: "CEO of Acme Corporation",
    password: "securePassword123!",
    last_seen_at: new Date().toDateString(),
    confirmPassword: "securePassword123!",
    categoryId: "cat_business",
    supportId: "agent_789",
    avatarUrl: "https://example.com/avatars/john-doe.jpg",
    phone: "+12025551234",
    countryCode: "US",
    company: "Acme Corporation",
    jobTitle: "Chief Executive Officer",
    clientType: "business",
    status: "vip",
    leadSource: "referral",
    address: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    }
  },
  {
    id: "5e6f7g8h-2345-6789-0123-456789abcdef",
    username: "sarah_smith",
    firstname: "Sarah",
    lastname: "Smith",
    role: "client",
    email: "sarah.smith@gmail.com",
    gender: "female",
    description: "Freelance designer",
    password: "designRocks456!",
    confirmPassword: "designRocks456!",
    last_seen_at: new Date().toDateString(),
    categoryId: "cat_creative",
    supportId: "agent_123",
    avatarUrl: "https://example.com/avatars/sarah-smith.jpg",
    phone: "+447700123456",
    countryCode: "GB",
    clientType: "individual",
    status: "active",
    leadSource: "organic_search",
    address: {
      street: "45 Creative Lane",
      city: "London",
      postalCode: "SW1A 1AA",
      country: "United Kingdom"
    }
  }
];

export const mockTickets: TicketType[] = [
  {
    id: 'TK-1001',
    subject: 'Website not loading properly',
    description: 'Our company website is showing a 500 error when accessing the checkout page. This started happening after the last deployment.',
    status: 'open',
    priority: 'high',
    category: 'Technical',
    createdAt: new Date('2023-11-15T09:15:00Z').toISOString(),
    updatedAt: new Date('2023-11-15T14:30:00Z').toISOString(),
    resolvedAt: null,
    requester: {
      id: 'USR-001',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '+12025551234',
      avatarUrl: 'https://example.com/avatars/john-doe.jpg'
    },
    assignee: {
      id: 'AGT-001',
      firstname: 'Sarah',
      lastname: 'Smith',
      email: 'sarah.smith@support.com',
      phone: '+12025554321'
    },
    attachments: [
      { name: 'screenshot.png', path: '/attachments/screenshot1.png' },
      { name: 'error_log.txt', path: '/attachments/error_log.txt' }
    ]
  },
  {
    id: 'TK-1002',
    subject: 'Billing discrepancy',
    description: 'I was charged twice for my subscription this month. The invoice shows two identical charges on the same day.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Billing',
    createdAt: new Date('2023-11-10T11:20:00Z').toISOString(),
    updatedAt: new Date('2023-11-14T16:45:00Z').toISOString(),
    resolvedAt: null,
    requester: {
      id: 'USR-002',
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+12025559876'
    },
    assignee: null,
    attachments: [
      { name: 'invoice.pdf', path: '/attachments/invoice_nov2023.pdf' }
    ]
  },
  {
    id: 'TK-1003',
    subject: 'Feature request - Dark mode',
    description: 'Our team would love to have a dark mode option in the dashboard interface to reduce eye strain during night work.',
    status: 'on_hold',
    priority: 'low',
    category: 'Feature Request',
    createdAt: new Date('2023-11-05T13:20:00Z').toISOString(),
    updatedAt: new Date('2023-11-12T10:10:00Z').toISOString(),
    resolvedAt: null,
    requester: {
      id: 'USR-003',
      firstname: 'Michael',
      lastname: 'Brown',
      email: 'michael.brown@example.com',
      phone: '+12025553456'
    } as IUser,
    assignee: {
      id: 'AGT-002',
      firstname: 'David',
      lastname: 'Wilson',
      email: 'david.wilson@support.com'
    } as IUser,
    attachments: []
  }
];