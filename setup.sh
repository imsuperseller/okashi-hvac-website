#!/bin/bash

# Okashi HVAC Services - Setup Script
# This script sets up the project for development and deployment

echo "🚀 Setting up Okashi HVAC Services Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build CSS
echo "🎨 Building CSS..."
npx tailwindcss -i ./src/input.css -o ./public/styles.css --minify

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your actual API keys"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs

# Set up git hooks (optional)
if [ -d .git ]; then
    echo "🔧 Setting up git hooks..."
    # Add pre-commit hook to build CSS
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🎨 Building CSS before commit..."
npx tailwindcss -i ./src/input.css -o ./public/styles.css --minify
git add public/styles.css
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

# Check if all required files exist
echo "🔍 Checking project structure..."
required_files=(
    "index.html"
    "services.html"
    "contact.html"
    "server.js"
    "package.json"
    "tailwind.config.js"
    "public/styles.css"
    "public/script.js"
    "public/logo.png"
    "mcp-servers/weather-mcp.js"
    "mcp-servers/reviews-mcp.js"
    "mcp-servers/validation-mcp.js"
    "vercel.json"
    "sitemap.xml"
    "robots.txt"
    "README.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files are present"
else
    echo "❌ Missing files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

# Test server startup
echo "🧪 Testing server startup..."
timeout 5s node server.js &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server starts successfully"
    kill $SERVER_PID
else
    echo "❌ Server failed to start"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 To deploy to Vercel:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Run: vercel"
echo "3. Set environment variables in Vercel dashboard"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🔧 Available commands:"
echo "  npm start          # Start production server"
echo "  npm run dev        # Start development server"
echo "  npm run build:css  # Build CSS (watch mode)"
echo "  npm run build      # Build CSS for production"
echo ""
echo "🌟 Okashi HVAC Services is ready to serve DFW!" 