# CRCL Design System
## Black & Green Theme - Simple & Functional

---

## Color Palette

### Primary Colors
- **Primary Green**: `#00C853` (Main actions, success states, active elements)
- **Dark Green**: `#00A043` (Hover states, secondary actions)
- **Light Green**: `#4CAF50` (Subtle highlights, badges)

### Neutral Colors
- **Pure Black**: `#000000` (Primary text, borders, backgrounds)
- **Charcoal Black**: `#1A1A1A` (Card backgrounds, secondary surfaces)
- **Dark Gray**: `#2D2D2D` (Input fields, dividers)
- **Medium Gray**: `#4A4A4A` (Secondary text, icons)
- **Light Gray**: `#6B6B6B` (Placeholder text, disabled states)
- **Off-White**: `#F5F5F5` (Page backgrounds, card backgrounds)

### Status Colors
- **Success**: `#00C853` (Green)
- **Warning**: `#FFC107` (Amber - for urgent cases)
- **Error**: `#F44336` (Red - for emergencies)
- **Info**: `#2196F3` (Blue - for information)

### Background Hierarchy
- **Page Background**: `#000000`
- **Card/Surface**: `#1A1A1A`
- **Elevated Surface**: `#2D2D2D`
- **Input Background**: `#2D2D2D`

---

## Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'Courier New', monospace (for case IDs, timestamps)

### Font Sizes
- **H1**: 32px / 40px line-height (Page titles)
- **H2**: 24px / 32px line-height (Section headers)
- **H3**: 20px / 28px line-height (Card titles)
- **H4**: 18px / 24px line-height (Subsection headers)
- **Body Large**: 16px / 24px line-height (Primary content)
- **Body**: 14px / 20px line-height (Standard text)
- **Body Small**: 12px / 16px line-height (Labels, captions)
- **Tiny**: 10px / 14px line-height (Timestamps, metadata)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Text Colors
- **Primary Text**: `#FFFFFF` (on dark backgrounds)
- **Secondary Text**: `#6B6B6B`
- **Placeholder**: `#4A4A4A`
- **Link**: `#00C853`

---

## Spacing System

### Base Unit: 4px
- **XS**: 4px
- **S**: 8px
- **M**: 16px
- **L**: 24px
- **XL**: 32px
- **XXL**: 48px
- **XXXL**: 64px

### Component Spacing
- **Card Padding**: 16px
- **Section Spacing**: 24px
- **Form Field Spacing**: 16px
- **Button Padding**: 12px 24px

---

## Components

### Buttons

#### Primary Button
- **Background**: `#00C853`
- **Text**: `#000000` (Black)
- **Border**: None
- **Padding**: 12px 24px
- **Border Radius**: 4px
- **Font**: 14px, Medium, 600
- **Hover**: Background `#00A043`
- **Active**: Background `#00A043`, scale 0.98
- **Disabled**: Background `#2D2D2D`, Text `#4A4A4A`

#### Secondary Button
- **Background**: Transparent
- **Text**: `#00C853`
- **Border**: 1px solid `#00C853`
- **Padding**: 12px 24px
- **Border Radius**: 4px
- **Hover**: Background `#00C853`, Text `#000000`

#### Text Button
- **Background**: Transparent
- **Text**: `#00C853`
- **Border**: None
- **Padding**: 8px 16px
- **Hover**: Background `#1A1A1A`

#### Danger Button
- **Background**: `#F44336`
- **Text**: `#FFFFFF`
- **Border**: None
- **Hover**: Background `#D32F2F`

### Input Fields

#### Text Input
- **Background**: `#2D2D2D`
- **Border**: 1px solid `#4A4A4A`
- **Text**: `#FFFFFF`
- **Placeholder**: `#4A4A4A`
- **Padding**: 12px 16px
- **Border Radius**: 4px
- **Focus**: Border `#00C853`, Outline: 2px solid `#00C853` (20% opacity)

#### Textarea
- Same as Text Input
- **Min Height**: 100px
- **Resize**: Vertical only

#### Select/Dropdown
- Same styling as Text Input
- **Dropdown Background**: `#1A1A1A`
- **Option Hover**: `#2D2D2D`

### Cards

#### Standard Card
- **Background**: `#1A1A1A`
- **Border**: 1px solid `#2D2D2D`
- **Border Radius**: 8px
- **Padding**: 16px
- **Shadow**: None (flat design)

#### Elevated Card
- **Background**: `#2D2D2D`
- **Border**: 1px solid `#4A4A4A`
- **Border Radius**: 8px
- **Padding**: 16px

### Badges

#### Status Badge
- **New**: Background `#00C853`, Text `#000000`
- **In Progress**: Background `#2196F3`, Text `#FFFFFF`
- **Urgent**: Background `#FFC107`, Text `#000000`
- **Emergency**: Background `#F44336`, Text `#FFFFFF`
- **Closed**: Background `#4A4A4A`, Text `#FFFFFF`
- **Padding**: 4px 12px
- **Border Radius**: 12px
- **Font**: 12px, Medium

### Navigation

#### Sidebar
- **Background**: `#1A1A1A`
- **Width**: 240px (collapsed: 64px)
- **Border Right**: 1px solid `#2D2D2D`
- **Item Padding**: 12px 16px
- **Active Item**: Background `#2D2D2D`, Border Left: 3px solid `#00C853`
- **Hover**: Background `#2D2D2D`

#### Top Bar
- **Background**: `#000000`
- **Height**: 64px
- **Border Bottom**: 1px solid `#2D2D2D`
- **Padding**: 0 24px

### Tables

#### Table Header
- **Background**: `#1A1A1A`
- **Text**: `#FFFFFF`, 14px, Semibold
- **Padding**: 12px 16px
- **Border Bottom**: 1px solid `#2D2D2D`

#### Table Row
- **Background**: `#1A1A1A`
- **Border Bottom**: 1px solid `#2D2D2D`
- **Padding**: 12px 16px
- **Hover**: Background `#2D2D2D`

### Modals

#### Modal Overlay
- **Background**: `rgba(0, 0, 0, 0.8)`
- **Backdrop**: Blur 4px

#### Modal Container
- **Background**: `#1A1A1A`
- **Border**: 1px solid `#2D2D2D`
- **Border Radius**: 8px
- **Padding**: 24px
- **Max Width**: 600px
- **Width**: 90vw

---

## Icons

### Icon Style
- **Style**: Outline/Monoline
- **Size**: 16px, 20px, 24px
- **Color**: `#FFFFFF` (default), `#00C853` (active), `#6B6B6B` (inactive)
- **Library**: Material Icons or Heroicons

### Common Icons
- **Home**: house
- **Cases**: clipboard-list
- **Dashboard**: chart-bar
- **Users**: users
- **Settings**: cog
- **Notifications**: bell
- **Search**: magnifying-glass
- **Filter**: funnel
- **Export**: arrow-down-tray
- **Add**: plus
- **Edit**: pencil
- **Delete**: trash
- **Close**: x-mark
- **Check**: check
- **Alert**: exclamation-triangle
- **Location**: map-pin
- **Phone**: phone
- **Message**: chat-bubble
- **Clock**: clock

---

## Layout Principles

### Grid System
- **Container Max Width**: 1400px
- **Grid Columns**: 12 columns
- **Gutter**: 24px
- **Margin**: 24px (mobile: 16px)

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Structure
```
┌─────────────────────────────────────┐
│         Top Bar (64px)              │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Main Content          │
│ (240px)  │    (Fluid)               │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

---

## Interaction Patterns

### Hover States
- **Buttons**: Background color change, cursor pointer
- **Cards**: Slight background change (`#1A1A1A` → `#2D2D2D`)
- **Links**: Underline, color change to `#00A043`

### Focus States
- **Inputs**: Green border (`#00C853`), outline ring
- **Buttons**: Outline ring
- **Keyboard Navigation**: Visible focus indicators

### Loading States
- **Spinner**: Green (`#00C853`) circular spinner
- **Skeleton**: Dark gray (`#2D2D2D`) animated placeholders

### Empty States
- **Icon**: Gray icon (`#4A4A4A`)
- **Text**: Secondary text color (`#6B6B6B`)
- **Action**: Primary button

### Error States
- **Error Text**: `#F44336`
- **Error Border**: `#F44336`
- **Error Icon**: Red alert icon

---

## Accessibility

### Contrast Ratios
- **Text on Dark**: Minimum 4.5:1
- **Text on Green**: Black text on green meets WCAG AA
- **Interactive Elements**: Clear focus indicators

### Keyboard Navigation
- **Tab Order**: Logical flow
- **Focus Indicators**: Visible green outline
- **Skip Links**: Available for main content

### Screen Reader Support
- **ARIA Labels**: All interactive elements
- **Alt Text**: All images and icons
- **Semantic HTML**: Proper heading hierarchy

---

## Animation & Transitions

### Duration
- **Fast**: 150ms (hover, click)
- **Medium**: 300ms (modal, dropdown)
- **Slow**: 500ms (page transitions)

### Easing
- **Default**: `ease-in-out`
- **Enter**: `ease-out`
- **Exit**: `ease-in`

### Transitions
- **Color Changes**: 150ms
- **Transform**: 200ms
- **Opacity**: 200ms

---

## Design Principles

1. **Simplicity First**: No unnecessary elements, clean layouts
2. **Function Over Form**: Every element serves a purpose
3. **Consistency**: Same patterns throughout the application
4. **Clarity**: Clear hierarchy, readable text, obvious actions
5. **Efficiency**: Minimal clicks to complete tasks
6. **Accessibility**: Usable by everyone, including assistive technologies

