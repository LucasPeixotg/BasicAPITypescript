# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with hot reload (nodemon + ts-node)
npm run build    # compile TypeScript to dist/
```

## Architecture

Minimal Express 5 API written in TypeScript with strict ESM configuration.

- [src/index.ts](src/index.ts) — entry point, starts the HTTP server on port 8080
- [src/server.ts](src/server.ts) — creates and exports the Express app instance; routes are defined here

## TypeScript Notes

- `"module": "nodenext"` + `"type": "module"` in package.json — all files are ES modules
- Relative imports require explicit `.js` extensions (e.g. `"./server.js"`) even though the source files are `.ts`
- `verbatimModuleSyntax: true` — type-only imports must use `import type` or `import { type Foo }`

## Testing & Verification

### Type-check without emitting

```bash
npx tsc --noEmit
```

Run this to catch type errors before building. Prefer this over a full build when you only need to validate types.

### Verify the build

```bash
npm run build && node dist/index.js
```

A successful build produces `dist/` with compiled `.js` files. The server should log something like `Listening on port 8080` — if it exits silently or throws, the build is broken.

### Smoke-test endpoints

Once the server is running (via `npm run dev` or `node dist/index.js`), use `curl` to verify routes respond correctly:

```bash
curl -s http://localhost:8080/        # expect 200 or your root handler
curl -s http://localhost:8080/health  # if a health route exists
```

For routes that accept a body:

```bash
curl -s -X POST http://localhost:8080/your-route \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### What a healthy state looks like

- `npx tsc --noEmit` exits with code `0` and no output
- `npm run build` produces `dist/` with no errors
- The server starts and responds to requests without unhandled rejections in the console