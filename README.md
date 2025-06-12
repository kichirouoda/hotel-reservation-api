# Hotel Reservation API

A simple REST API for hotel reservations built with Express, TypeScript, Prettier, ESLint, and PostgreSQL.

## Features

- Create and manage room types and rooms
- Create reservations with optional initial payments
- Search reservations by date range
- Handle partial payments and track outstanding balances

## Prerequisites

    - Node.js (v20+)
    - PostgreSQL (v12+)
    - npm

## Setup

1. **Clone the repository**

```bash
    git clone https://github.com/kichirouoda/hotel-reservation-api.git
    cd hotel-reservation-api
```
2. **Install dependencies**
```bash
    npm install
```
3. **Set up environment variables** 
    Create a `.env` file in the root directory and add the following variables:
```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=password
    DB_NAME=databases
    PORT=3000
```

5. **Set up the database and seeder**
```bash
    psql -U postgres -d databases -f src/config/schema.sql
    npx ts-node src/config/seed-db.ts
```
7. **Run the application**
```bash
    npm run dev
```
9. **API Endpoints**
    - GET /room/all-room-types : Get all room types
    - GET /room/room-types/:id : Get room type by ID
    - POST /room/room-types : Create a new room type
    - GET /room : Get all rooms
    - GET /room/:id : Get room by ID
    - GET /room?roomTypeId=1 : Get rooms by room type ID
    - POST /room : Create a new room
    - GET /reservations/:id : Get reservation by ID
    - GET /reservations?startDate={{start}}&endDate={{end}} : Get reservations by date range
    - POST /reservations : Create a new reservation
    - POST /reservations/{{reservation_id}}/payments : Create a new payment for a reservation

