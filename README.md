# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup
- **Docker Deployment** - Containerized deployment with scaling capabilities

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Docker (for containerized deployment)
- Docker Compose (for containerized deployment)

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🐳 Docker Deployment

This application includes Docker configuration for easy deployment and scaling:

### Development Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost
```

### Production Deployment

```bash
# Build and run production setup
docker-compose -f docker-compose.prod.yml up --build

# Access at http://localhost:8080
```

### Scaling the Application

```bash
# Scale to N replicas
docker-compose -f docker-compose.prod.yml up --scale app=5
```

### Deployment Scripts

The project includes helper scripts for easier deployment:

```bash
# On Linux/Mac
./deploy.sh deploy       # Deploy application
./deploy.sh scale 3       # Scale to 3 replicas
./deploy.sh deploy-prod   # Deploy to production
./deploy.sh logs          # View logs

# On Windows
deploy.bat deploy         # Deploy application
deploy.bat scale 3        # Scale to 3 replicas
deploy.bat deploy-prod    # Deploy to production
deploy.bat logs           # View logs
```

### Makefile Commands

```bash
make deploy      # Deploy the application
make deploy-prod # Deploy to production
make scale-3     # Scale to 3 replicas
make logs        # View application logs
```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Development Docker Compose
├── docker-compose.prod.yml # Production Docker Compose
├── nginx.conf          # Nginx configuration
├── loadbalancer.conf   # Load balancer configuration
├── deploy.sh           # Deployment script (Linux/Mac)
├── deploy.bat          # Deployment script (Windows)
├── Makefile            # Makefile for deployment
└── k8s/                # Kubernetes deployment files
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

For Docker Deployment, see the Docker Deployment section above.


