# Next.js Dashboard Application

A modern, full-stack dashboard application built with Next.js 14, featuring authentication, database integration, and real-time data visualization.

## Features

- 🔐 Authentication using NextAuth.js
- 💳 Dashboard with invoice and customer management
- 📊 Real-time revenue analytics and charts
- 🎨 Modern UI with Tailwind CSS
- 🚀 Server-side rendering and API routes
- 📱 Responsive design for mobile and desktop
- 🔍 Search and filtering capabilities
- 🗄️ PostgreSQL database integration

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Raw SQL with postgres.js
- **Icons:** Hero Icons
- **Fonts:** Next/Font with Inter and Lusitana

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_URL="your-postgresql-connection-string"
AUTH_SECRET="your-auth-secret"
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-dashboard
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
# Access the seed API route to populate the database
http://localhost:3000/seed
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/          # API routes
├── dashboard/    # Dashboard pages
├── lib/          # Utility functions and data fetching
├── ui/           # Reusable UI components
└── login/        # Authentication pages
```

## Features in Detail

### Authentication

- Secure login system with credentials
- Protected dashboard routes
- Session management

### Dashboard

- Overview page with key metrics
- Revenue visualization
- Latest invoices list
- Customer management
- Invoice CRUD operations

### Invoices

- Create, read, update, and delete invoices
- Status tracking (paid/pending)
- Search and filter functionality
- Pagination

## Deployment

This application is optimized for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is part of the Next.js Learn course and is available for learning purposes.
