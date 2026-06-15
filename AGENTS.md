<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Rules

## Project Structure

Follow the existing folder structure.

Do not create new top-level architecture folders unless explicitly requested. Use the current structure based on:

- `app`
- `features`
- `shared`

Place new code in the most appropriate existing folder.

## Naming Conventions

- Folder names: kebab-case, but prefer short single-word names when possible.
- File names: PascalCase.
- React components: PascalCase.
- Functions and variables: camelCase.
- Types and interfaces: PascalCase.

## Data Flow

Use the following data flow by default:

1. Client Components using TanStack Query, or Server Components such as `page.tsx`, call Server Actions.
2. Server Actions call the shared API wrapper.
3. The shared API wrapper is located at `shared/api/http.ts`.

Do not create Route Handlers for normal API communication unless explicitly requested.

Prefer Server Actions over `app/api` Route Handlers for application data fetching and mutations.
