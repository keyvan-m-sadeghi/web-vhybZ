# vhybZ Web Client - Architecture & Implementation Guide

## Overview

The vhybZ Web Client is a React-based application that provides the primary web interface for the vhybZ platform. It integrates the vhybZ Core Library to enable AI-powered artifact creation through a ChatGPT-like interface with real-time preview capabilities.

## Repository Context

### Platform Architecture
- **Backend API**: https://github.com/vhybzOS/deno-vhybZ (Deno/Fresh data store and authentication)
- **Core Library**: https://github.com/vhybzOS/vhybZ (AI logic, LLM integration, SOUL framework)
- **Web Client**: https://github.com/vhybzOS/web-vhybZ (this repo - React UI)
- **Mobile Client**: https://github.com/vhybzOS/RN-vhybZ (React Native app)

### Separation of Concerns
- **This Web Client**: React UI layer, user experience, platform-specific features
- **vhybZ Library**: AI/LLM integration, artifact generation, real-time preview logic
- **Backend API**: Data persistence, authentication, public hosting, analytics

## Technical Architecture

### Technology Stack
- **Framework**: React 19.1.0 with TypeScript for type safety
- **Build System**: Vite 6.3.5 with hot module replacement and fast builds
- **Routing**: React Router 7.6.2 with file-based routing for SPA navigation
- **UI Components**: Radix UI + Tailwind CSS for design system and styling
- **State Management**: Zustand for cross-platform state management
- **Data Fetching**: TanStack Query (@tanstack/react-query) for server state
- **Development**: ESLint with React-specific rules and best practices

### Development Environment

#### Node.js Environment
This directory uses **standard Node.js tooling**:
- **Package Manager**: npm (not Deno)
- **Runtime**: Node.js with standard npm packages
- **Build System**: Vite with React Router 7
- **Commands**: Use `npm run` commands, never `deno task`

#### Why Node.js Here?
- React ecosystem expects Node.js environment
- npm packages work out of the box
- Developer familiarity with standard tooling
- No "node:" prefixes or Deno-specific imports needed

### Cross-Platform State Architecture

#### Design Philosophy
Our state management strategy prioritizes **code reusability** across React Web and React Native platforms. By encapsulating all business logic, API interactions, and state management in platform-agnostic modules, we achieve 90%+ code sharing between web and mobile implementations.

#### Core Principles
1. **Platform-Agnostic Business Logic**: Pure TypeScript/JavaScript for all data operations
2. **Idiomatic Code First**: Use standard patterns, avoid custom wrappers and abstractions
3. **Minimal Cognitive Overhead**: External developers should understand code immediately
4. **Shared State Stores**: Zustand stores work identically across platforms
5. **Zero Boilerplate DX**: Custom hooks hide complexity, expose clean APIs
6. **Role-Based Architecture**: Built-in support for admin panels and permission systems

#### State Management Stack
- **Zustand**: Lightweight, boilerplate-free state management for UI state
- **TanStack Query**: Idiomatic server state with standard fetch functions
- **No Custom Classes**: Avoid `new ClassName()` patterns, prefer functional approach
- **Standard Patterns**: Use globally understood code patterns over custom abstractions

#### Design Decisions

##### 1. No HTTP Client Classes
```typescript
// ❌ Avoid: Custom wrapper classes
class HttpClient {
  async request() { /* ... */ }
}

// ✅ Prefer: Idiomatic TanStack Query functions
export const fetchCurrentUser = async (): Promise<User | null> => {
  const response = await fetch('/api/user', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};
```

##### 2. Functional API Patterns
```typescript
// ❌ Avoid: API service classes
export const authApi = {
  async getCurrentUser() { /* */ }
};

// ✅ Prefer: Direct fetch functions
export const fetchCurrentUser = async () => { /* */ };
export const logoutUser = async () => { /* */ };
```

##### 3. Clean Hook DX
```typescript
// ✅ Goal: Zero boilerplate for consumers
const { user, login, logout, isLoading } = useAuth();
const { canAccess } = useRole('admin');

// All complexity hidden in hook implementation
// External devs see clean, obvious APIs
```

##### 4. Role-Based Access Control
```typescript
// Built-in role support for admin panels
interface User {
  role: 'user' | 'admin' | 'superadmin';
  permissions: string[];
}

// Simple role checking
const AdminPanel = () => {
  return (
    <ProtectedRoute roles={['admin', 'superadmin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
};
```

### Application Structure
```
src/
├── app/                    # React Router 7 app directory
│   ├── root.tsx           # App shell and providers
│   ├── routes.ts          # Route configuration
│   └── routes/            # File-based routing
│       ├── login.tsx      # Authentication page
│       ├── dashboard.tsx  # User dashboard
│       ├── assistant.tsx  # Main chat interface
│       └── api/           # API routes
├── components/             # Reusable UI components
│   ├── ui/                # Radix UI + Tailwind components
│   ├── thread.tsx         # Chat thread component
│   ├── login-form.tsx     # Authentication form
│   └── protected-route.tsx # Route protection
├── lib/                   # Core platform-agnostic modules
│   ├── api/               # HTTP client and API services
│   │   ├── http-client.ts # Platform-agnostic fetch wrapper
│   │   ├── auth-api.ts    # Authentication API calls
│   │   └── artifacts-api.ts # Artifact CRUD operations
│   ├── stores/            # Zustand state stores
│   │   ├── auth-store.ts  # Authentication state
│   │   ├── artifacts-store.ts # Artifact management
│   │   └── chat-store.ts  # Chat/conversation state
│   ├── queries/           # TanStack Query configurations
│   │   ├── auth-queries.ts # Auth-related queries
│   │   ├── artifacts-queries.ts # Artifact queries
│   │   └── chat-queries.ts # Chat history queries
│   └── services/          # Platform adapters
│       ├── auth-service.web.ts # Web OAuth implementation
│       ├── storage-service.web.ts # Web storage adapter
│       └── types.ts       # Shared TypeScript types
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts        # Authentication hooks
│   ├── use-artifacts.ts   # Artifact management hooks
│   └── use-chat.ts        # Chat functionality hooks
├── providers/             # React providers
│   ├── query-provider.tsx # TanStack Query setup
│   └── auth-provider.tsx  # Authentication context
└── utils/                 # Shared utilities
    ├── validation.ts      # Zod schemas and validation
    └── constants.ts       # App-wide constants
```

#### Cross-Platform Module Strategy
```
lib/                    # 90% shared across platforms
├── stores/            # Zustand stores (100% shared)
├── queries/           # TanStack Query configs (100% shared)
├── api/              # HTTP layer (95% shared)
├── services/         # Platform adapters (50% shared interfaces)
└── types.ts          # TypeScript definitions (100% shared)

// Platform-specific implementations:
// Web: services/*.web.ts
// React Native: services/*.native.ts
```

## State Management & Data Flow Architecture

### Zustand + TanStack Query Integration

#### Architecture Overview
We use a hybrid approach combining Zustand for client state and TanStack Query for server state, designed for maximum cross-platform compatibility:

```typescript
// lib/stores/auth-store.ts - Client State (Zustand)
interface AuthState {
  // UI/Client-only state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// lib/queries/auth-queries.ts - Server State (TanStack Query)
export const authQueries = {
  user: () => ({
    queryKey: ['auth', 'user'],
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry 401s (unauthorized)
      if (error?.status === 401) return false;
      return failureCount < 3;
    }
  }),
  
  profile: (userId: string) => ({
    queryKey: ['auth', 'profile', userId],
    queryFn: () => authApi.getUserProfile(userId),
    enabled: !!userId
  })
};

export const authMutations = {
  logout: () => ({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
      authStore.getState().clearError();
    }
  })
};
```

#### Idiomatic Fetch Functions
```typescript
// lib/api/auth.ts - Direct fetch functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchCurrentUser = async (): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    credentials: 'include', // Essential for cookie auth
  });
  
  if (response.status === 401) {
    return null; // Not authenticated
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  return response.json();
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }
};

// Web-specific OAuth redirect
export const initiateGoogleLogin = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
};
```

#### Custom Hooks Pattern
```typescript
// hooks/use-auth.ts - Cross-Platform Hooks
export const useAuth = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  
  // Server state (cached, synchronized)
  const userQuery = useQuery(authQueries.user());
  
  // Mutations
  const logoutMutation = useMutation(authMutations.logout());

  // Derived state
  const isAuthenticated = !!userQuery.data && !userQuery.error;
  const isLoading = userQuery.isLoading || authStore.isLoading;
  
  // Actions
  const login = useCallback(() => {
    authStore.setLoading(true);
    authApi.initiateLogin(); // Platform-specific implementation
  }, []);

  const logout = useCallback(async () => {
    authStore.setLoading(true);
    try {
      await logoutMutation.mutateAsync();
      // TanStack Query automatically clears cache
      // Zustand clears client state
    } catch (error) {
      authStore.setError(error.message);
    } finally {
      authStore.setLoading(false);
    }
  }, [logoutMutation]);

  // Auto-refresh user data
  useEffect(() => {
    if (!userQuery.data && !userQuery.error && !userQuery.isLoading) {
      userQuery.refetch();
    }
  }, []);

  return {
    // Data
    user: userQuery.data,
    isAuthenticated,
    isLoading,
    error: authStore.error || userQuery.error?.message,
    
    // Actions
    login,
    logout,
    refetch: userQuery.refetch,
    
    // Utils
    clearError: authStore.clearError
  };
};

// Specialized hooks for specific use cases
export const useUser = () => {
  const { data } = useQuery(authQueries.user());
  return data;
};

export const useAuthActions = () => {
  const { login, logout } = useAuth();
  return { login, logout };
};
```

#### Artifacts & Chat State Management
```typescript
// lib/stores/artifacts-store.ts
interface ArtifactsState {
  // Client-only state
  selectedArtifactId: string | null;
  isCreating: boolean;
  creationProgress: number;
  previewContent: string;
  
  // Actions
  setSelectedArtifact: (id: string | null) => void;
  setCreationProgress: (progress: number) => void;
  updatePreview: (content: string) => void;
}

// lib/queries/artifacts-queries.ts
export const artifactsQueries = {
  list: (userId: string) => ({
    queryKey: ['artifacts', 'list', userId],
    queryFn: () => artifactsApi.getUserArtifacts(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  }),
  
  detail: (artifactId: string) => ({
    queryKey: ['artifacts', 'detail', artifactId],
    queryFn: () => artifactsApi.getArtifact(artifactId),
    enabled: !!artifactId
  })
};

export const artifactsMutations = {
  create: () => ({
    mutationFn: (data: CreateArtifactRequest) => artifactsApi.createArtifact(data),
    onMutate: async (variables) => {
      // Optimistic update
      const userId = authStore.getState().user?.id;
      if (userId) {
        await queryClient.cancelQueries(artifactsQueries.list(userId));
        
        const optimisticArtifact = {
          id: `temp-${Date.now()}`,
          ...variables,
          createdAt: new Date().toISOString(),
          isOptimistic: true
        };
        
        queryClient.setQueryData(
          artifactsQueries.list(userId).queryKey,
          (old: Artifact[] = []) => [optimisticArtifact, ...old]
        );
      }
    },
    onSuccess: (newArtifact, variables) => {
      // Replace optimistic update with real data
      const userId = authStore.getState().user?.id;
      if (userId) {
        queryClient.setQueryData(
          artifactsQueries.list(userId).queryKey,
          (old: Artifact[] = []) =>
            old.map(artifact =>
              artifact.isOptimistic ? newArtifact : artifact
            )
        );
      }
    }
  }),
  
  update: () => ({
    mutationFn: ({ id, data }: { id: string; data: UpdateArtifactRequest }) =>
      artifactsApi.updateArtifact(id, data),
    onSuccess: (updatedArtifact) => {
      // Update both list and detail caches
      queryClient.setQueryData(
        artifactsQueries.detail(updatedArtifact.id).queryKey,
        updatedArtifact
      );
      
      const userId = authStore.getState().user?.id;
      if (userId) {
        queryClient.setQueryData(
          artifactsQueries.list(userId).queryKey,
          (old: Artifact[] = []) =>
            old.map(artifact =>
              artifact.id === updatedArtifact.id ? updatedArtifact : artifact
            )
        );
      }
    }
  })
};

// hooks/use-artifacts.ts
export const useArtifacts = () => {
  const { user } = useAuth();
  const artifactsStore = useArtifactsStore();
  
  const artifactsQuery = useQuery({
    ...artifactsQueries.list(user?.id || ''),
    enabled: !!user?.id
  });
  
  const createMutation = useMutation(artifactsMutations.create());
  const updateMutation = useMutation(artifactsMutations.update());
  
  const createArtifact = useCallback(async (prompt: string) => {
    artifactsStore.setCreationProgress(0);
    artifactsStore.setIsCreating(true);
    
    try {
      // Simulate progress updates during creation
      const progressInterval = setInterval(() => {
        artifactsStore.setCreationProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      const result = await createMutation.mutateAsync({
        prompt,
        userId: user?.id || ''
      });
      
      clearInterval(progressInterval);
      artifactsStore.setCreationProgress(100);
      
      return result;
    } finally {
      artifactsStore.setIsCreating(false);
      artifactsStore.setCreationProgress(0);
    }
  }, [user?.id, createMutation, artifactsStore]);
  
  return {
    // Data
    artifacts: artifactsQuery.data || [],
    selectedArtifact: artifactsStore.selectedArtifactId,
    isLoading: artifactsQuery.isLoading,
    isCreating: artifactsStore.isCreating,
    creationProgress: artifactsStore.creationProgress,
    
    // Actions
    createArtifact,
    updateArtifact: updateMutation.mutateAsync,
    selectArtifact: artifactsStore.setSelectedArtifact,
    refetch: artifactsQuery.refetch
  };
};
```

#### Provider Setup
```typescript
// providers/query-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute default
      retry: (failureCount, error) => {
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    },
    mutations: {
      retry: 1
    }
  }
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// app/root.tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vhybZ-ui-theme">
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### React Native Migration Strategy

#### Shared Code (95% reusable)
```typescript
// All these modules work identically on React Native:
├── lib/
│   ├── stores/           # 100% shared
│   ├── queries/          # 100% shared  
│   ├── api/             # 95% shared (HTTP client)
│   └── types.ts         # 100% shared
├── hooks/               # 100% shared
└── utils/               # 100% shared

// Platform-specific adaptations:
// services/auth-service.native.ts
export const authService = {
  async initiateLogin() {
    // Use react-native-app-auth instead of window.location
    const result = await authorize(authConfig);
    return result;
  }
};
```

#### Benefits of This Architecture
1. **Type Safety**: Full TypeScript coverage across all layers
2. **Caching**: Automatic background refetching and cache management
3. **Optimistic Updates**: Immediate UI feedback with rollback on failure
4. **Error Handling**: Centralized error boundaries and retry logic
5. **Performance**: Background prefetching and selective re-rendering
6. **Cross-Platform**: 95% code reuse between web and mobile
7. **Developer Experience**: React Query DevTools and Zustand DevTools

## Core Features Implementation

### 1. ChatGPT-like Interface

#### Conversation Component Architecture
```typescript
interface ConversationProps {
  conversationId?: string;
  onArtifactGenerated: (artifact: Artifact) => void;
}

const Conversation: React.FC<ConversationProps> = ({ 
  conversationId, 
  onArtifactGenerated 
}) => {
  const { createArtifact, isGenerating } = useVhybZ();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = async (prompt: string) => {
    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const artifact = await createArtifact({
        prompt,
        conversationId,
        onUpdate: (update) => {
          // Show real-time generation progress
          setStreamingContent(update.html);
        }
      });
      
      const assistantMessage = { 
        role: 'assistant', 
        content: 'Artifact created successfully',
        artifact 
      };
      setMessages(prev => [...prev, assistantMessage]);
      onArtifactGenerated(artifact);
    } catch (error) {
      // Handle generation errors gracefully
      showErrorMessage(error.message);
    }
  };
  
  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <MessageInput 
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={isGenerating}
        placeholder="Describe the artifact you want to create..."
      />
    </ChatContainer>
  );
};
```

#### Real-time Streaming Implementation
```typescript
const useStreamingGeneration = () => {
  const [streamContent, setStreamContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const handleStream = useCallback((update: ArtifactUpdate) => {
    setStreamContent(prev => {
      // Merge incremental updates
      return mergeHTMLUpdates(prev, update.html);
    });
  }, []);
  
  return {
    streamContent,
    isStreaming,
    handleStream,
    resetStream: () => setStreamContent('')
  };
};
```

### 2. Real-time Artifact Preview

#### Sandboxed Preview Component
```typescript
interface ArtifactPreviewProps {
  content: string;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({ 
  content, 
  isLoading, 
  onError 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!iframeRef.current || !content) return;
    
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        // Clear previous content
        doc.open();
        
        // Inject security headers and sanitized content
        const sanitizedContent = sanitizeHTML(content);
        const wrappedContent = wrapWithSecurity(sanitizedContent);
        
        doc.write(wrappedContent);
        doc.close();
        
        setPreviewError(null);
      }
    } catch (error) {
      setPreviewError(error.message);
      onError?.(error);
    }
  }, [content, onError]);
  
  if (isLoading) {
    return <PreviewSkeleton />;
  }
  
  if (previewError) {
    return <PreviewError message={previewError} />;
  }
  
  return (
    <PreviewContainer>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin allow-forms"
        title="Artifact Preview"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          borderRadius: '8px'
        }}
      />
    </PreviewContainer>
  );
};
```

#### Content Security Implementation
```typescript
const sanitizeHTML = (html: string): string => {
  // Use DOMPurify or similar for XSS prevention
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input'],
    ALLOWED_ATTR: ['class', 'id', 'style', 'onclick', 'onchange'],
    ALLOW_DATA_ATTR: false
  });
};

const wrapWithSecurity = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline';">
      <style>
        body { margin: 0; padding: 16px; font-family: system-ui; }
        * { box-sizing: border-box; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};
```

### 3. vhybZ Library Integration

#### Custom Hook for Library Integration
```typescript
const useVhybZ = () => {
  const { user, token } = useAuth();
  const [generator] = useState(() => {
    return new VhybZGenerator({
      apiEndpoint: process.env.REACT_APP_API_URL,
      authToken: token,
      clientType: 'web',
      options: {
        enableStreaming: true,
        enableSOUL: true,
        maxConcurrentGenerations: 3
      }
    });
  });
  
  const createArtifact = useCallback(async (options: {
    prompt: string;
    conversationId?: string;
    onUpdate?: (update: ArtifactUpdate) => void;
  }) => {
    return await generator.createArtifact({
      ...options,
      userContext: {
        userId: user?.id,
        preferences: user?.preferences,
        subscription: user?.subscription
      }
    });
  }, [generator, user]);
  
  const refineArtifact = useCallback(async (
    artifactId: string,
    refinementPrompt: string
  ) => {
    return await generator.refineArtifact(artifactId, refinementPrompt);
  }, [generator]);
  
  return {
    createArtifact,
    refineArtifact,
    isGenerating: generator.isGenerating,
    supportedTypes: generator.getSupportedArtifactTypes()
  };
};
```

#### SOUL Agent Integration
```typescript
const useSOULAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<SOULAgent[]>([]);
  
  const createAgent = useCallback(async (config: {
    name: string;
    role: AgentRole;
    personality?: AgentPersonality;
  }) => {
    const agent = await SOULAgent.create({
      ...config,
      userId: user.id,
      memory: {
        conversationHistory: true,
        artifactHistory: true,
        userPreferences: true
      }
    });
    
    setAgents(prev => [...prev, agent]);
    return agent;
  }, [user]);
  
  const getRecommendations = useCallback(async (context: {
    currentArtifact?: Artifact;
    userGoal?: string;
  }) => {
    const primaryAgent = agents.find(a => a.role === 'primary');
    if (primaryAgent) {
      return await primaryAgent.generateRecommendations(context);
    }
    return [];
  }, [agents]);
  
  return {
    agents,
    createAgent,
    getRecommendations
  };
};
```

### 4. Backend API Integration

#### API Client Service
```typescript
class BackendAPIClient {
  private baseURL: string;
  private token: string | null = null;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  setAuthToken(token: string) {
    this.token = token;
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Artifact Management
  async saveArtifact(artifact: Artifact): Promise<string> {
    const result = await this.request<{ id: string }>('/api/artifacts', {
      method: 'POST',
      body: JSON.stringify(artifact)
    });
    return result.id;
  }
  
  async getArtifacts(): Promise<Artifact[]> {
    return this.request<Artifact[]>('/api/artifacts');
  }
  
  async updateArtifact(id: string, changes: Partial<Artifact>): Promise<void> {
    await this.request(`/api/artifacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes)
    });
  }
  
  // Conversation Management
  async saveConversation(conversation: Conversation): Promise<string> {
    const result = await this.request<{ id: string }>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation)
    });
    return result.id;
  }
  
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/api/conversations');
  }
}

export const apiClient = new BackendAPIClient(
  process.env.REACT_APP_API_URL || 'http://localhost:8000'
);
```

#### Authentication Integration
```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setAuthToken(storedToken);
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = useCallback(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await apiClient.request('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      apiClient.setAuthToken('');
    }
  }, []);
  
  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await apiClient.request<User>('/api/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);
  
  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
};
```

## State Management Architecture

### Context Providers
```typescript
// Authentication Context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Artifact Context
const ArtifactContext = createContext<ArtifactContextType | null>(null);

export const ArtifactProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);
  const { createArtifact: vhybzCreate, refineArtifact } = useVhybZ();
  
  const createArtifact = useCallback(async (prompt: string) => {
    const artifact = await vhybzCreate({ prompt });
    const savedId = await apiClient.saveArtifact(artifact);
    const savedArtifact = { ...artifact, id: savedId };
    
    setArtifacts(prev => [savedArtifact, ...prev]);
    setCurrentArtifact(savedArtifact);
    return savedArtifact;
  }, [vhybzCreate]);
  
  return (
    <ArtifactContext.Provider value={{
      artifacts,
      currentArtifact,
      createArtifact,
      refineArtifact,
      setCurrentArtifact
    }}>
      {children}
    </ArtifactContext.Provider>
  );
};
```

## Performance Optimization

### Code Splitting Strategy
```typescript
// Lazy load major route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ArtifactCreator = lazy(() => import('./pages/ArtifactCreator'));
const Collaboration = lazy(() => import('./pages/Collaboration'));

// Lazy load heavy dependencies
const VhybZGenerator = lazy(() => 
  import('@vhybzOS/vhybZ').then(module => ({ default: module.VhybZGenerator }))
);

// Route-based code splitting
const AppRouter: React.FC = () => (
  <Suspense fallback={<GlobalLoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<ArtifactCreator />} />
      <Route path="/collaborate/:id" element={<Collaboration />} />
    </Routes>
  </Suspense>
);
```

### Memory Management
```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup vhybZ generator
    generator.cleanup();
    
    // Clear preview content
    setPreviewContent('');
    
    // Cancel pending requests
    abortController.abort();
  };
}, []);

// Memoize expensive operations
const memoizedArtifactList = useMemo(() => {
  return artifacts.filter(artifact => 
    artifact.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}, [artifacts, searchQuery]);
```

## Testing Strategy

### Component Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ArtifactCreator } from './ArtifactCreator';

// Mock vhybZ library
vi.mock('@vhybzOS/vhybZ', () => ({
  VhybZGenerator: vi.fn().mockImplementation(() => ({
    createArtifact: vi.fn().mockResolvedValue({
      id: 'test-artifact',
      html: '<div>Test Artifact</div>',
      title: 'Test Artifact'
    })
  }))
}));

describe('ArtifactCreator', () => {
  test('creates artifact from user prompt', async () => {
    render(<ArtifactCreator />);
    
    const input = screen.getByPlaceholderText('Describe your artifact...');
    const submitButton = screen.getByText('Generate');
    
    fireEvent.change(input, { target: { value: 'Create a todo app' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Generating...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Artifact created successfully')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing
```typescript
describe('vhybZ Integration', () => {
  test('integrates with backend API', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'saved-artifact-id' })
    });
    
    const { createArtifact } = renderHook(() => useVhybZ()).result.current;
    
    const artifact = await createArtifact({
      prompt: 'Create a calculator'
    });
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/artifacts'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });
});
```

## Deployment & Production

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          vhybz: ['@vhybzOS/vhybZ']
        }
      }
    }
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
    'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
});
```

### Production Considerations
- **Bundle Size**: Target < 1MB initial bundle, < 500KB per lazy chunk
- **Performance**: Core Web Vitals compliance (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Security**: CSP headers, secure artifact preview, input sanitization
- **Monitoring**: Error tracking, performance metrics, user analytics
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support

## Platform Integration

This web client serves as the primary interface for the vhybZ ecosystem, providing:

- **Seamless vhybZ Library Integration**: Full utilization of AI capabilities
- **Backend Synchronization**: Persistent data and authentication
- **Cross-Platform Consistency**: Shared design patterns with mobile app
- **Extensible Architecture**: Ready for future features and integrations

The architecture enables rapid development while maintaining performance, security, and user experience standards essential for the vhybZ platform's vision of democratizing AI-powered creativity.

## Cross-Repository Links

- **Backend API**: https://github.com/vhybzOS/deno-vhybZ/blob/main/AGENTS.md
- **Core Library**: https://github.com/vhybzOS/vhybZ/blob/main/AGENTS.md  
- **Mobile Client**: https://github.com/vhybzOS/RN-vhybZ/blob/main/AGENTS.md
- **Product Requirements**: https://github.com/vhybzOS/deno-vhybZ/blob/main/PRD.md