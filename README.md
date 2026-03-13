# Leaderboard Web App 🏆

Web app para gerenciar o placar (leaderboard) de um torneio em tempo real.

## 🚀 Technologies Used

This project was built with a focus on performance and an excellent developer experience:

- **[React 19](https://react.dev/)** - JavaScript library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - A superset of JavaScript that adds static typing.
- **[Vite](https://vitejs.dev/)** - Fast and efficient build tool.
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development.
- **[Firebase](https://firebase.google.com/)** - Real-time data synchronization and persistence.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Lucide React](https://lucide.dev/)** - Accessible UI components and modern icons.

## ✨ Features

- **Leaderboard View**: Displays the list of participants and their updated chip/point counts.
- **Admin Panel**: Dedicated area (usually under a specific route) for inserting and controlling points.
  - Allows adding or removing chips quickly through buttons like `+1`, `+2`, `-1`, and `-2`.
- **Responsive and Modern Design**: User-friendly interface on both desktop computers and mobile devices.
- **Real-Time Updates**: Thanks to Firebase, point additions made in the admin panel reflect immediately on the main viewing screen.

## 📦 How to Install and Run

Follow the steps below to run the project locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Steps

1. **Access the project folder:**
   ```bash
   cd leaderboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Make sure to review/fill out the `.env` file in the root of the project with the appropriate Firebase API keys:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to the URL indicated in the terminal (often `http://localhost:5173`).

## 🛠️ Available Scripts

Inside the project directory, you can run the following commands:

- `npm run dev`: Starts the development server with hot-reload.
- `npm run build`: Transpiles TypeScript and creates the optimized production build in the `dist` folder.
- `npm run lint`: Analyzes the code with ESLint to ensure quality.
- `npm run preview`: Starts a local server to preview the production build before deployment.

## 📄 Main Structure

Most of the logic and interface are located in the `src/` folder:

- `src/components/` - Base components (e.g., buttons, inputs configured with shadcn).
- `src/pages/` - Pages and routing views (e.g., `Leaderboard.tsx`).
- `src/hooks/` - Custom React hooks (like `useLeaderboard.ts`).
- `src/index.css` - Global styles and basic Tailwind rules.
