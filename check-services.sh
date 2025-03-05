#!/bin/bash

# Script to check if OptiFit microservices are running correctly

echo "Checking OptiFit microservices..."
echo "=================================="

# Check User Service (port 4000)
echo -n "User Service (http://localhost:4000): "
if curl -s http://localhost:4000/health -o /dev/null; then
  echo "✅ Running"
else
  echo "❌ Not running or not responding"
fi

# Check AI Service (port 4001)
echo -n "AI Service (http://localhost:4001): "
if curl -s http://localhost:4001/health -o /dev/null; then
  echo "✅ Running"
else
  echo "❌ Not running or not responding"
fi

# Check Logging Service (port 4002)
echo -n "Logging Service (http://localhost:4002): "
if curl -s http://localhost:4002/health -o /dev/null; then
  echo "✅ Running"
else
  echo "❌ Not running or not responding"
fi

echo ""
echo "Database Containers"
echo "=================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep postgres

echo ""
echo "If services are not running, start them with:"
echo "docker-compose up -d"
echo ""
echo "To view logs:"
echo "docker-compose logs -f"
