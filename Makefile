# Makefile for WholesaleHub deployment

# Variables
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
APP_NAME = wholesalehub

# Default target
.PHONY: help build deploy stop logs clean

help:
	@echo "WholesaleHub Deployment Makefile"
	@echo "=================================="
	@echo "Available targets:"
	@echo "  build      - Build the application"
	@echo "  deploy     - Deploy the application"
	@echo "  deploy-prod - Deploy to production"
	@echo "  scale-N    - Scale to N replicas (e.g., scale-3)"
	@echo "  stop       - Stop all services"
	@echo "  logs       - View application logs"
	@echo "  logs-prod  - View production logs"
	@echo "  clean      - Clean build artifacts"

build:
	$(DOCKER_COMPOSE) build

deploy:
	$(DOCKER_COMPOSE) up -d

deploy-prod:
	$(DOCKER_COMPOSE_PROD) up -d

scale-%:
	$(DOCKER_COMPOSE) up -d --scale app=$*

stop:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE_PROD) down

logs:
	$(DOCKER_COMPOSE) logs -f

logs-prod:
	$(DOCKER_COMPOSE_PROD) logs -f

clean:
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE_PROD) down -v
	rm -rf build/

# Health check
.PHONY: health
health:
	@echo "Checking application health..."
	@curl -f http://localhost/health || echo "Health check failed"

# Install dependencies
.PHONY: install
install:
	npm install

# Run development server
.PHONY: dev
dev:
	npm start

# Build for production
.PHONY: build-prod
build-prod:
	npm run build