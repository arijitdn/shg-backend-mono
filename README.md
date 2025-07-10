# 📦 SHG Backend API – API for Self Help Group Management

The SHG Backend is a RESTful API service built using Node.js, TypeScript, and TypeORM, designed to manage Self Help Groups (SHGs), their members, meetings, and financial activities such as savings, loans, and repayments. It supports scalable CRUD operations with secure authentication and structured database design.

## Project Setup

We are mainly using pnpm for this project, make sure to install pnpm using the following command:

```bash
  npm install -g pnpm
```

Clone the repository:

```bash
  git clone https://github.com/arijitdn/shg-backend-mono.git shg-backend
```

Setup the project:

```bash
  cd shg-backend
  pnpm install
  cp .env.example .env
```

Make sure to fill all the values in `.env` file, then run the project in development mode:

```bash
  pnpm start:dev
```
