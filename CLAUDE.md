# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TravelMate** is a collaborative travel planning platform built as a full-stack monorepo. The project combines OAuth2/JWT authentication with comprehensive travel management features including itinerary planning, expense tracking with automatic settlement, photo albums, and real-time collaboration.

**Tech Stack:**
- **Backend**: Spring Boot 3.4.5 (Java 17), Spring Security, OAuth2, JWT, JPA/Hibernate, Redis, MySQL
- **Frontend**: Next.js 14 (App Router), TypeScript, React Context API, Tailwind CSS, shadcn/ui
- **Infrastructure**: Docker Compose, MinIO (S3 alternative), MailHog (SES alternative)
- **PWA Support**: Service Worker, manifest.json for mobile app installation

## Development Commands

### Backend (Spring Boot)

```bash
cd backend

# Build with Gradle
./gradlew build

# Run without Docker
./gradlew bootRun

# Run tests
./gradlew test

# Clean build
./gradlew clean build
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Docker Environment

```bash
# Start all services (MySQL, Redis, MailHog, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up -d --build spring-app
docker-compose up -d --build next-app

# Access MailHog UI (email testing)
# http://localhost:8025
```

### Environment Setup

1. Copy `.env.example` to `.env` in project root
2. Configure OAuth2 credentials (Google, Naver)
3. Set JWT_SECRET (minimum 256 bits)
4. Configure MinIO credentials for image storage

## Core Architecture

### Domain-Driven Design Pattern

The backend follows a layered architecture organized by domain entities:

```
backend/src/main/java/forproject/spring_oauth2_jwt/
├── entity/          # JPA entities (domain models)
├── dto/             # Data transfer objects (request/response)
├── repository/      # JPA repositories (data access)
├── service/         # Business logic
├── controller/      # REST API endpoints
├── config/          # Spring configuration (Security, JPA, Redis, OAuth2)
├── jwt/             # JWT token generation & validation
├── oauth2/          # OAuth2 success/failure handlers
├── exception/       # Custom exceptions & global handler
├── enums/           # Enum types (InvitationStatus, ExpenseCategory, etc.)
└── aspect/          # AOP logging and cross-cutting concerns
```

### Primary Domain Entities

**Travel Management:**
- `TravelPlanEntity`: Core trip entity (title, dates, background image, budget)
- `TravelParticipant`: Many-to-many join table for trip members
- `TravelInvitation`: Email-based invitation system with accept/reject

**Itinerary:**
- `TravelDayEntity`: Daily schedule container
- `TravelActivity`: Individual activities within a day (time, location, memo)

**Checklists:**
- `TravelChecklist`: Preparation items with `isShared` flag
  - `isShared=true`: Shared team checklist (used for progress calculation)
  - `isShared=false`: Personal checklist items

**Expense Tracking:**
- `SharedFund`: Group expenses (meals, transportation)
- `IndividualExpense`: Personal expenses with payer tracking
- `ExpenseParticipant`: Who participated in each expense
- `Settlement`: Automatic settlement calculations (who owes whom)
- Supports category-based statistics and budget tracking

**Photos:**
- `PhotoAlbum`: Album container with title
- `TravelPhoto`: Individual photos stored in MinIO

**Notifications:**
- `Notification`: Real-time notifications via SSE (Server-Sent Events)

### Authentication Flow

**OAuth2 + JWT Dual Token System:**

1. User initiates OAuth2 login (Google/Naver)
2. Backend exchanges OAuth2 code for user info
3. Issues two JWT tokens:
   - **Access Token**: Short-lived (stored in memory), sent in `Authorization: Bearer` header
   - **Refresh Token**: Long-lived (7 days), stored in HttpOnly cookie
4. Frontend auto-refreshes access token when expired
5. Logout clears tokens from Redis and client

**Key Files:**
- `backend/config/SecurityConfig.java`: Spring Security configuration
- `backend/jwt/JWTUtil.java`: Token generation/validation
- `frontend/lib/auth.ts`: Client-side auth utilities and auto-refresh logic
- `frontend/contexts/auth-context.tsx`: Global auth state management

### Frontend Architecture

**Next.js 14 App Router Structure:**

```
frontend/app/
├── layout.tsx              # Root layout with AuthProvider, PWA metadata
├── page.tsx                # Landing page
├── login/                  # Login page
├── signup/                 # Signup + email verification
├── dashboard/              # User dashboard (my trips)
├── trips/
│   ├── create/             # Create new trip
│   └── [id]/
│       └── page.tsx        # Main trip detail page (single-page app)
└── invitations/
    └── [token]/            # Accept/reject invitation
```

**Trip Detail Page Architecture:**

The trip detail page (`app/trips/[id]/page.tsx`) is a comprehensive single-page application with 7 tabs:

1. **개요 (Overview)**: Dashboard with trip summary, incomplete checklist preview (max 3), budget usage, recent albums
2. **일정 (Itinerary)**: Timeline-based schedule with day/activity management
3. **사진 (Photos)**: Album management with MinIO-stored images
4. **체크리스트 (Checklist)**: Two sections - shared team items + personal items
5. **경비 (Expenses)**: Shared funds, individual expenses, automatic settlement calculations, category statistics
6. **예약 (Reservations)**: Placeholder for reservation management (flights, accommodations, activities)
7. **멤버 (Members)**: Participant list + invitation dialog

**Responsive Navigation:**
- **Desktop**: Notion-style left sidebar with sticky positioning
- **Mobile**: Horizontal scrollable bottom navigation with all 7 tabs accessible
- PWA-enabled for mobile app installation

**State Management:**
- `contexts/auth-context.tsx`: User authentication state
- `contexts/notification-context.tsx`: Real-time notifications via SSE
- Component-level state with React hooks

**API Communication:**
- `lib/api.ts`: Axios instance with auto-refresh interceptor
- `lib/sse-service.ts`: Server-Sent Events for real-time notifications
- `lib/types.ts`: Comprehensive TypeScript type definitions matching backend DTOs

### Critical Data Flow Patterns

**Checklist Progress Calculation:**
- Overview tab shows progress based **only on shared checklists** (`isShared=true`)
- Repository method: `countByTripIdAndIsSharedTrue()` for total
- Repository method: `countCompletedSharedByTripId()` for completed
- **Do not mix shared and personal counts** - this causes >100% progress bugs

**Expense Settlement Logic:**
- Individual expenses track who paid (`paidBy` field)
- `SettlementService.calculateSettlement()` computes optimal debt resolution
- Settlement results stored in `Settlement` entity
- Frontend displays "who owes whom how much"

**Image Upload Flow:**
1. Frontend uploads to `/api/trips/{tripId}/photos/upload`
2. Backend saves to MinIO bucket `travel-images`
3. Returns public URL for frontend display
4. Photos associated with PhotoAlbum for organization

### Real-Time Features

**Server-Sent Events (SSE):**
- Endpoint: `/api/sse/subscribe`
- Notifications sent for: invitations, trip updates, expense changes
- Frontend auto-reconnects on connection loss
- Managed via `NotificationContext`

## Common Development Patterns

### Adding a New Domain Feature

1. **Entity**: Create JPA entity in `backend/entity/`
   - Use `@ManyToOne` for relationships to `TravelPlanEntity` or `User`
   - Add `@CreatedDate`, `@LastModifiedDate` for audit

2. **Repository**: Extend `JpaRepository` with custom query methods
   - Follow naming conventions: `findByTripIdAndUserId()`, `countCompletedByTripId()`

3. **DTO**: Create request/response DTOs in `backend/dto/`
   - Use `@Builder` pattern for immutability
   - Nest DTOs for complex responses

4. **Service**: Implement business logic in `backend/service/`
   - Inject repositories via constructor
   - Use `@Transactional` for write operations
   - Validate user permissions (check if user is trip participant)

5. **Controller**: Create REST endpoints in `backend/controller/`
   - Use `@AuthenticationPrincipal UserPrincipal` to get current user
   - Return `ResponseEntity<ApiResponse<T>>` for consistency
   - Add to `TravelPlanController` if trip-scoped (`/api/trips/{tripId}/...`)

6. **Frontend Types**: Add TypeScript types to `frontend/lib/types.ts`
   - Match DTO structure exactly

7. **Frontend API**: Add API function to `frontend/lib/api.ts`
   - Use existing axios instance for auto-authentication

8. **UI Integration**: Add to appropriate tab in `app/trips/[id]/page.tsx`

### Permission Checking Pattern

Always verify user is a trip participant before allowing operations:

```java
// In service layer
TravelPlanEntity trip = travelPlanRepository.findById(tripId)
    .orElseThrow(() -> new RuntimeException("여행을 찾을 수 없습니다."));

boolean isParticipant = travelParticipantRepository
    .existsByTravelPlanIdAndUserId(tripId, userId);

if (!isParticipant) {
    throw new RuntimeException("권한이 없습니다.");
}
```

### Handling isShared Flag

Many features have shared vs. personal variants (checklists, future features):
- Always provide `isShared` boolean in request
- Filter queries by `isShared` when calculating team-wide metrics
- Display shared items separately from personal items in UI

## Database Schema Notes

- **Cascade behavior**: Most entities cascade on trip deletion
- **Soft deletes**: Not implemented - entities are hard-deleted
- **Date handling**: Use `LocalDate`, `LocalDateTime` (NOT `java.util.Date`)
- **Monetary values**: Use `Long` (not `BigDecimal`) for amounts in Korean Won (원)
- **Enums**: Stored as `@Enumerated(EnumType.STRING)` for readability

## Frontend Styling Conventions

- **Tailwind CSS**: Utility-first approach with custom config
- **shadcn/ui**: Radix UI components with Tailwind styling
- **Color scheme**: Blue (#3b82f6) to Orange (#f97316) gradient for brand
- **Responsive breakpoints**: `lg:` for desktop sidebar (1024px+)
- **Icons**: Lucide React icon library
- **Safe areas**: Use `safe-area-inset-bottom` for PWA mobile compatibility

## Testing

### Backend Testing Approach
- Unit tests for service layer (business logic)
- Integration tests for repository (database queries)
- No controller tests currently (add as needed)

### Frontend Testing
- No automated tests currently
- Manual testing via browser
- Use MailHog UI (localhost:8025) to verify email functionality

## Deployment Considerations

This project uses Docker Compose for local development. For production:
- Replace MySQL with AWS RDS
- Replace Redis with AWS ElastiCache
- Replace MinIO with AWS S3
- Replace MailHog with AWS SES
- Use AWS Secrets Manager for JWT_SECRET and OAuth credentials
- Set `SPRING_PROFILES_ACTIVE=prod`
- Build Next.js with `npm run build` (not development mode)

## Known Quirks & Important Notes

1. **Checklist Progress Bug Prevention**: Always count shared checklists only for trip-wide progress metrics
2. **Token Refresh**: Frontend auto-refreshes tokens before expiration - do not manually call refresh in components
3. **SSE Connection**: Notifications require persistent SSE connection - handle reconnection in `NotificationContext`
4. **MinIO Access**: Images must be in public bucket or use signed URLs
5. **OAuth Redirect URIs**: Must match exactly in `.env` and OAuth provider console
6. **Settlement Calculations**: Are computed on-demand, not cached - may add caching later
7. **PWA Installation**: Requires HTTPS in production (localhost works for dev)
8. **Responsive Navigation**: Mobile bottom nav uses horizontal scroll - ensure `scrollbar-hide` class is applied
9. **Date Ranges**: Trip dates are inclusive (start and end dates both included)
10. **Participant Removal**: Removing a participant does NOT delete their expenses/photos - cascade carefully

## Project Context & Goals

This project demonstrates modern full-stack development with:
- Enterprise authentication patterns (OAuth2 + JWT dual token)
- Real-time collaboration features (SSE notifications)
- Complex domain modeling (trips, expenses, settlements)
- Mobile-first PWA design
- Docker-based development workflow

The core value proposition is: **여행준비단계 + 여행중 정산 + 여행후 추억 보관 + 다른사람에게 편리하게 공유** (Preparation → During Trip → After Trip → Easy Sharing).
