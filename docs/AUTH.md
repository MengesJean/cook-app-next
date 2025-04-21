# Authentication System Documentation

This document explains the authentication architecture and implementation in the Cook App project.

## Overview

The authentication system in this project is built around:

- JWT-based token authentication with access and refresh tokens
- React Server Actions for authentication operations
- Middleware for route protection
- React Context for client-side session management
- Zod for form validation
- HTTP-only cookies for secure token storage

## Authentication Flow

### Registration

1. User submits registration form with email, password, and name
2. Form data is validated using Zod schema
3. Server Action sends registration request to API
4. On success, user is redirected to login page
5. On failure, validation errors are displayed to the user

### Login

1. User submits login form with email and password
2. Form data is validated using Zod schema
3. Server Action sends login request to API
4. On success:
   - Access token and refresh token are stored in HTTP-only cookies
   - User is redirected to dashboard
5. On failure, error message is displayed

### Session Management

The application uses a token-based authentication system:

- **Access token**: Short-lived (15 minutes), used for API requests
- **Refresh token**: Long-lived (7 days), used to obtain new access tokens
- Both tokens are stored in HTTP-only cookies for security

### Logout

1. User clicks logout button
2. Server Action calls API to invalidate refresh token
3. Cookies are deleted
4. User is redirected to login page

## Components

### Server-Side

#### Session Actions (`src/utils/auth/session.actions.ts`)

Handles server-side session operations:

- `setSession`: Stores access and refresh tokens in cookies
- `getAccessToken`: Retrieves access token from cookies
- `getRefreshToken`: Retrieves refresh token from cookies
- `refreshSession`: Exchanges refresh token for new access token
- `deleteSession`: Removes tokens and calls logout endpoint
- `getCurrentUser`: Fetches current user data using access token

#### Authentication Actions (`src/actions/auth.action.ts`)

Server Actions for authentication operations:

- `register`: Handles user registration
- `login`: Handles user login
- `logout`: Handles user logout

#### Middleware (`src/middleware.ts`)

Next.js middleware that:

- Protects routes requiring authentication
- Redirects authenticated users away from login/register pages
- Handles token refresh when access token expires
- Defines protected and public routes

### Client-Side

#### Session Provider (`src/utils/auth/useSession.tsx`)

React Context Provider that:

- Maintains user session state
- Provides authentication status
- Offers methods for refreshing session and logging out

#### Auth Forms

- `LoginForm`: Form component for user login (`src/components/forms/LoginForm.tsx`)
- `RegisterForm`: Form component for user registration (`src/components/forms/RegisterForm.tsx`)

## Validation

Authentication forms are validated using Zod schemas:

- `LoginFormSchema`: Validates email and password
- `RegisterFormSchema`: Validates registration fields including password confirmation

## Route Protection

Routes are protected using Next.js middleware:

- Protected routes (e.g., `/dashboard`): Require authentication
- Public routes (e.g., `/login`, `/register`): Accessible to all
- Authenticated users are redirected from login/register pages to dashboard

## Using Authentication in Components

### Checking Authentication Status

```tsx
"use client";
import { useSession } from "@/utils/auth/useSession";

export default function ProtectedComponent() {
  const { user, isLoading, isAuthenticated } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {user?.name || "User"}</div>;
}
```

### Logging Out

```tsx
"use client";
import { useSession } from "@/utils/auth/useSession";

export default function LogoutButton() {
  const { logout } = useSession();

  return <button onClick={() => logout()}>Logout</button>;
}
```

## Best Practices

1. Never store tokens in localStorage or sessionStorage
2. Always validate form input on both client and server side
3. Use HTTP-only cookies for storing sensitive tokens
4. Implement proper token refresh mechanism
5. Always handle loading and error states in UI
6. Protect sensitive routes using middleware
7. Keep authentication logic in dedicated modules
8. Use proper error handling for API requests
9. Validate token expiration before accessing protected resources
10. Implement proper CSRF protection
11. Ensure secure password policies
