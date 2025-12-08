# CRCL Project Structure

## Folder Organization

```
crcl-system/
├── index.html                      # Login page (entry point)
├── README.md                       # Project documentation
├── PROJECT_STRUCTURE.md           # This file
├── netlify.toml                   # Netlify deployment config
├── .gitignore                     # Git ignore file
│
├── css/                           # Stylesheets
│   ├── styles.css                 # Main/base styles
│   ├── components.css            # Component styles (buttons, cards, modals)
│   └── utilities.css             # Utility classes
│
├── js/                            # JavaScript modules
│   ├── app.js                     # Main application logic
│   ├── auth.js                    # Authentication functions
│   ├── data.js                    # Data management (LocalStorage)
│   ├── utils.js                   # Utility functions
│   ├── cases.js                   # Case management functions
│   ├── chat.js                    # Chat functionality
│   │
│   └── pages/                     # Page-specific scripts
│       ├── dispatcher-dashboard.js
│       ├── dispatcher-cases.js
│       ├── new-case.js
│       ├── case-detail.js
│       ├── chat.js
│       └── request-help.js
│
└── pages/                          # HTML pages
    ├── dispatcher/                # Dispatcher role pages
    │   ├── dashboard.html
    │   ├── cases.html
    │   ├── new-case.html
    │   ├── case-detail.html
    │   └── chat.html
    │
    ├── responder/                 # Responder role pages (to be implemented)
    │   └── dashboard.html
    │
    ├── manager/                   # Agency Manager pages (to be implemented)
    │   └── dashboard.html
    │
    ├── admin/                     # CMHA Admin pages (to be implemented)
    │   └── dashboard.html
    │
    └── public/                    # Public pages
        └── request-help.html
```

## File Descriptions

### Core Files

- **index.html**: Main login page and entry point
- **README.md**: Complete project documentation with setup instructions
- **netlify.toml**: Netlify deployment configuration
- **.gitignore**: Files to exclude from version control

### CSS Files

- **styles.css**: Base styles, layout, typography, color variables
- **components.css**: Reusable component styles (buttons, cards, badges, modals)
- **utilities.css**: Utility classes for spacing, text, display, etc.

### JavaScript Files

#### Core Modules
- **app.js**: Main application initialization, routing, event handlers
- **auth.js**: Authentication logic (login, logout, role checking)
- **data.js**: LocalStorage data management (users, cases, messages)
- **utils.js**: Helper functions (date formatting, ID generation, notifications)
- **cases.js**: Case management functions (create, update, filter, render)
- **chat.js**: Chat functionality (conversations, messages)

#### Page Scripts
- **pages/dispatcher-dashboard.js**: Dispatcher dashboard logic
- **pages/dispatcher-cases.js**: Cases list page logic
- **pages/new-case.js**: New case form logic with dynamic questions
- **pages/case-detail.js**: Case detail view logic
- **pages/chat.js**: Chat page initialization
- **pages/request-help.js**: Public request form logic

### HTML Pages

#### Dispatcher Pages
- **dashboard.html**: Main dashboard with statistics and active cases
- **cases.html**: Full cases list with filters and search
- **new-case.html**: Create new case form
- **case-detail.html**: Detailed case view with timeline and actions
- **chat.html**: Messaging interface

#### Public Pages
- **request-help.html**: Public form for crisis requests

## Data Storage

All data is stored in browser LocalStorage:
- `crcl_users`: User accounts
- `crcl_cases`: All cases
- `crcl_messages`: Chat messages
- `crcl_current_user`: Currently logged in user

## Default Accounts

For testing:
- **Dispatcher**: dispatcher@crcl.ca / dispatcher123
- **Responder**: responder@crcl.ca / responder123
- **Manager**: manager@crcl.ca / manager123
- **Admin**: admin@crcl.ca / admin123

## Deployment

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Build settings: Leave empty (static site)
4. Publish directory: `/` (root)
5. Deploy!

### Other Hosting
Any static file hosting service will work:
- GitHub Pages
- Vercel
- AWS S3
- Any web server

## Development

1. Open `index.html` in a browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```
3. Access at `http://localhost:8000`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All functionality is client-side only
- Data persists in LocalStorage
- No backend required
- Fully functional for demo/testing
- Can be easily extended with a backend API

