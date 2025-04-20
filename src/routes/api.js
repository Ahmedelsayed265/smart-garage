const express = require('express');
const multer = require('multer');
const { collections } = require('../config/firebase');
const aiService = require('../services/aiService');
const realtimeService = require('../services/realtimeService');
const validateImage = require('../middleware/validateImage');
const { AppError } = require('../utils/errorHandler');
const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image and update parking spot status
router.post('/upload-image/:spotId', upload.single('image'), validateImage, async (req, res, next) => {
  try {
    const { spotId } = req.params;

    // Process image with AI model
    const aiResponse = await aiService.processImage(req.file.buffer);

    // Update parking spot status in real-time database
    await realtimeService.updateParkingSpot(spotId, {
      status: aiResponse.isEmpty ? 'empty' : 'occupied',
      confidence: aiResponse.confidence,
      lastImage: {
        timestamp: new Date().toISOString(),
        processedAt: aiResponse.timestamp
      }
    });

    // Update overall garage status
    const spotsSnapshot = await collections.parkingSpots.once('value');
    const spots = spotsSnapshot.val();
    const totalSpots = Object.keys(spots).length;
    const occupiedSpots = Object.values(spots).filter(spot => spot.status === 'occupied').length;

    await realtimeService.updateGarageStatus({
      totalSpots,
      occupiedSpots,
      availableSpots: totalSpots - occupiedSpots,
      lastUpdated: new Date().toISOString()
    });

    res.json({
      message: 'Image processed and status updated successfully',
      spotId,
      status: aiResponse
    });
  } catch (error) {
    next(error);
  }
});

// Get real-time updates for a parking spot
router.get('/spot/:spotId', (req, res, next) => {
  try {
    const { spotId } = req.params;
    
    const unsubscribe = realtimeService.subscribeToParkingSpot(spotId, (data) => {
      if (data) {
        res.json(data);
      } else {
        throw new AppError('Parking spot not found', 404);
      }
    });

    // Clean up subscription when client disconnects
    req.on('close', () => {
      unsubscribe();
    });
  } catch (error) {
    next(error);
  }
});

// Get real-time updates for garage status
router.get('/garage-status', (req, res, next) => {
  try {
    const unsubscribe = realtimeService.subscribeToGarageStatus((data) => {
      res.json(data);
    });

    // Clean up subscription when client disconnects
    req.on('close', () => {
      unsubscribe();
    });
  } catch (error) {
    next(error);
  }
});

// Initialize parking spots
router.post('/initialize', async (req, res, next) => {
  try {
    const { totalSpots } = req.body;
    
    if (!totalSpots || totalSpots < 1) {
      throw new AppError('Total spots must be a positive number', 400);
    }

    await realtimeService.initializeParkingSpots(totalSpots);
    res.json({ message: `Initialized ${totalSpots} parking spots` });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
router.get('/health', async (req, res, next) => {
  try {
    const dbHealth = await collections.garageImages.limit(1).get();
    const rtdbHealth = await collections.garageStatus.once('value');
    const aiHealth = await aiService.validateModelConnection();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        firestore: !dbHealth.empty,
        realtimeDb: rtdbHealth.exists(),
        aiModel: aiHealth
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 