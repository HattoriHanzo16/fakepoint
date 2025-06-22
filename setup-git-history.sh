#!/bin/bash

# Fakepoint Git Repository Setup Script
# This script creates a realistic development history with proper branching strategy

set -e

echo "🚀 Setting up Fakepoint Git repository with realistic development history..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Set up initial configuration (only if not already set)
if [ -z "$(git config user.name)" ]; then
    git config user.name "Fakepoint Developer"
fi
if [ -z "$(git config user.email)" ]; then
    git config user.email "dev@fakepoint.dev"
fi

# Check if there are existing commits and handle accordingly
if git rev-parse HEAD >/dev/null 2>&1; then
    echo "⚠️  Existing commits detected. This script will create a new commit history."
    echo "📝 Consider backing up your current repository state before proceeding."
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted by user."
        exit 1
    fi
fi

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
EOF

# Initial commit
git add .gitignore
git commit -m "🎯 Initial commit: Add .gitignore"

# Create main project structure commit
git add package.json README.md
git commit -m "📦 Project setup: Add root package.json and README

- Set up monorepo workspace structure
- Add project description and documentation
- Configure npm scripts for development"

# Create shared types branch
git checkout -b feature/shared-types
git add packages/shared/
git commit -m "🏗️ Add shared TypeScript types

- Define FakeEndpoint interface
- Add HTTP method types
- Set up request/response interfaces
- Establish type safety across packages"

# Switch back to main and merge
git checkout main
git merge feature/shared-types --no-ff -m "🔀 Merge feature/shared-types into main"

# Create server foundation branch
git checkout -b feature/server-foundation
git add packages/server/package.json packages/server/tsconfig.json packages/server/src/types.ts
git commit -m "⚙️ Server foundation: Package setup and configuration

- Add Express.js and TypeScript dependencies
- Configure build and development scripts
- Set up TypeScript compilation settings"

# Add server store
git add packages/server/src/store.ts
git commit -m "💾 Implement in-memory endpoint store

- Create EndpointStore class for data management
- Add CRUD operations for fake endpoints
- Implement path/method lookup functionality"

# Add server middleware
git add packages/server/src/middleware/
git commit -m "🔌 Add fake endpoint middleware

- Implement request interception logic
- Handle fake endpoint responses
- Skip management API routes"

# Add management routes
git add packages/server/src/routes/
git commit -m "🛣️ Implement management API routes

- Add CRUD endpoints for fake endpoint management
- Implement validation and error handling
- Add endpoint toggle functionality"

# Add main server file
git add packages/server/src/index.ts
git commit -m "🚀 Complete server implementation

- Set up Express application
- Configure CORS and JSON middleware
- Add health check endpoint
- Implement error handling"

# Merge server foundation
git checkout main
git merge feature/server-foundation --no-ff -m "🔀 Merge feature/server-foundation into main"

# Create client foundation branch
git checkout -b feature/client-foundation
git add packages/client/package.json packages/client/tsconfig.json packages/client/tsconfig.node.json packages/client/vite.config.ts
git commit -m "⚛️ Client foundation: React + Vite setup

- Configure React 18 with TypeScript
- Set up Vite build system
- Add TanStack Query for state management
- Configure development proxy"

# Add HTML template
git add packages/client/index.html
git commit -m "🎨 Add HTML template with custom styling

- Set up basic HTML structure
- Add meta tags and favicon
- Include custom CSS reset"

# Add main React entry point
git add packages/client/src/main.tsx packages/client/src/types.ts
git commit -m "🔧 Set up React application entry point

- Configure React 18 with StrictMode
- Set up TanStack Query provider
- Import shared types"

# Merge client foundation
git checkout main
git merge feature/client-foundation --no-ff -m "🔀 Merge feature/client-foundation into main"

# Create API integration branch
git checkout -b feature/api-integration
git add packages/client/src/api.ts
git commit -m "🌐 Implement API client integration

- Add Axios HTTP client configuration
- Create endpoint API methods (CRUD)
- Set up request/response handling
- Configure base URL and headers"

git checkout main
git merge feature/api-integration --no-ff -m "🔀 Merge feature/api-integration into main"

# Create basic UI branch
git checkout -b feature/basic-ui
git add packages/client/src/styles.css
git commit -m "🎨 Add basic CSS styling foundation

- Set up CSS custom properties
- Create component base styles
- Add form and button styling
- Implement responsive grid system"

# Add main App component
git add packages/client/src/App.tsx
git commit -m "🏠 Implement main App component

- Set up React Query integration
- Add basic layout structure
- Implement CRUD operations hooks
- Add error handling"

git checkout main
git merge feature/basic-ui --no-ff -m "🔀 Merge feature/basic-ui into main"

# Create endpoint list feature
git checkout -b feature/endpoint-list
git add packages/client/src/components/EndpointList.tsx
git commit -m "📋 Implement endpoint list component

- Display fake endpoints in organized list
- Add method badges and status indicators
- Implement action buttons (edit, delete, toggle)
- Add empty state with helpful messaging"

git checkout main
git merge feature/endpoint-list --no-ff -m "🔀 Merge feature/endpoint-list into main"

# Create endpoint form feature
git checkout -b feature/endpoint-form
git add packages/client/src/components/EndpointForm.tsx
git commit -m "📝 Implement endpoint form component

- Create modal form for endpoint creation/editing
- Add form validation and error handling
- Include JSON response body presets
- Implement create and update operations"

git checkout main
git merge feature/endpoint-form --no-ff -m "🔀 Merge feature/endpoint-form into main"

# Create UI enhancement branch
git checkout -b feature/ui-enhancements

# Commit CSS enhancements in chunks
git add packages/client/src/styles.css
git commit -m "✨ Major UI enhancement: Modern design system

- Add Inter font and improved typography
- Implement gradient backgrounds and animations
- Create glassmorphism card effects
- Add smooth transitions and hover states"

# Update components with enhanced styling
git add packages/client/src/App.tsx
git commit -m "🎯 Enhance App component with modern styling

- Add animated header with emoji integration
- Improve server information display
- Add visual hierarchy and better spacing
- Implement card-based layout"

git add packages/client/src/components/EndpointList.tsx
git commit -m "📋 Polish endpoint list with premium styling

- Add hover animations and visual feedback
- Enhance empty state with tips
- Improve button styling with emojis
- Add tooltips for better UX"

git add packages/client/src/components/EndpointForm.tsx
git commit -m "📝 Upgrade form component with professional styling

- Add emoji integration to buttons
- Improve modal header styling
- Enhance form validation display
- Add loading state animations"

# Final styling touches
git add packages/client/index.html
git commit -m "🎨 Add beautiful background patterns and responsive design

- Implement animated gradient background
- Add floating orb effects
- Improve mobile responsiveness
- Enhance accessibility features"

# Add favicon
git add packages/client/public/favicon.svg
git commit -m "🎯 Add custom branded favicon

- Create SVG favicon with gradient
- Match brand colors and styling
- Improve browser tab appearance"

# Final responsive improvements
git add packages/client/src/styles.css
git commit -m "📱 Complete responsive design implementation

- Add mobile-first responsive breakpoints
- Improve touch interactions
- Enhance accessibility with focus states
- Add dark mode preparation"

git checkout main
git merge feature/ui-enhancements --no-ff -m "🔀 Merge feature/ui-enhancements into main"

# Create release preparation branch
git checkout -b release/v1.0.0

# Update version and final touches
npm version 1.0.0 --no-git-tag-version
git add package.json packages/*/package.json
git commit -m "🏷️ Bump version to 1.0.0

- Update all package versions
- Prepare for initial release
- Ensure version consistency"

# Final README update
git add README.md
git commit -m "📚 Update README with comprehensive documentation

- Add detailed setup instructions
- Include usage examples and API reference
- Add development guidelines
- Improve project structure documentation"

# Merge release branch
git checkout main
git merge release/v1.0.0 --no-ff -m "🔀 Merge release/v1.0.0 into main"

# Create version tag
git tag -a v1.0.0 -m "🎉 Release v1.0.0: Initial release of Fakepoint

Features:
- Complete fake API endpoint management
- Modern React frontend with beautiful UI
- Node.js/Express backend with TypeScript
- Real-time endpoint creation and management
- Professional responsive design
- Comprehensive documentation"

# Create development branch for future work
git checkout -b develop

# Return to main branch (keeping all feature branches for realistic history)
git checkout main

echo ""
echo "🎉 Git repository setup complete!"
echo ""
echo "📊 Repository Statistics:"
echo "   • $(git rev-list --count HEAD) commits created"
echo "   • $(git tag | wc -l | tr -d ' ') version tags"
echo "   • $(git branch | wc -l | tr -d ' ') branches total"
echo ""
echo "🌟 Branches created:"
echo "   • main: Production-ready code"
echo "   • develop: Development branch for future features"
echo "   • feature/* branches: Individual feature development (kept for history)"
echo ""
echo "🏷️ Tags:"
git tag -l
echo ""
echo "🌳 All branches:"
git branch -a
echo ""
echo "📈 Recent commit history:"
git log --oneline -10
echo ""
# Set up remote repository
REPO_URL="https://github.com/HattoriHanzo16/fakepoint.git"

# Check if remote origin already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "📡 Remote origin already configured"
else
    echo "📡 Adding remote origin..."
    git remote add origin "$REPO_URL"
fi

# Push everything to remote
echo "🚀 Pushing all content to remote repository..."

# Push main branch first
echo "   📤 Pushing main branch..."
if git push -u origin main; then
    echo "   ✅ Main branch pushed successfully"
else
    echo "   ❌ Failed to push main branch"
    exit 1
fi

# Push all other branches
echo "   📤 Pushing all feature branches..."
if git push --all origin; then
    echo "   ✅ All branches pushed successfully"
else
    echo "   ⚠️  Some branches may have failed to push (this is normal if main was already pushed)"
fi

# Push all tags
echo "   🏷️ Pushing all tags..."
if git push --tags origin; then
    echo "   ✅ All tags pushed successfully"
else
    echo "   ⚠️  Some tags may have failed to push"
fi

echo ""
echo "✅ Complete! Repository setup finished!"
echo "🌐 Your repository is now available at: https://github.com/HattoriHanzo16/fakepoint"
echo "🎉 No further git commands needed - everything is set up!"
EOF 