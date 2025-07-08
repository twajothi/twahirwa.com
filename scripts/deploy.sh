#!/bin/bash


set -e  # Exit on any error

echo "🚀 Starting deployment process..."

if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the repository root."
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

echo "🔨 Building project..."
if [ -f "scripts/build.js" ]; then
    node scripts/build.js
else
    echo "⚠️  Build script not found, skipping build step"
fi

echo "📦 Staging changes..."
git add .

if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    COMMIT_MSG="Deploy portfolio updates - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "💾 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
fi

echo "🚀 Pushing to remote..."
git push origin "$CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo "✅ Deployment complete! Site will be available at https://twahirwa.com in a few minutes."
else
    echo "✅ Changes pushed to $CURRENT_BRANCH branch."
    echo "💡 To deploy to production, merge this branch to main."
fi

echo "🎉 Deployment process finished!"
