# MOB FT 2026 - Web Utama

Professional main portal and API Gateway for the **Masa Orientasi Bersama (MOB) FT 2026** at Universitas Surabaya.

## 📌 Overview

**Web Utama** serves as the central hub and proxy gateway for the entire MOB FT 2026 digital ecosystem. It utilizes **Next.js Multi-Zones** to seamlessly route traffic to various sub-applications while maintaining a unified user experience and shared authentication state.

### Core Responsibilities

- **Proxy Gateway**: Orchestrates traffic between the main dashboard and sub-apps for Mahasiswa (Web Baju, Web ET, etc.).
- **Central Authentication**: Manages global SSO via shared Top-Level Domain (TLD) cookies.
- **Resource Hub**: Centralizes Attendances, Penalty Tracking, and all Information regarding MOB FT 2026 for both Mahasiswa and Panitia.

---

## 🛠️ Tech Stack & Tooling

| Category      | Technology                                                  |
| :------------ | :---------------------------------------------------------- |
| **Framework** | Next.js 16 (App Router + Turbopack)                         |
| **Styling**   | Tailwind CSS v4 + DaisyUI Components                        |
| **Database**  | MySQL                                                       |
| **ORM**       | Drizzle ORM                                                 |
| **Auth**      | NextAuth.js (Session synchronization via `.ubayamobft.com`) |
| **Quality**   | ESLint, Prettier, TypeScript (Strict)                       |
| **Workflow**  | Husky, Lint-Staged, Commitlint (Conventional Commits)       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.x
- **Package Manager**: npm
- **Database**: MySQL Server (Local or Dockerized)
- **Editor**: VS Code, Antigravity (Recommended Extensions: Tailwind CSS IntelliSense, Prettier, ESLint) or an IDE of your choice

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Beyolandr7/MOBFT26-WebUtama.git
   cd MOBFT26-WebUtama
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file and configure your local variables:

   ```bash
   cp .env.example .env
   ```

   Modify `.env` and provide valid values for:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (Generate using `openssl rand -base64 32`)

4. **Initialize Husky Hooks:**

   ```bash
   npm run prepare
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The portal will be available at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement.
- `npm run build`: Generates the production build.
- `npm run start`: Starts the production server.
- `npm run typecheck`: Performs full static type checking with TypeScript.
- `npm run db:seed`: Seeds the database with student data from CSV.
- `npm run lint`: Analyzes the codebase for potential errors and styling issues.

---

## 🏗️ Development Workflow

### Conventions

- **Language**: Source code and comments are in **English**. UI content is in **Bahasa Indonesia**.
- **Naming**:
  - `camelCase`: Functions, variables, and hooks.
  - `PascalCase`: React components and Types.
  - `kebab-case`: File and directory names.

### Git Strategy

- **Branches**: `feat/*`, `fix/*`, `chore/*`, `refactor/*`.
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
  - _Example_: `feat: add student registration form` or `fix: resolve auth cookie mismatch`.
- **Pre-commit**: The system automatically runs `npm run typecheck`, Prettier, and ESLint on staged files.

---

## 📚 References & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [DaisyUI Components](https://daisyui.com/components/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)

---

Developed with ❤️ by **KOORWA ITD MOB FT 2026**.
