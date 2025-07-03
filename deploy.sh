#!/bin/bash

# Prompts Hub Deployment Script
# Deploy to Netlify with one command

set -e

echo "🚀 Prompts Hub Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI is not installed${NC}"
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

echo -e "${GREEN}✅ Netlify CLI found${NC}"

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo -e "${RED}❌ netlify.toml not found${NC}"
    echo "Please run this script from the Prompts Hub root directory"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Netlify...${NC}"
    netlify login
fi

echo -e "${GREEN}✅ Netlify authentication verified${NC}"

# Ask for deployment type
echo ""
echo "Choose deployment type:"
echo "1) Deploy preview (draft)"
echo "2) Deploy to production"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${BLUE}📦 Deploying preview...${NC}"
        netlify deploy --dir=website --open
        ;;
    2)
        echo -e "${BLUE}🌟 Deploying to production...${NC}"
        netlify deploy --dir=website --prod --open
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}🌐 Your website is now live on Netlify${NC}"