# Tragogo - Family GPS Tracker

A real-time family GPS tracking application built with Nuxt 4, PostgreSQL, and Google Maps.

## Features

- 🗺️ **Real-time Location Tracking** - Track family members on an interactive map
- 👨‍👩‍👧‍👦 **Family Management** - Invite members via email, QR code, or invitation code
- 📍 **Marked Locations** - Set up geofences for home, work, school, etc.
- 🔔 **Smart Notifications** - Get notified when family members arrive at marked locations
- 🏷️ **Smart Tag Support** - Track Samsung SmartTags and Apple AirTags
- 🎨 **Premium UI** - Beautiful glassmorphism design with smooth animations

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, Tailwind CSS
- **Backend**: Nuxt Server API, PostgreSQL
- **Real-time**: PostgreSQL LISTEN/NOTIFY with Server-Sent Events
- **Maps**: Google Maps JavaScript API
- **ORM**: Drizzle ORM
- **Authentication**: JWT tokens with bcrypt

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Google Maps API key

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd tragogo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `JWT_SECRET` - Secret for JWT token signing
- `SESSION_SECRET` - Secret for session management
- `SMTP_*` - Email configuration for invitations

### 4. Set up the database

Create a PostgreSQL database:

```bash
createdb tragogo
```

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Project Structure

```
tragogo/
├── assets/
│   └── css/
│       └── main.css              # Global styles with design system
├── components/
│   └── MapView.vue               # Google Maps component
├── composables/
│   ├── useAuth.ts                # Authentication composable
│   ├── useLocationTracking.ts   # Browser geolocation tracking
│   └── useLocationStream.ts     # Real-time location updates
├── pages/
│   ├── index.vue                 # Landing page with auth
│   ├── dashboard.vue             # Main dashboard
│   └── invite/
│       └── [code].vue            # Invitation acceptance
├── server/
│   ├── api/
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── family/               # Family management endpoints
│   │   ├── location/             # Location tracking endpoints
│   │   ├── locations/marked/     # Marked locations endpoints
│   │   └── tags/                 # Smart tag endpoints
│   ├── database/
│   │   ├── schema.ts             # Database schema
│   │   ├── client.ts             # Database client
│   │   └── migrations/           # Database migrations
│   ├── middleware/
│   │   └── auth.ts               # Auth middleware
│   └── utils/
│       ├── auth.ts               # Auth utilities
│       ├── email.ts              # Email utilities
│       ├── qrcode.ts             # QR code generation
│       └── geofence.ts           # Geofencing utilities
├── types/
│   └── index.ts                  # TypeScript types
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
└── drizzle.config.ts             # Drizzle ORM configuration
```

## Usage

### 1. Register an Account

Visit the landing page and create an account with your email and password.

### 2. Enable Location Tracking

Click "Start Tracking" in the dashboard to begin sharing your location.

### 3. Invite Family Members

Click "Invite Family Member" and enter their email address. They'll receive an invitation with:
- Email link
- QR code
- 8-character invitation code

### 4. Add Marked Locations

Click "Add Location" to create geofenced areas like:
- Home
- Work
- School
- Custom locations

Set the radius and enable notifications for arrivals.

### 5. Track Smart Tags

Add Samsung SmartTags or Apple AirTags to track items on the map.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Family Management
- `POST /api/family/invite` - Create invitation
- `POST /api/family/accept` - Accept invitation
- `GET /api/family/members` - Get family members

### Location Tracking
- `POST /api/location/update` - Update user location
- `GET /api/location/stream` - Real-time location stream (SSE)

### Marked Locations
- `POST /api/locations/marked/create` - Create marked location
- `GET /api/locations/marked/list` - List marked locations

### Smart Tags
- `POST /api/tags/add` - Add smart tag
- `GET /api/tags/list` - List smart tags

## Development

### Run database migrations

```bash
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Apply migrations
```

### View database

```bash
npm run db:studio    # Open Drizzle Studio
```

### Build for production

```bash
npm run build
npm run preview
```

## Deployment

### Environment Variables

Make sure to set all required environment variables in your hosting platform.

### Database

Ensure your PostgreSQL database is accessible and migrations are applied.

### Google Maps API

Configure API key restrictions in Google Cloud Console for security.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
