# Scaling Guide

This guide explains how to scale the WholesaleHub application for production environments.

## Horizontal Scaling

The application is designed to scale horizontally by running multiple instances behind a load balancer.

### Docker Compose Scaling

Scale the application using Docker Compose:

```bash
# Scale to 5 app instances
docker-compose -f docker-compose.prod.yml up --scale app=5

# Scale to 10 app instances
docker-compose -f docker-compose.prod.yml up --scale app=10
```

### Kubernetes Scaling

For Kubernetes deployments, scale using:

```bash
# Scale deployment to 5 replicas
kubectl scale deployment wholesalehub-app --replicas=5

# Autoscale based on CPU usage
kubectl autoscale deployment wholesalehub-app --cpu-percent=70 --min=3 --max=10
```

## Load Balancing

The application uses Nginx as a load balancer with the following features:

- Round-robin distribution of requests
- Health checks for backend instances
- SSL termination
- Gzip compression
- Security headers

### Load Balancer Configuration

The load balancer is configured in `loadbalancer.conf` with:

- Upstream server definitions
- Proxy settings for backend communication
- Security headers
- Gzip compression

## Resource Management

### Docker Resource Limits

Set resource limits in docker-compose.prod.yml:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Kubernetes Resource Limits

For Kubernetes, set resources in the deployment:

```yaml
spec:
  containers:
  - name: app
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```

## Health Checks

The application includes health check endpoints:

- `/health` - Returns JSON health status
- Container-level health checks in Docker configuration

### Health Check Configuration

Docker health checks are configured as:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Monitoring and Metrics

### Docker Monitoring

Monitor Docker containers with:

```bash
# View resource usage
docker stats

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs app
```

### Kubernetes Monitoring

For Kubernetes, use:

```bash
# View resource usage
kubectl top pods

# View logs
kubectl logs -f deployment/wholesalehub-app

# View events
kubectl get events
```

## Performance Tuning

### Nginx Tuning

Adjust Nginx settings in nginx.conf:

- Worker connections
- Keepalive timeout
- Gzip settings
- Cache settings

### Application Tuning

Optimize the application by:

- Adjusting database connection pools
- Implementing caching strategies
- Optimizing database queries
- Using CDN for static assets

## Auto Scaling

### Docker Auto Scaling

For Docker environments, implement auto scaling with:

- Docker Swarm mode
- External load balancers
- Monitoring tools (Prometheus, Grafana)

### Kubernetes Auto Scaling

Kubernetes provides Horizontal Pod Autoscaler (HPA):

```bash
# Create HPA
kubectl autoscale deployment wholesalehub-app --cpu-percent=70 --min=3 --max=10

# View HPA status
kubectl get hpa
```

## High Availability

### Multi-Node Deployment

Deploy across multiple nodes for high availability:

- Docker Swarm with multiple manager nodes
- Kubernetes with multiple worker nodes
- Load balancer with health checks

### Database High Availability

For database high availability:

- Use managed database services (Supabase, AWS RDS)
- Implement read replicas
- Use connection pooling

## Best Practices

### Scaling Best Practices

1. Start with 2-3 instances for small deployments
2. Monitor resource usage before scaling
3. Implement health checks for all services
4. Use load testing to determine scaling needs
5. Implement circuit breakers for external services

### Resource Allocation

Recommended resource allocation:

- Small deployment: 2-3 instances, 256MB RAM each
- Medium deployment: 5-10 instances, 512MB RAM each
- Large deployment: 10+ instances, 1GB RAM each

### Monitoring

Monitor key metrics:

- CPU usage
- Memory usage
- Response times
- Error rates
- Database connection counts

## Troubleshooting

### Common Scaling Issues

1. **Resource Exhaustion**
   - Solution: Increase resource limits or add more instances

2. **Session Affinity Issues**
   - Solution: Use sticky sessions or external session storage

3. **Database Connection Limits**
   - Solution: Implement connection pooling or increase database limits

4. **Load Balancer Bottlenecks**
   - Solution: Scale load balancer or use multiple load balancers

### Performance Issues

1. **Slow Response Times**
   - Check resource usage
   - Optimize database queries
   - Implement caching

2. **High Error Rates**
   - Check application logs
   - Verify health check endpoints
   - Review resource limits

## Conclusion

The WholesaleHub application is designed for horizontal scaling with:

- Container-based deployment
- Load balancing
- Health checks
- Resource management
- Monitoring capabilities

Follow the guidelines in this document to successfully scale the application for your production environment.