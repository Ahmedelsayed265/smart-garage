# Smart Garage System

A real-time smart garage monitoring system that uses AI to detect parking space occupancy.

## Features

- Real-time image processing
- Firebase integration for data storage
- AI-powered parking space detection
- Real-time status updates
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Firestore enabled
- AI model endpoint for image processing

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   AI_MODEL_ENDPOINT=your-ai-model-endpoint
   PORT=3000
   ```

4. To get your Firebase credentials:
   - Go to Firebase Console
   - Select your project
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Use the values from the downloaded JSON file

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Upload Image
- **POST** `/upload-image`
  - Accepts image file in multipart/form-data
  - Returns processing ID and status

### Get Status
- **GET** `/status/:id`
  - Returns real-time updates for image processing
  - Uses WebSocket for live updates

### Health Check
- **GET** `/health`
  - Returns server health status

## Project Structure

```
src/
├── config/
│   └── firebase.js      # Firebase configuration
├── services/
│   └── aiService.js     # AI model integration
├── routes/
│   └── api.js          # API routes
└── server.js           # Main application file
```

## Error Handling

The application includes comprehensive error handling and logging:
- All errors are logged to `error.log`
- General logs are stored in `combined.log`
- Console logging in development mode

## Testing

Run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 