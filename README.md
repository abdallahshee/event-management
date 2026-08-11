# Event Management App

A modern event management platform built with Next.js, React, and Supabase that allows authenticated users to browse and book events while giving administrators full control over event creation and management.

---

## Overview

This application is designed to simplify event booking and event administration.

Users can:

* Sign up and log in securely
* Browse available events
* Book events
* View their booked events and booking history

Administrators can:

* Create new events
* Edit event details
* Delete events
* Manage available event listings

The system ensures a clean separation between user permissions and admin capabilities.

---

## Features

### User Features

* Secure authentication
* Browse available events
* Book events
* View booked events
* Access personal booking history
* Responsive design across devices
* Email notifications for bookings and event updates

### Admin Features

* Create events
* Edit event information
* Delete events
* Cancel events when unavoidable circumstances occur
* Manage event availability
* Restricted admin-only access to event management

### Notification Features

* Booking confirmation emails
* Payment confirmation notifications
* Refund notifications
* Event cancellation notifications
* Newly created event notifications

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Mantine UI

### Backend / Backend as a Service (BaaS)

* Supabase

  * Authentication
  * PostgreSQL Database
  * File Storage
  * Row-Level Security (RLS)

### Deployment

* Vercel

---

## Core Functionality

### Authentication

Users must be logged in to:

* Book events
* Access booking history
* View personal dashboard data

Authentication is handled by Supabase Auth.

### Event Booking

Authenticated users can:

* Browse events created by admins
* Select an event
* Complete the booking process
* View booking confirmation

Important booking rules:

* Users cannot cancel an event once they have completed a booking.
* Booking cancellations can only be initiated by an administrator.

### Admin Access Control

Only administrators have permission to:

* Create events
* Update existing events
* Delete events
* Cancel events due to unavoidable circumstances

When an event is cancelled by an administrator:

* Users receive refund notifications
* Users are informed of the reason for cancellation
* Refund handling can be triggered through your payment workflow
* Email notifications are sent automatically

Admin permissions can be enforced using Supabase Row-Level Security (RLS) policies.

---

## Project Structure

```bash
event-management-app/
│
├── public/                     # Static assets such as images and icons
├── src/
│   ├── app/                    # Next.js App Router routes, layouts, providers
│   ├── components/             # Shared reusable UI components
│   ├── db/                     # Database schemas, queries, validations, and typed models
│   ├── server/                 # Server Actions and server-side auth helpers
│   ├── proxy.ts                # Next.js proxy (middleware) for Supabase session refresh
│   └── styles.css              # Global CSS entry file
│
├── drizzle.config.ts           # Database ORM configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project metadata and scripts
├── postcss.config.mjs          # Tailwind CSS v4 PostCSS configuration
├── README.md                   # Documentation
├── tsconfig.json               # TypeScript configuration
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/abdallahshee/event-management
```

Move into the project folder:

```bash
cd event-management-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Supabase Environment Variables Setup

This project uses Supabase as the backend-as-a-service (BaaS) for authentication, PostgreSQL database operations, and file storage.

### Step 1: Create a Supabase Project

1. Open the Supabase dashboard.
2. Create a new project.
3. Wait for project provisioning to finish.

### Step 2: Get API Credentials

Inside your Supabase project:

1. Open **Project Settings**.
2. Navigate to **API**.
3. Copy the following values:

   * Project URL
   * Anonymous Public Key

### Step 3: Create a `.env` File

Create a `.env` (or `.env.local`) file at the root of your project.

Example:

```env
# Public Client Variables (exposed to the browser — must be prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_public_anon_key

# Server-only Variables
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_public_anon_key
DATABASE_URL=postgresql://user:password@host:5432/db
```

### Step 4: Access Environment Variables

Example Supabase client setup:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)
```

### Important Notes

* Never expose your Supabase service role key on the frontend.
* Only use anonymous keys in browser code.
* Add `.env.local` to `.gitignore`.

---

## Notification System

The application uses the Resend API to send transactional email notifications.

### Notification Types

Users can receive notifications for:

* Successful bookings
* Payment confirmations
* Refund processing
* Event cancellations
* Newly created events

### Resend Integration

Resend can be connected through server-side functions to trigger emails during important actions.

Example use cases:

* Send booking confirmation after successful payment
* Notify users when an admin cancels an event
* Inform users when a refund has been processed
* Notify subscribed users about newly created events

---

## Database Structure

### Profile

Stores authenticated users from Supabase Auth.

### Events

Stores all event information including:

* Event title
* Description
* Date and time
* Location
* Availability

### Bookings

Stores booking relationships between users and events.

Each booking connects:

* A user
* An event
* Booking timestamp

---

## Deployment

You can deploy this application using:

* Vercel
* Netlify
* Render

When deploying:

1. Add environment variables to your hosting platform.
2. Redeploy the application.

---

## Future Improvements

* Email notifications for bookings
* Event reminders
* Calendar integration
* QR code ticket generation
* Admin dashboard analytics
* Payment integration

---

## Author

**Your Name**

* Portfolio: your-portfolio-link
* GitHub: [https://github.com/your-username](https://github.com/your-username)
* LinkedIn: your-linkedin-link

---

## License

This project is open-source and available under the MIT License.
