# Weekly Schedule Manager

A real-time weekly schedule display system with an admin panel for managing status updates. Built with vanilla HTML, CSS, and JavaScript featuring a modern universe-themed design.

## Features

### Public Schedule View
- **Real-time Status Display**: Shows current activity based on weekly schedule
- **Live Progress Tracking**: Visual progress bar showing time remaining in current activity
- **Next Activity Preview**: Displays upcoming scheduled events
- **Interactive Background**: Animated universe theme with interactive elements
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dynamic Schedule Loading**: Schedule data loaded from localStorage for easy admin updates

### Admin Control Panel
- **Secure Authentication**: Password-protected admin access
- **Status Override System**: Temporarily override schedule with custom messages
- **Quick Preset Messages**: Pre-configured messages for common situations
- **Real-time Preview**: See how your custom message will appear to visitors
- **Live Sync**: Changes instantly reflect on the public schedule page
- **Modern UI**: Clean glassmorphic design with smooth animations

## Live Demo

- **Public Schedule**: [View Schedule](https://sahidmustakim.github.io/WeeklySchedule/)
- **Admin Panel**: [Admin Access](https://sahidmustakim.github.io/WeeklySchedule/admin/)

## Project Structure

```
WeeklySchedule/
├── index.html          # Main public schedule page
├── script.js           # Schedule logic and animations
├── style.css           # Public page styling
├── admin/
│   ├── index.html      # Admin panel interface
│   ├── script.js       # Admin panel logic
│   └── style.css       # Admin panel styling
└── README.md           # Project documentation
```

## Design Features

### Visual Elements
- **Universe Theme**: Radial gradient background with animated stars
- **Glassmorphism**: Modern frosted glass effect on cards
- **Smooth Animations**: Floating elements and interactive components
- **Color-Coded Activities**:
  - Blue: Class sessions
  - Violet: Counseling hours
  - Pink: Office hours

### Interactive Features
- **Interactive Elements**: Click and mouse interactions with animated components
- **Live Time Updates**: Real-time clock showing current day and time
- **Progress Visualization**: Animated progress bars for ongoing activities

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties, animations, and glassmorphism
- **JavaScript (ES6+)**: Vanilla JS for all functionality
- **Day.js**: Lightweight date/time manipulation library
- **LocalStorage**: Client-side data persistence

## Admin Panel

### Features
1. **Status Override Toggle**: Enable/disable custom status messages
2. **Custom Messages**: Write personalized status updates
3. **Quick Presets**: One-click messages for common scenarios
4. **Live Preview**: See changes before publishing
5. **Quick Links**: Direct access to public schedule view

### How to Use
1. Navigate to `/admin/` directory
2. Enter admin password
3. Toggle "Status Override" to enable custom messages
4. Select a preset or write a custom message
5. Click "Save & Activate" to publish
6. Changes appear instantly on the public schedule

## Deployment

This project is designed for **GitHub Pages** deployment:

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via `https://[username].github.io/[repository-name]/`

### Folder Structure for GitHub Pages
- Main schedule: `https://[username].github.io/[repository-name]/`
- Admin panel: `https://[username].github.io/[repository-name]/admin/`

## Data Storage

### LocalStorage Keys
- `scheduleData`: Complete schedule configuration
- `adminStatus`: Current admin status override

## Use Cases

- **Faculty Schedule Display**: Show office hours and class schedule
- **Counseling Availability**: Display counseling hour availability
- **Event Scheduling**: Track recurring weekly events
- **Status Broadcasting**: Communicate real-time availability changes

## Real-time Sync

The system uses the `storage` event listener to sync changes across browser tabs:
- Admin panel updates are instantly reflected on the public page
- No page refresh required
- Works across multiple open tabs/windows

## Customization

### Changing Colors
Edit CSS custom properties in `style.css`:
```css
:root {
    --accent-1: #6366f1;  /* Indigo */
    --accent-2: #a855f7;  /* Purple */
    --accent-3: #3b82f6;  /* Blue */
}
```

## Browser Compatibility

- Chrome/Edge (90+)
- Firefox (88+)
- Safari (14+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for personal and educational use.

## Author

**Sahid Hossain Mustakim**
- Email: mustakim.ptfaculty@cse.uiu.ac.bd
- GitHub: [@sahidmustakim](https://github.com/sahidmustakim)

## Acknowledgments

- Day.js for date/time handling
- Google Fonts (Outfit) for typography
- Inspired by modern glassmorphic design trends
