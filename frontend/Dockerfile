# Stage 1: Build the Angular app in Node.js
FROM node:20.9.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Apache
FROM httpd:2.4-alpine
COPY --from=build /app/dist/frontend /usr/local/apache2/htdocs/
COPY apache.conf /usr/local/apache2/conf/httpd.conf
EXPOSE 80
CMD ["httpd-foreground"]
