# Overview

SecureHome is a full-stack home security monitoring system with real-time sensor data visualization and control capabilities. The application provides a mobile-first interface for monitoring multiple sensor types (motion, temperature, gas, door/window sensors, camera system, and power management) with WebSocket-based real-time updates. The system features automated alerts, customizable thresholds, comprehensive activity logging, and a polished glassmorphism loading screen for professional app initialization experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a Single Page Application (SPA) architecture
- **Routing**: Wouter for lightweight client-side routing with pages for home dashboard, alerts, history, and settings
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Design System**: Modern glassmorphism interface with professional loading screen, smooth animations, and mobile-first responsive design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Real-time Communication**: Custom WebSocket hook for live sensor data updates and system notifications
- **Build Tool**: Vite with custom alias configuration for clean import paths

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Development**: TypeScript with TSX for hot reloading in development mode
- **API Design**: RESTful endpoints for CRUD operations on sensors, settings, and activity logs
- **Real-time Updates**: WebSocket server integration for broadcasting sensor data changes
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request logging with performance metrics and response capturing

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle-kit for migrations and schema synchronization
- **Development Storage**: In-memory storage implementation with sample data for development/testing
- **Connection**: Neon serverless PostgreSQL for production deployment

## Database Schema Design
- **Users Table**: Authentication and user management
- **Sensor Data Table**: Time-series sensor readings with type, value, status, and timestamp
- **System Settings Table**: Configurable thresholds, automation preferences, and system state
- **Activity Log Table**: Audit trail for system events, alerts, and user actions
- **UUID Primary Keys**: Generated UUIDs for all entities to ensure uniqueness across distributed systems

## Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **User Storage**: Bcrypt password hashing with username/password authentication
- **Security**: Session-based authentication with HTTP-only cookies

## Real-time Communication
- **WebSocket Server**: Integrated with HTTP server for bidirectional communication
- **Message Broadcasting**: Automatic sensor data broadcasting to connected clients
- **Connection Management**: Reconnection logic and connection status indicators
- **Message Types**: Structured message format for different data types (sensors, settings, activities)

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon database connectivity
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **express**: Web application framework for REST API server
- **ws**: WebSocket library for real-time bidirectional communication

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design system
- **class-variance-authority**: Type-safe CSS class variant management
- **lucide-react**: Icon library with consistent design language

## Development and Build Tools
- **vite**: Modern build tool with hot module replacement and optimized bundling
- **typescript**: Static type checking for both frontend and backend code
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment
- **esbuild**: Fast JavaScript bundler for production server builds

## Data Management and Validation
- **@tanstack/react-query**: Powerful data fetching and caching library for React
- **zod**: Schema validation library integrated with Drizzle for runtime type safety
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Zod integration for form validation

## Utilities and Helpers
- **wouter**: Lightweight routing library for single-page applications
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility for dynamic styling
- **nanoid**: URL-safe unique ID generator for session management