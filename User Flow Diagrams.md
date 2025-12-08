# CRCL User Flow Diagrams
## Complete User Journey Maps

---

## 1. Dispatcher - Case Intake Flow

```
START: Dispatcher logs in
  │
  ├─→ Dashboard (Active Cases)
  │
  ├─→ New Case Request Received
  │     │
  │     ├─→ Phone Call
  │     ├─→ SMS Message
  │     ├─→ Web Form Submission
  │     └─→ WhatsApp (Optional)
  │
  ├─→ Create New Case
  │     │
  │     ├─→ Enter Caller Information
  │     │     • Name
  │     │     • Phone
  │     │     • Location
  │     │
  │     ├─→ Select Crisis Type
  │     │     • Routine
  │     │     • Urgent
  │     │     • Emergency
  │     │     • Sensitive
  │     │
  │     ├─→ Dynamic Questions Appear
  │     │     (Based on crisis type)
  │     │
  │     └─→ Initial Assessment
  │
  ├─→ Assessment Decision Point
  │     │
  │     ├─→ [Immediate Danger?]
  │     │     │
  │     │     YES → Escalate to Emergency Services
  │     │             │
  │     │             └─→ Case Status: "Emergency Escalated"
  │     │
  │     └─→ NO → Continue Assessment
  │               │
  │               ├─→ [Mobile Team Needed?]
  │               │     │
  │               │     YES → Assign to Responder
  │               │             │
  │               │             └─→ Case Status: "Assigned to Responder"
  │               │
  │               └─→ NO → Schedule Follow-up
  │                         │
  │                         └─→ Case Status: "Follow-up Scheduled"
  │
  └─→ Case Saved & Dashboard Updated
```

---

## 2. Dispatcher - Case Management Flow

```
START: View Case List
  │
  ├─→ Filter Cases
  │     • Status (Active, Pending, Closed)
  │     • Urgency (Normal, Urgent, Emergency)
  │     • Date Range
  │     • Region
  │
  ├─→ Select Case
  │     │
  │     ├─→ View Case Details
  │     │     • Caller Information
  │     │     • Timeline
  │     │     • Notes
  │     │     • Status History
  │     │
  │     ├─→ Available Actions
  │     │     │
  │     │     ├─→ Assign Responder
  │     │     │     │
  │     │     │     ├─→ View Available Responders
  │     │     │     │     • Sorted by distance
  │     │     │     │     • GPS locations on map
  │     │     │     │
  │     │     │     ├─→ Select Responder
  │     │     │     │
  │     │     │     └─→ Notification Sent to Responder
  │     │     │
  │     │     ├─→ Schedule Follow-up
  │     │     │     │
  │     │     │     ├─→ Select Time (24h or 48h)
  │     │     │     │
  │     │     │     └─→ Reminder Set
  │     │     │
  │     │     ├─→ Escalate to Emergency
  │     │     │     │
  │     │     │     └─→ Emergency Services Contacted
  │     │     │
  │     │     ├─→ Add Case Note
  │     │     │     │
  │     │     │     └─→ Note Saved with Timestamp
  │     │     │
  │     │     ├─→ Update Case Status
  │     │     │
  │     │     └─→ Close Case
  │     │           │
  │     │           └─→ Case Status: "Closed"
  │     │
  │     └─→ Communication
  │           • Call Person in Crisis
  │           • Send SMS
  │           • In-app Chat
  │
  └─→ Return to Dashboard
```

---

## 3. Dispatcher - Follow-up Flow

```
START: Follow-up Due Notification
  │
  ├─→ View Follow-up List
  │     • Today's Follow-ups
  │     • Overdue Follow-ups
  │     • Upcoming Follow-ups
  │
  ├─→ Select Follow-up Case
  │     │
  │     ├─→ Review Case History
  │     │
  │     ├─→ Conduct Follow-up
  │     │     • Call Person in Crisis
  │     │     • Check Status
  │     │     • Assess Current Situation
  │     │
  │     └─→ Follow-up Decision
  │           │
  │           ├─→ [Further Support Needed?]
  │           │     │
  │           │     YES → Additional Support Flow
  │           │             │
  │           │             ├─→ [Mobile Team Needed?]
  │           │             │     │
  │           │             │     YES → Assign Responder
  │           │             │     │
  │           │             │     NO → Provide Resources
  │           │             │           • Information
  │           │             │           • Referrals
  │           │             │           • Documentation
  │           │
  │           └─→ NO → Close Case
  │                     │
  │                     └─→ Case Status: "Closed"
  │
  └─→ Mark Follow-up Complete
```

---

## 4. Crisis Responder - Mobile App Flow

```
START: Responder Opens Mobile App
  │
  ├─→ Home Screen
  │     • Current Status (Available/Busy/Offline)
  │     • Active Cases
  │     • New Assignment Notifications
  │
  ├─→ Status Toggle
  │     • Available → Ready for assignments
  │     • Busy → Currently handling case
  │     • Offline → Not available
  │
  ├─→ New Assignment Received
  │     │
  │     ├─→ Push Notification
  │     │     • Case ID
  │     │     • Location
  │     │     • Distance
  │     │     • Urgency
  │     │
  │     ├─→ Accept/Decline Decision
  │     │     │
  │     │     ├─→ Accept
  │     │     │     │
  │     │     │     ├─→ Case Status: "Assigned to Responder"
  │     │     │     │
  │     │     │     ├─→ View Case Details
  │     │     │     │     • Caller Information
  │     │     │     │     • Location
  │     │     │     │     • Notes
  │     │     │     │     • Timeline
  │     │     │     │
  │     │     │     ├─→ Navigate to Location
  │     │     │     │     • Google Maps Integration
  │     │     │     │     • GPS Tracking Active
  │     │     │     │
  │     │     │     ├─→ Update Status: "On Route"
  │     │     │     │     • Timestamp: Travel Start
  │     │     │     │
  │     │     │     ├─→ Arrive at Location
  │     │     │     │     │
  │     │     │     │     └─→ Update Status: "Arrived"
  │     │     │     │           • Timestamp: Arrival
  │     │     │     │
  │     │     │     ├─→ Start Session
  │     │     │     │     │
  │     │     │     │     └─→ Update Status: "Session in Progress"
  │     │     │     │           • Timestamp: Session Start
  │     │     │     │
  │     │     │     ├─→ Provide Support
  │     │     │     │     • On-site intervention
  │     │     │     │     • Crisis de-escalation
  │     │     │     │     • Resource provision
  │     │     │     │
  │     │     │     ├─→ Log Session Details
  │     │     │     │     • Session Notes
  │     │     │     │     • Photos (optional)
  │     │     │     │     • Documents (optional)
  │     │     │     │     • Outcomes
  │     │     │     │
  │     │     │     └─→ Complete Session
  │     │     │           │
  │     │     │           └─→ Update Status: "Session Complete"
  │     │     │                 • Timestamp: Completion
  │     │     │                 • Case Status: "Follow-up Scheduled"
  │     │     │
  │     │     └─→ Decline
  │     │           │
  │     │           └─→ Case Returned to Pool
  │     │                 • Available for other responders
  │
  ├─→ Active Cases Management
  │     • View all active cases
  │     • Switch between cases
  │     • Update case status
  │     • Add notes on the go
  │
  ├─→ Communication
  │     • In-app chat with dispatcher
  │     • Receive updates
  │     • Request assistance
  │
  └─→ Return to Home Screen
```

---

## 5. Agency Manager - Dashboard & Reporting Flow

```
START: Agency Manager Logs In
  │
  ├─→ Dashboard
  │     • Agency Overview Stats
  │     • Active Cases Count
  │     • Team Performance Metrics
  │     • Response Time Averages
  │     • Recent Activity Feed
  │
  ├─→ View Cases
  │     │
  │     ├─→ Filter by
  │     │     • Status
  │     │     • Date Range
  │     │     • Responder
  │     │     • Region
  │     │
  │     ├─→ Case Details (Read-only)
  │     │     • View full case history
  │     │     • Review notes
  │     │     • Check timeline
  │     │
  │     └─→ Export Cases
  │           • CSV Export
  │           • PDF Report
  │
  ├─→ Team Management
  │     │
  │     ├─→ View Team Members
  │     │     • Active Responders
  │     │     • Dispatchers
  │     │     • Status (Available/Busy)
  │     │
  │     ├─→ Add Responder
  │     │     • Enter Information
  │     │     • Set Permissions
  │     │     • Send Invitation
  │     │
  │     ├─→ Remove Responder
  │     │     • Deactivate Account
  │     │     • Archive Data
  │     │
  │     └─→ Edit Responder
  │           • Update Information
  │           • Modify Permissions
  │
  ├─→ Reports & Analytics
  │     │
  │     ├─→ Generate Report
  │     │     • Select Date Range
  │     │     • Choose Metrics
  │     │     • Filter by Criteria
  │     │
  │     ├─→ View Analytics Dashboard
  │     │     • Case Volume Trends
  │     │     • Response Time Analysis
  │     │     • Team Performance
  │     │     • Outcome Metrics
  │     │
  │     ├─→ Export Data
  │     │     • Excel/CSV
  │     │     • PDF Report
  │     │
  │     └─→ Submit to CMHA
  │           • Review Report
  │           • Submit for Review
  │
  ├─→ Review Closed Cases
  │     • Quality Assurance
  │     • Documentation Review
  │     • Compliance Check
  │
  └─→ Settings
        • Agency Information
        • Notification Preferences
        • Data Export Settings
```

---

## 6. CMHA Admin - Provincial Overview Flow

```
START: CMHA Admin Logs In
  │
  ├─→ Provincial Dashboard
  │     • Total Cases Across All Agencies
  │     • Active Cases Summary
  │     • Average Response Times
  │     • Agency Performance Comparison
  │
  ├─→ Agency Management
  │     │
  │     ├─→ View All Agencies
  │     │     • Agency List
  │     │     • Performance Metrics
  │     │     • Case Volume
  │     │
  │     ├─→ Agency Details
  │     │     • View Agency Dashboard
  │     │     • Review Cases
  │     │     • Check Reports
  │     │
  │     ├─→ Add New Agency
  │     │     • Agency Information
  │     │     • Create Agency Manager Account
  │     │     • Set Permissions
  │     │
  │     └─→ Edit Agency
  │           • Update Information
  │           • Modify Settings
  │
  ├─→ User Management
  │     │
  │     ├─→ Manage Dispatchers
  │     │     • Add/Remove Dispatchers
  │     │     • Assign to Agencies
  │     │     • Set Permissions
  │     │
  │     ├─→ Manage Agency Managers
  │     │     • Add/Remove Managers
  │     │     • Assign to Agencies
  │     │
  │     └─→ View All Users
  │           • User List
  │           • Activity Status
  │           • Permission Levels
  │
  ├─→ Reporting & Analytics
  │     │
  │     ├─→ Provincial Reports
  │     │     • Aggregate Data from All Agencies
  │     │     • Comparative Analysis
  │     │     • Trend Analysis
  │     │
  │     ├─→ PowerBI Integration
  │     │     • Automated Sync (Every 10 min)
  │     │     • Data Export
  │     │     • Dashboard Access
  │     │
  │     ├─→ Custom Reports
  │     │     • Date Range Selection
  │     │     • Agency Filtering
  │     │     • Metric Selection
  │     │
  │     └─→ Export for Province
  │           • Anonymized Data
  │           • Compliance Reports
  │           • Performance Metrics
  │
  ├─→ Data Management
  │     • View All Cases (Anonymized)
  │     • Audit Trails
  │     • Data Integrity Checks
  │     • Backup Management
  │
  ├─→ System Administration
  │     • System Settings
  │     • Security Configuration
  │     • Integration Settings
  │     • Notification Settings
  │
  └─→ Compliance & Audit
        • Access Audit Logs
        • Review Security Events
        • Compliance Reports
        • Data Access Tracking
```

---

## 7. Person in Crisis - Request Help Flow

```
START: Person in Crisis Needs Help
  │
  ├─→ Choose Contact Method
  │     │
  │     ├─→ Phone Call
  │     │     │
  │     │     └─→ Call Hotline
  │     │           │
  │     │           └─→ Dispatcher Answers
  │     │                 • Intake Process
  │     │                 • Case Created
  │     │
  │     ├─→ SMS Text Message
  │     │     │
  │     │     └─→ Send Text to Hotline
  │     │           │
  │     │           └─→ Dispatcher Receives in System
  │     │                 • SMS Appears in Chat
  │     │                 • Dispatcher Responds
  │     │                 • Case Created
  │     │
  │     ├─→ Web Form
  │     │     │
  │     │     └─→ Fill Out Secure Form
  │     │           • Name
  │     │           • Phone
  │     │           • Location
  │     │           • Description
  │     │           • Emergency Toggle
  │     │           │
  │     │           └─→ Submit Form
  │     │                 │
  │     │                 └─→ Case Auto-Created
  │     │                       • Confirmation Message
  │     │                       • Case ID Provided
  │     │
  │     └─→ WhatsApp (Optional)
  │           │
  │           └─→ Chat with Bot
  │                 • Automated Intake
  │                 • Case Created
  │
  ├─→ Case Processing
  │     • Dispatcher Assessment
  │     • Immediate Response (if emergency)
  │     • Assignment to Responder (if needed)
  │     • Follow-up Scheduled
  │
  ├─→ Receive Support
  │     • Phone Support
  │     • On-site Visit (if assigned)
  │     • Resource Provision
  │     • Follow-up Contact
  │
  └─→ Case Resolution
        • Support Provided
        • Follow-up Completed
        • Case Closed
```

---

## 8. In-App Chat Flow

```
START: User Opens Chat
  │
  ├─→ Chat List View
  │     • Recent Conversations
  │     • Unread Message Count
  │     • Last Message Preview
  │
  ├─→ Select Conversation
  │     │
  │     ├─→ Internal Chat (Dispatcher ↔ Responder)
  │     │     • One-on-one Chat
  │     │     • Group Chat (multiple responders)
  │     │     • Case-linked Messages
  │     │
  │     └─→ SMS Thread (Dispatcher ↔ Person in Crisis)
  │           • SMS Messages Displayed
  │           • Two-way Communication
  │           • Linked to Case ID
  │
  ├─→ Send Message
  │     │
  │     ├─→ Type Message
  │     │     • Text Input
  │     │     • Auto-save Draft
  │     │
  │     ├─→ Attach File (Optional)
  │     │     • Image
  │     │     • Document
  │     │     • Case Reference
  │     │
  │     └─→ Send
  │           • Message Encrypted
  │           • Delivered Notification
  │           • Read Receipt (if enabled)
  │
  ├─→ Receive Message
  │     • Push Notification
  │     • In-app Notification
  │     • Sound Alert (optional)
  │     • Unread Badge
  │
  ├─→ Message Actions
  │     • Reply
  │     • Forward
  │     • Link to Case
  │     • Delete
  │
  └─→ Search Messages
        • Search by Keyword
        • Filter by Case ID
        • Filter by Date
        • Filter by Sender
```

---

## 9. Case Status Transition Flow

```
New Case Created
  │
  ├─→ Status: "New Case Created"
  │     • Timestamp: Creation Time
  │
  ├─→ Dispatcher Assessment
  │     │
  │     └─→ Status: "In Assessment"
  │           • Timestamp: Assessment Start
  │
  ├─→ Assessment Decision
  │     │
  │     ├─→ [Immediate Danger?]
  │     │     │
  │     │     YES → Status: "Emergency Escalated"
  │     │             • Timestamp: Escalation Time
  │     │             • Emergency Services Contacted
  │     │
  │     └─→ NO → Status: "Continue Assessment"
  │               • Timestamp: Assessment Complete
  │
  ├─→ Response Decision
  │     │
  │     ├─→ [Mobile Team Needed?]
  │     │     │
  │     │     YES → Status: "Assigned to Responder"
  │     │             • Timestamp: Assignment Time
  │     │             • Responder Notified
  │     │             │
  │     │             ├─→ Responder Accepts
  │     │             │     │
  │     │             │     └─→ Status: "In Progress - On Route"
  │     │             │           • Timestamp: Travel Start
  │     │             │           • GPS Tracking Active
  │     │             │
  │     │             └─→ Responder Arrives
  │     │                   │
  │     │                   └─→ Status: "In Progress - Session in Progress"
  │     │                         • Timestamp: Arrival Time
  │     │                         • Timestamp: Session Start
  │     │
  │     └─→ NO → Status: "In Progress - Session in Progress"
  │               • Timestamp: Session Start
  │               • Dispatcher Handles
  │
  ├─→ Session Complete
  │     │
  │     └─→ Status: "Follow-up Scheduled"
  │           • Timestamp: Session End
  │           • Follow-up Time: 24-48 hours
  │
  ├─→ Follow-up Due
  │     │
  │     └─→ Status: "Follow-up Due"
  │           • Timestamp: Follow-up Time
  │           • Notification to Dispatcher
  │
  ├─→ Follow-up Decision
  │     │
  │     ├─→ [Further Support Needed?]
  │     │     │
  │     │     YES → Status: "Additional Support Needed"
  │     │             • Loop back to Response Decision
  │     │
  │     └─→ NO → Status: "Closed"
  │               • Timestamp: Closure Time
  │               • Case Archived
  │
  └─→ Case Closed
        • Final Status: "Closed"
        • All Timestamps Recorded
        • Report Generated
        • Data Available for Analytics
```

---

## 10. Reporting & Analytics Flow

```
START: User Accesses Reports
  │
  ├─→ Select Report Type
  │     • Case Volume Report
  │     • Response Time Report
  │     • Outcome Report
  │     • Team Performance Report
  │     • Custom Report
  │
  ├─→ Set Filters
  │     • Date Range
  │     • Agency (if CMHA Admin)
  │     • Region
  │     • Crisis Type
  │     • Responder
  │     • Status
  │
  ├─→ Generate Report
  │     • Query Database
  │     • Calculate Metrics
  │     • Generate Visualizations
  │
  ├─→ View Report
  │     • Dashboard View
  │     • Charts & Graphs
  │     • Data Tables
  │     • Key Metrics
  │
  ├─→ Export Options
  │     │
  │     ├─→ Export as CSV
  │     │     • Download File
  │     │     • All Data Included
  │     │
  │     ├─→ Export as PDF
  │     │     • Formatted Report
  │     │     • Charts Included
  │     │
  │     └─→ PowerBI Sync (CMHA Admin)
  │           • Automated Sync
  │           • Real-time Updates
  │           • Dashboard Access
  │
  └─→ Share Report
        • Email Report
        • Submit to CMHA (Agency Manager)
        • Submit to Province (CMHA Admin)
```

---

## Flow Summary

### Key Decision Points
1. **Immediate Danger Check**: Routes to emergency escalation
2. **Mobile Team Needed**: Determines if responder assignment is required
3. **Further Support Needed**: Decides if case continues or closes
4. **Accept/Decline**: Responder decision on case assignment

### Status Transitions
- All status changes are timestamped
- Automatic calculations for time deltas
- Audit trail maintained for all transitions

### Notifications
- Real-time notifications for status changes
- Push notifications for mobile app
- Email notifications for important events
- SMS notifications for critical updates

### Data Flow
- All actions logged with timestamps
- Real-time sync between web and mobile
- Automatic report generation
- PowerBI integration for analytics

---

These flow diagrams provide a complete picture of how users interact with the CRCL system. Use these as a reference when designing the Figma prototypes to ensure all user paths are covered and the interface supports each workflow efficiently.

