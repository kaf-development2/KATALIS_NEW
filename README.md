# TailAdmin Dashboard

A modern, responsive admin dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📊 Interactive charts with Recharts
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and React 19
- 🔷 TypeScript for type safety
- 🎯 Dashboard with statistics cards
- 📈 Revenue and profit visualization
- 🧭 Sidebar navigation with multiple menu items

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- Docker Desktop (optional, for containerized deployment)

### Option 1: Docker (Recommended for Production)

**Quick Start with Docker:**

```bash
# Clone repository
git clone https://github.com/kaf-development2/KATALIS_NEW.git
cd KATALIS_NEW

# Run with Docker Compose
docker-compose up --build
```

Application will run at: **http://localhost:4000**

For detailed Docker instructions, see [DOCKER_README.md](./DOCKER_README.md)

### Option 2: Local Development

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Dashboard page
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── Sidebar.tsx      # Navigation sidebar
│       ├── Header.tsx       # Top header with search
│       ├── StatsCard.tsx    # Statistics cards
│       ├── StatisticsChart.tsx  # Line/Area charts
│       ├── RevenueChart.tsx     # Circular progress chart
│       └── ProgressBar.tsx      # Progress indicators
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library
- **ESLint** - Code linting

## Dashboard Components

### Stats Cards
- Active Deal
- Revenue Total
- Closed Deals

### Charts
- Statistics with Monthly/Quarterly/Annually views
- Line/Area charts for profit tracking
- Circular progress for revenue goals
- Progress bars for Marketing and Sales

### Navigation
- Collapsible sidebar
- Dashboard submenu (eCommerce, Analytics, Marketing, CRM, Stocks, SaaS, Logistics)
- AI Assistant
- E-commerce
- Calendar
- User Profile
- Task
- Forms

## License

MIT License

## Author

Built with ❤️ for modern web dashboards
