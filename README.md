# 🍲 Cook App - Recipe Application

A modern recipe management and sharing application, built with Next.js 15 and using a NestJS API.

## 📋 About

Cook App is a comprehensive platform that allows users to discover, create, share, and manage their favorite recipes. The application offers a smooth and intuitive user experience, with a modern architecture based on Next.js Server Components and Server Actions.

## 🚀 Features

- **🔐 Secure Authentication**: JWT authentication system with refresh tokens
- **📱 Responsive Design**: Interface adapted to all devices
- **🔍 Recipe Search**: Advanced filters by category, ingredients, preparation time
- **👤 User Profiles**: Creation and management of personalized profiles
- **❤️ Favorites Collection**: Save your favorite recipes
- **📝 Recipe Creation**: Intuitive editor with rich formatting
- **🌙 Dark Mode**: Light/dark theme for optimal reading comfort

## 🛠️ Technologies

- **Next.js 15 (App Router)**
- **React Server Components**
- **Server Actions**
- **Tailwind CSS**
- **TypeScript**

## 🏗️ Architecture

The application uses Next.js App Router with:

- Server Components for server-side rendering
- Server Actions for mutation operations
- Context API for client-side session management
- Custom hooks for form management

## 🚦 Installation and Setup

### Prerequisites

- Node.js 18+

### Configuration

```bash
# Clone the repository
git clone https://github.com/MengesJean/cook-app-next.git
cd cook-app-next

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.development` file at the root of the project:

```
NEXT_PUBLIC_API_URL=
```

### Starting the Application

```bash
# Start the application
npm run dev
```

## 📚 Documentation

For more details on the different parts of the application, consult our documentation:

- [Authentication Documentation](./docs/AUTH.md) - Explains the JWT authentication system, Server Actions, and route protection
- [Form Documentation](./docs/FORM.md) - Details the form architecture, useForm hook, and reusable components

## 📝 License

[MIT](LICENSE)
