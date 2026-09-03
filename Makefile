.PHONY: install test build run docker-build docker-up

install:
	@echo "No dependencies to install for the static frontend."

test:
	@echo "Running DevVault tests..."
	@node tests/test.js

build:
	@echo "Checking DevVault frontend build..."
	@echo "Static HTML/CSS/JavaScript project - no compilation required."

run:
	@echo "Starting DevVault..."
	@echo "Open frontend/index.html in your browser."

# Needed from M4 onwards
docker-build:
	@echo "TODO: docker build for frontend and backend" && exit 1

docker-up:
	docker compose up --build