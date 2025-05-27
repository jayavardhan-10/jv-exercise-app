# Exercise App

A full-stack exercise and workout management application built with React, Node.js, and MongoDB.

## Features

- Exercise library with different categories (Strength, Cardio, Core, Warmup, Stretching)
- Custom workout creation and management
- Workout execution with timer functionality
- Exercise instructions and animated GIFs
- Workout history tracking
- User authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB credentials:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

5. Seed the database with exercises:
   ```bash
   node seeds/exerciseSeeds.js
   ```

6. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create environment variables:
   ```bash
   echo VITE_API_URL=http://localhost:5000/api > .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth (with localStorage fallback)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
