#!/bin/bash

echo "🚀 Deploying AI Recipe Generator to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project locally first
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "Don't forget to:"
    echo "1. Add environment variables in Vercel dashboard"
    echo "2. Update NEXT_PUBLIC_SITE_URL with your Vercel URL"
    echo "3. Update Google OAuth redirect URLs"
    echo "4. Update Supabase site URL settings"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
