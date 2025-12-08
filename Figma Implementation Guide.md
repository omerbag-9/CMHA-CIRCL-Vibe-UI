# CRCL Figma Implementation Guide
## Quick Reference for Designers

---

## Getting Started

### Step 1: Set Up Your Figma File
1. Create a new Figma file: `CRCL - Design System`
2. Create pages:
   - `01 - Design System` (Colors, Typography, Components)
   - `02 - Authentication` (Login, Forgot Password)
   - `03 - Dispatcher` (Dashboard, Cases, Chat)
   - `04 - Responder Mobile` (Mobile app screens)
   - `05 - Agency Manager` (Dashboard, Team, Reports)
   - `06 - CMHA Admin` (Provincial Dashboard, Users)
   - `07 - Public` (Web form, Landing)
   - `08 - Components` (Reusable components library)

### Step 2: Create Color Styles
1. Go to `Design` → `Styles` → `Color`
2. Create these color styles:
   - `Primary/Green` → `#00C853`
   - `Primary/Green Dark` → `#00A043`
   - `Primary/Green Light` → `#4CAF50`
   - `Neutral/Black` → `#000000`
   - `Neutral/Charcoal` → `#1A1A1A`
   - `Neutral/Dark Gray` → `#2D2D2D`
   - `Neutral/Medium Gray` → `#4A4A4A`
   - `Neutral/Light Gray` → `#6B6B6B`
   - `Neutral/White` → `#FFFFFF`
   - `Status/Success` → `#00C853`
   - `Status/Warning` → `#FFC107`
   - `Status/Error` → `#F44336`
   - `Status/Info` → `#2196F3`

### Step 3: Create Text Styles
1. Go to `Design` → `Styles` → `Text`
2. Create these text styles:
   - `Heading/H1` → 32px, Bold, White
   - `Heading/H2` → 24px, Semibold, White
   - `Heading/H3` → 20px, Semibold, White
   - `Heading/H4` → 18px, Semibold, White
   - `Body/Large` → 16px, Regular, White
   - `Body/Regular` → 14px, Regular, White
   - `Body/Small` → 12px, Regular, White
   - `Body/Tiny` → 10px, Regular, Gray
   - `Label/Medium` → 14px, Medium, White
   - `Label/Small` → 12px, Medium, Gray
   - `Monospace/CaseID` → 14px, Regular, White, Courier New

### Step 4: Set Up Grid
1. Enable Layout Grid on frames
2. Use 4px grid
3. Set columns: 12 columns, 24px gutter

---

## Component Creation Order

### Phase 1: Base Components
1. **Buttons**
   - Primary Button (with variants: Default, Hover, Active, Disabled)
   - Secondary Button
   - Text Button
   - Icon Button

2. **Inputs**
   - Text Input (with variants: Default, Focus, Error, Disabled)
   - Textarea
   - Select/Dropdown
   - Checkbox
   - Radio Button
   - Toggle Switch

3. **Cards**
   - Standard Card
   - Case Card
   - Stats Card

### Phase 2: Complex Components
4. **Navigation**
   - Sidebar Item (with variants: Default, Hover, Active)
   - Top Bar
   - Bottom Navigation (Mobile)

5. **Tables**
   - Table Container
   - Table Header
   - Table Row
   - Table Cell

6. **Modals**
   - Modal Overlay
   - Modal Container

7. **Badges**
   - Status Badge (with variants: New, Active, Urgent, Emergency, Closed)
   - Dot Badge

### Phase 3: Feature Components
8. **Chat**
   - Chat Message
   - Chat Input
   - Chat List Item

9. **Forms**
   - Form Field Group
   - Form Section

10. **Alerts**
    - Alert Banner (with variants: Success, Error, Warning, Info)
    - Toast Notification

11. **Data Visualization**
    - Chart Container
    - Metric Card

12. **Empty States**
    - Empty State Container

---

## Screen Creation Checklist

### For Each Screen:
- [ ] Use Auto Layout for all containers
- [ ] Apply color styles (don't use hex codes directly)
- [ ] Apply text styles (don't use manual text settings)
- [ ] Use components from library (don't create duplicates)
- [ ] Set proper constraints for responsive behavior
- [ ] Add hover states for interactive elements
- [ ] Include empty states
- [ ] Include loading states
- [ ] Include error states
- [ ] Add annotations/notes explaining interactions
- [ ] Name layers clearly and consistently

### Naming Convention
- **Frames**: `Screen Name - Role` (e.g., `Dashboard - Dispatcher`)
- **Components**: `Component/Type/Variant` (e.g., `Button/Primary/Default`)
- **Layers**: Descriptive names (e.g., `Case Card Container`, `Status Badge`)

---

## Key Screens to Design

### Authentication (2 screens)
1. Login Page
2. Forgot Password (optional)

### Dispatcher (8 screens)
1. Dashboard
2. Case List
3. New Case Creation
4. Case Detail View
5. Assign Responder Modal
6. Follow-up Scheduling Modal
7. In-App Chat
8. Reports Dashboard

### Crisis Responder Mobile (6 screens)
1. Home Screen
2. Case Detail
3. Case List
4. Chat Screen
5. Profile/Settings
6. Status Toggle

### Agency Manager (6 screens)
1. Dashboard
2. Case List
3. Team Management
4. Reports & Analytics
5. Case Review
6. Settings

### CMHA Admin (6 screens)
1. Provincial Dashboard
2. Agency Management
3. User Management
4. Reports & Analytics
5. System Administration
6. Audit Logs

### Public (2 screens)
1. Request Help Web Form
2. Confirmation Page

---

## Design Principles to Follow

### 1. Simplicity
- No unnecessary decorative elements
- Clean, minimal interfaces
- Focus on functionality

### 2. Consistency
- Use the same components throughout
- Maintain consistent spacing (4px grid)
- Follow the same interaction patterns

### 3. Clarity
- Clear visual hierarchy
- Obvious call-to-action buttons
- Readable text (proper contrast)

### 4. Efficiency
- Minimize clicks to complete tasks
- Provide shortcuts for common actions
- Show relevant information upfront

### 5. Accessibility
- High contrast ratios
- Clear focus indicators
- Proper heading hierarchy
- Descriptive labels

---

## Interaction States

### For All Interactive Elements:
1. **Default State**: Normal appearance
2. **Hover State**: Slight background change, cursor pointer
3. **Active/Pressed State**: Slightly darker, scale 0.98
4. **Focus State**: Green outline (2px, 20% opacity)
5. **Disabled State**: Gray background, gray text, no interaction
6. **Error State**: Red border, error message below

### Create Variants For:
- Buttons (Default, Hover, Active, Disabled, Error)
- Inputs (Default, Focus, Error, Disabled)
- Cards (Default, Hover, Selected)
- Navigation Items (Default, Hover, Active)

---

## Responsive Design

### Breakpoints
- **Mobile**: 375px, 414px (iPhone sizes)
- **Tablet**: 768px, 1024px
- **Desktop**: 1280px, 1440px, 1920px

### Design Mobile First
1. Start with mobile layout (375px width)
2. Expand to tablet (768px)
3. Expand to desktop (1440px)

### Use Constraints
- **Left/Right**: Left, Right, or Center
- **Top/Bottom**: Top, Bottom, or Center
- **Width/Height**: Fill Container or Fixed

---

## Prototyping

### Connect Screens
1. Select interactive element
2. Click "Prototype" tab
3. Drag connection to target frame
4. Set interaction:
   - **Trigger**: On Click (default)
   - **Action**: Navigate to Frame
   - **Animation**: Instant (for navigation), Smart Animate (for modals)

### Key Interactions to Prototype
- Login → Dashboard
- Dashboard → Case Detail
- Case Detail → Assign Modal
- New Case → Case Created
- Chat List → Chat Conversation
- Mobile: Home → Case Detail
- Mobile: Accept Case → Case Detail

---

## Annotations & Documentation

### Add Notes to Screens
1. Create a "Notes" layer group
2. Use Figma's comment feature
3. Or create a notes frame next to the screen

### Document:
- User actions required
- Data displayed
- Validation rules
- Error scenarios
- Success states
- Loading states

### Example Annotation:
```
Screen: Case Detail
User: Dispatcher
Actions:
- View case information
- Assign responder
- Add notes
- Update status
- Close case

Data:
- Case ID (auto-generated)
- Caller information
- Timeline (auto-calculated)
- Status history
- Notes (chronological)

Validation:
- Cannot close case without notes
- Cannot assign if no available responders
```

---

## Export Settings

### For Development Handoff
1. **Frames**: Export as PNG (for reference)
2. **Icons**: Export as SVG
3. **Components**: Document in component library
4. **Spacing**: Use 8px grid for measurements
5. **Colors**: Provide hex codes and CSS variables
6. **Typography**: Provide font sizes, weights, line heights

### Create Style Guide Page
- Color palette with hex codes
- Typography scale
- Spacing system
- Component library overview
- Usage guidelines

---

## Common Patterns

### Modal Pattern
```
Overlay (rgba(0,0,0,0.8))
  └─ Modal Container (#1A1A1A)
      ├─ Header (Title + Close Button)
      ├─ Content (Scrollable)
      └─ Footer (Action Buttons)
```

### Card Pattern
```
Card Container (#1A1A1A, border #2D2D2D)
  ├─ Header Section
  │   ├─ Title
  │   └─ Badge/Action
  ├─ Content Section
  └─ Footer Section (Actions)
```

### Form Pattern
```
Form Container
  ├─ Form Section
  │   ├─ Section Title
  │   ├─ Form Field Group
  │   │   ├─ Label
  │   │   ├─ Input
  │   │   └─ Helper/Error Text
  │   └─ Form Field Group...
  └─ Form Actions (Buttons)
```

### List Pattern
```
List Container
  ├─ List Header (Filters, Search)
  └─ List Items
      ├─ List Item (Hover state)
      ├─ List Item
      └─ List Item
```

---

## Quality Checklist

Before marking a screen as complete:

- [ ] All text uses text styles (no manual formatting)
- [ ] All colors use color styles (no hex codes)
- [ ] All components are from library (no duplicates)
- [ ] Auto Layout enabled on all containers
- [ ] Proper constraints set for responsive behavior
- [ ] Hover states created for interactive elements
- [ ] Focus states visible (for accessibility)
- [ ] Error states included
- [ ] Empty states included
- [ ] Loading states included
- [ ] All layers properly named
- [ ] No stray elements or hidden layers
- [ ] Consistent spacing (4px grid)
- [ ] Proper visual hierarchy
- [ ] Clear call-to-action buttons
- [ ] Readable text (proper contrast)
- [ ] Icons are consistent style
- [ ] Prototype connections work
- [ ] Notes/annotations added

---

## Tips & Tricks

### Auto Layout Tips
- Use "Fill Container" for flexible elements
- Use "Hug Contents" for fixed-size elements
- Set proper padding and gaps
- Use "Space Between" for headers/footers

### Component Tips
- Create base components first
- Use variants for states (not separate components)
- Nest components when needed
- Use instance swap for different content

### Performance Tips
- Keep component trees shallow
- Use vector shapes instead of images when possible
- Group related elements
- Use masks instead of cropping

### Collaboration Tips
- Use consistent naming
- Add descriptions to components
- Use Figma comments for questions
- Keep master components organized
- Document design decisions

---

## Resources

### Design Files Structure
```
CRCL - Design System.fig
├── 01 - Design System
│   ├── Colors
│   ├── Typography
│   └── Spacing
├── 02 - Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Navigation
│   └── ...
├── 03 - Screens
│   ├── Authentication
│   ├── Dispatcher
│   ├── Responder Mobile
│   ├── Agency Manager
│   ├── CMHA Admin
│   └── Public
└── 04 - Prototypes
    ├── Dispatcher Flow
    ├── Responder Flow
    └── ...
```

### Reference Documents
- `Design System - CRCL.md` - Complete design system
- `UI-UX Flow Documentation.md` - Screen specifications
- `Component Library - CRCL.md` - Component details
- `User Flow Diagrams.md` - User journey maps

---

## Next Steps

1. **Set up Figma file** with pages and structure
2. **Create color and text styles** first
3. **Build base components** (buttons, inputs, cards)
4. **Design key screens** starting with Dispatcher Dashboard
5. **Create prototypes** to show interactions
6. **Review and iterate** based on feedback
7. **Document everything** for handoff

---

This guide provides everything needed to start designing the CRCL system in Figma. Follow the order, use the components, and maintain consistency throughout the design process.

