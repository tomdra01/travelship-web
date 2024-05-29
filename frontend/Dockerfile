# Stage 1: Build the Angular app
FROM node:20.9.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG configuration=production
RUN npm run build -- --configuration=$configuration

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
