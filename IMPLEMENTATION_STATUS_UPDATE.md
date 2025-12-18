# Implementation Status Update

## Questions Answered

### 1. Difference Between /jobs and /bookings

**`/jobs` Page:**
- Shows **Job** entities (actual work orders)
- Created when admin schedules a booking
- Uses `WorkflowStatus` (booked, routed, en-route, collected, warehouse, sanitised, graded, finalised)
- Represents active work in progress or completed work

**`/bookings` Page:**
- Shows **Booking** entities (booking requests)
- Created by clients/resellers when requesting asset collection
- Uses `BookingLifecycleStatus` (created, scheduled, collected, sanitised, graded, completed)
- Represents booking requests waiting to be scheduled or in progress

**Key Difference:**
- **Booking** = Request for service (created by client/reseller)
- **Job** = Actual work order (created when admin schedules the booking)

See `PAGES_EXPLANATION.md` for detailed explanation.

---

### 2. "Pending" Status in /clients Page

The "pending" status in `/clients` refers to the **client organization's account status**, not a booking status.

**Client Statuses:**
- **active**: Client account is active and can create bookings
- **inactive**: Client account is deactivated (cannot create bookings)
- **pending**: Client account is pending approval (new client waiting for admin approval)

This is separate from booking lifecycle statuses.

---

### 3. User Management in Admin

**`/users` Page:**
- Manage **individual user accounts** across the platform
- View all users (admin, client, reseller, driver)
- See user profile info (name, email, role, tenant, last login)
- Activate/deactivate users
- Filter by role and status

**`/clients` Page:**
- Manage **client organizations** (not individual users)
- View client organizations
- See client statistics (bookings, jobs, value)
- See client contact information
- Filter by status (active, inactive, pending)

**Summary:**
- **Users** = Individual people with accounts
- **Clients** = Organizations/companies that are clients

These are different entities serving different purposes.

---

## Missing Features - Now Implemented

### ✅ Admin: Booking Queue (`/admin/bookings`)
- **Status**: ✅ IMPLEMENTED
- **Features**:
  - View bookings grouped by lifecycle status
  - Filter by status group
  - Search functionality
  - Quick "Assign Driver" button for created bookings
  - Link to assignment screen

### ✅ Admin: Assignment Screen (`/admin/assign`)
- **Status**: ✅ IMPLEMENTED
- **Features**:
  - Assign driver to booking
  - Select from available drivers
  - View booking details
  - Changes booking status from "created" to "scheduled"
  - Records assignment timestamp and admin user

### ✅ Booking Detail Page (`/bookings/:id`)
- **Status**: ✅ IMPLEMENTED
- **Features**:
  - View full booking details
  - See lifecycle status
  - View assigned driver (if scheduled)
  - View assets and summary
  - Link to related job (if exists)

### ✅ Updated BookingsHistory Page
- **Status**: ✅ UPDATED
- **Changes**:
  - Now uses lifecycle statuses (created, scheduled, collected, etc.)
  - Links to booking detail page instead of job page
  - Proper status badges using lifecycle colors

---

## Files Created/Modified

### New Files:
1. `frontend/src/pages/app/admin/BookingQueue.tsx` - Admin booking queue
2. `frontend/src/pages/app/admin/Assignment.tsx` - Driver assignment screen
3. `frontend/src/pages/app/BookingDetail.tsx` - Booking detail view
4. `frontend/PAGES_EXPLANATION.md` - Documentation

### Modified Files:
1. `frontend/src/pages/app/BookingsHistory.tsx` - Updated to use lifecycle statuses
2. `frontend/src/services/booking.service.ts` - Added `assignDriver()` method
3. `frontend/src/hooks/useBookings.ts` - Added `useAssignDriver()` hook
4. `frontend/src/App.tsx` - Added routes for new pages
5. `frontend/src/components/layout/AppSidebar.tsx` - Added "Booking Queue" navigation item

---

## Current Implementation Status

### ✅ Fully Implemented:
- Booking lifecycle enum and validation
- Admin booking queue by status
- Admin driver assignment screen
- Booking detail page
- Updated booking history to use lifecycle statuses

### ⏳ Still Pending (from original prompt):
- Admin: Sanitisation Reporting UI
- Admin: Grading UI
- Admin: Final Approval workflow
- Client: Booking Timeline View
- Client: Sanitisation Certificate Access
- Client: Asset Grading Report
- Client: Completed Booking Summary
- Driver: Enhanced status updates (accepted, arrived)
- Driver: Access restrictions (no post-collection access)

---

## How to Use Admin Assignment Feature

1. **Navigate to Booking Queue**: Click "Booking Queue" in sidebar (admin only)
2. **View Bookings**: See bookings grouped by status (Created, Scheduled, In Progress, etc.)
3. **Assign Driver**: 
   - Click "Assign Driver" button on a booking in "Created" status
   - OR click "Assign Driver" button in header to go to assignment screen
   - Select a driver from dropdown
   - Click "Assign & Schedule"
   - Booking status changes to "scheduled" and driver is assigned

---

## Summary

✅ **Fixed Issues:**
- Clarified difference between /jobs and /bookings
- Explained "pending" status in clients page
- Explained user vs client management
- Implemented missing admin assignment feature
- Created booking queue for admin
- Updated booking pages to use lifecycle statuses

⏳ **Remaining Work:**
- Sanitisation and grading UIs (admin)
- Client timeline and certificate views
- Driver status updates and access restrictions

All implemented features maintain Milestone 1 compliance (frontend-only, mock data).

