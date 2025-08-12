# Deployment Guide

This guide explains how to deploy the WholesaleHub application using Docker for easy scaling and production deployment.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 1.29+
- Node.js 18+ (for local development)

## Quick Start

### Development Deployment

1. Build and run the application:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost:80`

### Production Deployment

1. Build and run the production setup:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

2. Access the application at `http://localhost:8080`

## Scaling the Application

### Horizontal Scaling

To scale the application containers:

```bash
# Scale to 5 app instances
docker-compose -f docker-compose.prod.yml up --scale app=5
```

### Load Balancing

The production setup includes:
- Multiple app instances behind a load balancer
- Nginx reverse proxy for SSL termination
- Automatic distribution of requests

## Environment Configuration

Create a `.env` file with your configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Docker Images

The deployment uses the following images:
- `node:18-alpine` for building the application
- `nginx:alpine` for serving static files
- Multi-stage build to minimize image size

## Monitoring and Maintenance

### Health Checks

The application includes health check endpoints:
- `/health` - Basic health check
- `/metrics` - Performance metrics (when implemented)

### Logs

View container logs:
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
```

### Updates

To update the application:

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build
```

## SSL Configuration

For production SSL setup:

1. Place your SSL certificates in the `ssl/` directory:
   - `ssl/certificate.crt`
   - `ssl/private.key`

2. Update the nginx configuration to use SSL

## Backup and Recovery

### Database Backup

Supabase handles database backups automatically. For additional backups:

```bash
# Export database (requires Supabase CLI)
supabase db dump --project-ref your-project-id > backup.sql
```

### Application State

Application state is stored in:
- Supabase database (customers, orders, products, etc.)
- Local storage (user preferences, session data)

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "8080:80"  # Change 8080 to another port
   ```

2. **Build Failures**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -a
   docker-compose up --build
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $(id -u):$(id -g) .
   ```

### Performance Tuning

1. Adjust resource limits in docker-compose:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

2. Optimize nginx configuration for high traffic

## Kubernetes Deployment (Optional)

For advanced deployments, Kubernetes manifests are available in the `k8s/` directory.

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to production
      run: |
        docker-compose -f docker-compose.prod.yml up -d
```

## Security Considerations

1. Always use environment variables for secrets
2. Keep Docker images updated
3. Implement proper network segmentation
4. Use SSL/TLS for production deployments
5. Regular security audits of dependencies