#!/bin/bash

# Deployment script for WholesaleHub application

echo "WholesaleHub Deployment Script"
echo "================================"

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to build and deploy
deploy() {
    echo "Building and deploying application..."
    
    # Build the application
    echo "Building application..."
    docker-compose build
    
    # Start the services
    echo "Starting services..."
    docker-compose up -d
    
    echo "Deployment completed!"
    echo "Access the application at http://localhost"
}

# Function to scale the application
scale() {
    local replicas=$1
    if [ -z "$replicas" ]; then
        echo "Please specify the number of replicas"
        echo "Usage: ./deploy.sh scale <number_of_replicas>"
        exit 1
    fi
    
    echo "Scaling application to $replicas replicas..."
    docker-compose up -d --scale app=$replicas
    
    echo "Application scaled to $replicas replicas"
}

# Function to deploy to production
deploy_prod() {
    echo "Deploying to production..."
    
    # Build the application
    echo "Building application..."
    docker-compose -f docker-compose.prod.yml build
    
    # Start the services
    echo "Starting production services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "Production deployment completed!"
    echo "Access the application at http://localhost:8080"
}

# Function to stop all services
stop() {
    echo "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    echo "All services stopped"
}

# Function to view logs
logs() {
    echo "Viewing application logs..."
    docker-compose logs -f
}

# Function to view production logs
logs_prod() {
    echo "Viewing production logs..."
    docker-compose -f docker-compose.prod.yml logs -f
}

# Main script logic
case "$1" in
    deploy)
        deploy
        ;;
    scale)
        scale $2
        ;;
    deploy-prod)
        deploy_prod
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    logs-prod)
        logs_prod
        ;;
    *)
        echo "Usage: $0 {deploy|scale|deploy-prod|stop|logs|logs-prod}"
        echo ""
        echo "Commands:"
        echo "  deploy       Build and deploy the application"
        echo "  scale <n>    Scale the application to n replicas"
        echo "  deploy-prod  Deploy to production environment"
        echo "  stop         Stop all services"
        echo "  logs         View application logs"
        echo "  logs-prod    View production logs"
        exit 1
        ;;
esac