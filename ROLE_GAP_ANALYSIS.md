# Role & Feature Gap Analysis

## PHASE 1: Current State Analysis

### ADMIN Role

#### ✅ Currently Supported:
- Dashboard with global overview (all jobs visible)
- Job list and detail views (all jobs)
- Booking creation (can create for any client)
- CO₂e Dashboard access
- Documents access
- Settings (organisation, branding, user management, security)
- Driver View access (oversight)

#### ❌ Missing Features:
- **User Management UI**: No dedicated page to view/manage users
- **Client Management**: No view to see all clients and their status
- **Reseller Management**: No view to manage resellers and their clients
- **Booking Visibility**: Can see all bookings but no dedicated admin booking view
- **Analytics/Reports**: No admin-specific analytics dashboard
- **System Settings**: No platform-wide settings page

#### ⚠️ UI/Navigation Issues:
- Settings page has user management but no dedicated users page
- No clear separation between admin operations and regular operations

---

### CLIENT Role

#### ✅ Currently Supported:
- Dashboard (tenant-scoped stats)
- Job list and detail views (own jobs only)
- Booking creation flow (3-step wizard)
- CO₂e Dashboard access
- Documents access (own jobs)
- Settings (organisation details, notifications, integrations)

#### ❌ Missing Features:
- **Booking History**: No view to see past bookings and their status
- **Invoice/Billing View**: No invoices or billing information
- **Site Management**: Can select sites in booking but no dedicated site management page
- **Booking Status Tracking**: No dedicated tracking page for active bookings
- **Reports**: No client-specific reports

#### ⚠️ UI/Navigation Issues:
- Booking flow exists but no way to view booking history
- No clear way to track booking status after creation

---

### RESELLER Role

#### ✅ Currently Supported:
- Dashboard (reseller tenant-scoped)
- Job list and detail views (own client jobs)
- Booking creation (can create bookings)
- CO₂e Dashboard access
- Documents access
- Settings (organisation, branding, notifications, integrations)

#### ❌ Missing Features:
- **Client Management**: No page to view/manage own clients
- **Booking on Behalf of Clients**: Can create bookings but no clear client selection in booking flow
- **Commission/Earnings View**: No view to see commission or earnings
- **Client Performance**: No analytics for client bookings
- **Booking History**: No view of all bookings made for clients

#### ⚠️ UI/Navigation Issues:
- Booking flow doesn't clearly indicate creating for a client
- No distinction between reseller's own bookings vs client bookings
- Settings mentions "client settings" but no actual client management

---

### DRIVER Role

#### ✅ Currently Supported:
- Dashboard (assigned jobs only, simplified stats)
- Job list (assigned jobs, non-finalised only)
- Driver View page (evidence capture)
- Settings (profile only)

#### ❌ Missing Features:
- **Job Status Updates**: Can view jobs but no way to update status (en-route → collected, etc.)
- **Route Planning**: No view of assigned routes or schedule
- **Job History**: No view of completed jobs
- **Profile Management**: Basic profile in settings but no vehicle info, availability, etc.

#### ⚠️ UI/Navigation Issues:
- Driver View allows evidence capture but no status progression
- No clear workflow for driver to mark job as "collected" or "warehouse"

---

## PHASE 2: Architecture Gaps

### 1. Role Definitions & Permissions
- ❌ No centralized permission system
- ❌ Role checks scattered throughout codebase
- ❌ No permission constants or utilities

### 2. Navigation & Routing
- ❌ Missing routes for:
  - `/users` (admin)
  - `/clients` (admin, reseller)
  - `/bookings` (client, reseller)
  - `/invoices` (client)
  - `/commission` (reseller)
  - `/history` (driver)

### 3. Services & Contracts
- ❌ Missing services:
  - `users.service.ts` (user management)
  - `clients.service.ts` (client management for resellers)
  - `bookings.service.ts` (booking history, status)
  - `invoices.service.ts` (billing)
  - `commission.service.ts` (reseller earnings)

### 4. Mock Data
- ❌ Missing mock data for:
  - Users (for admin user management)
  - Clients (for reseller client management)
  - Bookings (separate from jobs)
  - Invoices
  - Commission records

---

## PHASE 3: Feature Requirements by Role

### ADMIN - Required Features

1. **User Management Page** (`/users`)
   - List all users across all tenants
   - Filter by role, tenant
   - View user details
   - Invite new users
   - Deactivate users (mock action)

2. **Client Management** (`/clients`)
   - List all clients
   - View client details
   - See client booking history
   - Client status/health

3. **Reseller Management** (`/resellers`)
   - List all resellers
   - View reseller clients
   - Reseller performance

4. **Booking Overview** (`/bookings`)
   - All bookings across system
   - Filter by status, client, reseller
   - Booking details

### CLIENT - Required Features

1. **Booking History** (`/bookings`)
   - List all own bookings
   - Filter by status
   - View booking details
   - Track booking status

2. **Invoices** (`/invoices`)
   - List invoices
   - Download invoices
   - Payment status

3. **Site Management** (`/sites`)
   - List saved sites
   - Add/edit sites
   - Set default site

### RESELLER - Required Features

1. **Client Management** (`/clients`)
   - List own clients
   - View client details
   - Client booking history
   - Add new clients (mock)

2. **Booking Management** (`/bookings`)
   - All bookings for own clients
   - Create booking for client
   - Track booking status

3. **Commission/Earnings** (`/commission`)
   - Commission overview
   - Earnings by period
   - Commission per booking

### DRIVER - Required Features

1. **Job Status Updates**
   - Update job status (en-route → collected → warehouse)
   - Status change in Driver View or Job Detail

2. **Job History** (`/history`)
   - Completed jobs
   - Past work history

3. **Route/Schedule View**
   - Today's assigned jobs
   - Route optimization (mock)

---

## Summary of Gaps

### Critical Missing Features:
1. User Management UI (Admin)
2. Client Management (Admin, Reseller)
3. Booking History/Tracking (Client, Reseller)
4. Invoices (Client)
5. Commission View (Reseller)
6. Job Status Updates (Driver)
7. Job History (Driver)

### Architecture Improvements Needed:
1. Centralized permission system
2. Additional services for missing features
3. Mock data for new entities
4. New routes and pages
5. Enhanced navigation

### UI Adjustments Needed:
1. Add new navigation items per role
2. Create new pages for missing features
3. Enhance existing pages with missing functionality
4. Add empty states and loading states

