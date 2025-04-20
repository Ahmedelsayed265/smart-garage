const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Service account configuration
const serviceAccount = {
  type: "service_account",
  project_id: "smart-garage-93705",
  private_key_id: "2afa50d13d6ca502f632b103b4ee7eb671515171",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcNxykS0snnyST
Hzdl76wV0ctaLBgEw/+UV+48t9v5tltmzE5sbOUX/XpjAa4uxnhOOduR1pfhIMGK
nG5kZglUVCzv75kbvCU31hsaQDIKA96yQnixcoeNM3o5X1JG4KZBx0yywRjWtjzB
nEVa3yNSarwmsj/3xU82sTaINHmsPutg+J1asDSgFXm21wd7vUdPf6ThYflLsnxE
e59hhvN8+ja3CqOo6zK6KWv6ZvTk1syNsJxcy+reEdNdPeYPpkTQY1wSSJA2UvHj
QJEuGGLSnszcD4Xm3PWUXXnQMNlqS9rgqbEFcZY9vFmOpwQhCzppqNvkymVsrkLX
E1gDySFpAgMBAAECggEALRcPw0gzdEJur70lj7a6aqFRXP5IULl9HHfArSgMX54K
KwtMR4Eoi3f4VktiyesTeRj5r2vcH1mgp2wOYnpOELlHlj1eAULN8Bfj5sUcOda/
A4r+wX6s6KmQriypYR/givlu5+8H0fbwi8gen1OvHNIEAnxfArGg3Zb9jngILc83
BGh5etkUK8W70/ImE8QL6/4WWkFy7ocUGDcQIsDtlBNfNBiW8SfMmQacTOX45wIL
Sls4VPJlsnYC9wWAiWYj4IytIiercXhP1vGUEErOMEI9+pfaICG/EauD9zeekGbv
LqlJ3TGbZFH8mRv36yUBjDihvdyodlV25TPWT25BLQKBgQD1K39gyAXHcWd3APrq
VWyV9yWcOJRdtyes1thESZ+plMIY/O63pDA+mmE4V05Xupjr+6LH4GvQVFmKZxd0
XF729h3n/pcWpdPLOiLfn1RqtZUDFYHAAIShzSXl7FlGMthbbWzWXHH1VfYXbxtm
FLo2JUBXTfUJ2Po5yauONONx+wKBgQDl8Wo+b7SJg+GfZkAKflrsmU9mr3vqJDu0
EM3pL4BDpk7BdanH7cj68CkqgiTsNAKnuzG9XF5f2VXlA6Xoq0WtYRS3diy5A2ea
g1DNR5cSIkHaKo+XPJi1sdbXz403JgYiiB5W3TRY7XisBStozQTdjgZO25SyuQoI
M0KYvGaA6wKBgCm/tnkslo9X6F6DdDbjRRJke6sWl209+yubikhWoTGne0X2DFCJ
TQ3cDCIj+9tEkzXcK+QNe06Gjpja5UuTTziOwJj46ZGZu28n/zhFUYK6WR2lU+r2
K5/B52o3zRv/HIi1IYt/QoicksN60BeZ//uobERxqgB7SmD8zpHwv6pxAoGAfqZe
z271cHy8S/Cku2LnL8QtkLB9PvSgEcjjsVlhe2FhpXrqfd1Bwr1+3xP5xEPNZpdb
iSIUNRTfE5nTyvhzE1ESeQ5VCb6PVPKZEcgptGo7/S9OEY3lysXeQNXnwQVngaOZ
mlySVZzOx2i9hSbPVDzCyrJ1D4+NsACT4M58YusCgYEAjfbRtq+cTVzcO5x4DW1M
CNmSZYOESF+MpkzC+D30X1X5xl/cCUy6/+Hccz8lMJOX9iHhN4rM47Jwwtd6uK1K
HrW+aDxQGRxljWPnfuuz94VjgnNvbyLLSj2zZeTqobT9MtT2bFWQABhLGwHQFIAF
WxS0RP3HCHBpPEYqSjJoER0=
-----END PRIVATE KEY-----`,
  client_email: "firebase-adminsdk-fbsvc@smart-garage-93705.iam.gserviceaccount.com",
  client_id: "103948774396943647310",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40smart-garage-93705.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

console.log('Initializing Firebase with:');
console.log('Project ID:', serviceAccount.project_id);

// Initialize Firebase Admin SDK with error handling
let app;
try {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-garage-93705-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
}

// Initialize Firestore and Realtime Database with error handling
let db, rtdb, storage;
try {
  db = admin.firestore();
  rtdb = admin.database();
  storage = admin.storage();
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase services:', error);
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
}

// Create collections and references
const collections = {
  garageImages: db.collection('garage_images'),
  garageStatus: rtdb.ref('garage_status'),
  parkingSpots: rtdb.ref('parking_spots')
};

// Test database connection
const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    const connectedRef = rtdb.ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === false) {
        console.error('Database connection failed');
      } else {
        console.log('Database connection successful');
      }
    });

    // Test write operation
    const testRef = rtdb.ref('test');
    await testRef.set({ timestamp: new Date().toISOString() });
    console.log('Write test successful');
    
    // Clean up test data
    await testRef.remove();
  } catch (error) {
    console.error('Database connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Initialize real-time listeners
const setupRealtimeListeners = () => {
  try {
    // Listen for changes in parking spots
    collections.parkingSpots.on('value', (snapshot) => {
      console.log('Parking spots updated:', snapshot.val());
    }, (error) => {
      console.error('Error listening to parking spots:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    });

    // Listen for changes in garage status
    collections.garageStatus.on('value', (snapshot) => {
      console.log('Garage status updated:', snapshot.val());
    }, (error) => {
      console.error('Error listening to garage status:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    });
  } catch (error) {
    console.error('Failed to setup real-time listeners:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
};

// Initialize database structure
const initializeDatabase = async () => {
  try {
    console.log('Initializing database structure...');
    
    // Check if garage_status exists
    const statusSnapshot = await collections.garageStatus.once('value');
    if (!statusSnapshot.exists()) {
      await collections.garageStatus.set({
        totalSpots: 0,
        occupiedSpots: 0,
        availableSpots: 0,
        lastUpdated: new Date().toISOString()
      });
      console.log('Created garage_status');
    }

    // Check if parking_spots exists
    const spotsSnapshot = await collections.parkingSpots.once('value');
    if (!spotsSnapshot.exists()) {
      await collections.parkingSpots.set({});
      console.log('Created parking_spots');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Run connection test
testDatabaseConnection();

module.exports = {
  admin,
  db,
  rtdb,
  storage,
  collections,
  setupRealtimeListeners,
  initializeDatabase
}; 