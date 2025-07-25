# Stellar Mood - Space-Themed Mood Tracking Application

## Overview

Stellar Mood is a full-stack web application that provides a unique space-themed approach to mood tracking and personal journaling. The application combines mood logging with mission logs (journal entries) and provides analytics to help users understand their emotional patterns over time. Built with a React frontend and Express backend, it features a cosmic aesthetic with planet-based mood selection and stardate timestamping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom space theme
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES Modules
- **API Design**: RESTful API with JSON responses
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: In-memory storage fallback for development

### Deployment Strategy
- **Development**: Vite dev server with Express backend
- **Production**: Static assets served by Express
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Replit Integration**: Custom Vite plugins for Replit environment

## Key Components

### Data Models
1. **Users**: Authentication and user management
2. **Moods**: Mood entries with intensity ratings and notes
3. **Mission Logs**: Journal entries supporting text and voice recordings
4. **Voice Recordings**: Audio data associated with mission logs

### Frontend Pages
1. **Dashboard**: Overview with quick mood entry and recent logs
2. **Mood Tracker**: Detailed mood logging with planet selector
3. **Mission Log**: Journal entry creation and management
4. **Analytics**: Mood trends and statistics visualization

### Custom Components
- **Planet Selector**: Visual mood selection using space-themed planets
- **Voice Recorder**: Audio recording functionality for mission logs
- **Mood Calendar**: Calendar view of mood history
- **Mission Log Entry**: Individual journal entry display and editing

### Unique Features
- **Stardate System**: Custom timestamp format mimicking Star Trek
- **Space Theme**: Cosmic background with animated stars and planets
- **Mood Guidance**: Contextual suggestions based on selected moods
- **Voice Integration**: Audio recording capabilities for journal entries

## Data Flow

### Mood Tracking Flow
1. User selects mood from planet-based interface
2. User sets intensity level and optional note
3. Data sent to `/api/moods` endpoint with stardate
4. Real-time updates via React Query invalidation
5. Analytics automatically recalculated

### Mission Log Flow
1. User creates text or voice-based journal entry
2. Voice recordings processed through Web Audio API
3. Entry saved to `/api/mission-logs` with status tracking
4. Entries displayed with edit/delete capabilities
5. Audio playback functionality for voice entries

### Analytics Processing
1. Server aggregates mood and log data
2. Calculates statistics like streaks and averages
3. Mood distribution analysis
4. Predominant mood identification
5. Real-time dashboard updates

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: PostgreSQL database connection
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation and formatting

### UI Components
- **@radix-ui/***: Accessible component primitives
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework
- **clsx**: Conditional class name utility

### Audio Processing
- **Web Audio API**: Browser-native audio recording
- **MediaRecorder API**: Audio data capture and processing

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Database Schema

### Tables Structure
- **users**: User authentication (id, username, password)
- **moods**: Mood entries (id, userId, mood, intensity, note, date, stardate)
- **mission_logs**: Journal entries (id, userId, title, content, status, entryType, audioData, audioDuration, stardate, createdAt)
- **voice_recordings**: Audio data (id, missionLogId, audioData, duration, createdAt)

### Data Relationships
- Users have many moods and mission logs
- Mission logs can have associated voice recordings
- All entries timestamped with both regular dates and stardates

## Authentication Strategy

Currently implements demo mode with hardcoded user ID for development. The schema supports full user authentication with username/password, ready for implementation of proper auth flows.

## Performance Considerations

- React Query handles caching and background updates
- Drizzle ORM provides type-safe, efficient database queries
- Vite's hot module replacement for fast development
- Audio data stored as base64 strings (suitable for demo, may need optimization for production)
- In-memory storage fallback ensures development without database setup

## Space Theme Implementation

The application features a comprehensive space aesthetic including:
- Animated star field background
- Planet-themed mood selection with hover effects
- Cosmic color palette with nebula-inspired gradients
- Stardate timestamp system
- Space-themed terminology throughout the UI
- Floating animations and glow effects for interactive elements