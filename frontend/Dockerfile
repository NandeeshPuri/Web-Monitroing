# Step 1: Build the React app
# Use an official Node runtime as the parent image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the React app
# Use a lightweight web server to serve static content
FROM nginx:alpine

# Copy the build output from the previous stage to the web server's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to make the app accessible
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
