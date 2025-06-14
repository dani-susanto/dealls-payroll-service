#!/bin/sh

if [ ! -f .env ]; then
  echo "📝 Creating .env file from example..."
  cp .env.example .env
fi

echo "🧹 Cleaning up existing environment..."
make reset

echo "🚀 Starting Docker containers..."
make start

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🛠️ Running fresh migrations..."
make migrate

echo "🌱 Running seeders..."
make seed

echo "✅ Installation completed!"
