# Travelship

## Deployed Application

### Production Environment
http://travelship.net/
### Test Environment
http://164.68.109.76/

## About the Project
Travelship is designed to connect travelers around the world, enabling them to plan their travels collaboratively. Users can create travel plans that are either public or private, with private plans featuring unique join codes for added exclusivity and security.

## Getting Started

### Prerequisites
- Node.js
- Angular CLI
- .NET SDK
- PostgreSQL

### Setting Up the Environment
Ensure that your PostgreSQL database is up and running.

### Running the Application

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the Angular server:
    ```bash
   ng serve
4. Access the frontend by visiting http://localhost:4200 in your web browser.

#### Backend

##### Setting up Environment Variables
1. Create a .env file in the HttpApi directory.
2. It has to contain the DB_CON variable
    ```bash
    DB_CON=your db connection string
    UNSPLASH_KEY=your unsplash key
    RAPIDAPI_KEY=api key from https://rapidapi.com/ntd119/api/sky-scanner3 

##### HttpApi
1. Navigate to the HttpApi directory:
   ```bash
   cd backend/HttpApi
2. Run the Http API:
   ```bash
   dotnet run

##### WebsocketApi
1. Navigate to the WebsocketApi directory:
   ```bash
   cd backend/wsapi
2. Run the Websocket API:
   ```bash
   dotnet run

### Running Tests

##### Backend Tests
1. Navigate to the test directory:
   ```bash
   cd backend/test
2. Run the tests, whilst the backend is running:
   ```bash
   dotnet test
   
##### Frontend Tests
1. Navigate to the frontend directory:
   ```bash
   cd frontend/test-cafe
2. Run the tests:
   ```bash
   testcafe chrome angular-test.js

### Authors
Martin Grulyo - martingrulyo@gmail.com
Tomas Dracka - tomidracka@gmail.com

### License
This project is licensed under the MIT License - see the LICENSE file for details.
