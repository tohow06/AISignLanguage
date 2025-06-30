#!/bin/bash

echo "🚀 Setting up AISignLanguage Docker Development Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available (either as plugin or standalone)
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please ensure Docker Compose is installed."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Build and start the development environment
echo "🔨 Building and starting development containers..."
docker compose -f docker-compose.dev.yml up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose -f docker-compose.dev.yml exec app npm run db:push

echo "✅ Setup complete!"
echo ""
echo "🌐 Your application is now running at: http://localhost:5000"
echo "🗄️  Database is running on: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker compose -f docker-compose.dev.yml logs -f"
echo "  - Stop containers: docker compose -f docker-compose.dev.yml down"
echo "  - Restart containers: docker compose -f docker-compose.dev.yml restart"
echo "  - Access app container: docker compose -f docker-compose.dev.yml exec app sh"
echo "  - Access database: docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d aisignlanguage" 