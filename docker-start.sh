#!/bin/bash

echo "🐳 Starting TailAdmin Dashboard with Docker..."
echo "📦 Building and running container on port 4000..."
echo ""

docker-compose up --build

echo ""
echo "✅ Application should be running at http://localhost:4000"
