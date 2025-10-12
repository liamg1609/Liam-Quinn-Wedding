#!/bin/bash

echo "🚀 Testing build process..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build:public

if [ -d "public" ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 Contents of public folder:"
    ls -lh public/
    echo ""
    echo "🎉 Ready to deploy! Follow the instructions in DEPLOY.md"
else
    echo ""
    echo "❌ Build failed! Check the error messages above."
fi
