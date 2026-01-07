# Build the App

Read the app specification in `documentation/` and build the complete app for the user.

## Steps

1. **Read the spec**: Open and read all files in `documentation/` to understand what the user wants to build

2. **Plan the build**:
   - List the pages needed
   - Identify data models (PocketBase collections)
   - Note any special features (auth, AI, etc.)

3. **Set up the database**: 
   - Create any needed PocketBase collections via the Admin UI at port 8090 `/_/`
   - Or instruct the user how to create them

4. **Build pages one by one**:
   - Start with the main page (`src/app/page.tsx`)
   - Add additional pages as needed
   - Use shadcn/ui components from `src/components/ui/`
   - Style with Tailwind CSS

5. **Add functionality**:
   - Connect to PocketBase for data (`@/lib/pocketbase`)
   - Add auth if needed (`signInWithEmail`, `signUpWithEmail`, etc.)
   - Add AI features if needed (`@/lib/ai`)

6. **Test in browser**: Verify the app works at port 3000

7. **Iterate**: Ask the user for feedback and refine

## Remember

- The existing code is just a template—completely replace it to match the user's vision
- Use the pre-installed shadcn/ui components for a polished UI
- Test each feature as you build it


