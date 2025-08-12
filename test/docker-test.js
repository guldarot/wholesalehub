// Simple test to verify Docker setup
const http = require('http');

// Test configuration
const TEST_PORT = 80;
const TEST_HOST = 'localhost';
const TIMEOUT = 10000;

console.log('Testing Docker deployment...');

// Test health endpoint
const healthTest = () => {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://${TEST_HOST}:${TEST_PORT}/health`, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const health = JSON.parse(data);
                        if (health.status === 'healthy') {
                            console.log('✓ Health check passed');
                            resolve(true);
                        } else {
                            console.log('✗ Health check failed: Invalid status');
                            resolve(false);
                        }
                    } catch (e) {
                        console.log('✗ Health check failed: Invalid JSON');
                        resolve(false);
                    }
                } else {
                    console.log(`✗ Health check failed: HTTP ${res.statusCode}`);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (e) => {
            console.log(`✗ Health check failed: ${e.message}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            console.log('✗ Health check failed: Timeout');
            req.destroy();
            resolve(false);
        });
        
        req.setTimeout(TIMEOUT);
    });
};

// Test main application
const appTest = () => {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://${TEST_HOST}:${TEST_PORT}/`, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200 && data.includes('<title>')) {
                    console.log('✓ Application is accessible');
                    resolve(true);
                } else {
                    console.log('✗ Application access failed: HTTP ' + res.statusCode);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (e) => {
            console.log('✗ Application access failed: ' + e.message);
            resolve(false);
        });
        
        req.setTimeout(TIMEOUT);
    });
};

// Run tests
(async () => {
    try {
        console.log('Starting Docker deployment tests...');
        
        // Test health endpoint
        const healthPassed = await healthTest();
        if (!healthPassed) {
            process.exit(1);
        }
        
        // Test main application
        const appPassed = await appTest();
        if (!appPassed) {
            process.exit(1);
        }
        
        console.log('✓ All tests passed! Docker deployment is working correctly.');
        process.exit(0);
    } catch (error) {
        console.error('Tests failed:', error.message);
        process.exit(1);
    }
})();