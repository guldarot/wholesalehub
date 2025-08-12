@echo off
REM Deployment script for WholesaleHub application

echo WholesaleHub Deployment Script
echo ================================

REM Check if docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Function to build and deploy
if "%1"=="deploy" (
    echo Building and deploying application...
    
    REM Build the application
    echo Building application...
    docker-compose build
    
    REM Start the services
    echo Starting services...
    docker-compose up -d
    
    echo Deployment completed!
    echo Access the application at http://localhost
    goto :eof
)

REM Function to scale the application
if "%1"=="scale" (
    if "%2"=="" (
        echo Please specify the number of replicas
        echo Usage: deploy.bat scale ^<number_of_replicas^>
        exit /b 1
    )
    
    echo Scaling application to %2 replicas...
    docker-compose up -d --scale app=%2
    
    echo Application scaled to %2 replicas
    goto :eof
)

REM Function to deploy to production
if "%1"=="deploy-prod" (
    echo Deploying to production...
    
    REM Build the application
    echo Building application...
    docker-compose -f docker-compose.prod.yml build
    
    REM Start the services
    echo Starting production services...
    docker-compose -f docker-compose.prod.yml up -d
    
    echo Production deployment completed!
    echo Access the application at http://localhost:8080
    goto :eof
)

REM Function to stop all services
if "%1"=="stop" (
    echo Stopping all services...
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    echo All services stopped
    goto :eof
)

REM Function to view logs
if "%1"=="logs" (
    echo Viewing application logs...
    docker-compose logs -f
    goto :eof
)

REM Function to view production logs
if "%1"=="logs-prod" (
    echo Viewing production logs...
    docker-compose -f docker-compose.prod.yml logs -f
    goto :eof
)

REM Default help
echo Usage: deploy.bat {deploy^|scale^|deploy-prod^|stop^|logs^|logs-prod}
echo.
echo Commands:
echo   deploy       Build and deploy the application
echo   scale ^<n^>    Scale the application to n replicas
echo   deploy-prod  Deploy to production environment
echo   stop         Stop all services
echo   logs         View application logs
echo   logs-prod    View production logs