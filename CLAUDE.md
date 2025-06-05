# CLAUDE.md - Travel Planner Project

## Project Overview
A modern travel planning application built with Next.js 15, TypeScript, and Tailwind CSS. Users can input travel details (origin, destination, duration, budget) to generate personalized itineraries with Google Maps integration and AI-powered recommendations.

## Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Maps**: Google Maps JavaScript API (@googlemaps/js-api-loader)
- **AI**: OpenAI API for itinerary generation
- **Forms**: React Hook Form with Zod validation (@hookform/resolvers)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP**: Axios

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Git Workflow
- Always run `npm run lint` before committing to ensure code quality
- Use descriptive commit messages that explain the purpose of changes
- Consider creating commits after completing logical units of work

## Project Structure
```
src/
├── app/
│   ├── api/           # API routes for backend functionality
│   ├── itinerary/     # Itinerary-related pages
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page with travel form
├── components/
│   ├── ItineraryCard.tsx  # Display individual itinerary items
│   ├── MapView.tsx        # Google Maps integration
│   ├── TravelForm.tsx     # Main travel planning form
│   └── ui/               # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/
│   └── utils.ts       # Utility functions (tailwind-merge, clsx)
└── types/
    └── travel.ts      # TypeScript interfaces for travel data
```

## Key Types & Interfaces
- `TravelFormData`: Form input (origin, destination, duration, budget)
- `Location`: Geographic coordinates and address
- `Place`: Travel destination with cost and rating
- `DayItinerary`: Daily schedule with places, accommodation, restaurants

## Component Guidelines
- Use TypeScript interfaces from `src/types/travel.ts`
- Follow existing form patterns with React Hook Form + Zod
- Use Tailwind classes with `cn()` utility from `lib/utils.ts`
- Implement loading states for async operations
- Use Lucide React icons consistently
- Add Framer Motion animations for smooth UX

## API Integration Notes
- Google Maps API key required for MapView component
- OpenAI API integration for generating travel recommendations
- Use Axios for HTTP requests in API routes

## Code Style Preferences
- Extensive comments explaining functionality (see page.tsx example)
- TypeScript strict mode enabled
- Component props should be properly typed
- Use modern React patterns (hooks, functional components)
- Prefer async/await over promises
- Use ESLint configuration provided

## Development Workflow
- Always create a plan using TodoWrite before starting any task
- Break down complex tasks into smaller, manageable steps
- Mark todos as in_progress when working on them and completed when finished
- Use the todo list to track progress and ensure nothing is missed

## Development Notes
- Currently on branch: `editing-icon_FromTravel`
- The app has a two-panel layout: form sidebar + map/results area
- Form submission shows loading states and displays trip data
- Map integration and full itinerary generation are in progress

## Environment Variables Needed
- `GOOGLE_MAPS_API_KEY` - For maps functionality
- `OPENAI_API_KEY` - For AI-powered recommendations

## Testing Strategy
- No test framework currently configured
- Consider adding Jest + React Testing Library for component tests
- API routes should be tested for travel data processing

## Common Tasks
- Adding new travel form fields → Update `TravelFormData` interface
- Creating new components → Follow existing patterns in components/
- Adding API endpoints → Use app/api/ directory structure
- Styling → Use Tailwind classes with proper responsive design