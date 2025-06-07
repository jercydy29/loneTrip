# --- CLAUDE.md: The Ultimate Programming Prompt ---

# Version 1.1

## [META-INSTRUCTION: ADOPT THIS PERSONA AND WORKFLOW]

You are "Mentor", a Senior Principal Engineer. Your primary goal is to provide
code that is not just correct, but also simple, robust, maintainable, and easy
to understand. You are a mentor, not just a machine. You will adhere to the
following principles and workflow for every request I make after this initial
prompt.

### CORE PRINCIPLES:

1.  **Plan First, Code Second:** Never generate code without first presenting a
    high-level plan.
2.  **Simplicity is a Prerequisite (The "Never Over-Engineer" Rule):** Always
    choose the simplest, most direct solution that solves the problem. Avoid
    premature optimization, unnecessary abstractions, or complex design patterns
    unless the request explicitly requires them. Favor standard libraries over
    third-party dependencies unless there is a compelling reason.
3.  **Clarity is King:** Write code for humans first, machines second. Use clear
    variable names, add concise comments for the "why" not the "what", and
    structure the code logically.
4.  **Assume Nothing, Clarify Everything:** If my request is ambiguous, do not
    guess. Ask clarifying questions before proceeding with the plan. State any
    assumptions you are forced to make.
5.  **Think About the Context:** Consider edge cases, basic error handling, and
    security implications (e.g., input sanitization). You don't need to build a
    fortress, but you should build a house with locks on the doors.
6.  **Fix the Root Cause:** When an issue arises, your primary objective is to
    find and fix the underlying root cause. Do not propose workarounds or
    patches that only hide the symptom.
7.  **Debug and Refine, Don't Replace:** If a piece of code is not working
    correctly, your first instinct must be to debug and fix the existing
    implementation. Guide me through the debugging process. Do not start over
    with a different or simpler version unless we both agree the current
    approach is fundamentally flawed.

---

## [WORKFLOW: FOLLOW THESE STEPS FOR EVERY REQUEST]

For every programming task I give you, you will follow this exact sequence of
steps in your response.

**Step 1: Acknowledge and Clarify**

-   Briefly restate my core objective to confirm your understanding.
-   If any part of the request is ambiguous or lacks detail, ask me specific
    questions to clarify. (e.g., "For the file processing, should I handle files
    in subdirectories as well?").

**Step 2: The Plan**

-   Provide a high-level, step-by-step plan written in plain English. This
    should be a bulleted or numbered list.
-   Example:
    1.  Define the main function to orchestrate the script.
    2.  Implement a function to read the input data from `data.csv`.
    3.  Implement a function to process each row, calculating the required
        metric.
    4.  Implement a function to write the results to `output.json`.
    5.  Add basic error handling for file I/O operations.

**Step 3: Assumptions**

-   List any assumptions you are making to fulfill the request.
-   Example:
    -   Assuming the input file is a standard UTF-8 encoded CSV.
    -   Assuming the script will be run from a directory that contains the input
        file.

**Step 4: The Code**

-   Generate the complete, clean, and well-commented code.
-   Use Markdown code blocks with the correct language identifier (e.g.,
    ```python).
-   The code must directly implement the plan from Step 2.

**Step 5: How to Use**

-   Provide clear, concise instructions on how to use the code.
-   **Dependencies:** List any libraries or tools that need to be installed.
    Provide the command to install them (e.g., `pip install pandas`). If no
    dependencies are needed, state "No external dependencies are required."
-   **Execution:** Show the exact command to run the script. (e.g.,
    `python process_data.py`).
-   **Input:** Explain what input the code expects (e.g., "Create a file named
    `data.csv` in the same directory with the following format...").

**Step 6: Next Steps & Improvements**

-   Briefly suggest potential improvements or next steps. This demonstrates
    foresight.
-   Example:
    -   "For a larger dataset, you could modify this to process the file in
        chunks to save memory."
    -   "You could add command-line arguments to specify the input and output
        file paths instead of hardcoding them."

---

# NIHON JOURNEY - JAPAN TRAVEL PLANNER PROJECT VISION

## 🇯🇵 PROJECT OVERVIEW
A minimalist, Japan-focused AI travel planning application that creates personalized itineraries for exploring different regions of Japan. Features beautiful step-by-step form design, cultural authenticity, and AI-powered recommendations tailored specifically for Japanese travel experiences.

## CORE FEATURES IMPLEMENTED

### 🎌 Japan Region Selection
- **6 Major Regions**: Kantō (Tokyo), Kansai (Kyoto/Osaka), Chūbu (Mt. Fuji), Tōhoku (Northern Japan), Kyūshū (Southern Islands), Hokkaidō (Snow Country)
- **Cultural Context**: Each region includes Japanese names, cultural descriptions, and prefecture details
- **Visual Design**: Beautiful emoji-based region cards with hover animations

### 🎨 Travel Style Personalization
- **6 Authentic Styles**: Traditional (伝統的), Modern (現代的), Nature (自然), Spiritual (精神的), Culinary (料理), Ryokan (旅館)
- **Cultural Authenticity**: Japanese naming and descriptions for each style
- **Icon-Based Selection**: Intuitive visual selection with smooth animations

### 🌸 Seasonal Planning
- **4 Seasons**: Spring (Cherry Blossoms), Summer (Festivals), Autumn (Fall Foliage), Winter (Snow & Hot Springs)
- **Seasonal Highlights**: Each season includes specific activities and cultural events
- **Weather Integration**: Season-appropriate activity recommendations

### 🎯 Minimalist Multi-Step Form
- **Progressive Disclosure**: Beautiful step-by-step form with progress indicators
- **Smooth Animations**: Framer Motion powered transitions between steps
- **Responsive Design**: Works perfectly on mobile and desktop

## 📅 ULTRA-DETAILED 12-WEEK DEVELOPMENT ROADMAP

### **PHASE 1: FOUNDATION ENHANCEMENT (4 weeks) - $0 additional cost**

#### **Week 1: Chat Interface & Mood System**
- **Day 1-2**: MoodSelector component with animations (16 hours)
  - Design mood selection UI with emoji reactions
  - Implement TravelMood interface and state management
  - Add smooth transitions and hover effects
- **Day 3-4**: Basic ChatInterface with message bubbles (16 hours)
  - Create ChatMessage components with typing animations
  - Implement conversation state management
  - Add smooth message delivery animations
- **Day 5**: Integration with existing OpenAI API (8 hours)
  - Enhance AI prompts for conversational planning
  - Add context persistence between messages

#### **Week 2: Timeline Foundation**
- **Day 1-3**: TimelineView component with drag-drop (24 hours)
  - Implement React DnD for activity reordering
  - Create visual timeline with day-by-day layout
  - Add smooth drag animations and drop zones
- **Day 4-5**: DayCard and ActivityCard components (16 hours)
  - Design interactive activity cards with hover states
  - Implement activity details and quick actions
  - Add conflict detection for time overlaps

#### **Week 3: AI Enhancement**
- **Day 1-2**: Enhanced AI prompts and context management (16 hours)
  - Develop conversational AI system with memory
  - Create natural language processing for trip requirements
  - Implement context-aware follow-up questions
- **Day 3-4**: Natural language processing improvements (16 hours)
  - Add intent recognition for travel requests
  - Implement entity extraction for destinations, dates, budgets
  - Create dynamic response generation
- **Day 5**: AI response formatting and interactive elements (8 hours)
  - Add rich message content with cards and quick replies
  - Implement suggestion carousels and interactive elements

#### **Week 4: Budget Intelligence**
- **Day 1-2**: BudgetVisualizer with real-time updates (16 hours)
  - Create animated budget breakdown charts
  - Implement real-time cost calculations
  - Add budget allocation suggestions
- **Day 3-4**: Budget optimization algorithms (16 hours)
  - Develop smart budget distribution logic
  - Add cost prediction and price alerts
  - Implement budget conflict warnings
- **Day 5**: Integration testing and polish (8 hours)
  - Test all Phase 1 components together
  - Fix bugs and optimize performance

### **PHASE 2: PERSONALIZATION ENGINE (4 weeks) - $200/month for enhanced APIs**

#### **Week 5: Travel DNA System**
- **Day 1-3**: UserProfile and TravelPersona models (24 hours)
  - Design comprehensive user preference system
  - Implement travel style classification
  - Create preference capture workflows
- **Day 4-5**: Preference capture and storage (16 hours)
  - Build preference onboarding flow
  - Implement localStorage with migration to database
  - Add preference export/import functionality

#### **Week 6: Learning Engine**
- **Day 1-3**: Basic ML recommendation system (24 hours)
  - Develop user behavior tracking
  - Implement preference scoring algorithms
  - Create recommendation confidence metrics
- **Day 4-5**: User interaction tracking (16 hours)
  - Track user choices and feedback
  - Implement learning from itinerary modifications
  - Add implicit preference detection

#### **Week 7: Smart Recommendations**
- **Day 1-2**: Weather API integration (16 hours)
  - Integrate OpenWeatherMap for destination forecasts
  - Add weather-aware activity suggestions
  - Implement seasonal optimization
- **Day 3-4**: Context-aware suggestion engine (16 hours)
  - Develop mood-based activity filtering
  - Add time-of-day optimization
  - Implement crowd level considerations
- **Day 5**: Mood-based filtering (8 hours)
  - Fine-tune recommendation algorithms
  - Add mood intensity scaling

#### **Week 8: Real-time Features**
- **Day 1-3**: WebSocket setup for live updates (24 hours)
  - Implement real-time collaboration infrastructure
  - Add live timeline synchronization
  - Create presence indicators for collaborative editing
- **Day 4-5**: Real-time pricing integration (16 hours)
  - Integrate multiple pricing APIs
  - Add price monitoring and alerts
  - Implement dynamic cost updates

### **PHASE 3: COLLABORATION & POLISH (4 weeks) - $50/month for additional storage**

#### **Week 9: Sharing System**
- **Day 1-2**: Trip sharing URL generation (16 hours)
  - Create shareable trip links
  - Implement access control and permissions
  - Add trip preview for shared links
- **Day 3-5**: Basic collaborative editing (24 hours)
  - Enable multi-user timeline editing
  - Add conflict resolution for simultaneous edits
  - Implement user presence and live cursors

#### **Week 10: Voting & Group Features**
- **Day 1-3**: Voting system for activities (24 hours)
  - Create voting interface for activity options
  - Implement voting tallies and results
  - Add voting deadline management
- **Day 4-5**: Group decision tracking (16 hours)
  - Track group preferences and compromises
  - Add decision history and rationale
  - Implement automated consensus detection

#### **Week 11: Mobile Optimization**
- **Day 1-3**: Responsive design improvements (24 hours)
  - Optimize timeline for mobile interactions
  - Improve chat interface for small screens
  - Add touch-friendly drag and drop
- **Day 4-5**: Touch interactions and gestures (16 hours)
  - Implement swipe navigation
  - Add pull-to-refresh functionality
  - Optimize for one-handed usage

#### **Week 12: Polish & Launch Preparation**
- **Day 1-2**: Performance optimization (16 hours)
  - Implement code splitting and lazy loading
  - Optimize bundle sizes and caching
  - Add progressive web app features
- **Day 3-4**: User testing and bug fixes (16 hours)
  - Conduct comprehensive testing
  - Fix identified bugs and edge cases
  - Optimize user flows based on feedback
- **Day 5**: Final deployment and monitoring setup (8 hours)
  - Deploy to production environment
  - Set up error monitoring and analytics
  - Create deployment documentation

## 💰 **DETAILED COST BREAKDOWN**

### **Development Investment**
- **Total Development Time**: 480 hours over 12 weeks (40 hours/week)
- **Monthly Operating Costs After Full Implementation**: $270
  - External APIs: $250/month
  - Infrastructure (Vercel Pro + Database): $20/month

### **Technology Stack Evolution**
- **Foundation**: Next.js 15, TypeScript, Tailwind CSS, Google Maps, OpenAI
- **Phase 1 Additions**: React DnD, Framer Motion, enhanced state management
- **Phase 2 Additions**: WebSocket support, ML libraries, weather APIs
- **Phase 3 Additions**: Real-time collaboration, mobile optimizations

## 🎯 **SUCCESS METRICS & MILESTONES**

### **Phase 1 Success Criteria**
- Conversational planning completes trip in <5 interactions
- Timeline drag-and-drop works smoothly on all devices
- Budget visualization updates in real-time
- 95%+ uptime with <2 second load times

### **Phase 2 Success Criteria**
- Personalization improves recommendations by 40%
- Weather integration influences 80%+ of outdoor activities
- Real-time updates sync across users in <500ms
- User preference accuracy reaches 85%

### **Phase 3 Success Criteria**
- Collaborative planning supports 5+ simultaneous users
- Mobile experience matches desktop functionality
- Group voting resolves 90%+ of decisions automatically
- Overall user satisfaction >4.5/5 stars

## 🚀 **IMMEDIATE NEXT STEPS (Start Tomorrow)**

### **Day 1 Implementation Plan**
1. **Morning (4 hours)**: Set up MoodSelector component structure
2. **Afternoon (4 hours)**: Design mood selection UI with Tailwind
3. **Evening (2 hours)**: Add basic state management for travel mood

### **Week 1 Deliverables**
- Working mood selector with 5+ travel moods
- Basic chat interface with AI integration
- Enhanced travel form with conversational elements
- Foundation for timeline component

This ultra-detailed roadmap provides hour-by-hour implementation guidance while maintaining the achievable 12-week timeline for an individual developer project.
