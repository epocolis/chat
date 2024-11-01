// src/store/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MessageRole = 'user' | 'assistant';

type Message = {
  role: MessageRole;
  content: string;
}

type ChatSession = {
  id: string;
  name: string;
  messages: Message[];
  project?: string;
  createdAt: Date;
}

type ChatStore = {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  startNewChat: (initialMessage: string) => void;
  addMessage: (message: string) => void;
  resetChat: () => void;
  getRecentChats: (limit?: number) => ChatSession[];
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatName: (chatId: string, newName: string) => void;
}

const createMessage = (role: MessageRole, content: string): Message => ({
  role,
  content
});

const INITIAL_CHATS: ChatSession[] = [
  {
    id: '1',
    name: 'Building an AI Assistant React App with PDF...',
    project: 'multi-agent-chatui-react',
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    messages: [
      createMessage('user', 'How do I implement PDF parsing in React?'),
      createMessage('assistant', 'To implement PDF parsing in React, you can use...')
    ]
  },
  {
    id: '2',
    name: 'Optimizing Cloud Job Scheduling for Resource...',
    project: 'Optimal Resource allocation',
    createdAt: new Date(Date.now() - 26 * 60000), // 26 minutes ago
    messages: [
      createMessage('user', 'What are the best practices for cloud job scheduling?'),
      createMessage('assistant', 'For optimal cloud job scheduling...')
    ]
  },
  {
    id: '3',
    name: 'Managing State in Large React Apps',
    project: 'multi-agent-chatui-react',
    createdAt: new Date(Date.now() - 4 * 3600000), // 4 hours ago
    messages: [
      createMessage('user', 'How to manage complex state in React?'),
      createMessage('assistant', 'For managing complex state...')
    ]
  },
  {
    id: '4',
    name: 'Implementing Authentication System',
    project: 'multi-agent-chatui-react',
    createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
    messages: [
      createMessage('user', 'Best practices for auth implementation?'),
      createMessage('assistant', 'When implementing authentication...')
    ]
  },
  {
    id: '5',
    name: 'Database Optimization Techniques',
    project: 'Database Performance',
    createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    messages: [
      createMessage('user', 'How to optimize database queries?'),
      createMessage('assistant', 'For database optimization...')
    ]
  },
  {
    id: '6',
    name: 'CI/CD Pipeline Setup',
    project: 'DevOps',
    createdAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
    messages: [
      createMessage('user', 'Setting up CI/CD pipeline'),
      createMessage('assistant', 'To set up a CI/CD pipeline...')
    ]
  }
];

// Custom storage handler to properly serialize/deserialize Dates
const customStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      const parsed = JSON.parse(value, (key, value) => {
        if (key === 'createdAt') {
          return new Date(value);
        }
        return value;
      });
      return parsed;
    }
    return null;
  },
  setItem: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => localStorage.removeItem(key),
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatSessions: INITIAL_CHATS,
      currentChatId: null,

      startNewChat: (initialMessage) => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          name: `Chat - ${new Date().toLocaleString()}`,
          createdAt: new Date(),
          messages: [
            createMessage('user', initialMessage),
            createMessage('assistant', "I'll help you with that. What specific details would you like to know?")
          ]
        };

        set((state) => ({
          chatSessions: [newSession, ...state.chatSessions],
          currentChatId: newSession.id
        }));
      },

      addMessage: (message) => {
        set((state) => {
          const currentChat = state.chatSessions.find(chat => chat.id === state.currentChatId);
          if (!currentChat) return state;

          const updatedSessions = state.chatSessions.map(chat => 
            chat.id === state.currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    createMessage('user', message),
                    createMessage('assistant', 'This is a simulated response.')
                  ]
                }
              : chat
          );

          return {
            ...state,
            chatSessions: updatedSessions
          };
        });
      },

      resetChat: () => {
        set((state) => ({
          ...state,
          currentChatId: null
        }));
      },

      getRecentChats: (limit = 6) => {
        const { chatSessions } = get();
        return [...chatSessions]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      },

      selectChat: (chatId) => {
        set((state) => ({
          ...state,
          currentChatId: chatId
        }));
      },

      deleteChat: (chatId) => {
        set((state) => ({
          ...state,
          chatSessions: state.chatSessions.filter(chat => chat.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId
        }));
      },

      updateChatName: (chatId, newName) => {
        set((state) => ({
          ...state,
          chatSessions: state.chatSessions.map(chat =>
            chat.id === chatId
              ? { ...chat, name: newName }
              : chat
          )
        }));
      }
    }),
    {
      name: 'chat-store',
      storage: customStorage,
      partialize: (state) => ({
        chatSessions: state.chatSessions,
        // Don't persist currentChatId
      }),
    }
  )
);

export default useChatStore;