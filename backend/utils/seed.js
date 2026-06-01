import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Checkpoint from '../models/Checkpoint.js';
import Officer from '../models/Officer.js';
import VehicleOwner from '../models/VehicleOwner.js';
import Vehicle from '../models/Vehicle.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-tax-db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Checkpoint.deleteMany({});
    await Officer.deleteMany({});
    await VehicleOwner.deleteMany({});
    await Vehicle.deleteMany({});

    console.log('Cleared existing data.');

    // Create Admin
    const admin = new Admin({
      fullName: 'System Admin',
      email: 'muhidiin090448@.com',
      phone: '0000000000',
      password: 'password'
    });
    await admin.save();
    console.log('Admin created: muhidiin090448@.com / password');

    // Create Checkpoints
    const checkpoint1 = await new Checkpoint({
      name: 'Main Entry Point',
      location: 'South Highway, Km 12'
    }).save();

    const checkpoint2 = await new Checkpoint({
      name: 'Port Checkpoint',
      location: 'East Harbor, Sector A'
    }).save();

    console.log('Checkpoints created.');

    // Create Officers
    const officer1 = new Officer({
      fullName: 'Officer Ahmed',
      email: 'officer1@example.com',
      phone: '111222333',
      password: 'password',
      assignedCheckpoint: checkpoint1._id
    });
    await officer1.save();
    console.log('Officer created: officer1@example.com / password');

    // Create Owner
    const owner1 = new VehicleOwner({
      fullName: 'Mohamed Ali',
      email: 'owner1@example.com',
      phone: '444555666',
      password: 'password'
    });
    await owner1.save();
    console.log('Owner created: owner1@example.com / password');

    // Create Vehicles
    const vehicle1 = new Vehicle({
      ownerId: owner1._id,
      plateNumber: 'ABC-123',
      vehicleType: 'Car',
      model: 'Toyota Corolla',
      year: 2022,
      color: 'White',
      taxAmount: 1500,
      taxStatus: 'Paid',
      taxExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });
    await vehicle1.save();

    const vehicle2 = new Vehicle({
      ownerId: owner1._id,
      plateNumber: 'XYZ-789',
      vehicleType: 'SUV',
      model: 'Nissan Patrol',
      year: 2020,
      color: 'Black',
      taxAmount: 2500,
      taxStatus: 'Expired',
      taxExpiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    });
    await vehicle2.save();

    console.log('Vehicles created.');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
