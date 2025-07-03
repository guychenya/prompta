#!/bin/bash

# Prompts Hub Local Installer
# This script sets up the prompt filtering website locally

set -e

echo "🚀 Prompts Hub Local Installer"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on macOS/Linux
if [[ "$OSTYPE" != "darwin"* ]] && [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ This installer supports macOS and Linux only${NC}"
    echo "For Windows, please use WSL or Git Bash"
    exit 1
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required but not installed${NC}"
    echo "Please install Python 3 and try again"
    echo "Visit: https://www.python.org/downloads/"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 found${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is required but not installed${NC}"
    echo "Please install Git and try again"
    exit 1
fi

echo -e "${GREEN}✅ Git found${NC}"

# Check if we're in the right directory
if [ ! -f "data/prompts.json" ]; then
    echo -e "${RED}❌ prompts.json not found${NC}"
    echo "Please run this script from the Prompts Hub root directory"
    exit 1
fi

echo -e "${GREEN}✅ Prompts database found${NC}"

# Navigate to website directory
cd website

echo -e "${BLUE}🔧 Setting up local development server...${NC}"

# Create a simple server start script
cat > start-server.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting Prompts Hub Website..."
echo "📍 Local URL: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
    echo "🔄 Trying port 8000..."
    python3 -m http.server 8000
else
    python3 -m http.server 3000
fi
EOF

chmod +x start-server.sh

echo -e "${GREEN}✅ Local server setup complete${NC}"
echo ""
echo -e "${YELLOW}🎉 Installation Complete!${NC}"
echo ""
echo "To start the website locally:"
echo -e "${BLUE}  cd website${NC}"
echo -e "${BLUE}  ./start-server.sh${NC}"
echo ""
echo "Or use npm commands:"
echo -e "${BLUE}  cd website${NC}"
echo -e "${BLUE}  npm start${NC}"
echo ""
echo "The website will be available at:"
echo -e "${GREEN}  http://localhost:3000${NC}"
echo ""
echo "🚀 Ready to filter and discover prompts!"

# Ask if user wants to start the server now
read -p "🤔 Would you like to start the website now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌟 Starting website...${NC}"
    ./start-server.sh
fi