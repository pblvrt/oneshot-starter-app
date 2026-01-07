#!/bin/bash
set -e

# Wait for PocketBase to be healthy
echo "⏳ Waiting for PocketBase to start..."
until curl -sf http://pocketbase:8090/api/health > /dev/null 2>&1; do
  sleep 1
done

echo "✅ PocketBase is ready"

# Check if admin already exists by trying to authenticate
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-admin123456}"

echo "🔐 Checking if admin user exists..."

# Try to authenticate as admin
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://pocketbase:8090/api/admins/auth-with-password \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Admin user already exists: $ADMIN_EMAIL"
else
  echo "📝 Creating admin user: $ADMIN_EMAIL"
  
  # Create admin user
  RESPONSE=$(curl -s -X POST http://pocketbase:8090/api/admins \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"passwordConfirm\":\"$ADMIN_PASSWORD\"}")
  
  if echo "$RESPONSE" | grep -q "id"; then
    echo "✅ Admin user created successfully!"
    echo "📧 Email: $ADMIN_EMAIL"
    echo "🔑 Password: $ADMIN_PASSWORD"
  else
    echo "⚠️  Could not create admin user. You may need to create it manually at /_/"
  fi
fi

