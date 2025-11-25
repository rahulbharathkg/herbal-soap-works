#!/bin/bash

# Start the backend
echo "Starting backend..."
cd backend
npm run dev &

# Start the frontend
echo "Starting frontend..."
cd ../frontend
npm start
