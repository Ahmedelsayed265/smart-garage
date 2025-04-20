const { db, rtdb, collections } = require('../config/firebase');

async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');

    // Test 1: Basic Firestore Connection
    console.log('\n1. Testing Firestore Basic Connection...');
    const firestoreTest = await collections.garageImages.add({
      test: 'Firestore connection test',
      timestamp: new Date().toISOString()
    });
    console.log('✓ Firestore basic test successful! Document ID:', firestoreTest.id);

    // Test 2: Realtime Database Basic Connection
    console.log('\n2. Testing Realtime Database Basic Connection...');
    await collections.garageStatus.set({
      test: 'Realtime Database connection test',
      timestamp: new Date().toISOString()
    });
    console.log('✓ Realtime Database basic test successful!');

    // Test 3: Read from Realtime Database
    console.log('\n3. Testing Realtime Database Read...');
    const statusSnapshot = await collections.garageStatus.once('value');
    console.log('✓ Realtime Database read successful! Data:', statusSnapshot.val());

    // Test 4: Initialize Parking Spots Structure
    console.log('\n4. Testing Parking Spots Structure...');
    const parkingSpots = {
      spot1: {
        id: 'spot1',
        status: 'empty',
        lastUpdated: new Date().toISOString(),
        cameraId: 'cam1'
      },
      spot2: {
        id: 'spot2',
        status: 'empty',
        lastUpdated: new Date().toISOString(),
        cameraId: 'cam2'
      }
    };
    await collections.parkingSpots.set(parkingSpots);
    console.log('✓ Parking spots structure created successfully!');

    // Test 5: Test Real-time Updates
    console.log('\n5. Testing Real-time Updates...');
    let updateReceived = false;
    const unsubscribe = collections.parkingSpots.child('spot1').on('value', (snapshot) => {
      if (!updateReceived) {
        console.log('✓ Real-time update received:', snapshot.val());
        updateReceived = true;
      }
    });

    // Update a spot to trigger real-time update
    await collections.parkingSpots.child('spot1').update({
      status: 'occupied',
      lastUpdated: new Date().toISOString()
    });

    // Wait for update to be received
    await new Promise(resolve => setTimeout(resolve, 1000));
    unsubscribe();

    // Test 6: Test Image Storage
    console.log('\n6. Testing Image Storage...');
    const imageData = {
      spotId: 'spot1',
      imageUrl: 'test-image-url',
      timestamp: new Date().toISOString(),
      status: 'processed',
      isEmpty: true,
      confidence: 0.95
    };
    const imageRef = await collections.garageImages.add(imageData);
    console.log('✓ Image storage test successful! Document ID:', imageRef.id);

    // Test 7: Test Complex Queries
    console.log('\n7. Testing Complex Queries...');
    const querySnapshot = await collections.garageImages
      .where('spotId', '==', 'spot1')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    console.log('✓ Complex query test successful! Found documents:', querySnapshot.size);

    // Clean up test data
    console.log('\nCleaning up test data...');
    await firestoreTest.delete();
    await collections.garageStatus.remove();
    await collections.parkingSpots.remove();
    await imageRef.delete();
    console.log('✓ Cleanup completed successfully!');
    
    console.log('\nAll Firebase tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nFirebase test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Run the tests
testFirebaseConnection(); 