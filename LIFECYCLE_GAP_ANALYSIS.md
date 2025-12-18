# Booking Lifecycle Gap Analysis

## PHASE 1: Current State vs Required Lifecycle

### Required Lifecycle (Authoritative)
```
CREATED → SCHEDULED → COLLECTED → SANITISED → GRADED → COMPLETED
```

### Current Implementation

#### Booking Statuses (Current)
- `pending` - Initial state
- `confirmed` - After admin confirmation
- `scheduled` - When scheduled
- `completed` - Final state
- `cancelled` - Cancelled state

**Gap**: Missing `CREATED` state, using different terminology

#### Job Statuses (Current)
- `booked` - Initial job state
- `routed` - Assigned to driver
- `en-route` - Driver en route
- `collected` - Collected by driver
- `warehouse` - At warehouse
- `sanitised` - Sanitised
- `graded` - Graded
- `finalised` - Final state

**Gap**: Statuses don't align with required lifecycle. Missing clear separation between booking and job.

---

## PHASE 2: Role-Specific Gaps

### ADMIN Role - Missing Features

#### ❌ Booking Queue by Status
- **Current**: Can see bookings but no dedicated queue view
- **Required**: View bookings grouped by lifecycle status (CREATED, SCHEDULED, etc.)
- **Priority**: HIGH

#### ❌ Assignment Screen
- **Current**: No dedicated screen for assigning drivers/resellers
- **Required**: 
  - Assign driver to scheduled booking
  - Assign reseller to client bookings
  - View assignment history
- **Priority**: HIGH

#### ❌ Sanitisation Reporting UI
- **Current**: No sanitisation management interface
- **Required**:
  - Record sanitisation method per asset
  - Record timestamp
  - Generate certificate ID
  - View sanitisation history
- **Priority**: HIGH

#### ❌ Grading UI
- **Current**: Assets have grade field but no dedicated grading interface
- **Required**:
  - Per-asset grade assignment (A, B, C, D, Recycled)
  - Resale value calculation
  - Bulk grading operations
  - Grade history
- **Priority**: HIGH

#### ❌ Final Approval & Completion
- **Current**: Jobs can be "finalised" but no approval workflow
- **Required**:
  - Review completed grading
  - Approve completion
  - Generate final reports
- **Priority**: MEDIUM

---

### CLIENT Role - Missing Features

#### ❌ Booking Timeline View
- **Current**: Can see booking status but no timeline visualization
- **Required**:
  - Visual timeline showing lifecycle progress
  - Status change history
  - Estimated completion dates
- **Priority**: HIGH

#### ❌ Sanitisation Certificate Access
- **Current**: Certificates exist but no dedicated access point
- **Required**:
  - View sanitisation certificates
  - Download certificates
  - Certificate verification
- **Priority**: HIGH

#### ❌ Asset Grading Report
- **Current**: Can see job details but no dedicated grading report
- **Required**:
  - View per-asset grades
  - See resale values
  - Download grading report
- **Priority**: HIGH

#### ❌ Completed Booking Summary
- **Current**: Can see finalised jobs but no summary view
- **Required**:
  - Final asset count and grades
  - Total resale value
  - CO₂e impact summary
  - Certificate links
- **Priority**: MEDIUM

---

### RESELLER Role - Missing Features

#### ✅ Client Management
- **Status**: IMPLEMENTED
- **Note**: Already exists

#### ✅ Booking Creation for Clients
- **Status**: IMPLEMENTED
- **Note**: Already exists

#### ✅ Booking Tracking
- **Status**: IMPLEMENTED
- **Note**: Already exists

#### ❌ Commission & Resale Value View
- **Current**: Commission view exists but may need enhancement
- **Required**: 
  - See resale values for client bookings
  - Commission calculation based on resale
- **Priority**: MEDIUM

---

### DRIVER Role - Missing Features

#### ❌ Status Updates (Accepted, Arrived, Collected)
- **Current**: Can update to "collected" but missing intermediate states
- **Required**:
  - Accept job assignment
  - Mark as "arrived" at site
  - Mark as "collected"
  - No access beyond collection
- **Priority**: HIGH

#### ❌ Assigned Jobs List
- **Current**: Can see assigned jobs
- **Status**: PARTIALLY IMPLEMENTED
- **Note**: May need enhancement for better filtering

#### ✅ Job Detail View
- **Status**: IMPLEMENTED
- **Note**: Driver View exists

#### ⚠️ Post-Collection Access
- **Current**: Driver can see jobs after collection
- **Required**: NO access beyond collection state
- **Priority**: HIGH (Security/Compliance)

---

## PHASE 3: Architecture Gaps

### 1. Booking Lifecycle Enum
- **Missing**: Centralized booking lifecycle status enum
- **Required**: `CREATED | SCHEDULED | COLLECTED | SANITISED | GRADED | COMPLETED`
- **Impact**: All booking-related UI should use this enum

### 2. Booking-to-Job Mapping
- **Current**: Bookings and Jobs are separate entities
- **Gap**: No clear mapping or transition logic
- **Required**: Clear relationship showing when booking becomes job

### 3. Status Transition Validation
- **Current**: Some validation exists but not comprehensive
- **Required**: 
  - Prevent invalid transitions
  - Role-based transition permissions
  - Audit trail of transitions

### 4. Sanitisation Data Model
- **Missing**: Dedicated sanitisation record structure
- **Required**:
  - Method (Blancco, physical destruction, etc.)
  - Timestamp
  - Certificate ID
  - Per-asset sanitisation status

### 5. Grading Data Model
- **Current**: Grade exists on Asset but no dedicated grading record
- **Required**:
  - Grading timestamp
  - Graded by (admin user)
  - Resale value per asset
  - Grading notes

---

## PHASE 4: UI Flow Gaps

### Booking Creation Flow
- **Current**: ✅ Implemented
- **Status**: OK

### Booking to Job Transition
- **Current**: ❌ Not clearly modeled
- **Required**: Admin screens to convert booking to job

### Collection Flow
- **Current**: ⚠️ Partially implemented
- **Gap**: Missing "accepted" and "arrived" states
- **Required**: Full driver workflow

### Sanitisation Flow
- **Current**: ❌ Not implemented
- **Required**: Admin-only sanitisation interface

### Grading Flow
- **Current**: ⚠️ Partially implemented (grade field exists)
- **Gap**: No dedicated grading UI
- **Required**: Admin-only grading interface

### Completion Flow
- **Current**: ⚠️ Jobs can be finalised
- **Gap**: No approval workflow
- **Required**: Admin approval before completion

---

## Summary of Critical Gaps

### HIGH Priority
1. ✅ Booking lifecycle status enum (CREATED → SCHEDULED → COLLECTED → SANITISED → GRADED → COMPLETED)
2. ✅ Admin: Booking queue by status
3. ✅ Admin: Assignment screen (driver/reseller)
4. ✅ Admin: Sanitisation reporting UI
5. ✅ Admin: Grading UI
6. ✅ Client: Booking timeline view
7. ✅ Client: Sanitisation certificate access
8. ✅ Client: Asset grading report
9. ✅ Driver: Status updates (accepted, arrived, collected)
10. ✅ Driver: No post-collection access

### MEDIUM Priority
1. Admin: Final approval workflow
2. Client: Completed booking summary
3. Reseller: Enhanced commission view

### Architecture Changes Required
1. New booking lifecycle enum
2. Sanitisation data model
3. Enhanced grading data model
4. Status transition validation
5. Role-based access control for lifecycle states

---

## Next Steps

1. Create booking lifecycle enum
2. Update booking status to use lifecycle enum
3. Create admin screens for assignment, sanitisation, grading
4. Create client screens for timeline, certificates, grading report
5. Enhance driver workflow with accepted/arrived states
6. Restrict driver access to collection-only
7. Add status transition validation
8. Update mock data to reflect lifecycle

