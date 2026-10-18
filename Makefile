.PHONY: install test build run docker-build docker-up

install:
	cd react-frontend && npm install

test:
	@echo "Running DevVault tests..."
	@node tests/test.js

build:
	@echo "Building DevVault React frontend..."
	cd react-frontend && npm run build

run:
	@echo "Starting DevVault React frontend..."
	cd react-frontend && npm run dev

docker-build:
	docker compose build

docker-up:
	docker compose up --build