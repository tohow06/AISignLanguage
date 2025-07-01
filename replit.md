# AI Sign Language Interpreter

## Overview

This is a full-stack web application that converts text input into sign language videos using AI technology. The application features a modern React frontend with a Node.js/Express backend, designed to make communication more accessible by bridging the gap between written text and sign language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints
- **Request Processing**: Express middleware for JSON parsing and logging
- **Error Handling**: Centralized error handling middleware

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle ORM with Zod schema validation
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Key Components

### Database Schema
- **Users Table**: User authentication and profile management
- **Video Requests Table**: Tracks text-to-video conversion requests with status tracking
- **Status States**: pending, processing, completed, failed

### API Endpoints
- **POST /api/generate-video**: Accepts text input and initiates video generation
- **Background Processing**: Simulated AI video generation with status updates

### Frontend Features
- **Text Input Interface**: Clean textarea for user input with character limits
- **Real-time Status Updates**: Polling-based status checking for video generation
- **Video Player**: Embedded video playback once generation completes
- **Toast Notifications**: User feedback for all operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### AI Integration (Simulated)
- **Mock Video Generation**: Currently returns sample video URLs
- **Processing Simulation**: 3-second delay to mimic real AI processing
- **Status Tracking**: Complete workflow from request to completion

## Data Flow

1. **User Input**: User enters text in the frontend interface
2. **API Request**: Frontend sends POST request to /api/generate-video
3. **Request Creation**: Backend creates video request record with "pending" status
4. **Background Processing**: Simulated AI processing begins asynchronously
5. **Status Updates**: Request status updated to "processing", then "completed" or "failed"
6. **Frontend Polling**: Client polls for status updates and displays results
7. **Video Delivery**: Completed video URL returned to frontend for playback

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **express**: Web application framework
- **zod**: Schema validation

### Development Tools
- **drizzle-kit**: Database migration and schema management
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Configured for PostgreSQL with environment variables

### Production Build
- **Frontend**: Vite build process generating optimized static files
- **Backend**: esbuild compilation to ESM format
- **Deployment**: Single Node.js process serving both API and static files
- **Environment**: Production-ready with proper error handling

### Database Configuration
- **Connection**: Environment variable-based DATABASE_URL
- **Migrations**: Drizzle-kit for schema management
- **Dialect**: PostgreSQL with modern features

## Changelog
- June 30, 2025. Initial setup
- June 30, 2025. Added Lisa as AI interpreter with personal branding
- June 30, 2025. Updated all website copy to be written from Lisa's first-person perspective
- June 30, 2025. Rebranded to HeeJoo Kim with professional portfolio layout
- June 30, 2025. Added larger professional headshot and portfolio-style About section
- June 30, 2025. Transformed page structure to showcase HeeJoo's professional services

## User Preferences

Preferred communication style: Simple, everyday language.
Personal branding: The AI interpreter is named "HeeJoo Kim" and the website should function as her professional portfolio, showcasing her expertise in AI sign language interpretation. The site should maintain a professional tone while being personal and approachable.