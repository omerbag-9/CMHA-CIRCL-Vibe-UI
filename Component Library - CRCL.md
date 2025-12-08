# CRCL Component Library
## Reusable UI Components for Figma

---

## Buttons

### Primary Button
**Usage**: Main actions, form submissions, primary CTAs

**States**:
- Default: Green background (`#00C853`), black text (`#000000`)
- Hover: Darker green (`#00A043`)
- Active: Pressed state (scale 0.98)
- Disabled: Gray background (`#2D2D2D`), gray text (`#4A4A4A`)

**Specifications**:
- Height: 44px
- Padding: 12px 24px
- Border Radius: 4px
- Font: 14px, Medium (600), Inter
- Min Width: 120px

**Figma Properties**:
- Auto Layout: Horizontal, Padding 12/24
- Corner Radius: 4
- Fill: `#00C853`
- Text: `#000000`, 14px, Medium

---

### Secondary Button
**Usage**: Secondary actions, cancel buttons

**States**:
- Default: Transparent, green border (`#00C853`), green text
- Hover: Green background, black text
- Disabled: Gray border, gray text

**Specifications**:
- Height: 44px
- Padding: 12px 24px
- Border: 1px solid `#00C853`
- Border Radius: 4px

---

### Text Button
**Usage**: Tertiary actions, links that look like buttons

**States**:
- Default: Transparent, green text
- Hover: Dark gray background (`#1A1A1A`)

**Specifications**:
- Height: 36px
- Padding: 8px 16px
- No border

---

### Icon Button
**Usage**: Actions with icons only (e.g., edit, delete, close)

**States**:
- Default: Transparent, gray icon (`#6B6B6B`)
- Hover: Dark gray background, white icon
- Active: Green background, white icon

**Specifications**:
- Size: 40px × 40px
- Icon Size: 20px
- Border Radius: 4px

---

## Input Fields

### Text Input
**Usage**: Single-line text entry

**States**:
- Default: Dark gray background (`#2D2D2D`), gray border (`#4A4A4A`)
- Focus: Green border (`#00C853`), green outline (20% opacity)
- Error: Red border (`#F44336`)
- Disabled: Darker gray, no interaction

**Specifications**:
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid
- Border Radius: 4px
- Font: 14px, Regular, Inter
- Placeholder: `#4A4A4A`

**Figma Properties**:
- Auto Layout: Horizontal, Padding 12/16
- Fill: `#2D2D2D`
- Stroke: `#4A4A4A`, 1px
- Text: `#FFFFFF`, 14px, Regular

---

### Textarea
**Usage**: Multi-line text entry

**Specifications**:
- Min Height: 100px
- Padding: 12px 16px
- Resize: Vertical only
- Same styling as Text Input

---

### Select/Dropdown
**Usage**: Single selection from options

**States**:
- Default: Same as Text Input
- Open: Dropdown menu with options
- Selected: Green checkmark next to selected option

**Specifications**:
- Height: 44px
- Dropdown Background: `#1A1A1A`
- Option Hover: `#2D2D2D`
- Option Padding: 12px 16px

---

### Checkbox
**Usage**: Binary selection

**States**:
- Unchecked: Gray border (`#4A4A4A`), transparent fill
- Checked: Green background (`#00C853`), white checkmark
- Disabled: Gray, no interaction

**Specifications**:
- Size: 20px × 20px
- Border: 2px solid
- Border Radius: 4px
- Checkmark: White, 12px

---

### Radio Button
**Usage**: Single selection from group

**States**:
- Unselected: Gray border, transparent fill
- Selected: Green border, green center dot
- Disabled: Gray, no interaction

**Specifications**:
- Size: 20px × 20px
- Border: 2px solid
- Center Dot: 10px, `#00C853`

---

### Toggle Switch
**Usage**: On/off states

**States**:
- Off: Gray background (`#4A4A4A`), gray circle
- On: Green background (`#00C853`), white circle
- Disabled: Darker gray, no interaction

**Specifications**:
- Width: 44px
- Height: 24px
- Border Radius: 12px
- Circle: 20px diameter

---

## Cards

### Standard Card
**Usage**: Container for content, case listings

**Specifications**:
- Background: `#1A1A1A`
- Border: 1px solid `#2D2D2D`
- Border Radius: 8px
- Padding: 16px
- Shadow: None

**Figma Properties**:
- Auto Layout: Vertical, Padding 16
- Fill: `#1A1A1A`
- Stroke: `#2D2D2D`, 1px
- Corner Radius: 8

---

### Case Card
**Usage**: Display case information in lists

**Layout**:
```
┌─────────────────────────────────────┐
│ Case #CR-2024-001234  [Urgent]     │
│                                     │
│ John Doe • 24 min ago               │
│ 📍 123 Main St, Vancouver           │
│                                     │
│ Status: [Active]                    │
│                                     │
│ [View] [Assign] [Escalate]          │
└─────────────────────────────────────┘
```

**Specifications**:
- Same as Standard Card
- Status Badge: Top right
- Action Buttons: Bottom row
- Hover: Background `#2D2D2D`

---

### Stats Card
**Usage**: Display metrics and statistics

**Layout**:
```
┌─────────────────────┐
│ Active Cases        │
│                     │
│        12           │
│                     │
│ +3 from yesterday   │
└─────────────────────┘
```

**Specifications**:
- Same as Standard Card
- Large Number: 32px, Bold, Green (`#00C853`)
- Label: 14px, Regular, Gray (`#6B6B6B`)
- Trend: 12px, Regular, Gray

---

## Badges

### Status Badge
**Usage**: Case status, urgency indicators

**Variants**:
- **New**: Green (`#00C853`), black text
- **Active**: Blue (`#2196F3`), white text
- **Urgent**: Yellow (`#FFC107`), black text
- **Emergency**: Red (`#F44336`), white text
- **Closed**: Gray (`#4A4A4A`), white text
- **Pending**: Orange (`#FF9800`), white text

**Specifications**:
- Height: 24px
- Padding: 4px 12px
- Border Radius: 12px
- Font: 12px, Medium, Inter

**Figma Properties**:
- Auto Layout: Horizontal, Padding 4/12
- Corner Radius: 12
- Text: 12px, Medium

---

### Dot Badge
**Usage**: Status indicators, availability

**Variants**:
- **Available**: Green (`#00C853`)
- **Busy**: Yellow (`#FFC107`)
- **Offline**: Gray (`#4A4A4A`)

**Specifications**:
- Size: 8px × 8px
- Border Radius: 50%

---

## Navigation

### Sidebar Item
**Usage**: Navigation links in sidebar

**States**:
- Default: Transparent, gray icon and text
- Hover: Dark gray background (`#2D2D2D`)
- Active: Dark gray background, green left border (3px), white text

**Specifications**:
- Height: 48px
- Padding: 12px 16px
- Icon Size: 20px
- Text: 14px, Medium
- Active Border: 3px solid `#00C853` (left side)

**Layout**:
```
┌─────────────────────────┐
│ [📋] Cases              │  (Default)
└─────────────────────────┘

┌─────────────────────────┐
│ │ [📋] Cases            │  (Active - green border)
└─────────────────────────┘
```

---

### Top Bar
**Usage**: Header with user info and actions

**Specifications**:
- Height: 64px
- Background: `#000000`
- Border Bottom: 1px solid `#2D2D2D`
- Padding: 0 24px
- Auto Layout: Horizontal, Space Between

**Elements**:
- Logo/Menu: Left side
- Search: Center (optional)
- Notifications: Right side
- User Menu: Right side

---

## Tables

### Table Container
**Usage**: Data tables, case lists

**Specifications**:
- Background: `#1A1A1A`
- Border: 1px solid `#2D2D2D`
- Border Radius: 8px
- Overflow: Hidden

---

### Table Header
**Usage**: Column headers

**Specifications**:
- Background: `#1A1A1A`
- Height: 48px
- Padding: 12px 16px
- Border Bottom: 1px solid `#2D2D2D`
- Text: 14px, Semibold (600), White
- Sort Icons: Gray, 16px

---

### Table Row
**Usage**: Data rows

**States**:
- Default: `#1A1A1A` background
- Hover: `#2D2D2D` background
- Selected: Green border (left, 3px)

**Specifications**:
- Height: 56px
- Padding: 12px 16px
- Border Bottom: 1px solid `#2D2D2D`
- Text: 14px, Regular, White

---

### Table Cell
**Usage**: Individual cells

**Specifications**:
- Padding: 12px 16px
- Text: 14px, Regular
- Alignment: Left (default), Right (numbers)

---

## Modals

### Modal Overlay
**Usage**: Background for modals

**Specifications**:
- Background: `rgba(0, 0, 0, 0.8)`
- Backdrop Filter: Blur 4px
- Full screen coverage

---

### Modal Container
**Usage**: Modal dialog content

**Specifications**:
- Background: `#1A1A1A`
- Border: 1px solid `#2D2D2D`
- Border Radius: 8px
- Padding: 24px
- Max Width: 600px
- Width: 90vw (mobile)

**Layout**:
```
┌─────────────────────────────────────┐
│ Modal Title                    [×]  │
│ ─────────────────────────────────── │
│                                     │
│ Modal content goes here...         │
│                                     │
│ ┌──────────┐  ┌──────────┐        │
│ │ Cancel   │  │ Confirm  │        │
│ └──────────┘  └──────────┘        │
│                                     │
└─────────────────────────────────────┘
```

---

## Forms

### Form Field Group
**Usage**: Group related form fields

**Layout**:
```
┌─────────────────────────────────────┐
│ Label *                             │
│ ┌─────────────────────────────────┐ │
│ │ Input field                     │ │
│ └─────────────────────────────────┘ │
│ Helper text or error message        │
└─────────────────────────────────────┘
```

**Specifications**:
- Label: 14px, Medium, White
- Required Indicator: Red asterisk (`*`)
- Helper Text: 12px, Regular, Gray (`#6B6B6B`)
- Error Text: 12px, Regular, Red (`#F44336`)
- Spacing: 8px between elements

---

### Form Section
**Usage**: Group multiple form fields

**Specifications**:
- Title: 18px, Semibold, White
- Divider: 1px solid `#2D2D2D`
- Spacing: 24px between sections
- Field Spacing: 16px between fields

---

## Lists

### List Item
**Usage**: Items in lists, notifications

**States**:
- Default: Transparent
- Hover: Dark gray background (`#2D2D2D`)
- Selected: Green border (left, 3px)

**Specifications**:
- Height: 56px (minimum)
- Padding: 12px 16px
- Border Bottom: 1px solid `#2D2D2D` (optional)

---

### Notification Item
**Usage**: Notification list items

**Layout**:
```
┌─────────────────────────────────────┐
│ [🔔] New case assigned              │
│     2 minutes ago                   │
│     Case #CR-2024-001234            │
└─────────────────────────────────────┘
```

**Specifications**:
- Unread: Green dot indicator
- Read: No indicator, gray text
- Timestamp: 12px, Regular, Gray

---

## Progress Indicators

### Progress Bar
**Usage**: Show progress, loading states

**Specifications**:
- Height: 4px
- Background: `#2D2D2D`
- Fill: `#00C853`
- Border Radius: 2px

---

### Spinner
**Usage**: Loading indicator

**Specifications**:
- Size: 24px, 32px, 48px variants
- Color: `#00C853`
- Animation: 360° rotation, 1s linear infinite

**Figma Properties**:
- Create as component with rotation animation
- Use green stroke, 3px width

---

### Skeleton Loader
**Usage**: Content loading placeholder

**Specifications**:
- Background: `#2D2D2D`
- Border Radius: 4px
- Animation: Shimmer effect (opacity 0.3 → 0.7)
- Match content dimensions

---

## Alerts & Messages

### Alert Banner
**Usage**: System messages, errors, warnings

**Variants**:
- **Success**: Green background (`#00C853`), black text
- **Error**: Red background (`#F44336`), white text
- **Warning**: Yellow background (`#FFC107`), black text
- **Info**: Blue background (`#2196F3`), white text

**Specifications**:
- Padding: 12px 16px
- Border Radius: 4px
- Icon: 20px, left side
- Close Button: Right side, 20px icon

**Layout**:
```
┌─────────────────────────────────────┐
│ [✓] Success message            [×]  │
└─────────────────────────────────────┘
```

---

### Toast Notification
**Usage**: Temporary success/error messages

**Specifications**:
- Position: Top right (desktop), top center (mobile)
- Width: 320px (desktop), 90vw (mobile)
- Padding: 16px
- Border Radius: 8px
- Shadow: Subtle shadow for elevation
- Auto-dismiss: 5 seconds
- Animation: Slide in from right

---

## Maps & Location

### Map Container
**Usage**: Google Maps integration

**Specifications**:
- Border: 1px solid `#2D2D2D`
- Border Radius: 8px
- Height: 400px (default), responsive
- Background: `#1A1A1A` (while loading)

---

### Location Marker
**Usage**: Mark locations on map

**Variants**:
- **Case Location**: Red pin (`#F44336`)
- **Responder Location**: Green pin (`#00C853`)
- **User Location**: Blue pin (`#2196F3`)

**Specifications**:
- Size: 32px × 32px
- Icon: Map pin, centered

---

## Chat Components

### Chat Message
**Usage**: Individual chat messages

**Layout**:
```
┌─────────────────────────────────────┐
│ Sarah Johnson  2:30 PM              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ On my way to the case location  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Specifications**:
- Background: `#2D2D2D` (sent), `#1A1A1A` (received)
- Padding: 12px 16px
- Border Radius: 8px
- Max Width: 70%
- Timestamp: 12px, Regular, Gray

---

### Chat Input
**Usage**: Message input field

**Layout**:
```
┌─────────────────────────────────────┐
│ [📎] [Type a message...]      [📤] │
└─────────────────────────────────────┘
```

**Specifications**:
- Background: `#2D2D2D`
- Border: 1px solid `#4A4A4A`
- Border Radius: 24px
- Padding: 12px 20px
- Icon Buttons: 40px × 40px

---

## Data Visualization

### Chart Container
**Usage**: Charts and graphs

**Specifications**:
- Background: `#1A1A1A`
- Border: 1px solid `#2D2D2D`
- Border Radius: 8px
- Padding: 16px
- Chart Colors: Green (`#00C853`) primary, variations for multiple series

---

### Metric Card
**Usage**: Display single metric

**Layout**:
```
┌─────────────────────┐
│ Response Time       │
│                     │
│     12 min          │
│                     │
│ ↓ 2 min from avg    │
└─────────────────────┘
```

**Specifications**:
- Same as Stats Card
- Large Number: 32px, Bold, White
- Trend Indicator: Green/Red arrow, 12px text

---

## Empty States

### Empty State Container
**Usage**: When no data is available

**Layout**:
```
┌─────────────────────────────────────┐
│         [Icon]                      │
│                                     │
│    No Active Cases                  │
│                                     │
│    You don't have any active cases  │
│    at the moment.                   │
│                                     │
│    [+ Create New Case]              │
└─────────────────────────────────────┘
```

**Specifications**:
- Icon: 64px, Gray (`#4A4A4A`)
- Title: 18px, Semibold, White
- Description: 14px, Regular, Gray
- Action Button: Primary button style

---

## Component Naming Convention

### Figma Component Names
- `Button/Primary`
- `Button/Secondary`
- `Input/Text`
- `Input/Textarea`
- `Card/Standard`
- `Card/Case`
- `Badge/Status`
- `Navigation/SidebarItem`
- `Modal/Container`
- `Alert/Success`
- `Chat/Message`

### Variant Properties
- **State**: Default, Hover, Active, Disabled, Error
- **Size**: Small, Medium, Large
- **Type**: Primary, Secondary, Tertiary

---

## Spacing System (Figma Auto Layout)

### Padding Presets
- **XS**: 4px
- **S**: 8px
- **M**: 16px
- **L**: 24px
- **XL**: 32px

### Gap Presets
- **XS**: 4px
- **S**: 8px
- **M**: 16px
- **L**: 24px

### Use Auto Layout
- Enable Auto Layout on all components
- Use consistent padding and gaps
- Set constraints for responsive behavior
- Use "Fill Container" for flexible elements

---

## Color Styles (Figma)

### Create Color Styles
1. **Primary/Green**: `#00C853`
2. **Primary/Green Dark**: `#00A043`
3. **Primary/Green Light**: `#4CAF50`
4. **Neutral/Black**: `#000000`
5. **Neutral/Charcoal**: `#1A1A1A`
6. **Neutral/Dark Gray**: `#2D2D2D`
7. **Neutral/Medium Gray**: `#4A4A4A`
8. **Neutral/Light Gray**: `#6B6B6B`
9. **Neutral/White**: `#FFFFFF`
10. **Status/Success**: `#00C853`
11. **Status/Warning**: `#FFC107`
12. **Status/Error**: `#F44336`
13. **Status/Info**: `#2196F3`

---

## Text Styles (Figma)

### Create Text Styles
1. **Heading/H1**: 32px, Bold, White
2. **Heading/H2**: 24px, Semibold, White
3. **Heading/H3**: 20px, Semibold, White
4. **Heading/H4**: 18px, Semibold, White
5. **Body/Large**: 16px, Regular, White
6. **Body/Regular**: 14px, Regular, White
7. **Body/Small**: 12px, Regular, White
8. **Body/Tiny**: 10px, Regular, Gray
9. **Label/Medium**: 14px, Medium, White
10. **Label/Small**: 12px, Medium, Gray
11. **Monospace/CaseID**: 14px, Regular, White, Courier New

---

## Best Practices for Figma

1. **Use Components**: Create reusable components for all UI elements
2. **Auto Layout**: Use Auto Layout for all components and frames
3. **Variants**: Use component variants for states (hover, active, disabled)
4. **Constraints**: Set proper constraints for responsive design
5. **Naming**: Use clear, consistent naming (Component/Type/Variant)
6. **Styles**: Create and use color and text styles
7. **Frames**: Use frames for screens, not groups
8. **Grids**: Use 4px grid for alignment
9. **Spacing**: Use consistent spacing (4px base unit)
10. **Documentation**: Add descriptions to components explaining usage

---

This component library provides all the building blocks needed to create the CRCL interface in Figma. Each component is designed to be simple, functional, and consistent with the black and green theme.

