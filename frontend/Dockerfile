# Use the official Node.js image to build the app
FROM node:17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Use Nginx to serve the app
FROM nginx:alpine
COPY --from=build /app/dist/your-angular-project /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
