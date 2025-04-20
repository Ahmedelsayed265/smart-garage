const { collections } = require('../config/firebase');

class RealtimeService {
  constructor() {
    this.parkingSpots = collections.parkingSpots;
    this.garageStatus = collections.garageStatus;
  }

  // Update parking spot status
  async updateParkingSpot(spotId, status) {
    try {
      await this.parkingSpots.child(spotId).update({
        status,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating parking spot:', error);
      throw error;
    }
  }

  // Get real-time updates for a parking spot
  subscribeToParkingSpot(spotId, callback) {
    return this.parkingSpots.child(spotId).on('value', (snapshot) => {
      callback(snapshot.val());
    });
  }

  // Update overall garage status
  async updateGarageStatus(status) {
    try {
      await this.garageStatus.update({
        status,
        lastUpdated: new Date().toISOString(),
        totalSpots: status.totalSpots || 0,
        occupiedSpots: status.occupiedSpots || 0,
        availableSpots: status.availableSpots || 0
      });
      return true;
    } catch (error) {
      console.error('Error updating garage status:', error);
      throw error;
    }
  }

  // Get real-time updates for garage status
  subscribeToGarageStatus(callback) {
    return this.garageStatus.on('value', (snapshot) => {
      callback(snapshot.val());
    });
  }

  // Initialize parking spots
  async initializeParkingSpots(totalSpots) {
    try {
      const spots = {};
      for (let i = 1; i <= totalSpots; i++) {
        spots[`spot${i}`] = {
          id: `spot${i}`,
          status: 'empty',
          lastUpdated: new Date().toISOString()
        };
      }
      await this.parkingSpots.set(spots);
      return true;
    } catch (error) {
      console.error('Error initializing parking spots:', error);
      throw error;
    }
  }
}

module.exports = new RealtimeService(); 