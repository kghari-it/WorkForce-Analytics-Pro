#!/bin/bash

# WorkForce Analytics Pro - Setup Script
# This script helps you set up the application

set -e

echo "======================================"
echo "WorkForce Analytics Pro - Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please create .env file with Supabase credentials"
    exit 1
fi

echo "✓ .env file found"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Build the project
echo "Building project..."
npm run build
echo "✓ Build successful"
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to Supabase Dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co"
echo "2. Open SQL Editor and create a new query"
echo "3. Copy content from setup-database.sql"
echo "4. Paste into Supabase SQL Editor"
echo "5. Click Run"
echo ""
echo "Then start the app:"
echo "  npm run dev"
echo ""
echo "For Google OAuth setup, see GOOGLE_OAUTH_SETUP.md"
echo ""
