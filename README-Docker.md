# AISignLanguage - Docker Development Setup

This guide will help you run the AISignLanguage project using Docker containers for a consistent development environment.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### Installing Docker on Ubuntu/Debian

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

### Installing Docker Compose

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd AISignLanguage
   ```

2. **Run the setup script**:
   ```bash
   ./setup-docker.sh
   ```

   This script will:
   - Check if Docker is installed
   - Build and start the development containers
   - Wait for the database to be ready
   - Run database migrations
   - Display useful commands

3. **Access your application**:
   - Frontend: http://localhost:5000
   - Database: localhost:5432

## Manual Setup

If you prefer to run the commands manually:

### Development Environment

```bash
# Build and start development containers
docker-compose -f docker-compose.dev.yml up --build -d

# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:push
```

### Production Environment

```bash
# Build and start production containers
docker-compose up --build -d
```

## Useful Commands

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Container Management
```bash
# Stop containers
docker-compose -f docker-compose.dev.yml down

# Restart containers
docker-compose -f docker-compose.dev.yml restart

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build -d
```

### Accessing Containers
```bash
# Access app container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Access database
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d aisignlanguage
```

### Database Operations
```bash
# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# Reset database (remove volume)
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

## Environment Variables

The following environment variables are automatically set in the Docker containers:

- `NODE_ENV=development`
- `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aisignlanguage`
- `PORT=5000`

## Project Structure

```
AISignLanguage/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared TypeScript types
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
├── setup-docker.sh         # Setup script
└── README-Docker.md        # This file
```

## Troubleshooting

### Port Already in Use
If you get an error about port 5000 or 5432 being in use:

```bash
# Check what's using the port
sudo lsof -i :5000
sudo lsof -i :5432

# Stop the conflicting service or change ports in docker-compose.dev.yml
```

### Database Connection Issues
```bash
# Check if database is running
docker-compose -f docker-compose.dev.yml ps

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres

# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres
```

### Permission Issues
If you get permission errors:

```bash
# Add your user to docker group (requires logout/login)
sudo usermod -aG docker $USER

# Or run with sudo
sudo docker-compose -f docker-compose.dev.yml up -d
```

### Clean Slate
To start completely fresh:

```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker system prune -a

# Start again
./setup-docker.sh
```

## Development Workflow

1. **Start the environment**: `./setup-docker.sh`
2. **Make code changes**: Edit files in your IDE
3. **See changes immediately**: The development server has hot reloading
4. **Database changes**: Run `docker-compose -f docker-compose.dev.yml exec app npm run db:push`
5. **Stop when done**: `docker-compose -f docker-compose.dev.yml down`

## Next Steps

Once your Docker environment is running:

1. Visit http://localhost:5000 to see your application
2. Check the application logs for any issues
3. Start developing! The hot reloading will automatically reflect your changes

Happy coding! 🚀 