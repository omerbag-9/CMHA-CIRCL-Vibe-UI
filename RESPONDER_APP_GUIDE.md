# Responder Mobile Application Guide

## Overview
The Responder Mobile Application is a mobile-first interface designed for crisis responders to manage their assigned cases in the field. The interface is displayed in a mobile phone frame for desktop viewing.

## Features

### 1. Mobile Phone Frame UI
- iPhone-style frame (375px width)
- Responsive design for actual mobile devices
- Bottom navigation bar
- Clean, modern interface

### 2. Dashboard
**URL:** `pages/responder/dashboard.html`

**Features:**
- Statistics cards showing: Active Cases (X/3), Pending Requests, Completed Today
- Status selector (Available, Busy, Offline)
- Three sections:
  - **New Requests**: Cases assigned by dispatcher (not yet accepted)
  - **Active Cases**: Cases accepted by responder (max 3)
  - **Completed Today**: Cases closed by responder today

**Actions:**
- Accept case (checks 3-case limit, priority for emergencies)
- Decline case (with optional reason)
- View case details

### 3. Case Detail Page
**URL:** `pages/responder/case-detail.html?id=CASE_ID`

**Information Displayed:**
- Person in crisis details (name, phone, location)
- Crisis type and urgency
- Assessment questions and answers
- Dispatcher notes
- Case timeline
- Case notes

**Action Buttons** (based on status):
- **Assigned**: "Accept Case" button
- **Accepted**: "Arrived on Site" button
- **On Site**: "Close Case" button

### 4. My Cases Page
**URL:** `pages/responder/cases.html`

**Features:**
- Filter tabs: All, Active, Pending, Completed
- Case cards with status badges
- Quick navigation to case details
- Google Maps integration for navigation

### 5. Case Workflow

#### Step 1: Case Assignment
- Dispatcher assigns case to responder
- Status: `assigned_to_responder`
- Appears in "New Requests" section

#### Step 2: Accept Case
- Responder clicks "Accept" on dashboard or case detail
- System checks 3-case limit
- Status changes to: `accepted_by_responder`
- Moves to "Active Cases" section
- If responder has 3+ cases, status changes to "Busy"

#### Step 3: Arrive on Site
- Responder clicks "Arrived on Site" button
- Status changes to: `on_site`
- Timestamp recorded for time tracking

#### Step 4: Close Case
- Responder clicks "Close Case" button
- Modal opens with form:
  - **Outcome**: Resolved, Referred to Services, Escalated to Hospital, Other
  - **Notes**: Detailed description (required, min 10 characters)
  - **Time on Site**: Auto-calculated from arrival time
- On submit:
  - Status changes to: `responder_closed`
  - Notes added to case
  - **48-hour follow-up automatically scheduled**
  - Responder status updated (Available if no more active cases)
  - Redirects to dashboard

### 6. Case Limits
- Maximum 3 active cases at a time
- Emergency cases have priority in sorting
- Cannot accept more cases if at limit
- Declining a case returns it to unassigned pool

### 7. New Case Statuses
- `assigned_to_responder` - Assigned by dispatcher
- `accepted_by_responder` - Accepted by responder
- `on_site` - Responder arrived at location
- `responder_closed` - Closed by responder (48h follow-up auto-scheduled)
- `follow_up_scheduled` - Follow-up scheduled
- `closed` - Fully closed after follow-up

## Technical Implementation

### Files Created
1. `css/mobile-frame.css` - Mobile phone frame and mobile-specific styles
2. `pages/responder/case-detail.html` - Case detail page with mobile layout
3. `pages/responder/cases.html` - My cases list page
4. `pages/responder/chat.html` - Messages page (placeholder)
5. `js/pages/responder-dashboard.js` - Dashboard logic
6. `js/pages/responder-case-detail.js` - Case detail logic
7. `js/pages/responder-cases.js` - Cases list logic

### Files Modified
1. `js/utils.js` - Added new status badges and text
2. `js/data.js` - Added responder functions:
   - `acceptCase(caseId, responderId)`
   - `declineCase(caseId, responderId, reason)`
   - `arriveOnSite(caseId, responderId)`
   - `closeCaseByResponder(caseId, outcome, notes, responderId)`
   - `getResponderActiveCases(responderId)`
   - `getResponderAcceptedCases(responderId)`
   - `updateUser(userId, updates)`
3. `js/dummy-data.js` - Added cases in various responder statuses for testing
4. `pages/responder/dashboard.html` - Redesigned with mobile frame

## Testing

### Login as Responder
- Email: `responder@crcl.ca`
- Password: `responder123`

### Test Workflow
1. Login as responder
2. View dashboard with pending requests and active cases
3. Accept a case from "New Requests"
4. View case details
5. Click "Arrived on Site"
6. Click "Close Case"
7. Fill outcome and notes
8. Submit - case closes and 48h follow-up is auto-scheduled
9. Return to dashboard - see updated statistics

### Dummy Data
The system generates:
- 2 pending requests (1 emergency)
- 1 accepted case
- 1 on-site case
- 2 completed cases (closed today)

All assigned to "Sarah Responder" (ID: 2) for testing.

## Notes
- The mobile frame is visible on desktop for demonstration
- On actual mobile devices, the frame disappears and uses full screen
- Emergency cases are highlighted with red badges
- Google Maps integration for navigation to case location
- Automatic follow-up scheduling ensures continuity of care

