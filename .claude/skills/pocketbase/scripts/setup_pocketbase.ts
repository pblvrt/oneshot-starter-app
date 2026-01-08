/**
 * PocketBase Setup Script
 * Initializes collections for the application
 * Run with: npx tsx scripts/setup_pocketbase.ts
 *
 * Supports both PocketBase v0.22 and earlier (uses 'schema')
 * and v0.23+ (uses 'fields')
 */

const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://pocketbase:8090";

interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  options?: any;
  // v0.23+ uses flat properties instead of options
  [key: string]: any;
}

interface CollectionSchema {
  name: string;
  type: "base" | "auth";
  fields: FieldDefinition[];
  listRule?: string | null;
  viewRule?: string | null;
  createRule?: string | null;
  updateRule?: string | null;
  deleteRule?: string | null;
}

// Admin credentials (created at container startup)
const ADMIN_EMAIL = "admin@oneshot.com";
const ADMIN_PASSWORD = "Oneshot123456";

// Detect PocketBase version by checking if _superusers exists (v0.23+)
let useFieldsFormat = true; // Default to newer format

async function authenticateAdmin(): Promise<string> {
  // Try v0.23+ auth endpoint first
  let response = await fetch(
    `${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    }
  );

  // If failed, try v0.22 and earlier endpoint
  if (!response.ok) {
    response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (response.ok) {
      useFieldsFormat = false; // Older version uses 'schema'
      console.log(
        "  (detected PocketBase v0.22 or earlier - using 'schema' format)"
      );
    }
  }

  if (!response.ok) {
    throw new Error(`Admin auth failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.token;
}

// Store collection IDs for relations
const collectionIds: Record<string, string> = {};

async function getCollectionId(token: string, name: string): Promise<string> {
  // Return cached ID if available
  if (collectionIds[name]) {
    return collectionIds[name];
  }

  // Fetch from API
  const response = await fetch(`${POCKETBASE_URL}/api/collections/${name}`, {
    headers: { Authorization: token },
  });

  if (!response.ok) {
    throw new Error(`Collection "${name}" not found`);
  }

  const collection = await response.json();
  collectionIds[name] = collection.id;
  return collection.id;
}

async function createCollection(token: string, collection: CollectionSchema) {
  // Resolve relation collectionIds from names to actual IDs
  const resolvedFields = await Promise.all(
    collection.fields.map(async (field) => {
      if (field.type === "relation") {
        // Handle both formats: flat (v0.23+) and nested options (v0.22)
        const collectionName =
          field.collectionId || field.options?.collectionId;
        if (collectionName) {
          // Check if it's a name (not an ID format)
          if (
            !collectionName.startsWith("pbc_") &&
            !/^[a-z0-9]{15}$/.test(collectionName)
          ) {
            try {
              const actualId = await getCollectionId(token, collectionName);
              // Update the collectionId at the correct location
              if (field.collectionId) {
                return { ...field, collectionId: actualId };
              } else {
                return {
                  ...field,
                  options: { ...field.options, collectionId: actualId },
                };
              }
            } catch {
              // Collection might not exist yet, keep the name
              return field;
            }
          }
        }
      }
      return field;
    })
  );

  // Build payload with correct field name based on PocketBase version
  const { fields, ...rest } = { ...collection, fields: resolvedFields };
  const payload = useFieldsFormat
    ? { ...rest, fields }
    : { ...rest, schema: fields };

  const payloadStr = JSON.stringify(payload);

  // Debug: log what we're sending
  if (process.env.DEBUG) {
    console.log(
      `\n[DEBUG] Using ${useFieldsFormat ? "fields" : "schema"} format`
    );
    console.log(`[DEBUG] Sending payload:\n${payloadStr}\n`);
  }

  const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: payloadStr,
  });

  const responseText = await response.text();

  // Debug: log what we got back
  if (process.env.DEBUG) {
    console.log(`[DEBUG] Response (${response.status}):\n${responseText}\n`);
  }

  if (!response.ok) {
    if (
      responseText.includes("already exists") ||
      responseText.includes("name_exists")
    ) {
      console.log(`✓ Collection "${collection.name}" already exists`);
      // Still cache the ID for relations
      try {
        await getCollectionId(token, collection.name);
      } catch {}
      return;
    }
    throw new Error(
      `Failed to create collection ${collection.name}: ${responseText}`
    );
  }

  // Cache the created collection's ID
  const created = JSON.parse(responseText);
  collectionIds[collection.name] = created.id;

  const fieldCount = created.fields?.length || created.schema?.length || 0;
  console.log(
    `✓ Created collection: ${collection.name} (${fieldCount} fields)`
  );

  if (fieldCount <= 1 && collection.fields.length > 0) {
    console.warn(
      `⚠ Warning: Expected ${
        collection.fields.length + 1
      } fields (including id) but got ${fieldCount}`
    );
    console.warn(`  Try running with DEBUG=1 to see the full request/response`);
  }
}

async function setup() {
  console.log("🚀 Initializing PocketBase collections...\n");

  try {
    console.log("Authenticating as admin...");
    const token = await authenticateAdmin();
    console.log("✓ Authenticated successfully\n");

    // Collections from schema_templates.md (Blog Platform)
    const collections: CollectionSchema[] = [
      // Categories collection (no relations - create first)
      {
        name: "categories",
        type: "base",
        fields: [
          {
            name: "name",
            type: "text",
            required: true,
            min: 1,
            max: 100,
          },
          {
            name: "slug",
            type: "text",
            required: true,
            min: 1,
            max: 100,
          },
          {
            name: "description",
            type: "text",
            max: 500,
          },
          {
            name: "color",
            type: "text",
            max: 7,
          },
        ],
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
      },
      // Posts collection (has relation to categories)
      {
        name: "posts",
        type: "base",
        fields: [
          {
            name: "title",
            type: "text",
            required: true,
            min: 1,
            max: 200,
          },
          {
            name: "slug",
            type: "text",
            required: true,
            min: 1,
            max: 200,
          },
          {
            name: "content",
            type: "text",
            required: true,
          },
          {
            name: "excerpt",
            type: "text",
            max: 500,
          },
          {
            name: "category",
            type: "relation",
            collectionId: "categories", // Reference by name (resolved to ID)
            cascadeDelete: false,
            maxSelect: 1,
          },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["draft", "published", "archived"],
          },
          {
            name: "published_date",
            type: "date",
          },
        ],
        listRule: "status = 'published'",
        viewRule: "status = 'published'",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
      },
    ];

    if (collections.length === 0) {
      console.log(
        "No collections defined. Add your collections to the setup script."
      );
      return;
    }

    console.log("Creating collections...\n");
    for (const collection of collections) {
      await createCollection(token, collection);
    }

    console.log("\n✅ PocketBase collections initialized!");
    console.log("\nCollections created:");
    collections.forEach((c) => console.log(`  - ${c.name} (${c.type})`));
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
