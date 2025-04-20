const { collections } = require("../config/firebase");

async function initializeDatabase() {
  try {
    console.log("Initializing database with sample data...");

    // Initialize parking spots
    console.log("\n1. Creating parking spots...");
    const parkingSpots = {
      spot1: {
        id: "spot1",
        status: "empty",
        lastUpdated: new Date().toISOString(),
        cameraId: "cam1",
        confidence: 0.95,
      },
      spot2: {
        id: "spot2",
        status: "empty",
        lastUpdated: new Date().toISOString(),
        cameraId: "cam2",
        confidence: 0.95,
      },
      spot3: {
        id: "spot3",
        status: "empty",
        lastUpdated: new Date().toISOString(),
        cameraId: "cam3",
        confidence: 0.95,
      },
    };
    await collections.parkingSpots.set(parkingSpots);
    console.log("✓ Parking spots created successfully!");

    // Initialize garage status
    console.log("\n2. Setting up garage status...");
    const garageStatus = {
      totalSpots: 3,
      availableSpots: 3,
      lastUpdated: new Date().toISOString(),
      systemStatus: "active",
    };
    await collections.garageStatus.set(garageStatus);
    console.log("✓ Garage status initialized!");

    // Add sample images
    console.log("\n3. Adding sample images...");
    const sampleImages = [
      {
        spotId: "spot1",
        imageUrl: "https://example.com/images/spot1.jpg",
        timestamp: new Date().toISOString(),
        status: "processed",
        isEmpty: true,
        confidence: 0.95,
        metadata: {
          cameraId: "cam1",
          processingTime: 150,
          modelVersion: "1.0.0",
        },
      },
      {
        spotId: "spot2",
        imageUrl: "https://example.com/images/spot2.jpg",
        timestamp: new Date().toISOString(),
        status: "processed",
        isEmpty: true,
        confidence: 0.92,
        metadata: {
          cameraId: "cam2",
          processingTime: 145,
          modelVersion: "1.0.0",
        },
      },
    ];

    for (const image of sampleImages) {
      await collections.garageImages.add(image);
    }
    console.log("✓ Sample images added successfully!");

    // Add system logs
    console.log("\n4. Creating system logs...");
    const systemLogs = [
      {
        type: "info",
        message: "System initialized",
        timestamp: new Date().toISOString(),
        source: "init-database",
        details: { version: "1.0.0" },
      },
      {
        type: "info",
        message: "Parking spots created",
        timestamp: new Date().toISOString(),
        source: "init-database",
        details: { count: 3 },
      },
    ];

    for (const log of systemLogs) {
      await collections.systemLogs.add(log);
    }
    console.log("✓ System logs created successfully!");

    console.log("\nDatabase initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\nDatabase initialization failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
