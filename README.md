# Bote

Bote is a simple Markdown note-taking app built with React and TypeScript.

## Features

- Email and password account creation and sign-in
- Protected notes area for authenticated users
- React Router-based navigation
- Firebase Authentication and Realtime Database integration
- Vite-powered development experience with TypeScript

## Tech stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)

## Getting started

### Prerequisites

- [Bun](https://bun.com/)
- A Firebase project with Email/Password authentication enabled
- A Firebase Realtime Database

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/KaykeMoraes/bote.git
cd bote
bun install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

Fill in the Firebase values in `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start the development server:

```bash
bun run dev
```

Vite will print the local URL in the terminal.

## Available scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun run dev`     | Start the development server             |
| `bun run build`   | Type-check and create a production build |
| `bun run preview` | Preview the production build locally     |
| `bun run lint`    | Run ESLint                               |
| `bun run format`  | Format the project with Prettier         |

## Project structure

```text
src/
├── context/       # Authentication context
├── hooks/         # Shared React hooks
├── pages/         # Login, registration, and notes pages
├── routes/        # Application and protected routes
├── services/      # Firebase and authentication services
└── App.tsx        # Application entry component
```
