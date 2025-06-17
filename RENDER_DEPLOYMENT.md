# Deploying iBikers Backend to Render

This guide provides step-by-step instructions for deploying the iBikers backend to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your MongoDB Atlas connection string
3. Your project's environment variables

## Deployment Steps

### Option 1: Deploy using the Render Dashboard

1. **Create a new Web Service**
   - Log in to your Render account
   - Click on "New +" and select "Web Service"
   - Connect your GitHub repository or use the public repo URL

2. **Configure the service**
   - Name: `ibikers-backend` (or your preferred name)
   - Environment: `Node`
   - Region: Choose the region closest to your users
   - Branch: `main` (or your deployment branch)
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

3. **Set environment variables**
   - Click on "Environment" tab
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render will automatically assign the PORT)
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `EMAIL_USER`: Your email address for sending notifications
     - `EMAIL_PASS`: Your email password or app password

4. **Deploy the service**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Option 2: Deploy using render.yaml (Blueprint)

1. **Use the provided render.yaml file**
   - The render.yaml file is already configured in your project
   - Push this file to your GitHub repository

2. **Create a new Blueprint instance**
   - In Render dashboard, click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will detect the render.yaml file and configure services accordingly

3. **Set environment variables**
   - You'll be prompted to set values for environment variables marked as `sync: false`
   - Enter your MongoDB URI, JWT secret, and email credentials

4. **Apply the Blueprint**
   - Click "Apply" to create and deploy the services

## Verifying Deployment

1. Once deployed, Render will provide a URL for your service (e.g., `https://ibikers-backend.onrender.com`)
2. Test the API by accessing an endpoint, such as `https://ibikers-backend.onrender.com/bikes`

## Updating the Frontend

After deploying the backend, update your frontend API configuration to point to the new backend URL:

1. Update the API_BASE_URL in your frontend config:
   ```javascript
   // In frontend/src/config/api.js
   const API_BASE_URL = 'https://ibikers-backend.onrender.com';
   ```

2. Redeploy your frontend application

## Troubleshooting

- **Connection Issues**: Ensure your MongoDB Atlas IP whitelist allows connections from anywhere (0.0.0.0/0)
- **CORS Errors**: The backend is configured to accept requests from any origin in production
- **Environment Variables**: Double-check that all required environment variables are set correctly
- **Logs**: Check the Render logs for any errors or issues