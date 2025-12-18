# API Services Documentation

All API services in this project are mocked and include comprehensive error simulation capabilities for testing and development.

## Services Overview

- **`jobs.service.ts`** - Job management (CRUD operations, filtering, stats)
- **`auth.service.ts`** - Authentication (login, signup, invites)
- **`booking.service.ts`** - Booking creation and retrieval
- **`co2.service.ts`** - CO₂e calculations
- **`site.service.ts`** - Site management (CRUD operations)
- **`assets.service.ts`** - Asset category management

## Error Simulation

All services support configurable error simulation for testing error handling in the UI.

### How to Enable Error Simulation

Error simulation is controlled via `localStorage`. To enable error simulation for a service:

```javascript
// Enable error simulation for jobs service
localStorage.setItem('error_sim_jobs', JSON.stringify({
  enabled: true,
  errorRate: 0.3, // 30% chance of error
  errorType: 'NETWORK_ERROR', // Optional: specific error type
  delay: 1000 // Optional: additional delay before error (ms)
}));
```

### Error Types

Available error types (from `ApiErrorType` enum):

- `NETWORK_ERROR` - Network connection issues (status: 0)
- `VALIDATION_ERROR` - Invalid input data (status: 400)
- `NOT_FOUND` - Resource not found (status: 404)
- `UNAUTHORIZED` - Authentication required (status: 401)
- `FORBIDDEN` - Permission denied (status: 403)
- `RATE_LIMIT` - Too many requests (status: 429)
- `SERVER_ERROR` - Server error (status: 500)
- `TIMEOUT` - Request timeout (status: 408)
- `BAD_REQUEST` - Invalid request (status: 400)

### Example: Testing Different Error Scenarios

```javascript
// Test network errors (30% chance)
localStorage.setItem('error_sim_jobs', JSON.stringify({
  enabled: true,
  errorRate: 0.3,
  errorType: 'NETWORK_ERROR'
}));

// Test validation errors (50% chance)
localStorage.setItem('error_sim_booking', JSON.stringify({
  enabled: true,
  errorRate: 0.5,
  errorType: 'VALIDATION_ERROR'
}));

// Test not found errors (100% chance)
localStorage.setItem('error_sim_jobs', JSON.stringify({
  enabled: true,
  errorRate: 1.0,
  errorType: 'NOT_FOUND'
}));

// Disable error simulation
localStorage.removeItem('error_sim_jobs');
```

### Service Names

Use these service names when configuring error simulation:

- `jobs` - Jobs service
- `auth` - Auth service
- `booking` - Booking service
- `co2` - CO₂ service
- `site` - Site service
- `assets` - Assets service

## Error Handling

All services throw `ApiError` instances with:
- `type` - Error type (ApiErrorType enum)
- `message` - Human-readable error message
- `statusCode` - HTTP status code (0 for network errors)
- `details` - Additional error details (optional)

### Example Error Handling in Components

```typescript
import { ApiError, ApiErrorType } from '@/services/api-error';

try {
  const jobs = await jobsService.getJobs();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.type === ApiErrorType.NETWORK_ERROR) {
      // Handle network error
    } else if (error.type === ApiErrorType.NOT_FOUND) {
      // Handle not found
    }
    // Show error message to user
    toast.error(error.message);
  }
}
```

## Service Features

### Jobs Service

- `getJobs(filter?, user?)` - Get filtered list of jobs
- `getJob(id)` - Get single job by ID
- `getDashboardStats(user?)` - Get dashboard statistics
- `updateJobStatus(jobId, status)` - Update job status (with validation)
- `updateJobEvidence(jobId, evidence)` - Update job evidence

**Validation:**
- Status transitions are validated
- Evidence photos limited to 10 per job

### Auth Service

- `login(credentials)` - Authenticate user
- `signup(data)` - Create new account
- `acceptInvite(inviteData)` - Accept invitation
- `getInvite(token)` - Get invite details
- `getCurrentAuth()` - Get current authentication state
- `logout()` - Log out user

**Validation:**
- Email format validation
- Password strength (min 8 characters)
- Duplicate email checking
- Invite expiration checking

### Booking Service

- `createBooking(request)` - Create new booking
- `getBooking(id)` - Get booking by ID

**Validation:**
- Required fields: siteName, address, postcode, scheduledDate
- Scheduled date must be in the future
- At least one asset required
- Asset quantities must be > 0
- Charity percent must be 0-100
- Asset categories must exist

### CO₂ Service

- `calculateCO2e(request)` - Calculate CO₂e impact
- `getJobCO2e(jobId)` - Get CO₂e data for a job

**Validation:**
- At least one asset required
- Asset quantities must be > 0
- Distance must be positive
- Vehicle type must be valid (car, van, truck)

### Site Service

- `getSites()` - Get all sites
- `getSite(id)` - Get site by ID
- `searchSites(query)` - Search sites
- `createSite(site)` - Create new site

**Validation:**
- Required fields: name, address, postcode, city
- UK postcode format validation
- Duplicate site checking (by name + postcode)
- Search query must be at least 2 characters

### Assets Service

- `getAssetCategories()` - Get all asset categories
- `getAssetCategory(id)` - Get category by ID

**Note:** Asset categories are static data, so errors are less common.

## Loading Delays

All services simulate realistic API delays:

- Fast operations: 200-500ms (get single item, calculations)
- Standard operations: 500-800ms (get list, search)
- Slow operations: 1000-1500ms (create, update, complex operations)

## Best Practices

1. **Always use services through hooks** - Don't call services directly in components
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Use loading states** - React Query provides `isLoading` and `isError` states
4. **Validate on client side** - Services validate input, but UI should also validate
5. **Test error scenarios** - Use error simulation to test error handling

## Migration to Real API

When migrating to a real API:

1. Replace mock data with actual API calls
2. Update error handling to match API error format
3. Remove error simulation code (or make it optional)
4. Update authentication to use real tokens
5. Add request/response interceptors for common logic

