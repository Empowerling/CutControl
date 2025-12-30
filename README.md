# CutControl

Modern appointment booking and management system for salons and barbershops, built with Next.js 15 and Supabase.

## 📁 Repository Structure

This repository contains two main components:

- **`app/`** - Next.js 15 application (App Router) with Supabase integration
- **`cutflow-pro/`** - Original Vite + React application (maintained as Git submodule)

### Git Submodule

The `cutflow-pro` directory is a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) that points to the original CutFlow Pro repository. This allows you to:

- Maintain access to the original project's complete git history
- Keep both projects in sync or work on them independently
- Reference specific versions/commits of the original project

## 🚀 Getting Started

### Initial Clone (First Time)

When cloning this repository for the first time, you need to include the submodule:

```bash
git clone --recurse-submodules https://github.com/Empowerling/CutControl.git
cd CutControl
```

If you've already cloned without the `--recurse-submodules` flag:

```bash
git clone https://github.com/Empowerling/CutControl.git
cd CutControl
git submodule update --init --recursive
```

### Updating Submodules

To update the `cutflow-pro` submodule to the latest version:

```bash
cd cutflow-pro
git pull origin main
cd ..
git add cutflow-pro
git commit -m "Update cutflow-pro submodule"
git push
```

## 🔧 Working with Submodules

### View Current Submodule Commit

To see which commit the submodule is currently pointing to:

```bash
cd cutflow-pro
git rev-parse HEAD
git log -1 --oneline
cd ..
```

### Making Changes in the Submodule

If you need to make changes to the `cutflow-pro` project:

```bash
cd cutflow-pro
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
cd ..
# Update the main repository to point to the new commit
git add cutflow-pro
git commit -m "Update cutflow-pro to latest version"
git push
```

### Pulling Latest Changes (Both Repositories)

To update both the main repository and the submodule:

```bash
# Update main repository
git pull origin main

# Update submodule
git submodule update --remote cutflow-pro

# If there are updates, commit them
git add cutflow-pro
git commit -m "Update cutflow-pro submodule"
git push
```

### Switching to a Specific Commit in Submodule

To pin the submodule to a specific commit:

```bash
cd cutflow-pro
git checkout <commit-hash>
cd ..
git add cutflow-pro
git commit -m "Pin cutflow-pro to specific commit"
git push
```

## 📦 Project Setup

### Next.js Application (`app/`)

The main application is a Next.js 15 project. See [app/README.md](app/README.md) for detailed setup instructions.

**Quick Start:**

```bash
cd app
npm install
# Set up environment variables (see app/README.md)
npm run dev
```

### Original Application (`cutflow-pro/`)

The original Vite + React application is available as a reference. See [cutflow-pro/README.md](cutflow-pro/README.md) for details.

**Quick Start:**

```bash
cd cutflow-pro
npm install
npm run dev
```

## 🏗️ Architecture

### Current State

- **Primary Application**: Next.js 15 (App Router) with Supabase backend
- **Reference Implementation**: Original Vite + React application (cutflow-pro submodule)

### Migration Path

The project is in a migration state from Vite + React (cutflow-pro) to Next.js 15 + Supabase (app/). The original implementation is preserved as a submodule for reference and comparison.

See the migration documentation in `openspec/changes/migrate-to-nextjs-supabase/` for details.

## 📚 Documentation

- **Next.js App Setup**: [app/README.md](app/README.md)
- **Original App Info**: [cutflow-pro/README.md](cutflow-pro/README.md)
- **Project Specifications**: [openspec/project.md](openspec/project.md)
- **Architecture Decisions**: [openspec/changes/migrate-to-nextjs-supabase/](openspec/changes/migrate-to-nextjs-supabase/)
- **Agent Guidelines**: [openspec/AGENTS.md](openspec/AGENTS.md)

## 🔑 Key Features

### Admin Dashboard (`/admin`)
- Multi-column staff calendar view
- Week navigation
- Appointment visualization
- Staff management

### Customer Booking Flow (`/book/[salon-id]`)
- Service selection with category filters
- Staff selection (filtered by service)
- Smart calendar with real-time availability
- Guest checkout
- Conditional deposit payment

### Settings
- Online deposits toggle
- Manual approval toggle
- PayPal merchant link configuration

## 🛠️ Tech Stack

### Next.js Application
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)

### Original Application (cutflow-pro)
- **Framework**: Vite + React
- **Routing**: React Router DOM
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **State Management**: TanStack Query + React Hook Form

## 📝 Contributing

When contributing to this repository:

1. Create a new branch for your changes
2. Make your changes in the appropriate directory (`app/` or `cutflow-pro/`)
3. If working in `cutflow-pro`, commit to that submodule first
4. Update the main repository to reference the new submodule commit (if applicable)
5. Create a pull request

## 🔗 Links

- **Repository**: https://github.com/Empowerling/CutControl
- **Submodule Repository**: https://github.com/Empowerling/cutflow-pro
- **Main Application**: `app/` directory
- **Original Application**: `cutflow-pro/` directory (Git submodule)

## ⚠️ Important Notes

- The `cutflow-pro` directory is a Git submodule - changes made directly in this directory won't be tracked by the main repository
- Always use `git submodule update` after pulling changes to ensure submodules are in sync
- The submodule points to a specific commit - updating it requires explicit commits to both repositories

## 📄 License

See individual project directories for license information.

