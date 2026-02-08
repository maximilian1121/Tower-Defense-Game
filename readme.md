# TD-Gaeem Documentation

> A Roblox tower defense game built with TypeScript and React using the `roblox-ts` compiler.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Core Systems](#core-systems)
- [UI Components](#ui-components)
- [Entry Points](#entry-points)
- [Patterns & Conventions](#patterns--conventions)
- [Build & Development](#build--development)
- [Quick Reference](#quick-reference)

---

## Overview

TD-Gaeem is a tower defense game for Roblox developed using modern TypeScript practices. The project uses `roblox-ts` to transpile TypeScript to Lua, and React for UI rendering.

**Key Technologies:**
- TypeScript → Lua (via roblox-ts)
- React (@rbxts/react)
- Roblox Services API (@rbxts/services)

---

## Project Structure

```
src/
├── client/
│   └── index.client.ts          # Client-side entry point
├── server/
│   └── index.server.ts          # Server-side entry point
└── shared/
    ├── Core/
    │   ├── AssetManagment.ts    # Asset retrieval system
    │   └── Registry/
    │       └── ItemRegistry.ts  # Item registration & sync
    └── UI/
        ├── App.tsx              # Root UI component
        ├── App.story.tsx        # Storybook story
        ├── Constants.tsx        # UI constants & utilities
        └── components/
            ├── inventory/
            │   ├── hotbar.tsx   # Inventory hotbar (6 slots)
            │   └── levelbar.tsx # Level/progress bar
            ├── shared/
            │   ├── item.tsx     # Item display (3D/image)
            │   └── Text.tsx     # Text label component
            └── toasting/
                └── snackbar.tsx # Toast notifications
```

---

## Architecture

### Client-Server-Shared Model

| Directory | Purpose | Runs On |
|-----------|---------|---------|
| `client/` | Client-side initialization & UI rendering | Player Client |
| `server/` | Server initialization & item registration | Server |
| `shared/` | Shared code (compiled to both) | Both |

**Key Pattern:** The `shared/` directory contains code compiled for both client and server. The server is the authoritative source for item data, syncing to clients via RemoteEvents.

---

## Core Systems

### Item Registry

**Location:** `src/shared/Core/Registry/ItemRegistry.ts`

A centralized item management system with server-client synchronization.

#### Type Definitions

```typescript
type ItemBase = {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    ArbitraryData?: unknown;
    IsStackable: boolean;
    IsConsumable: boolean;
    Count: number;
};

type TowerItem = ItemBase & { Type: "tower"; Icon: Instance };
type CrateItem = ItemBase & { Type: "crate"; Icon: string };
type Item = TowerItem | CrateItem;
```

#### API

| Method | Description | Scope |
|--------|-------------|-------|
| `registerItem(item)` | Register a new item | Server only |
| `getItem(id)` | Retrieve item by ID | Both |
| `getAllItems()` | Get all registered items | Both |

#### Synchronization

Uses two Roblox remotes:
- **`RegistrySync`** (RemoteEvent) - Syncs new items to clients
- **`FetchAllRegistry`** (RemoteFunction) - Fetches all existing items

---

### Asset Management

**Location:** `src/shared/Core/AssetManagment.ts`

Retrieves assets from ReplicatedStorage.

```typescript
getAsset(category: "tower" | "enemy", name: string): Instance | undefined
```

**Expected Structure:**
```
ReplicatedStorage/Assets/
├── Towers/{name}/
└── Enemies/{name}/
```

**Note:** Tower models should include `CamPos` and `LookAt` attachments for proper 3D view camera positioning.

---

## UI Components

### App (`src/shared/UI/App.tsx`)

Root UI component that wraps the application.

```tsx
<SnackbarProvider>
    <Hotbar/>
</SnackbarProvider>
```

---

### Hotbar (`src/shared/UI/components/inventory/hotbar.tsx`)

Inventory hotbar displaying 6 selectable item slots.

**Properties:**
- Position: Bottom-center (45% width, 15% height)
- Layout: Horizontal with padding
- Includes LevelBar component

---

### LevelBar (`src/shared/UI/components/inventory/levelbar.tsx`)

Displays player level/progress.

**Features:**
- Green gradient background with rounded corners
- Format: "Level x (y/z)"
- Size: 40% width, 5% height
- Border stroke effect

---

### Item (`src/shared/UI/components/shared/item.tsx`)

Displays individual items with 3D model or image support.

**Props:**
```typescript
type Props = { itemId: string };
```

**Features:**
- Tower items: Uses ViewportFrame with 3D camera
- Crate items: Uses ImageLabel for 2D display
- Camera positioning via `CamPos` and `LookAt` attachments
- Click handler triggers snackbar notification
- Fallback UI for missing items

---

### Text (`src/shared/UI/components/shared/Text.tsx`)

Reusable text label component.

**Styles:**
- Font: Comic Neue Angular
- Color: White
- Scales with min/max constraints
- Props forwarded for customization

---

### Snackbar (`src/shared/UI/components/toasting/snackbar.tsx`)

Toast notification system with animations.

#### API

```typescript
const { enqueueSnackbar } = useSnackbar();
```

#### Options

```typescript
{
    variant?: "info" | "success" | "warning" | "error";
    duration?: number; // Default: 5000ms
}
```

#### Features

- Max 4 notifications visible
- Animated slide-in from right
- Auto-dismiss after duration
- Color-coded variants

---

### Constants (`src/shared/UI/Constants.tsx`)

Shared UI constants and utilities.

| Export | Value | Description |
|--------|-------|-------------|
| `FULL_SIZE` | `UDim2.fromScale(1, 1)` | Full screen size |
| `WHITE` | `Color3(1, 1, 1)` | White color |
| `STUDS` | Studs asset ID | Studs image |
| `GetFont()` | Font object | Comic Neue Angular helper |

---

## Entry Points

### Server Entry (`src/server/index.server.ts`)

**Purpose:** Server initialization and item registration

```typescript
// Example item registration
const items: Item[] = [
    {
        Id: "builderman",
        Name: "Builderman",
        Description: "A powerful builder.",
        Price: 100,
        IsStackable: false,
        IsConsumable: false,
        Count: 1,
        Type: "tower",
        Icon: getAsset("tower", "builderman") as Instance,
    }
];
```

---

### Client Entry (`src/client/index.client.ts`)

**Purpose:** Client-side UI rendering setup

```typescript
// Creates React root in PlayerGui
const root = createRoot(new Instance("ScreenGui"));
root.render(<App />);
```

---

## Patterns & Conventions

### Design Patterns Used

| Pattern | Where Used | Purpose |
|---------|------------|---------|
| Singleton | `ItemRegistry` | Single source of truth for items |
| React Context | `SnackbarContext` | Global notification system |
| Ref Pattern | `item.tsx` | Imperative Instance access |
| Discriminated Unions | `Item` type | Type-safe item variants |

### React Hooks

- `useLayoutEffect` - Synchronous DOM manipulation
- `useEffect` - Side effects & cleanup
- `useRef` - Instance references
- `useContext` - Context consumption

### Type Safety

- Strict TypeScript enabled
- Discriminated unions for item types
- Type-safe RemoteEvent/Function usage

---

## Build & Development

### Build Scripts

```bash
npm run build    # Compile TypeScript to Lua
npm run watch    # Watch mode for development
```

### Key Dependencies

```json
{
  "@rbxts/react": "React for Roblox",
  "@rbxts/react-roblox": "React runtime for Roblox",
  "@rbxts/services": "Roblox services API",
  "@rbxts/ui-labs": "UI development tools",
  "roblox-ts": "TypeScript to Lua transpiler"
}
```

### Code Quality

- ESLint with `eslint-plugin-roblox-ts`
- Prettier configuration (tabs, semi, double quotes)

---

## Quick Reference

### Item Registration Flow

```
Server: registerItem(item)
        ↓
ItemRegistry stores in Map
        ↓
RemoteEvent "RegistrySync" fires
        ↓
All clients receive and store
```

### Client Initialization Flow

```
Client: index.client.ts starts
        ↓
React root created in PlayerGui
        ↓
App component renders
        ↓
Hotbar displays items from ItemRegistry
```

### Required Roblox Instances

| Instance | Type | Purpose |
|----------|------|---------|
| `RegistrySync` | RemoteEvent | Sync items from server |
| `FetchAllRegistry` | RemoteFunction | Fetch all items |
| `Assets/Towers/` | Folder | Tower 3D models |
| `Assets/Enemies/` | Folder | Enemy assets |

---

## File Summary

| File | Lines | Purpose |
|------|-------|---------|
| `client/index.client.ts` | 11 | Client entry, React root |
| `server/index.server.ts` | 18 | Server entry, item registration |
| `AssetManagment.ts` | 12 | Asset retrieval |
| `ItemRegistry.ts` | 79 | Item registry & sync |
| `App.tsx` | 11 | Root UI component |
| `Constants.tsx` | 14 | UI constants |
| `hotbar.tsx` | 50 | Inventory hotbar |
| `levelbar.tsx` | 24 | Level bar display |
| `item.tsx` | 84 | Item display (3D/image) |
| `Text.tsx` | 25 | Text label |
| `snackbar.tsx` | 160 | Toast notifications |

---

*Last Updated: 2025*