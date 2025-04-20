const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

console.log('Initializing Firebase with environment variables');

// Create service account from environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
};

// Log configuration for debugging
console.log('Project ID:', serviceAccount.project_id);
console.log('Database URL:', process.env.FIREBASE_DATABASE_URL);

// Initialize Firebase Admin SDK with error handling
let app, rtdb;
try {
  // Check if app is already initialized
  if (admin.apps.length === 0) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    app = admin.app();
    console.log('Using existing Firebase Admin SDK instance');
  }
  
  // Initialize Realtime Database
  rtdb = admin.database();
  console.log('Firebase Realtime Database initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  process.exit(1);
}

// Create references
const collections = {
  garageStatus: rtdb.ref('garage_status'),
  parkingSpots: rtdb.ref('parking_spots')
};

// Test database connection with improved error handling
const testDatabaseConnection = async () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Testing database connection...');
      
      // Create a test reference
      const testRef = rtdb.ref('.info/connected');
      
      // Set up connection listener
      const connectionListener = testRef.on('value', (snapshot) => {
        if (snapshot.val() === true) {
          console.log('✅ Database connection successful');
          testRef.off('value', connectionListener);
          resolve(true);
        } else {
          console.log('⚠️ Not connected to database yet, waiting...');
        }
      }, (error) => {
        console.error('❌ Error in connection listener:', error);
        testRef.off('value', connectionListener);
        reject(error);
      });
      
      // Set a timeout
      setTimeout(() => {
        testRef.off('value', connectionListener);
        console.error('❌ Database connection test timed out');
        
        // Try to verify database URL
        console.log('Verifying database URL format...');
        const urlPattern = /^https:\/\/[a-z0-9-]+\.firebaseio\.com\/?$/;
        if (!urlPattern.test(process.env.FIREBASE_DATABASE_URL)) {
          console.error('❌ Database URL format appears incorrect. Should be: https://PROJECT-ID.firebaseio.com');
        }
        
        reject(new Error('Connection test timed out after 15 seconds'));
      }, 15000);
      
    } catch (error) {
      console.error('❌ Error in connection test setup:', error);
      reject(error);
    }
  });
};

// Initialize database structure
const initializeDatabase = async () => {
  try {
    console.log('Initializing database structure...');
    
    // Perform a simple write test first
    const testRef = rtdb.ref('connection_test');
    await testRef.set({
      timestamp: new Date().toISOString(),
      status: 'testing'
    });
    console.log('✅ Write test successful');
    await testRef.remove();
    
    // Check if garage_status exists
    const statusSnapshot = await collections.garageStatus.once('value');
    if (!statusSnapshot.exists()) {
      await collections.garageStatus.set({
        totalSpots: 10,  // Default to 10 spots
        occupiedSpots: 0,
        availableSpots: 10,
        lastUpdated: new Date().toISOString()
      });
      console.log('✅ Created garage_status');
    } else {
      console.log('✅ garage_status already exists');
    }

    // Check if parking_spots exists
    const spotsSnapshot = await collections.parkingSpots.once('value');
    if (!spotsSnapshot.exists()) {
      // Create default parking spots
      const defaultSpots = {};
      for (let i = 1; i <= 10; i++) {
        defaultSpots[`spot_${i}`] = {
          id: `spot_${i}`,
          name: `Parking Spot ${i}`,
          occupied: false,
          lastUpdated: new Date().toISOString()
        };
      }
      await collections.parkingSpots.set(defaultSpots);
      console.log('✅ Created parking_spots with default values');
    } else {
      console.log('✅ parking_spots already exists');
    }

    console.log('✅ Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return false;
  }
};

// Setup real-time listeners for database changes
const setupRealtimeListeners = () => {
  try {
    console.log('Setting up real-time database listeners...');
    
    // Listen for changes in garage status
    collections.garageStatus.on('value', (snapshot) => {
      const status = snapshot.val();
      console.log('Garage status updated:', status);
    }, (error) => {
      console.error('Error listening to garage status:', error);
    });
    
    // Listen for changes in parking spots
    collections.parkingSpots.on('value', (snapshot) => {
      const spots = snapshot.val();
      console.log('Parking spots updated:', spots);
    }, (error) => {
      console.error('Error listening to parking spots:', error);
    });
    
    console.log('Real-time listeners set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up real-time listeners:', error);
    return false;
  }
};

// Export a function to initialize everything
const initialize = async () => {
  try {
    // Test connection first
    await testDatabaseConnection();
    // Then initialize database
    await initializeDatabase();
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
};

module.exports = {
  admin,
  rtdb,
  collections,
  initializeDatabase,
  setupRealtimeListeners  // Export the new function
};