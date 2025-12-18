# Pages Explanation

## Difference Between /jobs and /bookings

### `/jobs` Page
- **Purpose**: Shows **Job** entities (actual work orders)
- **When Created**: Jobs are created when a booking is **scheduled** by admin
- **Status**: Uses `WorkflowStatus` (booked, routed, en-route, collected, warehouse, sanitised, graded, finalised)
- **Who Sees**: All roles see jobs relevant to them
- **Represents**: Active work in progress or completed work

### `/bookings` Page
- **Purpose**: Shows **Booking** entities (booking requests)
- **When Created**: Bookings are created by clients/resellers when they request asset collection
- **Status**: Uses `BookingLifecycleStatus` (created, scheduled, collected, sanitised, graded, completed) or 'cancelled'
- **Who Sees**: Clients see their own bookings, Resellers see their clients' bookings, Admin sees all
- **Represents**: Booking requests waiting to be scheduled or in progress

### Key Difference:
- **Booking** = Request for service (created by client/reseller)
- **Job** = Actual work order (created when admin schedules the booking)

---

## Client Status in /clients Page

The "pending" status in `/clients` refers to the **client organization's account status**, not a booking status.

### Client Statuses:
- **active**: Client account is active and can create bookings
- **inactive**: Client account is deactivated (cannot create bookings)
- **pending**: Client account is pending approval (new client waiting for admin approval)

This is separate from booking lifecycle statuses.

---

## User Management in Admin

### `/users` Page
- **Purpose**: Manage **individual user accounts** across the platform
- **Features**:
  - View all users (admin, client, reseller, driver)
  - See user profile info (name, email, role, tenant, last login)
  - Activate/deactivate users
  - Filter by role and status

### `/clients` Page
- **Purpose**: Manage **client organizations** (not individual users)
- **Features**:
  - View client organizations
  - See client statistics (bookings, jobs, value)
  - See client contact information
  - Filter by status (active, inactive, pending)

### Summary:
- **Users** = Individual people with accounts
- **Clients** = Organizations/companies that are clients

These are different entities serving different purposes.

