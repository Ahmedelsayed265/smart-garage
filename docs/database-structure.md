# Smart Garage Database Structure

## Overview
The Smart Garage system uses both Firebase Realtime Database and Firestore to store different types of data. This document outlines the structure and relationships between different data collections.

## Realtime Database Structure

### Parking Spots
```
/parkingSpots/
  /{spotId}/
    id: string
    status: "empty" | "occupied"
    lastUpdated: timestamp
    cameraId: string
    confidence: number
```

### Garage Status
```
/garageStatus/
  totalSpots: number
  availableSpots: number
  lastUpdated: timestamp
  systemStatus: "active" | "maintenance" | "offline"
```

## Firestore Collections

### Garage Images
```
garageImages/
  /{documentId}/
    spotId: string
    imageUrl: string
    timestamp: timestamp
    status: "processing" | "processed" | "error"
    isEmpty: boolean
    confidence: number
    metadata: {
      cameraId: string
      processingTime: number
      modelVersion: string
    }
```

### System Logs
```
systemLogs/
  /{documentId}/
    type: "error" | "info" | "warning"
    message: string
    timestamp: timestamp
    source: string
    details: object
```

## Data Relationships

1. **Parking Spots to Images**
   - Each parking spot can have multiple images
   - Images are linked to spots via `spotId`
   - Latest image status affects spot status

2. **Garage Status to Parking Spots**
   - Garage status aggregates data from all parking spots
   - Updates in real-time as spot statuses change

## Security Rules

### Realtime Database
```javascript
{
  "rules": {
    "parkingSpots": {
      ".read": true,
      ".write": "auth != null"
    },
    "garageStatus": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /garageImages/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /systemLogs/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Best Practices

1. **Data Consistency**
   - Always update both spot status and garage status together
   - Use transactions for critical updates
   - Implement proper error handling

2. **Performance**
   - Index frequently queried fields
   - Use appropriate data types
   - Implement pagination for large datasets

3. **Security**
   - Follow principle of least privilege
   - Validate data before writing
   - Use proper authentication

4. **Maintenance**
   - Regular backups
   - Monitor database size
   - Clean up old data periodically 