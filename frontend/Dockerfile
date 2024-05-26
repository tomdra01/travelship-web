# Stage 1: Build the Angular app in Node.js
FROM node:20.9.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# If building for production use the production script, else just build normally
RUN npm run build

# Stage 2: Serve the app with Apache
FROM httpd:2.4-alpine
COPY --from=build /app/dist/frontend /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
