# Collections in PocketBase

## Overview

Collections are the fundamental data structures in PocketBase, similar to tables in a relational database. They define the schema and behavior of your data.

## Version Notice

> **Important**: PocketBase v0.23+ introduced breaking changes to the Collections API.
>
> | Feature              | v0.22 and earlier                | v0.23+                                            |
> | -------------------- | -------------------------------- | ------------------------------------------------- |
> | Field definition key | `schema`                         | `fields`                                          |
> | Field options        | Nested in `options` object       | Flat at field level                               |
> | Admin auth endpoint  | `/api/admins/auth-with-password` | `/api/collections/_superusers/auth-with-password` |
>
> This document shows the **v0.23+ format** (current). For programmatic creation, see [Creating Collections via API](creating_collections_api.md).

## Collection Types

### 1. Base Collection

Flexible collection with custom schema. Used for:

- Posts, articles, products
- Comments, messages
- Any application-specific data

**Characteristics:**

- No built-in authentication
- Custom fields only
- Full CRUD operations
- Can be accessed via REST API

### 2. Auth Collection

Special collection for user accounts. Used for:

- User registration and login
- User profiles and settings
- Authentication workflows

**Characteristics:**

- Built-in auth fields (`email`, `password`, `emailVisibility`, `verified`)
- Automatic user ID tracking on creation
- OAuth2 support
- Password management
- Email verification
- Password reset functionality

### 3. View Collection

Read-only collection based on SQL views. Used for:

- Complex joins and aggregations
- Denormalized data for performance
- Reporting and analytics
- Dashboard metrics

**Characteristics:**

- Read-only (no create, update, delete)
- Defined via SQL query
- Auto-updates when source data changes
- Useful for performance optimization

## Creating Collections

### Via Admin UI

1. Navigate to Collections
2. Click "New Collection"
3. Choose collection type
4. Configure name and schema
5. Save

### Via REST API (v0.23+)

```http
POST /api/collections
Content-Type: application/json
Authorization: {admin_token}

{
  "name": "products",
  "type": "base",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "required": true,
      "min": 1,
      "max": 200
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "min": 0
    }
  ],
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.id != ''",
  "updateRule": "@request.auth.id != ''",
  "deleteRule": "@request.auth.id != ''"
}
```

### Via JavaScript SDK

```javascript
// Using the JS SDK (abstracts API version differences)
const collection = await pb.collections.create({
  name: 'products',
  type: 'base',
  schema: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'price',
      type: 'number',
      required: true
    }
  ]
});
```

## Field Types Reference

### Text Field

Short to medium text strings.

```json
{
  "name": "title",
  "type": "text",
  "required": true,
  "min": 1,
  "max": 200,
  "pattern": ""
}
```

**Properties:**

- `min` - Minimum character length
- `max` - Maximum character length
- `pattern` - Regex pattern for validation

### Number Field

Integer or decimal numbers.

```json
{
  "name": "price",
  "type": "number",
  "required": true,
  "min": 0,
  "max": 10000,
  "noDecimal": false
}
```

**Properties:**

- `min` - Minimum value
- `max` - Maximum value
- `noDecimal` - Allow only integers (true/false)

### Email Field

Email addresses with validation.

```json
{
  "name": "contact_email",
  "type": "email",
  "required": true
}
```

### URL Field

URLs with validation.

```json
{
  "name": "website",
  "type": "url"
}
```

### Date Field

Date and time values.

```json
{
  "name": "published_date",
  "type": "date",
  "min": "",
  "max": ""
}
```

### Boolean Field

True/false values.

```json
{
  "name": "is_published",
  "type": "bool",
  "required": true
}
```

### JSON Field

Arbitrary JSON data.

```json
{
  "name": "metadata",
  "type": "json"
}
```

### Relation Field

Links to records in other collections.

```json
{
  "name": "author",
  "type": "relation",
  "collectionId": "pbc_1234567890",
  "cascadeDelete": false,
  "maxSelect": 1
}
```

**Properties:**

- `collectionId` - Target collection **ID** (not name!) - looks like `pbc_1234567890`
- `cascadeDelete` - Delete related records when this is deleted
- `maxSelect` - Maximum number of related records (1 for single, null for unlimited)

> **Important**: Relations require the actual collection ID, not the collection name. When creating collections programmatically, create the target collection first, then use its ID.

### File Field

File uploads and storage.

```json
{
  "name": "avatar",
  "type": "file",
  "maxSelect": 1,
  "maxSize": 5242880,
  "mimeTypes": ["image/jpeg", "image/png", "image/webp"],
  "thumbs": ["100x100", "300x300"]
}
```

**Properties:**

- `maxSelect` - Maximum number of files
- `maxSize` - Maximum file size in bytes (5242880 = 5MB)
- `mimeTypes` - Allowed MIME types (use `["*"]` for all)
- `thumbs` - Auto-generate image thumbnails at specified sizes

### Select Field

Dropdown with predefined options.

```json
{
  "name": "status",
  "type": "select",
  "required": true,
  "maxSelect": 1,
  "values": ["draft", "published", "archived"]
}
```

**Properties:**

- `values` - Array of allowed values
- `maxSelect` - Maximum selections (1 for single select, null for multi-select)

### Autodate Field

Automatically populated dates.

```json
{
  "name": "created",
  "type": "autodate",
  "onCreate": true,
  "onUpdate": false
}
```

**Properties:**

- `onCreate` - Set on record creation
- `onUpdate` - Update on record modification

## Complete Collection Example

Here's a complete example of a blog posts collection:

```json
{
  "name": "posts",
  "type": "base",
  "fields": [
    {
      "name": "title",
      "type": "text",
      "required": true,
      "min": 1,
      "max": 200
    },
    {
      "name": "slug",
      "type": "text",
      "required": true,
      "min": 1,
      "max": 200
    },
    {
      "name": "content",
      "type": "text",
      "required": true
    },
    {
      "name": "excerpt",
      "type": "text",
      "max": 500
    },
    {
      "name": "category",
      "type": "relation",
      "collectionId": "pbc_categories_id",
      "cascadeDelete": false,
      "maxSelect": 1
    },
    {
      "name": "status",
      "type": "select",
      "required": true,
      "maxSelect": 1,
      "values": ["draft", "published", "archived"]
    },
    {
      "name": "published_date",
      "type": "date"
    },
    {
      "name": "featured_image",
      "type": "file",
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": ["image/jpeg", "image/png", "image/webp"]
    }
  ],
  "listRule": "status = 'published'",
  "viewRule": "status = 'published'",
  "createRule": "@request.auth.id != ''",
  "updateRule": "@request.auth.id != ''",
  "deleteRule": "@request.auth.id != ''"
}
```

## Collection Rules

Rules control who can access, create, update, and delete records.

### Types of Rules

1. **List Rule** - Who can list/view multiple records
2. **View Rule** - Who can view individual records
3. **Create Rule** - Who can create new records
4. **Update Rule** - Who can modify records
5. **Delete Rule** - Who can delete records

### Rule Values

| Value                       | Meaning                                        |
| --------------------------- | ---------------------------------------------- |
| `""` (empty string)         | Public access - anyone can perform this action |
| `null`                      | Denied - only admins can perform this action   |
| `"@request.auth.id != ''"`  | Authenticated users only                       |
| `"user = @request.auth.id"` | Owner only (field `user` matches auth user)    |

### Rule Syntax Examples

**Authenticated Users Only**

```
@request.auth.id != ''
```

**Owner-Based Access**

```
user = @request.auth.id
```

**Role-Based Access**

```
@request.auth.role = 'admin'
```

**Conditional Access**

```
status = 'published' || @request.auth.id = author
```

**Complex Conditions**

```
@request.auth.role = 'moderator' && @request.auth.verified = true
```

### Special Variables

- `@request.auth` - Current authenticated user record
- `@request.auth.id` - User ID
- `@request.auth.email` - User email
- `@request.auth.verified` - Email verification status

### Rule Examples by Use Case

**Public Blog Posts**

```json
{
  "listRule": "status = 'published'",
  "viewRule": "status = 'published'",
  "createRule": "@request.auth.id != ''",
  "updateRule": "author = @request.auth.id",
  "deleteRule": "author = @request.auth.id"
}
```

**Private User Data**

```json
{
  "listRule": "user = @request.auth.id",
  "viewRule": "user = @request.auth.id",
  "createRule": "@request.auth.id != ''",
  "updateRule": "user = @request.auth.id",
  "deleteRule": "user = @request.auth.id"
}
```

**Admin-Only Content**

```json
{
  "listRule": null,
  "viewRule": null,
  "createRule": null,
  "updateRule": null,
  "deleteRule": null
}
```

**Moderated Comments**

```json
{
  "listRule": "is_approved = true || author = @request.auth.id",
  "viewRule": "is_approved = true || author = @request.auth.id",
  "createRule": "@request.auth.id != ''",
  "updateRule": "author = @request.auth.id",
  "deleteRule": "author = @request.auth.id"
}
```

## Collection Indexes

Indexes improve query performance on frequently searched or sorted fields.

### Creating Indexes

**Via Admin UI**

1. Go to collection settings
2. Click "Indexes" tab
3. Click "New Index"
4. Select fields to index
5. Save

**Via API**

```json
{
  "indexes": [
    "CREATE INDEX idx_posts_status ON posts(status)",
    "CREATE INDEX idx_posts_created ON posts(created)"
  ]
}
```

### Index Best Practices

1. **Index fields used in filters**

   ```sql
   CREATE INDEX idx_posts_status ON posts(status)
   ```

2. **Index fields used in sorts**

   ```sql
   CREATE INDEX idx_posts_created ON posts(created)
   ```

3. **Index foreign keys (relations)**

   ```sql
   CREATE INDEX idx_comments_post ON comments(post)
   ```

4. **Composite indexes for multi-field queries**

   ```sql
   CREATE INDEX idx_posts_status_created ON posts(status, created)
   ```

5. **Don't over-index** - Each index adds overhead to writes

## Managing Collections

### List Collections

```javascript
const collections = await pb.collections.getList(1, 50);
```

### Get Collection

```javascript
const collection = await pb.collections.getOne('posts');
// or by ID
const collection = await pb.collections.getOne('pbc_1234567890');
```

### Update Collection

```javascript
const updated = await pb.collections.update('posts', {
  listRule: "status = 'published'"
});
```

### Delete Collection

```javascript
await pb.collections.delete('posts');
```

## Best Practices

1. **Plan Schema Carefully**

   - Design before implementing
   - Consider future needs
   - Use appropriate field types

2. **Create Collections in Order**

   - Create collections without relations first
   - Then create collections that reference them
   - This ensures relation IDs are available

3. **Use Relations Wisely**

   - Normalize data appropriately
   - Set cascadeDelete when appropriate
   - Remember: relations need collection **IDs**, not names

4. **Set Rules Early**

   - Security from the start
   - Test rules thoroughly
   - Use empty string `""` for public, `null` for admin-only

5. **Index Strategically**

   - Profile slow queries
   - Index commonly filtered fields
   - Avoid over-indexing

6. **Use Auth Collections for Users**
   - Built-in auth features
   - OAuth2 support
   - Password management

## Common Patterns

### Blog/Post System

```
Collections (create in order):
1. categories (base) - name, slug, description
2. posts (base) - title, content, category (relation), status, published_date
3. comments (base) - post (relation), author (relation), content
```

### E-commerce

```
Collections (create in order):
1. categories (base) - name, parent (self-relation)
2. products (base) - name, price, description, category (relation), stock
3. orders (base) - user (relation), items (json), total, status
```

### Social Network

```
Collections (create in order):
1. users (auth) - built-in auth + profile fields
2. posts (base) - author (relation), content, media
3. likes (base) - post (relation), user (relation)
4. follows (base) - follower (relation), following (relation)
```

## Troubleshooting

**Fields not being created (schema ignored)**

- For v0.23+: Use `fields` not `schema`
- For v0.23+: Put options flat at field level, not nested in `options`
- Run with `DEBUG=1` to see the actual payload being sent

**Relation field failing with "collectionId cannot be blank"**

- Relations require the actual collection ID (e.g., `pbc_1234567890`)
- Create the target collection first, get its ID, then create the relation
- See [Creating Collections via API](creating_collections_api.md) for details

**Select field failing with "values cannot be blank"**

- For v0.23+: Put `values` at field level, not inside `options`

**Collection not showing data**

- Check listRule
- Verify user permissions
- Check if view collection is properly configured

**Slow queries**

- Add database indexes
- Optimize rule conditions
- Use views for complex joins

**Can't create records**

- Check createRule
- Verify required fields
- Ensure user is authenticated

**File uploads failing**

- Check maxSize and mimeTypes
- Verify file field configuration
- Check user has create permissions

## Related Topics

- [Creating Collections via API](creating_collections_api.md) - Programmatic collection creation
- [Authentication](authentication.md) - User management
- [API Rules & Filters](api_rules_filters.md) - Security rules syntax
- [Working with Relations](working_with_relations.md) - Field relationships
- [Files Handling](files_handling.md) - File uploads and storage
- [Schema Templates](../schema_templates.md) - Pre-built schemas
