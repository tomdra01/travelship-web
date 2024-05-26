# Stage 1: Build the Angular app in Node.js
FROM node:20.9.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# If building for production use the production script, else just build normally
RUN npm run build

# Stage 2: Serve the app with http-server
FROM node:20.9.0-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist/frontend /app
EXPOSE 80
CMD ["http-server", "/app", "-p", "80"]
