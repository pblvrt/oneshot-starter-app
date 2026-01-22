# Creating Collections via API

## Overview

This guide covers how to programmatically create PocketBase collections using the REST API. This is useful for:
- Automated database setup scripts
- CI/CD pipelines
- Development environment initialization
- Programmatic schema management

## Version Differences

> **Important**: PocketBase v0.23+ introduced breaking changes to the Collections API.

| Feature | v0.22 and earlier | v0.23+ |
|---------|-------------------|--------|
| Admin auth endpoint | `/api/admins/auth-with-password` | `/api/collections/_superusers/auth-with-password` |
| Field definition key | `schema` | `fields` |
| Field options | Nested in `options` object | Flat at field level |

## Authentication

Before creating collections, authenticate as an admin/superuser:

### v0.23+ (Current)
```typescript
const response = await fetch(`${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identity: "admin@example.com",
    password: "your-password",
  }),
});

const { token } = await response.json();
```

### v0.22 and earlier
```typescript
const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identity: "admin@example.com",
    password: "your-password",
  }),
});

const { token } = await response.json();
```

## Creating a Basic Collection

### Request Format

```http
POST /api/collections
Content-Type: application/json
Authorization: {admin_token}
```

### v0.23+ Field Format (Flat)

```typescript
const collection = {
  name: "posts",
  type: "base",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      min: 1,           // Options are FLAT at field level
      max: 200,
    },
    {
      name: "content",
      type: "text",
      required: true,
    },
  ],
  listRule: "",
  viewRule: "",
  createRule: "@request.auth.id != ''",
  updateRule: "@request.auth.id != ''",
  deleteRule: "@request.auth.id != ''",
};
```

### v0.22 Field Format (Nested Options)

```typescript
const collection = {
  name: "posts",
  type: "base",
  schema: [  // Note: 'schema' not 'fields'
    {
      name: "title",
      type: "text",
      required: true,
      options: {        // Options are NESTED
        min: 1,
        max: 200,
      },
    },
    {
      name: "content",
      type: "text",
      required: true,
    },
  ],
  listRule: "",
  viewRule: "",
  createRule: "@request.auth.id != ''",
  updateRule: "@request.auth.id != ''",
  deleteRule: "@request.auth.id != ''",
};
```

## Field Types Reference

### Text Field

```typescript
// v0.23+ (flat)
{
  name: "title",
  type: "text",
  required: true,
  min: 1,
  max: 200,
  pattern: "",  // regex pattern
}

// v0.22 (nested)
{
  name: "title",
  type: "text",
  required: true,
  options: { min: 1, max: 200, pattern: "" },
}
```

### Number Field

```typescript
// v0.23+ (flat)
{
  name: "price",
  type: "number",
  required: true,
  min: 0,
  max: 10000,
  noDecimal: false,
}
```

### Select Field

```typescript
// v0.23+ (flat)
{
  name: "status",
  type: "select",
  required: true,
  maxSelect: 1,
  values: ["draft", "published", "archived"],
}

// v0.22 (nested)
{
  name: "status",
  type: "select",
  required: true,
  options: {
    maxSelect: 1,
    values: ["draft", "published", "archived"],
  },
}
```

### Relation Field

```typescript
// v0.23+ (flat)
{
  name: "category",
  type: "relation",
  collectionId: "pbc_1234567890",  // Must be actual collection ID
  cascadeDelete: false,
  maxSelect: 1,
}

// v0.22 (nested)
{
  name: "category",
  type: "relation",
  options: {
    collectionId: "pbc_1234567890",
    cascadeDelete: false,
    maxSelect: 1,
  },
}
```

### Date Field

```typescript
{
  name: "published_date",
  type: "date",
  required: false,
}
```

### Boolean Field

```typescript
{
  name: "is_active",
  type: "bool",
  required: true,
}
```

### File Field

```typescript
// v0.23+ (flat)
{
  name: "avatar",
  type: "file",
  maxSelect: 1,
  maxSize: 5242880,  // 5MB
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
}
```

### JSON Field

```typescript
{
  name: "metadata",
  type: "json",
}
```

### Email Field

```typescript
{
  name: "contact_email",
  type: "email",
  required: true,
}
```

### URL Field

```typescript
{
  name: "website",
  type: "url",
}
```

## Working with Relations

### The Collection ID Problem

Relations require the target collection's **ID**, not its name. Collection IDs look like `pbc_1234567890` (15 character alphanumeric).

### Solution: Resolve IDs After Creation

Create collections in dependency order and resolve IDs:

```typescript
// Store collection IDs after creation
const collectionIds: Record<string, string> = {};

async function getCollectionId(token: string, name: string): Promise<string> {
  if (collectionIds[name]) {
    return collectionIds[name];
  }

  const response = await fetch(`${POCKETBASE_URL}/api/collections/${name}`, {
    headers: { Authorization: token },
  });

  const collection = await response.json();
  collectionIds[name] = collection.id;
  return collection.id;
}

// When creating a collection with relations, resolve the ID first:
const categoryId = await getCollectionId(token, "categories");

const postsCollection = {
  name: "posts",
  type: "base",
  fields: [
    // ... other fields
    {
      name: "category",
      type: "relation",
      collectionId: categoryId,  // Now using actual ID
      maxSelect: 1,
    },
  ],
};
```

### Creation Order

Always create collections in dependency order:

1. Collections with no relations first
2. Collections that depend on #1
3. Collections that depend on #2
4. etc.

Example order for a blog:
```
1. categories (no relations)
2. users (auth collection, no relations)
3. posts (relates to categories)
4. comments (relates to posts and users)
```

## Complete Example Script

See the setup script at `scripts/setup_pocketbase.ts` for a complete, working example that:
- Auto-detects PocketBase version
- Uses the correct field format
- Resolves collection names to IDs for relations
- Handles "already exists" errors gracefully

### Running the Script

```bash
# Set the PocketBase URL
export POCKETBASE_URL=http://localhost:8090

# Run the script
npx tsx .claude/skills/pocketbase/scripts/setup_pocketbase.ts

# With debug output
DEBUG=1 npx tsx .claude/skills/pocketbase/scripts/setup_pocketbase.ts
```

## Collection Rules

Rules control who can access, create, update, and delete records.

### Rule Syntax

| Rule | Description |
|------|-------------|
| `""` (empty string) | Public access |
| `null` | Denied (admin only) |
| `@request.auth.id != ''` | Authenticated users |
| `@request.auth.id = user_id` | Owner only |
| `status = 'published'` | Conditional access |

### Example Rules

```typescript
{
  listRule: "status = 'published'",           // Only show published
  viewRule: "status = 'published'",           // Only view published
  createRule: "@request.auth.id != ''",       // Authenticated users can create
  updateRule: "@request.auth.id = author",    // Only author can update
  deleteRule: "@request.auth.id = author",    // Only author can delete
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `validation_collection_name_exists` | Collection already exists | Check before creating or handle error |
| `validation_required` on `collectionId` | Using collection name instead of ID | Resolve name to ID first |
| `validation_required` on `values` | Select field missing values | Ensure `values` array is at correct level |
| `Admin auth failed` | Wrong credentials or endpoint | Check PocketBase version and credentials |

### Handling "Already Exists"

```typescript
if (!response.ok) {
  const error = await response.text();
  if (error.includes("already exists") || error.includes("name_exists")) {
    console.log(`Collection "${name}" already exists, skipping...`);
    return;
  }
  throw new Error(`Failed to create collection: ${error}`);
}
```

## Best Practices

### 1. Version Detection

Auto-detect PocketBase version to use correct format:

```typescript
let useFieldsFormat = true;

// Try v0.23+ endpoint first
let response = await fetch(`${url}/api/collections/_superusers/auth-with-password`, ...);

if (!response.ok) {
  // Fall back to v0.22 endpoint
  response = await fetch(`${url}/api/admins/auth-with-password`, ...);
  if (response.ok) {
    useFieldsFormat = false;  // Use 'schema' instead of 'fields'
  }
}
```

### 2. Idempotent Scripts

Make scripts safe to run multiple times:
- Check if collection exists before creating
- Handle "already exists" errors gracefully
- Cache collection IDs to avoid repeated lookups

### 3. Use Environment Variables

```typescript
const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "password";
```

### 4. Debug Mode

Add debug output for troubleshooting:

```typescript
if (process.env.DEBUG) {
  console.log(`Sending payload: ${JSON.stringify(payload, null, 2)}`);
  console.log(`Response: ${responseText}`);
}
```

## Related Documentation

- [Collections Overview](collections.md) - Collection types and concepts
- [Working with Relations](working_with_relations.md) - Detailed relation patterns
- [API Rules & Filters](api_rules_filters.md) - Security rules syntax
- [Schema Templates](../schema_templates.md) - Pre-built collection schemas
- [Collections API Reference](../api/api_collections.md) - Full API documentation


