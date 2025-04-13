# Car Pooling System

The Car Pooling System is a project developed to provide functionalities for managing carpooling activities such as authentication, ride creation, vehicle registration, and monitoring ride requests.

This project was developed as a technical assessment for MoveInSync.

## Features
- **Authentication**: Secure login for users.
- **Ride Creation**: Users can create new rides.
- **Vehicle Registration**: Adding and managing vehicles for carpooling.
- **Requesting a Ride**: Users can request to join a ride.
- **Checking Ride Status**: Track the status of rides.
- **Managing Riders**: Allow or deny riders for a ride.
- **Monitoring Requests**: Logs all actions for better monitoring.

## Installation

To set up the server, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Kartikay-Garg18/CarPoolingSystem.git
   cd CarPoolingSystem/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run start
   ```

## API Endpoints

### **Authentication Routes ( /api/auth )**
These routes handle user registration, login, and profile retrieval.

| Method | Endpoint       | Description                             | Parameters/Headers                          |
|--------|----------------|-----------------------------------------|---------------------------------------------|
| POST   | `/register`    | Registers a new user.                  | **Body:** `{ username, password, email }`  |
| POST   | `/login`       | Logs in an existing user.              | **Body:** `{ username, password }`         |
| GET    | `/profile`     | Retrieves the current user's profile.  | **Headers:** `Authorization: Bearer <token>` |


---

### **Ride Management Routes ( /api/ride )**
These routes provide functionalities for creating, joining, and managing rides.

| Method  | Endpoint                  | Description                                    | Parameters/Headers                          |
|---------|---------------------------|------------------------------------------------|---------------------------------------------|
| POST    | `/create`                 | Creates a new ride.                           | **Body:** `{ source, destination, time }`  |
| GET     | `/`                       | Retrieves all rides.                          | None                                        |
| POST    | `/join/:id`               | Requests to join a specific ride by its ID.   | **Params:** `id` (ride ID)                 |
| PATCH   | `/accept/:id/:userId`     | Accepts a user's request to join a ride.      | **Params:** `id` (ride ID), `userId`       |
| PATCH   | `/reject/:id/:userId`     | Rejects a user's request to join a ride.      | **Params:** `id` (ride ID), `userId`       |
| GET     | `/requests`               | Retrieves all requests related to rides.      | None                                        |
| GET     | `/status/:id`             | Checks the status of a specific ride request. | **Params:** `id` (ride request ID)         |
| GET     | `/:id`                    | Retrieves details of a specific ride by ID.   | **Params:** `id` (ride ID)                 |


---

### **Vehicle Management Routes ( /api/vehicle )**
These routes allow users to register and manage their vehicles.

| Method | Endpoint       | Description                             | Parameters/Headers                          |
|--------|----------------|-----------------------------------------|---------------------------------------------|
| POST   | `/create`      | Registers a new vehicle.               | **Body:** `{ make, model, registration }`  |


---

## Usage
- Once the server is running, use the REST API endpoints listed above to interact with the system.
- Refer to the source files for further customization or enhancements.
