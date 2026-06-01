# Vehicle Tax Verification System - Backend API

Complete backend API built with Node.js, Express.js, and MongoDB.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## API Endpoints

### Officers
- `POST /api/officers/register` - Register new officer
- `GET /api/officers` - Get all officers (requires auth)
- `GET /api/officers/:id` - Get officer by ID (requires auth)
- `PUT /api/officers/:id` - Update officer (requires auth)
- `DELETE /api/officers/:id` - Delete officer (requires auth)

### Owners
- `POST /api/owners/register` - Register new owner
- `GET /api/owners` - Get all owners (requires auth)
- `GET /api/owners/:id` - Get owner by ID (requires auth)
- `PUT /api/owners/:id` - Update owner (requires auth)
- `DELETE /api/owners/:id` - Delete owner (requires auth)

### Vehicles
- `POST /api/vehicles/register` - Register new vehicle (requires auth)
- `GET /api/vehicles` - Get all vehicles (requires auth)
- `GET /api/vehicles/:id` - Get vehicle by ID (requires auth)
- `GET /api/vehicles/plate/:plateNumber` - Get vehicle by plate number
- `GET /api/vehicles/owner/:ownerId` - Get vehicles by owner (requires auth)
- `GET /api/vehicles/verify/:plateNumber` - Verify vehicle status

## Project Structure

```
backend/
├── config/
│   └── index.js              # Configuration management
├── controllers/
│   ├── officerController.js  # Officer logic
│   ├── ownerController.js    # Owner logic
│   └── vehicleController.js  # Vehicle logic
├── models/
│   ├── Admin.js              # Admin schema
│   ├── Checkpoint.js         # Checkpoint schema
│   ├── Officer.js            # Officer schema
│   ├── Payment.js            # Payment schema
│   ├── Vehicle.js            # Vehicle schema
│   ├── VehicleOwner.js       # Owner schema
│   └── VerificationLog.js    # Verification log schema
├── middleware/
│   └── auth.js               # JWT authentication
├── routes/
│   ├── officerRoutes.js      # Officer routes
│   ├── ownerRoutes.js        # Owner routes
│   └── vehicleRoutes.js      # Vehicle routes
├── utils/
│   └── jwt.js                # JWT utilities
├── .env.example              # Environment template
├── index.js                  # Express server entry point
└── package.json              # Dependencies
```

## Models

### VehicleOwner
- fullName, email, phone, password, status

### Officer
- fullName, email, phone, password, assignedCheckpoint, status

### Vehicle
- plateNumber, ownerId, vehicleType, model, year, color, taxAmount, taxStatus, taxExpiryDate

### Checkpoint
- name, location, latitude, longitude, status

### Payment
- vehicleId, ownerId, amount, paymentMethod, status, validMonths, newExpiryDate

### VerificationLog
- vehicleId, officerId, plateNumber, ownerName, taxStatus, checkpointId

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is returned when registering or logging in and expires based on `JWT_EXPIRE` setting.

## Error Handling

All endpoints return structured responses:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

## Development Notes

- Passwords are hashed with bcryptjs before storage
- MongoDB queries use indexes for performance
- CORS is configured for frontend communication
- Environment variables should be set for production deployment
