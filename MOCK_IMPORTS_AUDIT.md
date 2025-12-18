# Mock Imports Audit

## Confirmation: Deleting `mocks/` Directory

✅ **CONFIRMED**: Deleting the entire `mocks/` directory would **ONLY break services**, not any UI components.

## Direct Mock Imports Found

### Services Only (Expected)

The following files import directly from `@/mocks/mock-data`:

1. **`services/jobs.service.ts`**
   - Imports: `mockJobs`
   - Line: `import { mockJobs } from '@/mocks/mock-data';`

2. **`services/co2.service.ts`**
   - Imports: `assetCategories`
   - Line: `import { assetCategories } from '@/mocks/mock-data';`

3. **`services/booking.service.ts`**
   - Imports: `mockJobs`, `assetCategories`
   - Lines:
     - `import { mockJobs } from '@/mocks/mock-data';`
     - `import { assetCategories } from '@/mocks/mock-data';`

4. **`services/assets.service.ts`**
   - Imports: `assetCategories`
   - Line: `import { assetCategories } from '@/mocks/mock-data';`

### Services with Inline Mock Data (No Import)

These services define mock data inline (not imported from mocks directory):

5. **`services/auth.service.ts`**
   - Defines: `mockUsers`, `mockTenants`, `mockInvites` (inline arrays)
   - **No import from mocks directory**

6. **`services/site.service.ts`**
   - Defines: `mockSites` (inline array)
   - **No import from mocks directory**

## UI Components - No Direct Mock Imports ✅

**Verified**: No UI components or pages import from `@/mocks/mock-data`:

- ✅ `pages/app/Booking.tsx` - Uses `@/lib/constants` and hooks
- ✅ `pages/app/CO2eDashboard.tsx` - Uses `@/lib/constants` and hooks
- ✅ `pages/app/JobDetail.tsx` - Uses `@/lib/constants` and hooks
- ✅ `pages/app/Index.tsx` - Uses hooks only
- ✅ `pages/app/Jobs.tsx` - Uses hooks only
- ✅ `components/dashboard/CO2eOverview.tsx` - Uses `@/lib/constants` and hooks
- ✅ `components/dashboard/RecentJobsTable.tsx` - Uses `@/lib/constants` and hooks
- ✅ `components/jobs/JobStatusBadge.tsx` - Uses `@/lib/constants`

## Hooks - No Direct Mock Imports ✅

All hooks call services, not mocks directly:

- ✅ `hooks/useJobs.ts` - Calls `jobsService`
- ✅ `hooks/useAssets.ts` - Calls `assetsService`
- ✅ `hooks/useSites.ts` - Calls `siteService`
- ✅ `hooks/useCO2.ts` - Calls `co2Service`
- ✅ `hooks/useBooking.ts` - Calls `bookingService`

## Lib Files - No Direct Mock Imports ✅

- ✅ `lib/constants.ts` - Pure constants, no imports from mocks
- ✅ `lib/calculations.ts` - Pure functions, accepts data as parameters, no imports from mocks
- ✅ `lib/config.ts` - Configuration only, no imports from mocks

## Summary

| Category | Files Importing from Mocks | Status |
|----------|---------------------------|--------|
| **Services** | 4 files | ✅ Expected |
| **UI Components** | 0 files | ✅ Compliant |
| **Pages** | 0 files | ✅ Compliant |
| **Hooks** | 0 files | ✅ Compliant |
| **Lib** | 0 files | ✅ Compliant |

## Impact of Deleting `mocks/` Directory

### Would Break:
- ❌ `services/jobs.service.ts` (imports `mockJobs`)
- ❌ `services/co2.service.ts` (imports `assetCategories`)
- ❌ `services/booking.service.ts` (imports `mockJobs`, `assetCategories`)
- ❌ `services/assets.service.ts` (imports `assetCategories`)

### Would NOT Break:
- ✅ All UI components (pages/app/*)
- ✅ All UI components (components/**)
- ✅ All hooks (hooks/*)
- ✅ All lib files (lib/*)
- ✅ `services/auth.service.ts` (uses inline mock data)
- ✅ `services/site.service.ts` (uses inline mock data)

## Recommendation

✅ **Safe to delete `mocks/` directory** - Only services will break, which is expected behavior. UI components are fully isolated from mock data.

**Note**: If deleting for testing purposes, remember that:
- Services will fail to import mock data
- The app will not function without either:
  - Mock data in `mocks/` directory, OR
  - Real backend API implementation

