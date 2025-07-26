# Celestial Mood Tracker - Code Documentation

## Overview
This documentation explains how the Celestial mood tracking app works, written in simple terms to help with future development and understanding.

## Project Structure

### Frontend (Client)
The app's user interface is built with React and lives in the `client/` folder.

#### Key Files:
- `client/src/App.tsx` - Main app component that handles navigation between pages
- `client/src/pages/` - Individual pages users can visit
- `client/src/components/` - Reusable UI pieces
- `client/src/hooks/` - Custom functions for common tasks
- `client/src/lib/` - Helper functions and utilities

### Backend (Server)
The server handles data storage and API requests, located in the `server/` folder.

#### Key Files:
- `server/index.ts` - Main server file that starts everything
- `server/routes.ts` - Defines what happens when users make requests
- `server/storage.ts` - Handles saving and loading data

### Shared Code
- `shared/schema.ts` - Defines what data looks like (types and validation)

## How Data Flows

### 1. User Interaction → Frontend
When a user clicks something or fills out a form:
- React components handle the interaction
- Forms use `react-hook-form` for validation
- Data gets sent to the backend via API calls

### 2. Frontend → Backend
The frontend talks to the backend through API endpoints:
- `GET /api/moods` - Gets all mood entries
- `POST /api/moods` - Saves a new mood entry
- `GET /api/mission-logs` - Gets all journal entries
- `POST /api/mission-logs` - Saves a new journal entry
- `GET /api/analytics` - Gets statistics and trends

### 3. Backend → Storage
The backend processes requests and saves/loads data:
- Uses in-memory storage for development (data resets when server restarts)
- Can be configured to use PostgreSQL database for production
- All data operations go through the storage interface

### 4. Storage → Backend → Frontend
Data flows back to update the user interface:
- Backend fetches data from storage
- Sends JSON response to frontend
- React Query automatically updates the UI

## Key Features Explained

### Mood Tracking
**File:** `client/src/pages/mood-tracker.tsx`

**How it works:**
1. User sees planet buttons representing different moods
2. Clicking a planet selects that mood
3. User sets intensity level (1-10) with a slider
4. Optional note can be added
5. Form submission sends data to `/api/moods`
6. Backend saves mood with current date and "stardate"

**Important parts:**
- Planet selector uses CSS hover effects and animations
- Form validation ensures required fields are filled
- Success message appears after saving

### Mission Log (Journaling)
**File:** `client/src/pages/mission-log.tsx`

**How it works:**
1. User can write text entries or record voice memos
2. Voice recording uses browser's microphone API
3. Audio gets converted to base64 text for storage
4. Entries are saved with timestamps and status
5. Users can edit or delete existing entries

**Voice Recording Process:**
- `use-voice-recorder.ts` hook handles microphone access
- Records audio using MediaRecorder API
- Converts audio blob to base64 string
- Saves to database along with duration

### Analytics Dashboard
**File:** `client/src/pages/analytics.tsx`

**How it works:**
1. Backend calculates statistics from all mood entries
2. Shows mood distribution (which moods are most common)
3. Calculates streak (consecutive days with entries)
4. Displays average mood and trends
5. Charts and progress bars visualize the data

**Statistics calculated:**
- Total entries and mission logs
- Current streak of consecutive days
- Average mood intensity
- Most common mood (predominant mood)
- Percentage breakdown of all moods

### Dashboard Overview
**File:** `client/src/pages/dashboard.tsx`

**How it works:**
1. Shows quick stats (streak, total entries, top mood)
2. Displays recent mission log entries
3. Quick mood entry form for easy logging
4. Links to detailed pages

## Technical Details

### State Management
- **React Query** handles server data (fetching, caching, updates)
- **useState** for local component state
- No global state management needed

### Styling
- **Tailwind CSS** for all styling
- Custom Y2K/cyberpunk theme with pinks, purples, and cyans
- Animated backgrounds and glow effects
- Responsive design for mobile and desktop

### Database Schema
```
users: id, username, password
moods: id, userId, mood, intensity, note, date, stardate
mission_logs: id, userId, title, content, status, entryType, audioData, audioDuration, stardate, createdAt
voice_recordings: id, missionLogId, audioData, duration, createdAt
```

### API Endpoints
All endpoints return JSON and follow REST conventions:
- GET requests fetch data
- POST requests create new data
- PUT requests update existing data
- DELETE requests remove data

## Development Guidelines

### Adding New Features
1. **Define data structure** in `shared/schema.ts` first
2. **Add storage methods** in `server/storage.ts`
3. **Create API routes** in `server/routes.ts`
4. **Build frontend components** in `client/src/`
5. **Test with real user interactions**

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic

### Common Patterns
- **Forms:** Use `react-hook-form` with Zod validation
- **API calls:** Use React Query with proper error handling
- **UI components:** Use shadcn/ui components when possible
- **Styling:** Use Tailwind classes, avoid custom CSS

## Debugging Tips

### Frontend Issues
- Check browser console for errors
- Use React Developer Tools
- Verify API calls in Network tab
- Check if data is loading correctly

### Backend Issues
- Look at server logs in terminal
- Test API endpoints with curl or Postman
- Verify data is being saved correctly
- Check database connections

### Common Problems
- **CORS errors:** Make sure frontend and backend URLs match
- **Data not updating:** Check React Query cache invalidation
- **Forms not submitting:** Verify form validation and error handling
- **Styling issues:** Check Tailwind classes and responsive breakpoints

## Future Development Ideas

### Potential Features
- User authentication and accounts
- Data export functionality
- Mood prediction based on patterns
- Social sharing of insights
- Calendar view of mood history
- Reminder notifications

### Technical Improvements
- Add proper database migrations
- Implement caching strategies
- Add comprehensive testing
- Optimize for performance
- Add offline functionality

## File Reference Guide

### Most Important Files to Understand

1. **`client/src/App.tsx`** - App structure and routing
2. **`server/routes.ts`** - All API endpoints
3. **`shared/schema.ts`** - Data types and validation
4. **`client/src/pages/mood-tracker.tsx`** - Main mood entry feature
5. **`server/storage.ts`** - Data persistence layer

### Configuration Files
- `package.json` - Dependencies and scripts
- `tailwind.config.ts` - Styling configuration
- `vite.config.ts` - Build tool settings
- `tsconfig.json` - TypeScript settings

### Style Files
- `client/src/index.css` - Global styles and theme
- Individual component styles using Tailwind classes

This documentation should help anyone understand how the Celestial app works and how to continue developing it. The code is organized in a way that makes it easy to add new features while maintaining the existing functionality.