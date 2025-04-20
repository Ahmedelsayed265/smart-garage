const axios = require('axios');
const { AppError } = require('../utils/errorHandler');
const dotenv = require('dotenv');

dotenv.config();

class AIService {
  constructor() {
    this.aiModelEndpoint = process.env.AI_MODEL_ENDPOINT;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  async processImage(imageBuffer) {
    let retries = 0;
    let lastError = null;

    while (retries < this.maxRetries) {
      try {
        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');

        // Send to AI model
        const response = await axios.post(this.aiModelEndpoint, {
          image: base64Image,
          timestamp: new Date().toISOString()
        }, {
          timeout: 10000, // 10 seconds timeout
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.data || typeof response.data.isEmpty !== 'boolean') {
          throw new AppError('Invalid response from AI model', 500);
        }

        return {
          isEmpty: response.data.isEmpty,
          confidence: response.data.confidence || 0,
          timestamp: new Date().toISOString(),
          modelVersion: response.data.modelVersion || 'unknown'
        };
      } catch (error) {
        lastError = error;
        retries++;
        
        if (retries < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
          continue;
        }
      }
    }

    throw new AppError(
      `Failed to process image after ${this.maxRetries} attempts: ${lastError.message}`,
      503
    );
  }

  async validateModelConnection() {
    try {
      const response = await axios.get(`${this.aiModelEndpoint}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      throw new AppError('AI model service is unavailable', 503);
    }
  }
}

module.exports = new AIService(); 